"""create_bib_type_site

Revision ID: b53bafb13ce8
Revises: 
Create Date: 2022-12-06 16:18:24.512562

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "b53bafb13ce8"
down_revision = "e78003460441"
branch_labels = None
depends_on = None

monitorings_schema = "gn_monitoring"
nomenclature_schema = "ref_nomenclatures"

# TODO : check if id_type =  https://stackoverflow.com/questions/48737407/sqlalchemy-check-constraint-with-join 
def upgrade():
    op.execute("DROP TABLE IF EXISTS gn_monitoring.bib_site_type;")
    op.create_table(
        "bib_type_site",
        sa.Column("id_type_site",sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('id_type_site', name=op.f('pk_type_site')),
        sa.Column("id_nomenclature", sa.Integer(), sa.ForeignKey(
                f"{nomenclature_schema}.t_nomenclatures.id_nomenclature",
                name="fk_t_nomenclatures_id_nomenclature",
            ), 
            nullable=False, 
            unique=True),
        sa.Column("config", sa.JSON(), nullable=True),
        schema=monitorings_schema,
    )
    op.create_index(
        op.f("ix_bib_type_site_id"),
        "bib_type_site",
        ["id_nomenclature"],
        unique=True,
        schema=monitorings_schema,
    )
    statement = sa.text(
        f"""
        CREATE OR REPLACE FUNCTION {monitorings_schema}.ck_bib_type_site_id_nomenclature()
        RETURNS trigger
        LANGUAGE plpgsql
        AS $function$
        BEGIN
                perform {nomenclature_schema}.check_nomenclature_type_by_mnemonique(NEW.id_nomenclature, :mnemonique );
                RETURN NEW;
        END;
        $function$
        ;
        DROP TRIGGER IF EXISTS ck_bib_type_site_id_nomenclature on gn_monitoring.bib_type_site;
        CREATE TRIGGER ck_bib_type_site_id_nomenclature BEFORE
        INSERT
            OR
        UPDATE ON {monitorings_schema}.bib_type_site FOR EACH ROW EXECUTE PROCEDURE {monitorings_schema}.ck_bib_type_site_id_nomenclature();
        """
    ).bindparams(mnemonique='TYPE_SITE')
    op.execute(statement)

    # op.add_column(
    #     "t_base_sites",
    #     sa.Column(
    #         "id_categorie",
    #         sa.Integer(),
    #         sa.ForeignKey(
    #             f"{monitorings_schema}.bib_type_site.id_categorie",
    #             name="fk_t_base_sites_id_categorie",
    #             ondelete="CASCADE",
    #         ),
    #         nullable=True,  # TODO: see migration? nullable is conservative here
    #     ),
    #     schema=monitorings_schema,
    # )


def downgrade():

    # op.drop_constraint("fk_cor_type_site_id_base_site", "t_base_sites", schema=monitorings_schema)
    # op.drop_constraint("fk_cor_module_type_id_type_site", "t_modules", schema=monitorings_schema)
    # op.drop_column("t_base_sites", "id_categorie", schema=monitorings_schema)
    statement = sa.text(
        f"""
        DROP TRIGGER IF EXISTS ck_bib_type_site_id_nomenclature on gn_monitoring.bib_type_site;
        DROP FUNCTION IF EXISTS {monitorings_schema}.ck_bib_type_site_id_nomenclature;
        """
    )
    op.execute(statement)
    op.drop_index(
        op.f("ix_bib_type_site_id"),
        table_name="bib_type_site",
        schema=monitorings_schema,
    )
    op.drop_table("bib_type_site", schema=monitorings_schema)


