"""Fix campaign_send_logs columns to match model

Revision ID: 3_fix_campaign_send_logs_columns
Revises: 2_campaigns_enhancements
Create Date: 2026-01-25 23:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '3_fix_campaign_send_logs_columns'
down_revision: Union[str, Sequence[str], None] = '2_campaigns_enhancements'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema - fix campaign_send_logs columns."""
    pass  # Column already exists as extra_data, nothing to do


def downgrade() -> None:
    """Downgrade schema."""
    pass  # Nothing to revert

