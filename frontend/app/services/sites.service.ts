import { Injectable } from "@angular/core";

import { CacheService } from "./cache.service";
import { ConfigService } from "./config.service";
import { HttpClient } from "@angular/common/http";


@Injectable()
export class SitesService {
  constructor(
    private _cacheService: CacheService
  ) {}

  getSitesGroups() {
    return this._cacheService.request("get", `sites_groups`);
  }
}
