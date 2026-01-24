import uuid
import datetime
from sqlalchemy import String, DECIMAL, TIMESTAMP, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base

class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="CASCADE"),
        index=True
    )

    razorpay_order_id: Mapped[str | None] = mapped_column(String(255))
    razorpay_payment_id: Mapped[str | None] = mapped_column(
        String(255), unique=True
    )
    razorpay_signature: Mapped[str | None] = mapped_column(String(500))

    amount: Mapped[float] = mapped_column(DECIMAL(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="INR")

    subscription_plan: Mapped[str] = mapped_column(String(50), nullable=False)
    valid_until: Mapped[datetime.datetime | None]

    created_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP, server_default=func.now()
    )
