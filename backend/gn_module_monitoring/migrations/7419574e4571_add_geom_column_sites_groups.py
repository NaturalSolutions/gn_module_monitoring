"""add_geom_column_sites_groups

Revision ID: 7419574e4571
Revises: 
Create Date: 2023-01-03 16:18:24.512562

"""
from alembic import op
import geoalchemy2
from geonature.core.gn_monitoring.models import TBaseSites
from gn_module_monitoring.monitoring.models import TMonitoringSites, TMonitoringSitesGroups
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "7419574e4571"
down_revision = "e64bafb13ce8"
branch_labels = None
depends_on = None

monitorings_schema = "gn_monitoring"


def upgrade():
    op.add_column(
        "t_sites_groups",
        sa.Column(
            "geom",
            geoalchemy2.types.Geometry(
                srid=4326,
                name="geometry",
            ),
            nullable=True,
        ),
        schema=monitorings_schema,
    )
    statement = sa.text(
        """
        WITH t AS
            (SELECT ST_ConvexHull(ST_COLLECT(tbs.geom)) AS geom,
                    tsg.id_sites_group AS id_sites_group
            FROM gn_monitoring.t_sites_groups tsg
            JOIN gn_monitoring.t_site_complements tsc ON tsc.id_sites_group = tsg.id_sites_group
            JOIN gn_monitoring.t_base_sites tbs ON tbs.id_base_site = tsc.id_base_site
            GROUP BY tsg.id_sites_group)
        UPDATE gn_monitoring.t_sites_groups
        SET geom = t.geom
        FROM t
        WHERE gn_monitoring.t_sites_groups.id_sites_group = t.id_sites_group;
        """
    )
    op.execute(statement)
    op.alter_column("t_sites_groups", "geom", nullable=False, schema=monitorings_schema)


def downgrade():
    op.drop_column("t_sites_groups", "geom", schema=monitorings_schema)
