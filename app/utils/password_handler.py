"""Password hashing and verification utilities."""

from passlib.context import CryptContext

# Create password context for hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12  # Increase rounds for better security
)


def hash_password(password: str) -> str:
   
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
   
    return pwd_context.verify(plain_password, hashed_password)
