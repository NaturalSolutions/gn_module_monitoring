from flask import jsonify, request
from geonature.utils.env import db
from gn_module_monitoring.utils.strings.strings import gettext
from sqlalchemy import func
from werkzeug.datastructures import MultiDict

from gn_module_monitoring.blueprint import blueprint
from gn_module_monitoring.monitoring.models import TMonitoringSites, TMonitoringSitesGroups
from gn_module_monitoring.monitoring.schemas import MonitoringSitesGroupsSchema
from gn_module_monitoring.utils.routes import (
    filter_params,
    geojson_query,
    get_limit_page,
    get_sort,
    paginate,
    sort,
)
from gn_module_monitoring.monitoring.schemas import MonitoringSitesGroupsSchema
from marshmallow import ValidationError
from gn_module_monitoring.utils.errors.errorHandler import InvalidUsage


@blueprint.route("/sites_groups", methods=["GET"])
def get_sites_groups():
    params = MultiDict(request.args)
    limit, page = get_limit_page(params=params)
    sort_label, sort_dir = get_sort(
        params=params, default_sort="id_sites_group", default_direction="desc"
    )
    query = filter_params(query=TMonitoringSitesGroups.query, params=params)

    query = sort(query=query, sort=sort_label, sort_dir=sort_dir)
    return paginate(
        query=query,
        schema=MonitoringSitesGroupsSchema,
        limit=limit,
        page=page,
    )


@blueprint.route("/sites_groups/<int:id_sites_group>", methods=["GET"])
def get_sites_group_by_id(id_sites_group: int):
    schema = MonitoringSitesGroupsSchema()
    # result = TMonitoringSitesGroups.query.get_or_404(id_sites_group)
    result = TMonitoringSitesGroups.find_by_id(id_sites_group)
    return jsonify(schema.dump(result))


@blueprint.route("/sites_groups/geometries", methods=["GET"])
def get_sites_group_geometries():
    subquery = (
        db.session.query(
            TMonitoringSitesGroups.id_sites_group,
            TMonitoringSitesGroups.sites_group_name,
            func.st_convexHull(func.st_collect(TMonitoringSites.geom)),
        )
        .group_by(TMonitoringSitesGroups.id_sites_group, TMonitoringSitesGroups.sites_group_name)
        .join(
            TMonitoringSites,
            TMonitoringSites.id_sites_group == TMonitoringSitesGroups.id_sites_group,
        )
        .subquery()
    )

    result = geojson_query(subquery)

    return jsonify(result)


@blueprint.route("/sites_groups/<int:_id>", methods=["PATCH"])
def patch(_id):
    item_schema = MonitoringSitesGroupsSchema()
    item_json = request.get_json()
    item = TMonitoringSitesGroups.find_by_id(_id)
    if item:
        fields = TMonitoringSitesGroups.attribute_names()
        for field in item_json:
            if field in (fields):
                # getattr(Models.NgBase,field)
                setattr(item, field, item_json[field])
            else:
                continue
    else:
        item = item_schema.load(item_json)
    try:
        item_schema.load(item_json)
        db.session.add(item)
        db.session.commit()
    except ValidationError as err:
        return InvalidUsage(
            gettext("item_not_validated").format(err.messages), status_code=422, payload=item_json
        ).to_dict()
    except:
        return InvalidUsage("Internal Error", status_code=500).to_dict()

    return item_schema.dump(item), 201
