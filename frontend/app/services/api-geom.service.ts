import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

import { CacheService } from "./cache.service";
import { IGeomService, ISitesGroup, ISite } from "../interfaces/geom";
import { IPaginated } from "../interfaces/page";
import { JsonData } from "../types/jsondata";
import { Resp } from "../types/response";
import { endPoints } from "../enum/endpoints";
import { IobjObs } from "../interfaces/objObs";
import { ConfigJsonService } from "./config-json.service";


@Injectable()
export class ApiGeomService implements IGeomService {
  public endPoint: endPoints = endPoints.sites_groups;
  public objectObs: IobjObs;

  constructor(protected _cacheService: CacheService,protected _configJsonService: ConfigJsonService ) {
    this.init();
  }

  init() {
    this.endPoint = endPoints.sites_groups;
    this.objectObs = {
      properties: {},
      endPoint: endPoints.sites_groups,
      label:"groupe de site",
      addObjLabel: "Ajouter",
      editObjLabel: "Editer",
      id: null,
      moduleCode: "generic",
      schema:{},
      template:{fieldNames:[],  fieldLabels:{}}
    };
  }
  get(
    page: number = 1,
    limit: number = 10,
    params: JsonData = {}
  ): Observable<IPaginated<ISitesGroup | ISite>> {
    return this._cacheService.request<
      Observable<IPaginated<ISitesGroup | ISite>>
    >("get", this.endPoint, {
      queryParams: { page, limit, ...params },
    });
  }

  getById(id: number): Observable<ISitesGroup | ISite> {
    return this._cacheService.request<Observable<ISitesGroup | ISite>>(
      "get",
      `${this.endPoint}/${id}`
    );
  }

  get_geometries(params: JsonData = {}): Observable<GeoJSON.FeatureCollection> {
    return this._cacheService.request<Observable<GeoJSON.FeatureCollection>>(
      "get",
      `${this.endPoint}/geometries`,
      {
        queryParams: { ...params },
      }
    );
  }

  patch(id: number, updatedData: ISitesGroup | ISite): Observable<Resp> {
    return this._cacheService.request("patch", `${this.endPoint}/${id}`, {
      postData: updatedData,
    });
  }

  create( postData: ISitesGroup | ISite): Observable<Resp> {
    return this._cacheService.request("post", `${this.endPoint}`, {
      postData: postData,
    });
  }

  delete(id: number): Observable<Resp> {
    return this._cacheService.request("delete", `${this.endPoint}/${id}`);
  }
  
}

@Injectable()
export class SitesGroupService extends ApiGeomService {
  constructor(_cacheService: CacheService, _configJsonService: ConfigJsonService) {
    super(_cacheService, _configJsonService);
  }
  init(): void {
    this.endPoint = endPoints.sites_groups;
    this.objectObs ={
      properties: {},
      endPoint: endPoints.sites_groups,
      label:"groupe de site",
      addObjLabel: "Ajouter un nouveau groupe de site",
      editObjLabel: "Editer le groupe de site",
      id: null,
      moduleCode: "generic",
      schema:{},
      template:{fieldNames:[],  fieldLabels:{}}
    };
    this._configJsonService
    .init(this.objectObs.moduleCode)
    .pipe()
    .subscribe(() => {
      
  const fieldNames = this._configJsonService.configModuleObjectParam(this.objectObs.moduleCode,this.objectObs.endPoint,"display_properties")
  const schema = this._configJsonService.schema(this.objectObs.moduleCode,this.objectObs.endPoint)
  const fieldLabels = this._configJsonService.fieldLabels(schema)
  console.log(fieldNames)
  this.objectObs.template.fieldNames = fieldNames;
  this.objectObs.schema = schema;
  this.objectObs.template.fieldLabels = fieldLabels;
})
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
  constructor(_cacheService: CacheService, _configJsonService: ConfigJsonService) {
    super(_cacheService, _configJsonService);
  }
  opts = [];

  init(): void {
    this.endPoint = endPoints.sites;
    this.objectObs ={
      properties: {},
      endPoint: endPoints.sites,
      label:"site",
      addObjLabel: "Ajouter un nouveau site",
      editObjLabel: "Editer le site",
      id: null,
      moduleCode: "generic",
      schema:{},
      template:{fieldNames:[], fieldLabels:{}}
    };
    this._configJsonService
    .init(this.objectObs.moduleCode)
    .pipe()
    .subscribe(() => {
      
  const fieldNames = this._configJsonService.configModuleObjectParam(this.objectObs.moduleCode,this.objectObs.endPoint,"display_properties")
  const schema = this._configJsonService.schema(this.objectObs.moduleCode,this.objectObs.endPoint)
  const fieldLabels = this._configJsonService.fieldLabels(schema)
  console.log(fieldNames)
  this.objectObs.template.fieldNames = fieldNames;
  this.objectObs.schema = schema;
  this.objectObs.template.fieldLabels = fieldLabels;
})
    
  }

  addObjectType(): string {
    return " un nouveau site";
  }

  editObjectType(): string {
    return "le site";
  }
}
