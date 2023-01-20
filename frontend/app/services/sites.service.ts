import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
// import { GeoJSON } from "geojson";

import { CacheService } from "./cache.service";
import { IGeomService, JsonData, ISite } from "../interfaces/geom";
import { Paginated } from "../interfaces/page";
import { MonitoringSite } from "../class/monitoring-site";

@Injectable()
export class SitesService implements IGeomService {
  constructor(private _cacheService: CacheService) {}

  get(
    page: number = 1,
    limit: number = 10,
    params: JsonData = {}
  ): Observable<Paginated<MonitoringSite>> {
    return this._cacheService
      .request<Observable<Paginated<ISite>>>("get", `sites`, {
        queryParams: { page, limit, ...params },
      })
      .pipe(
        map((response: Paginated<ISite>) => ({
          ...response,
          items: response.items.map((item: ISite) => item as MonitoringSite),
        }))
      );
  }
}
