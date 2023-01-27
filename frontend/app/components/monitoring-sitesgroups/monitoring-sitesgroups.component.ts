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
import { MonitoringGeomComponent } from "../../class/monitoring-geom-component";
import { setPopup } from "../../functions/popup";

const LIMIT = 10;

@Component({
  selector: "monitoring-sitesgroups",
  templateUrl: "./monitoring-sitesgroups.component.html",
  styleUrls: ["./monitoring-sitesgroups.component.css"],
})
export class MonitoringSitesGroupsComponent
  extends MonitoringGeomComponent
  implements OnInit
{
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

  constructor(
    private _sites_group_service: SitesGroupService,
    private _sites_service: SitesService,
    public geojsonService: GeoJSONService,
    private _configService: ConfigService,
    private router: Router,
    private _Activatedroute: ActivatedRoute // private _routingService: RoutingService
  ) {
    super();
    this.getAllItemsCallback = this.getSitesGroups;
  }

  ngOnInit() {
    this.getSitesGroups(1);
    this.geojsonService.getSitesGroupsGeometries(
      this.onEachFeatureSiteGroups()
    );
  }

  ngOnDestroy() {
    this.geojsonService.removeFeatureGroup(
      this.geojsonService.sitesGroupFeatureGroup
    );
  }

  onEachFeatureSiteGroups(): Function {
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
        this.colsname = this.columnNameSiteGroup;
      });
  }

  seeDetails($event) {
    // TODO: routerLink
    console.log("seeDetails");
    this.router.navigate([$event.id_sites_group], {
      relativeTo: this._Activatedroute,
    });
    // if ($event) {
    //   this.router.navigate([
    //     "/monitorings/sites_groups",
    //     $event.id_sites_group,
    //   ]);
    //   console.log(this.sitesGroupsSelected);
    // }
  }

  onSelect($event) {
    this.geojsonService.selectSitesGroupLayer($event);
  }
}
