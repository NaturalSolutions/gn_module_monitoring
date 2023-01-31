import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GeoJSON } from "geojson";

import { CacheService } from "./cache.service";
import { IGeomService, ISitesGroup, ISite } from "../interfaces/geom";
import { IPaginated } from "../interfaces/page";
import { JsonData } from "../types/jsondata";
import { ResponseUpdated } from "../interfaces/response";
@Injectable()
export class SitesGroupService implements IGeomService {
  constructor(private _cacheService: CacheService) {}

  get(
    page: number = 1,
    limit: number = 10,
    params: JsonData = {}
  ): Observable<IPaginated<ISitesGroup>> {
    return this._cacheService.request<Observable<IPaginated<ISitesGroup>>>(
      "get",
      `sites_groups`,
      {
        queryParams: { page, limit, ...params },
      }
    );
  }

  getById(id: number): Observable<ISitesGroup> {
    return this._cacheService.request<Observable<ISitesGroup>>(
      "get",
      `sites_groups/${id}`
    );
  }

  get_geometries(params: JsonData = {}): Observable<GeoJSON.FeatureCollection> {
    return this._cacheService.request<Observable<GeoJSON.FeatureCollection>>(
      "get",
      "sites_groups/geometries",
      {
        queryParams: { ...params },
      }
    );
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

  patchGroupSite(id:number,updatedData:JsonData):Observable<ResponseUpdated>{
    return this._cacheService.request("patch",`sites_groups/${id}`,{postData : updatedData})
  }
}
