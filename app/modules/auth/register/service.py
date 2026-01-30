from datetime import timedelta
from typing import Optional, Tuple
import json
from sqlalchemy.orm import Session
from loguru import logger

from app.modules.auth.model import Company
from app.utils.password_handler import hash_password
from app.utils.mail.email_service import EmailService
from app.redis.redis_manager import redis_manager


class RegisterService:

    @staticmethod
    async def initiate_registration(
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
                return False, "Email or username already registered", None
            
            # Truncate password to 72 bytes for bcrypt compatibility
            password_bytes = password.encode('utf-8')
            if len(password_bytes) > 72:
                logger.warning(f"Password too long for {email}, truncating to 72 bytes")
                password = password_bytes[:72].decode('utf-8', errors='ignore')
            
            otp = EmailService.generate_otp()
            
            otp_key = f"otp:{email}"
            await redis_manager.redis.setex(
                otp_key,
                600,
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
            
            await redis_manager.redis.setex(
                reg_key,
                600,
                json.dumps(registration_data)
            )
            
            logger.info(f"Registration initiated for {email}")
            return True, f"OTP stored for {email}", otp
            
        except Exception as e:
            logger.error(f"Registration error for {email}: {str(e)}")
            return False, "Registration failed. Please try again.", None

    @staticmethod
    async def resend_otp(
        email: str,
        db: Session
    ) -> Tuple[bool, str, Optional[str]]:
        try:
            existing_company = db.query(Company).filter(
                Company.email == email
            ).first()
            
            if existing_company and existing_company.is_verified:
                return False, "Email already verified", None
            
            reg_key = f"registration:{email}"
            reg_data_str = await redis_manager.redis.get(reg_key)
            
            if not reg_data_str:
                return False, "Registration session expired. Please register again.", None
            
            reg_data = json.loads(reg_data_str)
            
            otp = EmailService.generate_otp()
            
            otp_key = f"otp:{email}"
            await redis_manager.redis.setex(
                otp_key,
                600,
                otp
            )
            
            logger.info(f"OTP resent to {email}")
            return True, f"OTP resent to {email}", otp
            
        except Exception as e:
            logger.error(f"Resend OTP error for {email}: {str(e)}")
            return False, "Failed to resend OTP", None

    @staticmethod
    async def verify_otp(
        email: str,
        otp: str,
        db: Session
    ) -> Tuple[bool, Optional[Company], str]:
        try:
            otp_key = f"otp:{email}"
            stored_otp = await redis_manager.redis.get(otp_key)
            
            if not stored_otp or stored_otp != otp:
                return False, None, "Invalid or expired OTP"
            
            reg_key = f"registration:{email}"
            reg_data_str = await redis_manager.redis.get(reg_key)
            
            if not reg_data_str:
                return False, None, "Registration session expired. Please register again."
            
            reg_data = json.loads(reg_data_str)
            
            import uuid
            new_company = Company(
                id=uuid.uuid4(),
                username=reg_data["username"],
                email=reg_data["email"],
                password_hash=reg_data["password_hash"],
                company_name=reg_data["company_name"],
                website_url=reg_data["website_url"] or None,
                is_verified=True
            )
            
            db.add(new_company)
            db.commit()
            db.refresh(new_company)
            
            await redis_manager.redis.delete(otp_key)
            await redis_manager.redis.delete(reg_key)
            
            await EmailService.send_verification_email(email, reg_data["company_name"])
            
            logger.info(f"Company registered and verified: {email}")
            return True, new_company, "Company registered successfully"
            
        except Exception as e:
            db.rollback()
            logger.error(f"OTP verification error for {email}: {str(e)}")
            return False, None, "Verification failed. Please try again."
