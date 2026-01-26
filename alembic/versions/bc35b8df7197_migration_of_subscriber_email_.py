"""Migration of subscriber_email + subscriber_name on subscribers

Revision ID: bc35b8df7197
Revises: d493eb9aaf6e
Create Date: 2026-01-26 19:04:20.477906
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "bc35b8df7197"
down_revision: Union[str, Sequence[str], None] = "d493eb9aaf6e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Upgrade schema.

    Strategy:
    1. Add new columns as nullable
    2. Backfill subscriber_email from old email column
    3. Enforce NOT NULL
    4. Recreate constraints & indexes
    5. Drop old columns
    """

    # 1. Add new columns (nullable first)
    op.add_column(
        "subscribers",
        sa.Column("subscriber_email", sa.String(length=255), nullable=True),
    )
    op.add_column(
        "subscribers",
        sa.Column("subscriber_name", sa.String(length=100), nullable=True),
    )

    # 2. Backfill existing data
    op.execute(
        """
        UPDATE subscribers
        SET subscriber_email = LOWER(email)
        """
    )

    # 3. Enforce NOT NULL
    op.alter_column(
        "subscribers",
        "subscriber_email",
        nullable=False,
    )

    # 4. Drop old constraints / indexes
    op.drop_constraint(
        "uq_subscriber_company_email",
        "subscribers",
        type_="unique",
    )

    op.drop_index("idx_subscribers_email", table_name="subscribers", if_exists=True)
    op.drop_index("ix_subscribers_email", table_name="subscribers", if_exists=True)

    # 5. Create new constraints / indexes
    op.create_unique_constraint(
        "uq_subscriber_company_email",
        "subscribers",
        ["company_id", "subscriber_email"],
    )

    op.create_index(
        "idx_subscribers_email",
        "subscribers",
        ["subscriber_email"],
    )

    # 6. Drop old columns
    op.drop_column("subscribers", "email")
    op.drop_column("subscribers", "username")


def downgrade() -> None:
    """
    Downgrade schema.

    Reverse of upgrade:
    1. Restore old columns
    2. Backfill email
    3. Restore constraints / indexes
    4. Drop new columns
    """

    # 1. Restore old columns
    op.add_column(
        "subscribers",
        sa.Column("email", sa.String(length=255), nullable=True),
    )
    op.add_column(
        "subscribers",
        sa.Column("username", sa.String(length=100), nullable=True),
    )

    # 2. Backfill email from subscriber_email
    op.execute(
        """
        UPDATE subscribers
        SET email = subscriber_email
        """
    )

    # 3. Enforce NOT NULL on email
    op.alter_column(
        "subscribers",
        "email",
        nullable=False,
    )

    # 4. Drop new constraints / indexes
    op.drop_constraint(
        "uq_subscriber_company_email",
        "subscribers",
        type_="unique",
    )

    op.drop_index("idx_subscribers_email", table_name="subscribers")

    # 5. Restore old constraints / indexes
    op.create_unique_constraint(
        "uq_subscriber_company_email",
        "subscribers",
        ["company_id", "email"],
    )

    op.create_index(
        "idx_subscribers_email",
        "subscribers",
        ["email"],
    )

    # 6. Drop new columns
    op.drop_column("subscribers", "subscriber_name")
    op.drop_column("subscribers", "subscriber_email")
