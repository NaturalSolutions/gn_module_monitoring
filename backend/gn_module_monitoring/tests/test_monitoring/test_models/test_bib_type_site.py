import pytest

from gn_module_monitoring.monitoring.models import BibTypeSite


@pytest.mark.usefixtures("temporary_transaction")
class TestBibTypeSite:
    def test_get_bib_type_site(self, type_site):
        get_type_site = BibTypeSite.query.filter_by(
            id_nomenclature=type_site.id_nomenclature
        ).one()

        assert get_type_site.id_nomenclature == type_site.id_nomenclature
