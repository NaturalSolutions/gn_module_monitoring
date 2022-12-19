
from flask import request
from werkzeug.datastructures import MultiDict

from gn_module_monitoring.blueprint import blueprint
from gn_module_monitoring.monitoring.models import TMonitoringSitesGroups
from gn_module_monitoring.utils.routes import get_limit_offset, paginate


@blueprint.route("/sites_groups", methods=["GET"])
def get_sites_groups():
    params = MultiDict(request.args)
    limit, page = get_limit_offset(params=params)

    query = TMonitoringSitesGroups.query
    if len(params) != 0:
        query = query.filter_by(**params)
    query = query.order_by(TMonitoringSitesGroups.id_sites_group)
    return paginate(query=query, object_name="sites_groups", limit=limit, page=page)

