from flask_sqlalchemy import BaseQuery
from werkzeug.datastructures import MultiDict
from sqlalchemy import and_


class Query(BaseQuery):
    def _get_model(self):
        # When sqlalchemy is updated:
        # return self._raw_columns[0].entity_namespace
        return self._entities[0].selectable.c

    def filter_by_params(self, params: MultiDict = None):
        model = self._get_model()
        and_query = and_(*tuple(getattr(model, key).ilike(f"%{value}%") for key, value in params.items()))
        return self.filter(and_query)

