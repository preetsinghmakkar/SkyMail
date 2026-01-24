from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple
import uuid
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from loguru import logger

from app.modules.auth.model import Company, RefreshToken
from app.utils.password_handler import hash_password, verify_password
from app.utils.jwt_handler import create_access_token, create_refresh_token
from app.utils.mail.email_service import EmailService
from app.redis.redis_manager import redis_manager
from app.utils import constants


class AuthService:
    
    @staticmethod
    async def register_company(
        username: str,
        email: str,
        password: str,
        company_name: str,
        website_url: Optional[str],
        db: Session
    ) -> Tuple[bool, str, Optional[str]]:
        try:
            existing_company = db.query(Company).filter(
                (Company.email == email) | (Company.username == username)
            ).first()
            
            if existing_company:
                return False, "Email or username already registered", "DUPLICATE_ACCOUNT"
            
            # Generate OTP
            otp = EmailService.generate_otp()
            
            otp_key = f"otp:{email}"
            await redis_manager.redis.setex(
                otp_key,
                600,  # 2 minutes expiry
                otp
            )
            
            reg_key = f"registration:{email}"
            registration_data = {
                "username": username,
                "email": email,
                "password_hash": hash_password(password),
                "company_name": company_name,
                "website_url": website_url or ""
            }
            
            import json
            await redis_manager.redis.setex(
                reg_key,
                300,  # 5 minutes expiry
                json.dumps(registration_data)
            )
            
            await EmailService.send_otp_email(email, otp, company_name)
            
            logger.info(f"Registration initiated for {email}")
            return True, f"OTP sent to {email}", None
            
        except Exception as e:
            logger.error(f"Registration error for {email}: {str(e)}")
            return False, "Registration failed. Please try again.", "REGISTRATION_ERROR"
    
    @staticmethod
    async def verify_otp_and_register(
        email: str,
        otp: str,
        db: Session
    ) -> Tuple[bool, Optional[Company], str]:
        
        try:
            # Verify OTP from Redis
            otp_key = f"otp:{email}"
            stored_otp = await redis_manager.redis.get(otp_key)
            
            if not stored_otp or stored_otp != otp:
                return False, None, "Invalid or expired OTP"
            
            # Get registration data
            reg_key = f"registration:{email}"
            reg_data_str = await redis_manager.redis.get(reg_key)
            
            if not reg_data_str:
                return False, None, "Registration session expired. Please register again."
            
            import json
            reg_data = json.loads(reg_data_str)
            
            # Create company in database
            new_company = Company(
                id=uuid.uuid4(),
                username=reg_data["username"],
                email=reg_data["email"],
                password_hash=reg_data["password_hash"],
                company_name=reg_data["company_name"],
                website_url=reg_data["website_url"] or None,
                is_verified=True  # Mark as verified since OTP was verified
            )
            
            db.add(new_company)
            db.commit()
            db.refresh(new_company)
            
            # Clean up Redis keys
            await redis_manager.redis.delete(otp_key)
            await redis_manager.redis.delete(reg_key)
            
            # Send welcome email
            await EmailService.send_verification_email(email, reg_data["company_name"])
            
            logger.info(f"Company registered and verified: {email}")
            return True, new_company, "Company registered successfully"
            
        except IntegrityError:
            db.rollback()
            logger.error(f"Integrity error during registration for {email}")
            return False, None, "Email or username already exists"
        except Exception as e:
            db.rollback()
            logger.error(f"OTP verification error for {email}: {str(e)}")
            return False, None, "Verification failed. Please try again."
    
    @staticmethod
    async def login(
        email: str,
        password: str,
        db: Session
    ) -> Tuple[bool, Optional[Company], str]:
        try:
            # Find company by email
            company = db.query(Company).filter(Company.email == email).first()
            
            if not company:
                return False, None, "Invalid email or password"
            
            # Check if company is verified
            if not company.is_verified:
                return False, None, "Please verify your email first"
            
            # Verify password
            if not verify_password(password, company.password_hash):
                return False, None, "Invalid email or password"
            
            logger.info(f"Login successful for {email}")
            return True, company, "Login successful"
            
        except Exception as e:
            logger.error(f"Login error for {email}: {str(e)}")
            return False, None, "Authentication failed"
    
    @staticmethod
    async def generate_tokens(
        company_id: str,
        db: Session
    ) -> Tuple[str, str]:
        try:
            # Create access token
            access_token = create_access_token(company_id)
            
            # Create refresh token
            refresh_token = create_refresh_token(company_id)
            
            # Store refresh token hash in database
            refresh_token_expiry = datetime.now(timezone.utc) + timedelta(days=7)
            
            db_refresh_token = RefreshToken(
                id=uuid.uuid4(),
                company_id=uuid.UUID(company_id),
                token_hash=refresh_token,  # In production, hash this
                expires_at=refresh_token_expiry
            )
            
            db.add(db_refresh_token)
            db.commit()
            
            logger.info(f"Tokens generated for company {company_id}")
            return access_token, refresh_token
            
        except Exception as e:
            db.rollback()
            logger.error(f"Token generation error: {str(e)}")
            raise
    
    @staticmethod
    async def refresh_access_token(
        refresh_token: str,
        db: Session
    ) -> Tuple[bool, Optional[str], str]:
        try:
            from app.utils.jwt_handler import verify_token
            
            # Verify refresh token
            token_payload = verify_token(refresh_token)
            
            if token_payload.type != "refresh":
                return False, None, "Invalid token type"
            
            company_id = token_payload.sub
            
            # Check if token exists in database and not revoked
            db_token = db.query(RefreshToken).filter(
                RefreshToken.company_id == uuid.UUID(company_id),
                RefreshToken.token_hash == refresh_token,
                RefreshToken.revoked_at == None
            ).first()
            
            if not db_token:
                return False, None, "Refresh token not found or revoked"
            
            # Check expiration
            if datetime.now(timezone.utc) > db_token.expires_at:
                return False, None, "Refresh token expired"
            
            # Generate new access token
            new_access_token = create_access_token(company_id)
            
            logger.info(f"Access token refreshed for company {company_id}")
            return True, new_access_token, "Token refreshed successfully"
            
        except Exception as e:
            logger.error(f"Token refresh error: {str(e)}")
            return False, None, "Token refresh failed"
    
    @staticmethod
    async def logout(
        company_id: str,
        db: Session
    ) -> bool:
        try:
            # Revoke all refresh tokens for this company
            db.query(RefreshToken).filter(
                RefreshToken.company_id == uuid.UUID(company_id),
                RefreshToken.revoked_at == None
            ).update(
                {RefreshToken.revoked_at: datetime.now(timezone.utc)},
                synchronize_session=False
            )
            
            db.commit()
            logger.info(f"Logout successful for company {company_id}")
            return True
            
        except Exception as e:
            db.rollback()
            logger.error(f"Logout error for {company_id}: {str(e)}")
            return False
    
    @staticmethod
    async def get_company_by_id(
        company_id: str,
        db: Session
    ) -> Optional[Company]:
        try:
            company = db.query(Company).filter(
                Company.id == uuid.UUID(company_id)
            ).first()
            return company
        except Exception as e:
            logger.error(f"Error fetching company {company_id}: {str(e)}")
            return None
