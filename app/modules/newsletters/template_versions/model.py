import uuid
import datetime
from sqlalchemy import (
    String,
    Text,
    TIMESTAMP,
    ForeignKey,
    func,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class NewsletterTemplateVersion(Base):
    __tablename__ = "newsletter_template_versions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    template_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("newsletter_templates.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    subject: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    html_content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    text_content: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    constants: Mapped[list] = mapped_column(
        JSONB,
        server_default="[]",
        nullable=False,
    )

    created_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP,
        server_default=func.now(),
        nullable=False,
    )

    # Relationships
    template = relationship(
        "NewsletterTemplate",
        back_populates="versions",
    )
