import pytest
from geonature.utils.env import db
from pypnnomenclature.models import BibNomenclaturesTypes, TNomenclatures

from gn_module_monitoring.monitoring.models import BibTypeSite


@pytest.fixture
def type_site():
    site_type = TNomenclatures.query.filter(
        BibNomenclaturesTypes.mnemonique == "TYPE_SITE", TNomenclatures.mnemonique == "Grotte"
    ).one()
    type_site = BibTypeSite(id_nomenclature=site_type.id_nomenclature, config={})
    with db.session.begin_nested():
        db.session.add(type_site)
    return type_site
