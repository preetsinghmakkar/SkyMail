from fastapi_mail import FastMail, MessageSchema, MessageType
from app.utils.mail.mail_config import mail_config
from loguru import logger
import random, string
import time

class EmailService:

    @staticmethod
    def generate_otp(length: int = 6) -> str:
        return ''.join(random.choices(string.digits, k=length))

    @staticmethod
    async def send_otp_email(email: str, otp: str, company_name: str = "") -> bool:
        try:
            message = MessageSchema(
                subject="Verify your SkyMail account",
                recipients=[email],
                body=f"""
                <h2>Email Verification</h2>
                <p>Hi {company_name},</p>
                <p>Your OTP is:</p>
                <h1>{otp}</h1>
                <p>This OTP is valid for 10 minutes.</p>
                """,
                subtype=MessageType.html,
            )

            fm = FastMail(mail_config)
            start = time.time()
            await fm.send_message(message)
            elapsed = time.time() - start
            logger.info(f"OTP email sent to {email} (elapsed={elapsed:.2f}s)")
            return True

        except Exception as e:
            logger.error(f"OTP email failed: {e}")
            return False

    @staticmethod
    async def send_verification_email(email: str, company_name: str = "") -> bool:
        try:
            message = MessageSchema(
                subject="Welcome to SkyMail",
                recipients=[email],
                body=f"""
                <h2>Welcome to SkyMail</h2>
                <p>Hi {company_name},</p>
                <p>Your account has been verified successfully. Welcome aboard!</p>
                """,
                subtype=MessageType.html,
            )

            fm = FastMail(mail_config)
            start = time.time()
            await fm.send_message(message)
            elapsed = time.time() - start
            logger.info(f"Verification email sent to {email} (elapsed={elapsed:.2f}s)")
            return True

        except Exception as e:
            logger.error(f"Verification email failed: {e}")
            return False