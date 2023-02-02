import { Injectable } from "@angular/core";
import { ApiGeomService } from "./api-geom.service";
import { endPoints } from "./api-geom.service";
@Injectable()
export class SitesGroupService extends ApiGeomService {
  constructor(_cacheService) {
    super(_cacheService);
    this.objectType = endPoints.sites_groups;
    console.log(this.objectType);
  }

  addObjectType(): string {
    return "un nouveau groupe de site";
  }

  editObjectType(): string {
    return "le groupe de site";
  }
}
