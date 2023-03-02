import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

import { CacheService } from "./cache.service";
import { IGeomService, ISitesGroup, ISite } from "../interfaces/geom";
import { IPaginated } from "../interfaces/page";
import { JsonData } from "../types/jsondata";
import { Resp } from "../types/response";
import { endPoints } from "../enum/endpoints";
import { IobjObs } from "../interfaces/objObs";


@Injectable()
export class ApiGeomService implements IGeomService {
  public objectType: endPoints = endPoints.sites_groups;
  public objectObs: IobjObs;

  constructor(protected _cacheService: CacheService) {
    this.init();
  }

  init() {
    this.objectType = endPoints.sites_groups;
    this.objectObs = {
      properties: {},
      endPoint: endPoints.sites_groups,
      label:"groupe de site",
      addObjLabel: "Ajouter",
      editObjLabel: "Editer",
      id: null,
      moduleCode: "generic",
    };
  }
  get(
    page: number = 1,
    limit: number = 10,
    params: JsonData = {}
  ): Observable<IPaginated<ISitesGroup | ISite>> {
    return this._cacheService.request<
      Observable<IPaginated<ISitesGroup | ISite>>
    >("get", this.objectType, {
      queryParams: { page, limit, ...params },
    });
  }

  getById(id: number): Observable<ISitesGroup | ISite> {
    return this._cacheService.request<Observable<ISitesGroup | ISite>>(
      "get",
      `${this.objectType}/${id}`
    );
  }

  get_geometries(params: JsonData = {}): Observable<GeoJSON.FeatureCollection> {
    return this._cacheService.request<Observable<GeoJSON.FeatureCollection>>(
      "get",
      `${this.objectType}/geometries`,
      {
        queryParams: { ...params },
      }
    );
  }

  patch(id: number, updatedData: ISitesGroup | ISite): Observable<Resp> {
    return this._cacheService.request("patch", `${this.objectType}/${id}`, {
      postData: updatedData,
    });
  }

  create( postData: ISitesGroup | ISite): Observable<Resp> {
    return this._cacheService.request("post", `${this.objectType}`, {
      postData: postData,
    });
  }

  delete(id: number): Observable<Resp> {
    return this._cacheService.request("delete", `${this.objectType}/${id}`);
  }
  
}

@Injectable()
export class SitesGroupService extends ApiGeomService {
  constructor(_cacheService: CacheService) {
    super(_cacheService);
  }
  init(): void {
    this.objectType = endPoints.sites_groups;
    this.objectObs ={
      properties: {},
      endPoint: endPoints.sites_groups,
      label:"groupe de site",
      addObjLabel: "Ajouter un nouveau groupe de site",
      editObjLabel: "Editer le groupe de site",
      id: null,
      moduleCode: "generic",
    };
  }

  getSitesChild(
    page: number = 1,
    limit: number = 10,
    params: JsonData = {}
  ): Observable<IPaginated<ISite>> {
    return this._cacheService.request<Observable<IPaginated<ISite>>>(
      "get",
      `sites`,
      {
        queryParams: { page, limit, ...params },
      }
    );
  }


  addObjectType(): string {
    return "un nouveau groupe de site";
  }

  editObjectType(): string {
    return "le groupe de site";
  }
}

@Injectable()
export class SitesService extends ApiGeomService {
  constructor(_cacheService: CacheService) {
    super(_cacheService);
  }
  opts = [];

  init(): void {
    this.objectType = endPoints.sites;
    this.objectObs ={
      properties: {},
      endPoint: endPoints.sites,
      label:"site",
      addObjLabel: "Ajouter un nouveau site",
      editObjLabel: "Editer le site",
      id: null,
      moduleCode: "generic",
    };
  }

  addObjectType(): string {
    return " un nouveau site";
  }

  editObjectType(): string {
    return "le site";
  }
}
