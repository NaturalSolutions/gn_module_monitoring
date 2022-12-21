from typing import Tuple

from flask import Response
from flask.json import jsonify
from sqlalchemy.orm import Query
from werkzeug.datastructures import MultiDict
import sqlalchemy
from sqlalchemy.orm import class_mapper


def todict(obj, classkey=None):
    if isinstance(obj, dict):
        data = {}
        for (k, v) in obj.items():
            data[k] = todict(v, classkey)
        return data
    elif hasattr(obj, "_ast"):
        return todict(obj._ast())
    elif hasattr(obj, "__iter__") and not isinstance(obj, str):
        return [todict(v, classkey) for v in obj]
    elif hasattr(obj, "__dict__"):
        data = dict([(key, todict(value, classkey)) 
            for key, value in obj.__dict__.items() 
            if not callable(value) and not key.startswith('_')])
        if classkey is not None and hasattr(obj, "__class__"):
            data[classkey] = obj.__class__.__name__
        return data
    else:
        return obj



def get_limit_offset(params: MultiDict) -> Tuple[int]:
    return params.pop("limit", 50), params.pop("offset", 1)


def paginate(query: Query, object_name: str, limit: int, page: int) -> Response:
    result = query.paginate(page=page, error_out=False, max_per_page=limit)
    data = {
        object_name: [res.as_dict() for res in result.items],
        "count": result.total,
        "limit": limit,
        "offset": page - 1,
    }
    return jsonify(data)

def paginate_nested(query: Query, object_name: str, limit: int, page: int,mode=None) -> Response:
    result = query.paginate(page=page, error_out=False, max_per_page=limit)
    # model_to_analyze = model
    # structure_data =  {prop.key:type(prop.expression.type).__name__ for prop in class_mapper(model_to_analyze).iterate_properties
    #         if isinstance(prop, sqlalchemy.orm.ColumnProperty)}
    # for prop in class_mapper(model_to_analyze).iterate_properties:
    #         if isinstance(prop, sqlalchemy.orm.RelationshipProperty):
    #             structure_data[prop.key] = "Select"

    data = {
        object_name: [todict(res) for res in result.items],
        "count": result.total,
        "limit": limit,
        "offset": page - 1,
    }
    return jsonify(data)

def filter_params(query: Query, params: MultiDict) -> Query: 
    if len(params) != 0:
        query = query.filter_by(**params)
    return query