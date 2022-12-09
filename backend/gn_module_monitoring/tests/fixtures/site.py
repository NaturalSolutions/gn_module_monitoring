import pytest
from geonature.utils.env import db

from gn_module_monitoring.monitoring.models import BibCategorieSite


@pytest.fixture()
def categories():
    categories = [{"label": "gite", "config": {}}, {"label": "eolienne", "config": {}}]

    categories = {cat["label"]: BibCategorieSite(**cat) for cat in categories}

    with db.session.begin_nested():
        db.session.add_all(categories.values())

    return categories
