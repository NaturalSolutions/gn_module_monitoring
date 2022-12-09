from flask import request
from flask.json import jsonify
from werkzeug.datastructures import MultiDict

from gn_module_monitoring.blueprint import blueprint
from gn_module_monitoring.monitoring.models import BibCategorieSite


@blueprint.route("/sites/categories", methods=["GET"])
def get_categories():
    params = MultiDict(request.args)
    label = params.get("label")
    limit = params.get("limit", 100)
    offset = params.get("offset", 0)

    query = BibCategorieSite.query
    if label is not None:
        query = query.filter_by(label=label)
    query = query.order_by(BibCategorieSite.id_categorie).limit(limit).offset(offset)
    return [res.as_dict() for res in query.all()]


@blueprint.route("/sites/categories/<int:id_categorie>", methods=["GET"])
def get_categories_by_id(id_categorie):
    query = BibCategorieSite.query.filter_by(id_categorie=id_categorie)
    res = query.first()

    return jsonify(res.as_dict())


@blueprint.route("/sites", methods=["GET"])
def get_site():
    pass
