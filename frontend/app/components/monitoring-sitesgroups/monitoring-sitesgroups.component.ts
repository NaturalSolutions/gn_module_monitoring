import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  SimpleChanges,
} from "@angular/core";
import { SitesService } from "../../services/sites.service";
import { GeoJSON } from "leaflet";

import { DatatableComponent } from "@swimlane/ngx-datatable";
import { Subject } from "rxjs";
import {debounceTime } from "rxjs/operators";
import { Feature, FeatureCollection } from "geojson";
import { DataTableService } from "../../services/data-table.service";

const LIMIT = 10
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
  offset: number;
}

interface PaginatedSitesGroup extends Page{
  items: SitesGroupsExtended[];
}

enum columnNameSiteGroup {
  nb_sites = "Nb. sites",
  nb_visits = "Nb. visites",
  sites_group_code = "Code",
  sites_group_name = "Nom",
}

interface CustomGeoJson {
  type: "FeatureCollection";
  features: SitesGroupsExtended[];
}



 @Component({
  selector: "monitoring-sitesgroups",
  templateUrl: "./monitoring-sitesgroups.component.html",
  styleUrls: ["./monitoring-sitesgroups.component.css"],
})
export class MonitoringSitesGroupsComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @Input() page: Page = {count: 0, limit: 0, offset: 0}; 
  @Input() dataTable;
  @Input() sitesGroups:CustomGeoJson;
  @Input() columnNameSiteGroup: typeof columnNameSiteGroup = columnNameSiteGroup;

 
  filters = {};

  constructor(private _sites_service: SitesService, private _dataTableService: DataTableService) {}
  ngOnInit() {
    this.getSites()
  }

  getSites(offset=1, params={}) {
    this._sites_service
      .getSitesGroups(offset, LIMIT, params)
      .subscribe((data: PaginatedSitesGroup) => {
        this.page = {count: data.count, limit: data.limit, offset: data.offset - 1}
        this.sitesGroups = this._sites_service.setFormatToGeoJson(data)
        this.dataTable = this._sites_service.getDataTable(this.sitesGroups);
      });
      
  }

  setPage($event) {
    console.log('setPage Sitesgroups Components')
    this.getSites($event.offset + 1, this.filters)
  }

  onSortEvent(filters) {
    console.log("onSortEvent sitegroups component, filters",filters)
    this.filters = filters
    this.getSites(1, this.filters)
  }

  onFilterEvent(filters){
    console.log("onFilterEvent sitegroups component, filters",filters)
    this.filters = filters
    this.getSites(1, this.filters)
  }

}
