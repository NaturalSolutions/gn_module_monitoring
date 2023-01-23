import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GeoJSON } from "geojson";

import { CacheService } from "./cache.service";
import { IGeomService, ISitesGroup, ISite } from "../interfaces/geom";
import { IPaginated } from "../interfaces/page";
import { JsonData } from "../types/jsondata";
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

  // getById(
  //   page: number = 1,
  //   limit: number = 10,
  //   params: JsonData = {"id_sites_group":null}
  // ): Observable<Paginated<MonitoringSitesGroup>> {
  //   return this._cacheService
  //     .request<Observable<Paginated<ISitesGroup>>>("get", `sites_groups`, {
  //       queryParams: { page, limit, ...params },
  //     })
  //     .pipe(
  //       map((response: Paginated<ISitesGroup>) => ({
  //         ...response,
  //         items: response.items.map(
  //           (item: ISitesGroup) => item as MonitoringSitesGroup
  //         ),
  //       }))
  //     );
  // }

  get_geometries(params: JsonData = {}): Observable<GeoJSON.FeatureCollection> {
    return this._cacheService.request<Observable<GeoJSON.FeatureCollection>>(
      "get",
      "/sites_groups/geometries",
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
}
