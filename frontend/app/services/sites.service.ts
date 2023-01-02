import { Injectable } from "@angular/core";

import { CacheService } from "./cache.service";
import { ConfigService } from "./config.service";
import { HttpClient } from "@angular/common/http";


@Injectable()
export class SitesService {
  constructor(
    private _cacheService: CacheService
  ) {}

  getSitesGroups(offset=1, limit=10, params={}) {
    return this._cacheService.request("get", `sites_groups`, {queryParams: {offset, limit, ...params}});
  }
}
