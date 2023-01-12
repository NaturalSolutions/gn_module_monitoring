from flask_admin.contrib.sqla import ModelView
from geonature.core.admin.admin import CruvedProtectedMixin
from geonature.utils.env import DB
from pypnnomenclature.models import TNomenclatures, BibNomenclaturesTypes
from wtforms.validators import ValidationError

from gn_module_monitoring.monitoring.models import BibTypeSite


SITE_TYPE = "TYPE_SITE"


class BibTypeSiteView(CruvedProtectedMixin, ModelView):
    """
    Surcharge de l'administration des types de sites
    """

    module_code = "MONITORINGS"
    object_code = None

    def __init__(self, session, **kwargs):
        # Référence au model utilisé
        super(BibTypeSiteView, self).__init__(BibTypeSite, session, **kwargs)

    def get_only_nomenclature_asc():
        return (
            DB.session.query(TNomenclatures)
            .join(TNomenclatures.nomenclature_type)
            .filter(BibNomenclaturesTypes.mnemonique == SITE_TYPE)
            .order_by(TNomenclatures.label_fr.asc())
        )

    def get_label_fr_nomenclature(x):
        return x.label_fr

    def list_label_nomenclature_formatter(view, _context, model, _name):
        return model.nomenclature.label_fr

    def unique(form, field):
        if BibTypeSite.query.filter_by(id_nomenclature=field.data.id_nomenclature).first() is not None:
            raise ValidationError("The same nomenclature cannot be used twice")

    # Nom de colonne user friendly
    column_labels = dict(nomenclature="Types de site")
    # Description des colonnes
    column_descriptions = dict(nomenclature="Nomenclature de Type de site à choisir")

    column_hide_backrefs = False

    form_args = dict(
        nomenclature=dict(query_factory=get_only_nomenclature_asc, get_label=get_label_fr_nomenclature, validators=[unique])
    )

    column_list = ("nomenclature","config")
    column_formatters = dict(nomenclature=list_label_nomenclature_formatter)
