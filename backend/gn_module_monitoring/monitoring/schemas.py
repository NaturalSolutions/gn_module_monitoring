import json

from marshmallow import Schema, fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from gn_module_monitoring.monitoring.models import TMonitoringSitesGroups


def paginate_schema(schema):
    class PaginationSchema(Schema):
        count = fields.Integer()
        limit = fields.Integer()
        offset = fields.Integer()
        items = fields.Nested(schema, many=True, dump_only=True)

    return PaginationSchema


class MonitoringSitesGroupsSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = TMonitoringSitesGroups
        exclude = ("geom_geojson",)

    geometry = fields.Method("serialize_geojson", dump_only=True)

    def serialize_geojson(self, obj):
        if obj.geom_geojson is not None:
            return json.loads(obj.geom_geojson)
