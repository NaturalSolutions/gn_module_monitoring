import { Injectable } from "@angular/core";
import { ApiGeomService, endPoints } from "./api-geom.service";

@Injectable()
export class SitesService extends ApiGeomService {
  constructor(_cacheService, objectType: endPoints) {
    super(_cacheService);
    this.objectType = endPoints.sites;
  }
  addObjectType(): string {
    return " un nouveau site";
  }

  editObjectType(): string {
    return "le site";
  }
}
