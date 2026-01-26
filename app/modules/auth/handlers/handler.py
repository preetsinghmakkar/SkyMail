from fastapi import HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session

from app.modules.auth.register.service import RegisterService
from app.modules.auth.login.service import LoginService
from app.utils.mail.email_service import EmailService
from app.modules.auth.schemas import (
    CompanyRegisterRequest,
    CompanyLoginRequest,
    VerifyOTPRequest,
    RefreshTokenRequest,
    CompanyRegisterResponse,
    LoginResponse,
    VerifyOTPResponse,
    RefreshTokenResponse,
    TokenResponse,
    CompanyBaseResponse,
)
from app.utils import constants


class RegisterHandler:

    @staticmethod
    async def register(
        request: CompanyRegisterRequest,
        background_tasks: BackgroundTasks,
        db: Session
    ) -> CompanyRegisterResponse:
        success, message, otp = await RegisterService.initiate_registration(
            username=request.username,
            email=request.email,
            password=request.password,
            company_name=request.company_name,
            website_url=request.website_url,
            db=db
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message
            )
        if otp:
            background_tasks.add_task(EmailService.send_otp_email, request.email, otp, request.company_name)

        return CompanyRegisterResponse(
            message=message,
            email=request.email,
            description="Check your email for OTP. OTP is valid for 10 minutes."
        )

    @staticmethod
    async def resend_otp(
        email: str,
        background_tasks: BackgroundTasks,
        db: Session
    ):
        success, message, otp = await RegisterService.resend_otp(email, db)

        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message
            )

        if otp:
            # company_name is stored in registration data; attempt to fetch for email body
            import json
            from app.redis.redis_manager import redis_manager
            reg_key = f"registration:{email}"
            reg_data_str = await redis_manager.redis.get(reg_key)
            company_name = ""
            if reg_data_str:
                try:
                    reg_data = json.loads(reg_data_str)
                    company_name = reg_data.get("company_name", "")
                except Exception:
                    company_name = ""

            background_tasks.add_task(EmailService.send_otp_email, email, otp, company_name)

        return {
            "message": message,
            "email": email
        }

    @staticmethod
    async def verify_otp(
        request: VerifyOTPRequest,
        db: Session
    ) -> VerifyOTPResponse:
        success, company, message = await RegisterService.verify_otp(
            email=request.email,
            otp=request.otp,
            db=db
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message
            )
        
        try:
            access_token, refresh_token = await LoginService.generate_tokens(
                str(company.id),
                db
            )
            
            tokens = TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                token_type="bearer",
                expires_in=constants.ACCESS_TOKEN_EXPIRE_MINUTES * 60
            )
            
            company_response = CompanyBaseResponse.model_validate(company)
            
            return VerifyOTPResponse(
                message="Email verified successfully",
                company=company_response,
                tokens=tokens
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Token generation failed"
            )


class LoginHandler:

    @staticmethod
    async def login(
        request: CompanyLoginRequest,
        db: Session
    ) -> LoginResponse:
        success, company, message = await LoginService.authenticate(
            email=request.email,
            password=request.password,
            db=db
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=message
            )
        
        try:
            access_token, refresh_token = await LoginService.generate_tokens(
                str(company.id),
                db
            )
            
            tokens = TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                token_type="bearer",
                expires_in=constants.ACCESS_TOKEN_EXPIRE_MINUTES * 60
            )
            
            company_response = CompanyBaseResponse.model_validate(company)
            
            return LoginResponse(
                message=message,
                company=company_response,
                tokens=tokens
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Token generation failed"
            )

    @staticmethod
    async def refresh_token(
        request: RefreshTokenRequest,
        db: Session
    ) -> RefreshTokenResponse:
        success, access_token, message = await LoginService.refresh_access_token(
            refresh_token=request.refresh_token,
            db=db
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=message
            )
        
        return RefreshTokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=constants.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )

    @staticmethod
    async def logout(
        company_id: str,
        db: Session
    ):
        success = await LoginService.logout(company_id, db)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Logout failed"
            )
        
        return {"message": "Logged out successfully"}

    @staticmethod
    async def get_profile(
        company_id: str,
        db: Session
    ) -> CompanyBaseResponse:
        from app.modules.auth.model import Company
        import uuid
        
        company = db.query(Company).filter(
            Company.id == uuid.UUID(company_id)
        ).first()
        
        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found"
            )
        
        return CompanyBaseResponse.model_validate(company)

    @staticmethod
    async def update_profile(
        company_id: str,
        update_data,
        db: Session
    ):
        from app.modules.auth.model import Company
        from app.modules.auth.schemas import ProfileResponse
        import uuid
        
        company = db.query(Company).filter(
            Company.id == uuid.UUID(company_id)
        ).first()
        
        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found"
            )
        
        # Update only provided fields
        if hasattr(update_data, 'company_name') and update_data.company_name:
            company.company_name = update_data.company_name
        
        if hasattr(update_data, 'website_url') and update_data.website_url:
            company.website_url = update_data.website_url
        
        db.add(company)
        db.commit()
        db.refresh(company)
        
        return ProfileResponse(
            id=company.id,
            email=company.email,
            company_name=company.company_name,
            website_url=company.website_url,
            is_verified=company.is_verified,
            is_premium=company.is_premium,
            subscription_tier=company.subscription_tier,
            subscription_end_date=company.subscription_end_date.isoformat() if company.subscription_end_date else None
        )
