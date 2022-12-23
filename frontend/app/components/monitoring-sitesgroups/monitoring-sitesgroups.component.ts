import { Component, OnInit } from "@angular/core";
import { SitesService } from "../../services/sites.service";
import { GeoJSON } from "leaflet";

interface SitesGroups {
  comments?: string;
  data?: any;
  geom_geojson: any;
  id_sites_group: number;
  nb_sites: number;
  nb_visits: number;
  sites_group_code: string;
  sites_group_description?: string;
  sites_group_name: string;
  uuid_sites_group: string;
}

interface PaginatedSitesGroup {
  count: number;
  limit: number;
  offset: number;
  items: SitesGroups[];
}

@Component({
  selector: "monitoring-sitesgroups",
  templateUrl: "./monitoring-sitesgroups.component.html",
  styleUrls: ["./monitoring-sitesgroups.component.css"],
})
export class MonitoringSitesGroupsComponent implements OnInit {
  sitesGroups: GeoJSON;
  constructor(private _sites_service: SitesService) {}
  ngOnInit() {
    console.log("yolo");
    this._sites_service
      .getSitesGroups()
      .subscribe((data: PaginatedSitesGroup) => {
        this.sitesGroups = {
          features: data.items.map((group) => {
            group["id"] = group.id_sites_group;
            group["type"] = "Feature";
            return group;
          }),
          type: "FeatureCollection",
        };
        console.log(this.sitesGroups);
      });
  }
}
