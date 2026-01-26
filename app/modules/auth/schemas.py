"""Authentication schemas (Pydantic models) for request/response validation."""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from uuid import UUID
from datetime import datetime


# ==================== REQUEST SCHEMAS ====================

class CompanyRegisterRequest(BaseModel):
    """Schema for company registration request."""
    username: str = Field(..., min_length=3, max_length=50, description="Unique username")
    email: EmailStr = Field(..., description="Company email address")
    password: str = Field(..., min_length=8, description="Password (minimum 8 characters)")
    company_name: str = Field(..., min_length=2, max_length=255, description="Official company name")
    website_url: Optional[str] = Field(None, max_length=500, description="Company website URL")


class CompanyLoginRequest(BaseModel):
    """Schema for company login request."""
    email: EmailStr = Field(..., description="Company email")
    password: str = Field(..., description="Company password")


class VerifyOTPRequest(BaseModel):
    """Schema for OTP verification request."""
    email: EmailStr = Field(..., description="Email to verify")
    otp: str = Field(..., min_length=6, max_length=6, description="6-digit OTP")


class RefreshTokenRequest(BaseModel):
    """Schema for refresh token request."""
    refresh_token: str = Field(..., description="Valid refresh token")


class PasswordResetRequest(BaseModel):
    """Schema for password reset request."""
    email: EmailStr = Field(..., description="Account email")


class ConfirmPasswordResetRequest(BaseModel):
    """Schema for confirming password reset."""
    token: str = Field(..., description="Password reset token")
    new_password: str = Field(..., min_length=8, description="New password")


class UpdateProfileRequest(BaseModel):
    """Schema for updating company profile."""
    company_name: Optional[str] = Field(None, min_length=2, max_length=255, description="Company name")
    website_url: Optional[str] = Field(None, max_length=500, description="Company website URL")


# ==================== RESPONSE SCHEMAS ====================

class CompanyBaseResponse(BaseModel):
    """Base company response schema."""
    id: UUID
    username: str
    email: str
    company_name: str
    website_url: Optional[str] = None
    profile_image_key: Optional[str] = None
    is_verified: bool
    is_premium: bool
    subscription_tier: str
    subscription_end_date: Optional[datetime] = None
    max_subscribers: int
    subscriber_count: int = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CompanyRegisterResponse(BaseModel):
    """Response after company registration."""
    message: str
    email: str
    description: str


class TokenResponse(BaseModel):
    """Token response schema."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # Token expiration in seconds


class LoginResponse(BaseModel):
    """Login response schema."""
    message: str
    company: CompanyBaseResponse
    tokens: TokenResponse


class VerifyOTPResponse(BaseModel):
    """OTP verification response."""
    message: str
    company: Optional[CompanyBaseResponse] = None
    tokens: Optional[TokenResponse] = None


class RefreshTokenResponse(BaseModel):
    """Refresh token response."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class ErrorResponse(BaseModel):
    """Error response schema."""
    detail: str
    error_code: Optional[str] = None


class SuccessResponse(BaseModel):
    """Generic success response."""
    message: str
    data: Optional[dict] = None


class ProfileResponse(BaseModel):
    """Profile response schema."""
    id: UUID
    email: str
    company_name: str
    website_url: Optional[str] = None
    is_verified: bool
    is_premium: bool
    subscription_tier: str
    subscription_end_date: Optional[str] = None

    class Config:
        from_attributes = True
