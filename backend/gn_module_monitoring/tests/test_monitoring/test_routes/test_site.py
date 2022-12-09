import json

import pytest
from flask import url_for

from gn_module_monitoring.tests.fixtures.site import categories


@pytest.mark.usefixtures("client_class", "temporary_transaction")
class TestSite:
    def test_get_categories_by_id(self, categories):
        for cat in categories.values():
            r = self.client.get(
                url_for(
                    "monitorings.get_categories_by_id",
                    id_categorie=cat.id_categorie,
                )
            )
            assert r.json["label"] == cat.label

    def test_get_categories(self, categories):
        r = self.client.get(url_for("monitorings.get_categories"))

        assert r.json == [cat.as_dict() for cat in categories.values()]

    def test_get_categories_label(self, categories):
        label = list(categories.keys())[0]

        r = self.client.get(url_for("monitorings.get_categories"), query_string={"label": label})
        assert r.json == [categories[label].as_dict()]
