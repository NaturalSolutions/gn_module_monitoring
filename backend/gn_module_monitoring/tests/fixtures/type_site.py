import pytest
from geonature.utils.env import db
from pypnnomenclature.models import BibNomenclaturesTypes, TNomenclatures

from gn_module_monitoring.monitoring.models import BibTypeSite


@pytest.fixture
def nomenclature_site_types():
    return TNomenclatures.query.filter(
        BibNomenclaturesTypes.mnemonique == "TYPE_SITE",
        TNomenclatures.mnemonique.in_(("Grotte", "Mine")),
    ).all()


@pytest.fixture
def types_site(nomenclature_site_types):
    types_site = {
        nomenc_site_type.mnemonique: BibTypeSite(
            id_nomenclature=nomenc_site_type.id_nomenclature, config={}
        )
        for nomenc_site_type in nomenclature_site_types
    }
    with db.session.begin_nested():
        db.session.add_all(types_site.values())
    return types_site
