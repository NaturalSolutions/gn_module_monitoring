import { Component, OnInit, Input } from "@angular/core";
import { SitesGroupService } from "../../services/sites_group.service";
import { MonitoringSitesGroup } from "../../class/monitoring-sites-group";
import { Page, Paginated } from "../../interfaces/page";

const LIMIT = 10;

enum columnNameSiteGroup {
  sites_group_name = "Nom",
  nb_sites = "Nb. sites",
  nb_visits = "Nb. visites",
  sites_group_code = "Code",
}

@Component({
  selector: "monitoring-sitesgroups",
  templateUrl: "./monitoring-sitesgroups.component.html",
  styleUrls: ["./monitoring-sitesgroups.component.css"],
})
export class MonitoringSitesGroupsComponent implements OnInit {
  @Input() page: Page;
  @Input() sitesGroups: MonitoringSitesGroup[];
  @Input() columnNameSiteGroup: typeof columnNameSiteGroup =
    columnNameSiteGroup;

  filters = {};

  constructor(private _sites_group_service: SitesGroupService) {}
  ngOnInit() {
    this.getSitesGroups();
  }

  getSitesGroups(page = 1, params = {}) {
    this._sites_group_service
      .get(page, LIMIT, params)
      .subscribe((data: Paginated<MonitoringSitesGroup>) => {
        this.page = {
          count: data.count,
          limit: data.limit,
          page: data.page - 1,
        };
        this.sitesGroups = data.items;
      });
  }

  setPage($event) {
    console.log("setPage Sitesgroups Components");
    this.getSitesGroups($event.page + 1, this.filters);
  }

  onSortEvent(filters) {
    console.log("onSortEvent sitegroups component, filters", filters);
    this.filters = filters;
    this.getSitesGroups(1, this.filters);
  }

  onFilterEvent(filters) {
    console.log("onFilterEvent sitegroups component, filters", filters);
    this.filters = filters;
    this.getSitesGroups(1, this.filters);
  }
}
