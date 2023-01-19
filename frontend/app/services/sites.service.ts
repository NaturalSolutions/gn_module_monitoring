import { Injectable } from "@angular/core";

import { CacheService } from "./cache.service";
import { ConfigService } from "./config.service";
import { HttpClient } from "@angular/common/http";
import { GeoJSON } from "leaflet";
interface SitesGroups{
  comments?: string;
  data?: any;
  // geometry: any;
  id_sites_group: number;
  nb_sites: number;
  nb_visits: number;
  sites_group_code: string;
  sites_group_description?: string;
  sites_group_name: string;
  uuid_sites_group: string;
}

interface SitesGroupsExtended extends Omit<GeoJSON.Feature, "P"|"type"> {
  // properties:Omit<SitesGroups,"geometry">;
  properties:SitesGroups
  type:string;
}

interface Page {
  count: number;
  limit: number;
  page: number;
}

interface PaginatedSitesGroup extends Page{
  items: SitesGroupsExtended[];
}
interface CustomGeoJson {
  type: "FeatureCollection";
  features: SitesGroupsExtended[];
}

@Injectable()
export class SitesService {
  constructor(
    private _cacheService: CacheService
  ) {}

  getSitesGroups(page=1, limit=10, params={}) {
    return this._cacheService.request("get", `sites_groups`, {queryParams: {page, limit, ...params}});
  }

  setFormatToGeoJson(data:PaginatedSitesGroup):CustomGeoJson{
    return {
      features: data.items.map((group) => {
        let {
          geometry,
          properties,
          ..._
        } = group;
        let result = {"geometry":geometry,"properties":properties,"type":"Feature"}
        console.log("result",result)
        console.log(group)
        return result;
      }),
      type: "FeatureCollection",
    };
  }

  getDataTable(data:CustomGeoJson) {
    return data.features.map((groupSite) => {
      let {
        comments,
        data,
        uuid_sites_group,
        id_sites_group,
        sites_group_description,
        ...dataTable
      } = groupSite.properties;
      return dataTable;
    });
  }

}
