"""correction_t_observations_cd_nom

Revision ID: fcf325f5eba4
Revises: fc90d31c677f
Create Date: 2023-09-11 12:33:04.364446

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "fcf325f5eba4"
down_revision = "e2b66850b5ee"
branch_labels = None
depends_on = None

monitorings_schema = "gn_monitoring"
table = "t_observations"
column = "cd_nom"


def upgrade():
    statement = sa.text(
        f"""
        ALTER TABLE {monitorings_schema}.{table} ALTER COLUMN {column} DROP NOT NULL;
        """
    )
    op.execute(statement)


def downgrade():
    statement = sa.text(
        f"""
        ALTER TABLE {monitorings_schema}.{table} ALTER COLUMN {column} SET NOT NULL;
        """
    )
    op.execute(statement)
