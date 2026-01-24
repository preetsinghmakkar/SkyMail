"""JWT Token handling utilities for authentication."""

from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from pydantic import BaseModel
from app.utils import constants


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # in seconds


class TokenPayload(BaseModel):
    sub: str  # company_id
    type: str  # "access" or "refresh"
    iat: int  # issued at
    exp: int  # expiration


def create_access_token(company_id: str, expires_delta: Optional[timedelta] = None) -> str:
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=constants.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode = {
        "sub": str(company_id),
        "type": "access",
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    
    encoded_jwt = jwt.encode(
        to_encode, 
        constants.ACCESS_TOKEN_SECRET_KEY, 
        algorithm="HS256"
    )
    return encoded_jwt


def create_refresh_token(company_id: str, expires_delta: Optional[timedelta] = None) -> str:
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # Refresh tokens typically have longer expiration (7 days)
        expire = datetime.now(timezone.utc) + timedelta(days=7)
    
    to_encode = {
        "sub": str(company_id),
        "type": "refresh",
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    
    encoded_jwt = jwt.encode(
        to_encode, 
        constants.ACCESS_TOKEN_SECRET_KEY, 
        algorithm="HS256"
    )
    return encoded_jwt


def verify_token(token: str) -> TokenPayload:
    
    try:
        payload = jwt.decode(
            token, 
            constants.ACCESS_TOKEN_SECRET_KEY, 
            algorithms=["HS256"]
        )
        company_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if company_id is None:
            raise JWTError("Invalid token payload")
            
        return TokenPayload(
            sub=company_id,
            type=token_type,
            iat=payload.get("iat"),
            exp=payload.get("exp")
        )
    except JWTError:
        raise


def decode_token_no_verify(token: str) -> dict:
    
    try:
        payload = jwt.decode(
            token,
            constants.ACCESS_TOKEN_SECRET_KEY,
            algorithms=["HS256"],
            options={"verify_signature": False}
        )
        return payload
    except JWTError:
        return {}
