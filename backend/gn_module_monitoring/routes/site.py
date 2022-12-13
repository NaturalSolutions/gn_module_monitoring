from typing import Tuple

from flask import request
from flask.json import jsonify
from geonature.core.gn_monitoring.models import TBaseSites
from werkzeug.datastructures import MultiDict

from gn_module_monitoring.blueprint import blueprint
from gn_module_monitoring.monitoring.models import BibCategorieSite


def get_limit_offset(params: MultiDict) -> Tuple[int]:
    return params.get("limit", 50), params.get("offset", 1)


def paginate(query, object_name: str, limit: int, page: int):
    result = query.paginate(page=page, error_out=False, max_per_page=limit)
    data = {
        object_name: [res.as_dict() for res in result.items],
        "count": result.total,
        "limit": limit,
        "offset": page - 1,
    }
    return jsonify(data)


@blueprint.route("/sites/categories", methods=["GET"])
def get_categories():
    params = MultiDict(request.args)
    label = params.get("label")
    limit, page = get_limit_offset(params=params)

    query = BibCategorieSite.query
    if label is not None:
        query = query.filter_by(label=label)
    query = query.order_by(BibCategorieSite.id_categorie)
    return paginate(query=query,
                             object_name="categories",
                             limit=limit,
                             page=page)


@blueprint.route("/sites/categories/<int:id_categorie>", methods=["GET"])
def get_categories_by_id(id_categorie):
    query = BibCategorieSite.query.filter_by(id_categorie=id_categorie)
    res = query.first()

    return jsonify(res.as_dict())


@blueprint.route("/sites", methods=["GET"])
def get_sites():
    # TODO: add filter support
    limit, page = get_limit_offset(params=MultiDict(request.args))
    query = TBaseSites.query.join(BibCategorieSite, TBaseSites.id_categorie == BibCategorieSite.id_categorie)
    return paginate(query=query, object_name="sites", limit=limit, page=page)


@blueprint.route("/sites/module/<string:module_code>", methods=["GET"])
def get_module_sites(module_code: str):
    # TODO: load with site_categories.json API
    return jsonify({"module_code": module_code})
