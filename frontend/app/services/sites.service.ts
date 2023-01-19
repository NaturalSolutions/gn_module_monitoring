import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { CacheService } from "./cache.service";
import { IGeomService, ISite } from "../interfaces/geom";
import { IPaginated } from "../interfaces/page";
import { JsonData } from "../types/jsondata";

@Injectable()
export class SitesService implements IGeomService {
  constructor(private _cacheService: CacheService) {}

  get(
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
