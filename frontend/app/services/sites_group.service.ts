import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
// import { GeoJSON } from "geojson";

import { CacheService } from "./cache.service";
import { IGeomService, JsonData, ISitesGroup, ISite } from "../interfaces/geom";
import { Paginated } from "../interfaces/page";
import { MonitoringSitesGroup } from "../class/monitoring-sites-group";
import { MonitoringSite } from "../class/monitoring-site";
@Injectable()
export class SitesGroupService implements IGeomService {
  constructor(private _cacheService: CacheService) {}

  get(
    page: number = 1,
    limit: number = 10,
    params: JsonData = {}
  ): Observable<Paginated<MonitoringSitesGroup>> {
    return this._cacheService
      .request<Observable<Paginated<ISitesGroup>>>("get", `sites_groups`, {
        queryParams: { page, limit, ...params },
      })
      .pipe(
        map((response: Paginated<ISitesGroup>) => ({
          ...response,
          items: response.items.map(
            (item: ISitesGroup) => item as MonitoringSitesGroup
          ),
        }))
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


  getSitesChild(page: number = 1,
    limit: number = 10,
    params: JsonData = {},
  ): Observable<Paginated<MonitoringSite>> {
    return this._cacheService
      .request<Observable<Paginated<ISite>>>("get", `sites`, {
        queryParams: { page, limit, ...params },
      })
      .pipe(
        map((response: Paginated<ISite>) => ({
          ...response,
          items: response.items.map(
            (item: ISite) => item as MonitoringSite
          ),
        }))
      );
  }

}
