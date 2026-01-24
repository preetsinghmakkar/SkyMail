from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple
import uuid
from sqlalchemy.orm import Session
from loguru import logger

from app.modules.auth.model import Company, RefreshToken
from app.utils.password_handler import verify_password
from app.utils.jwt_handler import create_access_token, create_refresh_token


class LoginService:

    @staticmethod
    async def authenticate(
        email: str,
        password: str,
        db: Session
    ) -> Tuple[bool, Optional[Company], str]:
        try:
            company = db.query(Company).filter(Company.email == email).first()
            
            if not company:
                return False, None, "Invalid email or password"
            
            if not company.is_verified:
                return False, None, "Please verify your email first"
            
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
            access_token = create_access_token(company_id)
            refresh_token = create_refresh_token(company_id)
            
            refresh_token_expiry = datetime.now(timezone.utc) + timedelta(days=7)
            
            db_refresh_token = RefreshToken(
                id=uuid.uuid4(),
                company_id=uuid.UUID(company_id),
                token_hash=refresh_token,
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
            
            token_payload = verify_token(refresh_token)
            
            if token_payload.type != "refresh":
                return False, None, "Invalid token type"
            
            company_id = token_payload.sub
            
            db_token = db.query(RefreshToken).filter(
                RefreshToken.company_id == uuid.UUID(company_id),
                RefreshToken.token_hash == refresh_token,
                RefreshToken.revoked_at == None
            ).first()
            
            if not db_token:
                return False, None, "Refresh token not found or revoked"
            
            if datetime.now(timezone.utc) > db_token.expires_at:
                return False, None, "Refresh token expired"
            
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
