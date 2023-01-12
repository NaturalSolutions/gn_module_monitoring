import pytest
from geonature.utils.env import db
from pypnnomenclature.models import BibNomenclaturesTypes, TNomenclatures

from gn_module_monitoring.monitoring.models import BibTypeSite


@pytest.fixture
def nomenclature_types_site():
    return TNomenclatures.query.filter(
        BibNomenclaturesTypes.mnemonique == "TYPE_SITE",
        TNomenclatures.mnemonique.in_(("Grotte", "Mine")),
    ).all()


@pytest.fixture
def types_site(nomenclature_types_site):
    types_site = {
        nomenc_type_site.mnemonique: BibTypeSite(
            id_nomenclature=nomenc_type_site.id_nomenclature, config={}
        )
        for nomenc_type_site in nomenclature_types_site
    }
    with db.session.begin_nested():
        db.session.add_all(types_site.values())
    return types_site
