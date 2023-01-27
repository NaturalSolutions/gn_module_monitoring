import { Component, OnInit, Input } from "@angular/core";
import { ConfigService } from "../../services/config.service";
import { MapService } from "@geonature_common/map/map.service";
import { Subscription } from "rxjs";
import { SitesGroupService } from "../../services/sites_group.service";
import { columnNameSiteGroup } from "../../class/monitoring-sites-group";
import { IPaginated, IPage } from "../../interfaces/page";
import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationError,
  ActivatedRoute,
} from "@angular/router";
import { columnNameSite } from "../../class/monitoring-site";
import { ISite, ISitesGroup } from "../../interfaces/geom";
import { SitesService } from "../../services/sites.service";
import { GeoJSONService } from "../../services/geojson.service";

const LIMIT = 10;

function setPopup(baseUrl: string, id: number, name: string) {
  const url = `#/${baseUrl}/${id}/`;

  const popup = `
  <div>
    <h4>${name}</h4>
    <a href="${url}">
        <i class="fa fa-eye" aria-hidden="true"></i>
      </a>
  </div>
  `;

  return popup;
}

@Component({
  selector: "monitoring-sitesgroups",
  templateUrl: "./monitoring-sitesgroups.component.html",
  styleUrls: ["./monitoring-sitesgroups.component.css"],
})
export class MonitoringSitesGroupsComponent implements OnInit {
  @Input() page: IPage;
  @Input() sitesGroups: ISitesGroup[];
  @Input() sitesChild: ISite[];
  @Input() columnNameSiteGroup: typeof columnNameSiteGroup =
    columnNameSiteGroup;
  @Input() columnNameSite: typeof columnNameSite = columnNameSite;
  @Input() sitesGroupsSelected: ISitesGroup;

  @Input() rows;
  @Input() colsname;
  @Input() obj;

  filters = {};
  displayDetails: boolean = false;
  path: string;
  currentRoute: string = "";
  id: string | null;

  private routerSubscription: Subscription;

  constructor(
    private _sites_group_service: SitesGroupService,
    private _sites_service: SitesService,
    public geojson_service: GeoJSONService,
    private _configService: ConfigService,
    private router: Router,
    private _Activatedroute: ActivatedRoute // private _routingService: RoutingService
  ) {
    // TODO: Try to refactor into routingService ?
    // console.log(this.id)
    // this.id = this._routingService.id
    // console.log(this.id)
    // // this._routingService.getIdChild()
    // this._routingService.idChanging.subscribe(value =>{console.log(value)})
    // console.log(this.id)

    this.currentRoute = "";
    this.routerSubscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show progress spinner or progress bar
        console.log("Route change detected");
      }

      if (event instanceof NavigationEnd) {
        // Hide progress spinner or progress bar
        this.currentRoute = event.url;
        this.checkChildRoute();
        console.log(event);
        console.log(this._Activatedroute.snapshot);
        console.log(this._Activatedroute.snapshot.params);
        console.log(this.id);
        this.getDataAccordingTopath();
      }

      if (event instanceof NavigationError) {
        // Hide progress spinner or progress bar

        // Present error to user
        console.log(event.error);
      }
    });
  }

  ngOnInit() {
    this.getDataAccordingTopath();
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  onEachFeatureSiteGroups() {
    const baseUrl = this.router.url;
    return (feature, layer) => {
      const popup = setPopup(
        baseUrl,
        feature.properties.id_sites_group,
        "Groupe de site :" + feature.properties.sites_group_name
      );
      layer.bindPopup(popup);
    };
  }

  onEachFeatureSite() {
    const baseUrl = this.router.url;
    return (feature, layer) => {
      const popup = setPopup(
        baseUrl,
        feature.properties.id_base_site,
        "Site :" + feature.properties.base_site_name
      );
      layer.bindPopup(popup);
    };
  }

  checkChildRoute() {
    if (this._Activatedroute.firstChild) {
      this._Activatedroute.firstChild.params.subscribe((params) => {
        this.displayDetails = true;
        this.id = params["id"];
      });
    } else {
      this.displayDetails = false;
      this.id = null;
      this.geojson_service.removeFeatureGroup(
        this.geojson_service.sitesFeatureGroup
      );
      this.geojson_service.getSitesGroupsGeometries(
        this.onEachFeatureSiteGroups()
      );
    }
    // console.log(params);
  }

  getSitesGroups(page = 1, params = {}) {
    this._sites_group_service
      .get(page, LIMIT, params)
      .subscribe((data: IPaginated<ISitesGroup>) => {
        this.page = {
          count: data.count,
          limit: data.limit,
          page: data.page - 1,
        };
        this.sitesGroups = data.items;
        this.rows = this.sitesGroups;
        this.obj = this.sitesGroups;
        this.colsname = this.columnNameSiteGroup;
        console.log("Inside getSitesGroups", this.rows);
      });
  }

  getSitesGroupsById(page = 1, params = {}) {
    this._sites_group_service
      .get(page, LIMIT, params)
      .subscribe((data: IPaginated<ISitesGroup>) => {
        this.page = {
          count: data.count,
          limit: data.limit,
          page: data.page - 1,
        };
        this.sitesGroupsSelected = data.items[0];
        console.log("Inside getSitesGroupsById", data.items);
      });
  }

  getSitesGroupsChild(page = 1, params = {}) {
    console.log(params);
    this._sites_group_service
      .getSitesChild(page, LIMIT, params)
      .subscribe((data: IPaginated<ISite>) => {
        this.page = {
          count: data.count,
          limit: data.limit,
          page: data.page - 1,
        };

        this.sitesChild = data.items;
        this.rows = this.sitesChild;
        this.obj = this.sitesChild;
        this.colsname = this.columnNameSite;
        console.log("Inside getSitesGroupsChild", this.rows);
      });
  }

  getDataAccordingTopath(page = 1, params = {}) {
    if (this.id) {
      console.log("inside getDataAccording to path", this.id);
      console.log("inside getDataAccording to path, params", params);
      params["id_sites_group"] = this.id;
      this.displayDetails = true;
      this.getSitesGroupsById(
        (page = 1),
        (params = { id_sites_group: this.id })
      );
      this.geojson_service.getSitesGroupsChildGeometries(
        this.onEachFeatureSite(),
        params
      );
      this.geojson_service.filterSitesGroups(+this.id);
      this.getSitesGroupsChild(page, params);
    } else {
      this.getSitesGroups(page, params);
    }
    // });
  }

  setPage($event) {
    console.log("setPage Sitesgroups Components");
    this.getDataAccordingTopath($event.page + 1, this.filters);
  }

  onSortEvent(filters) {
    console.log("onSortEvent sitegroups component, filters", filters);
    this.filters = filters;
    this.getDataAccordingTopath(1, this.filters);
  }

  onFilterEvent(filters) {
    console.log("onFilterEvent sitegroups component, filters", filters);
    this.filters = filters;
    this.getDataAccordingTopath(1, this.filters);
  }

  seeDetails($event) {
    console.log("seeDetails", $event);
    if ($event) {
      this.router.navigate([
        "/monitorings/sites_groups",
        $event.id_sites_group,
      ]);
      console.log(this.sitesGroupsSelected);
    }
  }

  onSelect($event) {
    this.geojson_service.selectSitesGroupLayer($event);
  }
}