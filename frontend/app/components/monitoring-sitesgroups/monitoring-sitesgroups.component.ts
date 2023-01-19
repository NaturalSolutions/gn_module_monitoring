import { Component, OnInit, Input } from "@angular/core";
import { LocationStrategy } from "@angular/common";
import { SitesGroupService } from "../../services/sites_group.service";
import {
  MonitoringSitesGroup,
  columnNameSiteGroup,
} from "../../class/monitoring-sites-group";
import { Page, Paginated } from "../../interfaces/page";
import {
  Router
} from "@angular/router";

const LIMIT = 10;

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
  @Input() sitesGroupsSelected: MonitoringSitesGroup;
  filters = {};
  displayDetails: boolean = false;
  path: string;

  constructor(
    private _sites_group_service: SitesGroupService,
    private router: Router,
    private location: LocationStrategy
  ) {
    this.path = this.router.url;
    this.location.onPopState(() => {
      if (this.location.path() === this.path) this.displayDetails = false;
    });
  }
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

  seeDetails($event) {
    console.log("seeDetails", $event);
    if ($event) {
      this.displayDetails = true;
      this.sitesGroupsSelected = $event;
      this.router.navigate([
        "/monitorings/sites_groups",
        $event.id_sites_group,
      ]);
      console.log(this.sitesGroupsSelected);
    }
  }
}
