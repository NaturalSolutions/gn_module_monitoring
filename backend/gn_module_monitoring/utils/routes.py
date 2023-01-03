from typing import Tuple

from flask import Response
from flask.json import jsonify
from sqlalchemy.orm import Query
from werkzeug.datastructures import MultiDict

from gn_module_monitoring.monitoring.queries import Query as MonitoringQuery


def get_limit_offset(params: MultiDict) -> Tuple[int]:
    return params.pop("limit", 50), params.pop("offset", 1)


def get_sort(params: MultiDict, default_sort: str, default_direction) -> Tuple[str]:
    return params.pop("sort", default_sort), params.pop("sort_dir", default_direction)


def paginate(query: Query, object_name: str, limit: int, page: int, depth: int = 0) -> Response:
    result = query.paginate(page=page, error_out=False, max_per_page=limit)
    data = {
        object_name: [res.as_dict(depth=depth) for res in result.items],
        "count": result.total,
        "limit": limit,
        "offset": page - 1,
    }
    return jsonify(data)


def filter_params(query: MonitoringQuery, params: MultiDict) -> MonitoringQuery:
    if len(params) != 0:
        query = query.filter_by_params(params)
    return query


def sort(query: MonitoringQuery, sort: str, sort_dir: str) -> MonitoringQuery:
    if sort_dir in ["desc", "asc"]:
        query = query.sort(label=sort, direction=sort_dir)
    return query
