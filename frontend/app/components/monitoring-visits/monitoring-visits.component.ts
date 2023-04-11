import { Component, OnInit,Input } from "@angular/core";
import { forkJoin } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import { GeoJSONService } from "../../services/geojson.service";
import { MonitoringGeomComponent } from "../../class/monitoring-geom-component";
import { SitesService, VisitsService } from "../../services/api-geom.service";
import { ISite } from "../../interfaces/geom";
import { IVisit } from "../../interfaces/visit";
import { IPage, IPaginated } from "../../interfaces/page";
import { columnNameVisit } from "../../class/monitoring-visit";
import { JsonData } from "../../types/jsondata";
import { ObjDataType } from "../../interfaces/objObs";

@Component({
  selector: "monitoring-visits",
  templateUrl: "./monitoring-visits.component.html",
  styleUrls: ["./monitoring-visits.component.css"],
})
export class MonitoringVisitsComponent
  extends MonitoringGeomComponent
  implements OnInit
{
  site: ISite;
  @Input() visits: IVisit[];
  @Input() page: IPage;
  // colsname: typeof columnNameVisit = columnNameVisit;
  objectType: string;
  bEdit: boolean;
  @Input() colsname;

  constructor(
    private _sites_service: SitesService,
    private _visits_service: VisitsService,
    public geojsonService: GeoJSONService,
    private router: Router,
    private _Activatedroute: ActivatedRoute
  ) {
    super();
    this.getAllItemsCallback = this.getVisits;
    this.objectType = "sites";
  }

  ngOnInit() {
    this._Activatedroute.params
      .pipe(
        map((params) => params["id"] as number),
        mergeMap((id: number) =>
          forkJoin({
            site: this._sites_service.getById(id),
            visits: this._visits_service.get(1, this.limit, {
              id_base_site: id,
            }),
          })
        )
      )
      .subscribe((data: { site: ISite; visits: IPaginated<IVisit> }) => {
        this.site = data.site;
        this.setVisits(data.visits);
        this.baseFilters = { id_base_site: this.site.id_base_site };
      });
  }

  getVisits(page: number, filters: JsonData) {
    this._visits_service
      .get(page, this.limit, filters)
      .subscribe((visits:IPaginated<IVisit>) => this.setVisits(visits));
  }

  setVisits(visits) {
    this.visits = visits.items;
    this.page = {
      page: visits.page - 1,
      count: visits.count,
      limit: visits.limit,
    };
    this.colsname =  this._visits_service.objectObs.dataTable.colNameObj;
  }

  seeDetails($event) {
    this.router.navigate([
      `monitorings/object/${$event.module.module_code}/visit/${$event.id_base_visit}`,
    ]);
  }
}
