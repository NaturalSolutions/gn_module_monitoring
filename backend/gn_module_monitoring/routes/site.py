from typing import Tuple
from sqlalchemy import select
from geonature.utils.env import DB

from flask import request
from flask.json import jsonify
from geonature.core.gn_monitoring.models import TBaseSites
from werkzeug.datastructures import MultiDict

from gn_module_monitoring.blueprint import blueprint
from gn_module_monitoring.monitoring.models import BibCategorieSite,cor_site_type_categorie,TNomenclatures
from gn_module_monitoring.utils.routes import (filter_params, get_limit_offset,
                                               paginate,paginate_nested)
from sqlalchemy.orm import joinedload,load_only,Load


@blueprint.route("/sites/categories", methods=["GET"])
def get_categories():
    params = MultiDict(request.args)
    limit, page = get_limit_offset(params=params)

    query = filter_params(query=BibCategorieSite.query, params=params)
    query = query.order_by(BibCategorieSite.id_categorie)

  
    # query.options(load_only(BibCategorieSite.id_categorie, BibCategorieSite.label,BibCategorieSite.config), Load(TNomenclatures).load_only(TNomenclatures.label_fr))
   
    # subq = DB.session.query(TNomenclatures.id_nomenclature, TNomenclatures.label_fr,cor_site_type_categorie.c.id_categorie).join(cor_site_type_categorie,cor_site_type_categorie.c.id_nomenclature == TNomenclatures.id_nomenclature).subquery()   
    # stmt = DB.session.query(BibCategorieSite.id_categorie, BibCategorieSite.label,BibCategorieSite.config, subq.c.label_fr).join(subq, BibCategorieSite.id_categorie == subq.c.id_categorie)
    # return paginate_nested(query=stmt, object_name="categories", limit=limit, page=page,model=BibCategorieSite)
    return paginate_nested(query=query, object_name="categories", limit=limit, page=page)


@blueprint.route("/sites/categories/<int:id_categorie>", methods=["GET"])
def get_categories_by_id(id_categorie):
    query = BibCategorieSite.query.filter_by(id_categorie=id_categorie)
    res = query.first()

    return jsonify(res.as_dict())


@blueprint.route("/sites", methods=["GET"])
def get_sites():
    params = MultiDict(request.args)
    # TODO: add filter support
    limit, page = get_limit_offset(params=params)
    query = TBaseSites.query.join(
        BibCategorieSite, TBaseSites.id_categorie == BibCategorieSite.id_categorie
    )
    query = filter_params(query=query, params=params)
    return paginate(query=query, object_name="sites", limit=limit, page=page)


@blueprint.route("/sites/module/<string:module_code>", methods=["GET"])
def get_module_sites(module_code: str):
    # TODO: load with site_categories.json API
    return jsonify({"module_code": module_code})
