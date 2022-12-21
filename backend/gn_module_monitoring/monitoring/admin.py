from flask_admin.contrib.sqla import ModelView, fields

from geonature.core.admin.admin import CruvedProtectedMixin

from wtforms import (
    StringField,
    PasswordField,
    BooleanField,
    SubmitField,
    HiddenField,
    SelectField,
    RadioField,
    SelectMultipleField,
    widgets,
    Form,
)
from wtforms.validators import DataRequired, Email
from wtforms.widgets import TextArea
from wtforms_sqlalchemy.fields import QuerySelectField


from geonature.core.gn_permissions.models import TFilters, BibFiltersType, TActions
from geonature.core.gn_commons.models import TModules,TNomenclatures
from gn_module_monitoring.monitoring.models import BibCategorieSite
from geonature.utils.env import DB

class BibCategorieSiteView(CruvedProtectedMixin, ModelView):
    """
    Surcharge de l'administration des catégories de sites
    """

    module_code = "MONITORINGS"
    object_code = None
    # site_type = SelectMultipleField('', choices=["test1"], coerce=int)

    def __init__(self, session, **kwargs):
        # Référence au model utilisé
        super(BibCategorieSiteView, self).__init__(BibCategorieSite, session, **kwargs)
        # site_type = SelectMultipleField('', choices=[c.id for c in BibView.site_type], coerce=int)
    def get_only_type_site_desc():
        return DB.session.query(TNomenclatures).order_by(
                TNomenclatures.mnemonique.desc()
            ).filter(TNomenclatures.id_type == 116)

    # Nom de colonne user friendly
    column_labels = dict(site_type="Type de site")
    # Description des colonnes
    column_descriptions = dict(site_type="Type de site à choisir")
    # Surcharge du formulaure
    # form_overrides = dict(
    #     site_type = SelectMultipleField
    # )
    # form_choices = {
    #              'site_type': DB.session.query(TNomenclatures.mnemonique).order_by(
    #             TNomenclatures.mnemonique.desc()
    #         ).filter(TNomenclatures.id_type == 116).all()
    #        }
    # form_args = {
    #     "site_type": {
            # "query_factory": lambda: DB.session.query(TNomenclatures).order_by(
            #     TNomenclatures.mnemonique.desc()
            # ).filter(TNomenclatures.id_type == 116)
    #     }
    # }

    column_hide_backrefs = False
    # form_extra_fields = {
    #     'type_site_2': fields.QuerySelectField(
    #         label='Type de site 2',
    #         query_factory=get_only_type_site_desc,
    #         widget=SelectMultipleField()
    #     )
    # }
    form_args = dict(
        site_type=dict(
            query_factory=get_only_type_site_desc,
        )
    )
    # form_columns = ('label','config')
    # inline_models = ((
    #     BibCategorieSite,
    #     {
    #         'form_columns': ('site_type'),
    #     }
    # ),)
    form_choices = {
        'title':DB.session.query(TNomenclatures.mnemonique).order_by(
            TNomenclatures.mnemonique.desc()
        ).filter(TNomenclatures.id_type == 116).all()
    }
    column_list=["label","config","site_type"]
    # form_choices = {
    #         'site_type': DB.session.query(TNomenclatures.mnemonique).order_by(
    #         TNomenclatures.mnemonique.desc()
    #     ).filter(TNomenclatures.id_type == 116).all()
    # }
    wait = True





