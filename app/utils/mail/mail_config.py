from fastapi_mail import ConnectionConfig
from app.utils import constants

mail_config = ConnectionConfig(
    MAIL_USERNAME=constants.MAIL_USERNAME,
    MAIL_PASSWORD=constants.MAIL_PASSWORD,
    MAIL_FROM=constants.MAIL_FROM,
    MAIL_SERVER=constants.MAIL_SMTP_HOST,
    MAIL_PORT=constants.MAIL_SMTP_PORT,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)
