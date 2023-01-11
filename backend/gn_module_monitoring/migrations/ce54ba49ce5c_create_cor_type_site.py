
"""create_cor_type_site

Revision ID: ce54ba49ce5c
Revises: 
Create Date: 2022-12-06 16:18:24.512562

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "ce54ba49ce5c"
down_revision = "b53bafb13ce8"
branch_labels = None
depends_on = None

monitorings_schema = "gn_monitoring"
referent_schema = "gn_commons"

def upgrade():
    op.create_table(
        "cor_type_site",
        sa.Column(
            "id_type_site",
            sa.Integer(),
            sa.ForeignKey(
                f"{monitorings_schema}.bib_type_site.id_nomenclature",
                name="fk_cor_module_type_id_nomenclature",
                ondelete="CASCADE",
                onupdate="CASCADE",
            ),
            nullable=False,
        ),
        sa.Column("id_base_sites", sa.Integer(),sa.ForeignKey(
                f"{referent_schema}.t_base_sites.id_base_site",
                name="fk_cor_type_site_id_base_site",
                ondelete="CASCADE",
                onupdate="CASCADE",
            ), nullable=False),
        schema=monitorings_schema,
    )

def downgrade():
    op.drop_table("cor_type_site", schema=monitorings_schema)
