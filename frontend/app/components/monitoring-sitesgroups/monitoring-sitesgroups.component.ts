import { Component, OnInit,   Input,
  Output,
  EventEmitter,
  ViewChild,
  SimpleChanges } from "@angular/core";
import { SitesService } from "../../services/sites.service";
import { GeoJSON } from "leaflet";

import { DatatableComponent } from "@swimlane/ngx-datatable";
import { Subject } from "rxjs";
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
  
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @Input() rowStatus: Array<any>;
  @Output() rowStatusChange = new EventEmitter<Object>();
  @Output() bEditChanged = new EventEmitter<boolean>();
  objectsStatus;
  groupSiteId;

  private filterSubject: Subject<string> = new Subject();
  selected = [];
  filters = {};


  listAllColName:{"name":string,"prop":string}[]=[];
  dataTable;
  rows;
  columns;

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
        // console.log(this.sitesGroups);
        this.getDataTable()
        this.colsTable()
        // console.log(this.listAllColName)
        this.columns = this.listAllColName
        this.rows=this.dataTable
        console.log("rows",this.rows)
        console.log("columns",this.columns)
        this.groupSiteId= this.sitesGroups.features[0].id 
        console.log("this.groupSiteId",this.groupSiteId)
        this.initObjectsStatus()
      });
      
  }

  
  getDataTable(){
   this.dataTable =  this.sitesGroups.features.map(groupSite => {
    let { comments,data,geometry,uuid_sites_group,type, ... dataTable } = groupSite
    return dataTable
   }) ;
  //  console.log(this.dataTable)
  }

  colsTable(){
    const arr= Object.keys(this.dataTable[0]);
    console.log("arr",arr)
    arr.forEach(element => 
      this.listAllColName.push({"name": element,"prop": element}));
    return this.listAllColName
  }

  initObjectsStatus() {
    const objectsStatus = {};
    // for (const childrenType of Object.keys(this.obj.children)) {
    objectsStatus["sites_groups"] = this.sitesGroups.features.map(
        (groupSite) => {
          return {
            id: groupSite.id,
            selected: false,
            visible: true,
            current: false,
          };
        }
      );
    console.log("objectsStatus",objectsStatus)
    // }

    // init site status
    if (this.groupSiteId) {
      objectsStatus["sites_groups"] = [];
      this.sitesGroups.features.forEach((f) => {
        // determination du site courrant
        let cur = false;
        if (f.id_sites_group == this.groupSiteId) {
          cur = true;
        }

        objectsStatus["sites_groups"].push({
          id: f.id_sites_group,
          selected: false,
          visible: true,
          current: cur,
        });
      });
    }

    this.objectsStatus = objectsStatus;
    console.log("objectsStatus after init",objectsStatus)
  }

  onRowClick(event) {
    console.log('Select Event', event, this.selected);
    if (!(event && event.type === "click")) {
      return;
    }
    const id = event.row && event.row.id;

    if (!this.rowStatus) {
      return;
    }

    this.rowStatus.forEach((status) => {
      const bCond = status.id === id;
      status["selected"] = bCond && !status["selected"];
    });

    this.setSelected();
    this.rowStatusChange.emit(this.rowStatus);
    console.log("after click rowStatus",this.rowStatus)
    console.log("after click selected",this.selected)
    console.log("after click table",this.table)
  }

  setSelected() {
    // this.table._internalRows permet d'avoir les ligne triées et d'avoir les bons index

    if (!this.rowStatus) {
      return;
    }

    const status_selected = this.rowStatus.find((status) => status.selected);
    if (!status_selected) {
      return;
    }

    const index_row_selected = this.table._internalRows.findIndex(
      (row) => row.id === status_selected.id
    );
    if (index_row_selected === -1) {
      return;
    }

    this.selected = [this.table._internalRows[index_row_selected]];
    this.table.offset = Math.floor(index_row_selected / this.table._limit);
  }


  // ngOnChanges(changes: SimpleChanges) {
  //   console.log("inside ngOnChanges")
  //   for (const propName of Object.keys(changes)) {
  //     const chng = changes[propName];
  //     const cur = chng.currentValue;
  //     const pre = chng.currentValue;
  //     switch (propName) {
  //       case "rowStatus":
  //         this.setSelected();
  //         break;
  //       // case "child0":
  //       //   this.customColumnComparator = this.customColumnComparator_();
  //       //   break;
  //     }
  //   }
  // }



  //  TEST
  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);
  }

  onActivate(event) {
    console.log('Activate Event', event);
  }
}
