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

const LIMIT = 10


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

interface Page {
  count: number;
  limit: number;
  offset: number;
}

interface PaginatedSitesGroup extends Page{
  items: SitesGroups[];
}

enum columnNameSiteGroup {
  nb_sites = "Nb. sites",
  nb_visits = "Nb. visites",
  sites_group_code = "Code",
  sites_group_name = "Nom",
}

interface ColName {
  name: string,
  prop: string,
  description?: string,
}

@Component({
  selector: "monitoring-sitesgroups",
  templateUrl: "./monitoring-sitesgroups.component.html",
  styleUrls: ["./monitoring-sitesgroups.component.css"],
})
export class MonitoringSitesGroupsComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rowStatus: Array<any>;
  // @Input() rowStatus: Array<any>;
  @Output() rowStatusChange = new EventEmitter<Object>();
  @Output() bEditChanged = new EventEmitter<boolean>();
  objectsStatus;
  groupSiteId;

  private filterSubject: Subject<string> = new Subject();
  selected = [];
  filters = {};
  row_save;

  public page: Page = {count: 0, limit: 0, offset: 0}; 
  listAllColName: ColName[] = [];
  dataTable;
  rows;
  columns;

  // child0 = {
  //   "config":{
  //     "display_filter":false
  //   }
  // }

  // Est ce qu'un simple boolean ne convient pas ?
  displayFilter:boolean = false;

  sitesGroups: GeoJSON;

  constructor(private _sites_service: SitesService) {}
  ngOnInit() {
    this.getSites()
    this.initDatatable();
  }

  getSites(offset=1, params={}) {
    this._sites_service
      .getSitesGroups(offset, LIMIT, params)
      .subscribe((data: PaginatedSitesGroup) => {
        this.page = {count: data.count, limit: data.limit, offset: data.offset - 1}
        this.sitesGroups = {
          features: data.items.map((group) => {
            group["type"] = "Feature";
            return group;
          }),
          type: "FeatureCollection",
        };
        // console.log(this.sitesGroups);
        this.getDataTable();
        this.listAllColName = this.colsTable();
        // console.log(this.listAllColName)
        this.columns = this.listAllColName;
        this.rows = this.dataTable;
        console.log("rows", this.rows);
        console.log("columns", this.columns);
        this.groupSiteId = this.sitesGroups.features[0].id;
        console.log("this.groupSiteId", this.groupSiteId);
        this.initObjectsStatus();
      });
      
  }

  setPage(e) {
    this.getSites(e.offset + 1, this.filters)
  }

  getDataTable() {
    this.dataTable = this.sitesGroups.features.map((groupSite) => {
      let {
        comments,
        data,
        geometry,
        uuid_sites_group,
        type,
        id_sites_group,
        sites_group_description,
        ...dataTable
      } = groupSite;
      return dataTable;
    });
    //  console.log(this.dataTable)
  }

  colsTable() {
    const arr = Object.keys(this.dataTable[0]);
    console.log("arr", arr);
    const allColName: ColName[] = []
    arr.forEach((element) => {
      allColName.push({
        name:
          element in ["id", "id_group_site"]
            ? element
            : columnNameSiteGroup[element],
        prop: element,
        description: undefined
      });
    });
    return allColName;
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
    console.log("objectsStatus", objectsStatus);
    // }

    // init site status
    if (this.groupSiteId) {
      objectsStatus["sites_groups"] = [];
      this.sitesGroups.features.forEach((f) => {
        // determination du site courrant
        let cur = false;
        if (f.id == this.groupSiteId) {
          cur = true;
        }

        objectsStatus["sites_groups"].push({
          id: f.id,
          selected: false,
          visible: true,
          current: cur,
        });
      });
    }

    this.objectsStatus = objectsStatus;
    console.log("objectsStatus after init", objectsStatus);
    this.rowStatus = this.objectsStatus["sites_groups"];
  }

  // ICI le select renvoyé correspond directement aux valeurs de la ligne sélectionné et non à l'event
  // permet de simplifier la fonction et pas besoin de check si l'event est un "click" ou non
  onSelect({ selected }) {
    console.log("Select Row", selected, this.selected);
    console.log("this.table", this.table);
    console.log(this.table._internalRows);

    console.log("selected[0].id", selected[0].id);
    const id = selected[0].id;

    if (!this.rowStatus) {
      return;
    }
    console.log("this.rowStatus after check rowStatus", this.rowStatus);

    this.rowStatus.forEach((status) => {
      const bCond = status.id === id;
      status["selected"] = bCond && !status["selected"];
    });

    this.setSelected();
    this.rowStatusChange.emit(this.rowStatus);
    console.log("after click rowStatus", this.rowStatus);
    console.log("after click selected", this.selected);
    console.log("after click table", this.table);
  }

  setSelected() {
    // this.table._internalRows permet d'avoir les ligne triées et d'avoir les bons index
    console.log("Inside setSelected", this.rowStatus);
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

  // Pour l'instant fonction non active
  ngOnChanges(changes: SimpleChanges) {
    console.log("inside ngOnChanges");
    for (const propName of Object.keys(changes)) {
      const chng = changes[propName];
      const cur = chng.currentValue;
      const pre = chng.currentValue;
      switch (propName) {
        case "rowStatus":
          this.setSelected();
          break;
        // case "child0":
        //   this.customColumnComparator = this.customColumnComparator_();
        //   break;
      }
    }
  }

  //  TEST
  // onSelect({ selected }) {
  //   console.log('Select Event', selected, this.selected);
  // }

  // onActivate(event) {
  //   console.log("Activate Event", event);
  // }

  //   if (!this.rowStatus) {
  //     return;
  //   }

  //////////////////////////////////////
  // NON utilisé car le databinding (selected)=onSelect($event) suffit par rapport au but recherché
  /////////////////////////////////////////////////
  // onRowClick(event) {
  //   console.log("inside onRowClick- event",event)
  //   if (!(event && event.type === "click")) {
  //     return;
  //   }
  //   console.log("inside onRowClick- event.row",event.row)
  //   const id = event.row && event.row.id;

  //   if (!this.rowStatus) {
  //     return;
  //   }

  //   this.rowStatus.forEach((status) => {
  //     const bCond = status.id === id;
  //     status["selected"] = bCond && !status["selected"];
  //   });

  //   this.setSelected();
  //   this.rowStatusChange.emit(this.rowStatus);
  // }

  ////////////////////////////////////:
  // WIP : fonctions liés à des classes basées sur ce qui se faisait anciennement avec le module code en parent de tout
  // A l'adapter pour coller avec l'architecture actuelle
  /////////////////////// 

  initDatatable() {
    console.log("Inside initDatatable")
    this.filters = {};
    this.filterSubject.pipe(debounceTime(500)).subscribe(() => {
      this.filter();
    });

    // this.customColumnComparator = this.customColumnComparator_();
    this.row_save = this.rows.map((e) => e);
    // on declenche les filtres (si filtre par defaut)
    setTimeout(() => {
      this.filter(true);
    }, 500);
  }

  filterInput($event) {
    this.filterSubject.next();
  }

  onSort($event) {
    this.filters = {...this.filters, sort: $event.column.prop, sort_dir: $event.newValue}
    this.getSites(1, this.filters)
  }

  filter(bInitFilter = false) {
    // filter all
    const oldFilters = this.filters
    this.filters = Object.keys(oldFilters).reduce(function(r, e) {
      if (![undefined, "", null].includes(oldFilters[e])) r[e] = oldFilters[e]
      return r;
    }, {})
    
    //offset = 1
    this.getSites(1, this.filters)
    // let bChange = false;
    // const temp = this.row_save.filter((row, index) => {
    //   let bCondVisible = true;
    //   for (const key of Object.keys(this.filters)) {
    //     let val = this.filters[key];
    //     if ([null, undefined].includes(val)) {
    //       continue;
    //     }
    //     val = String(val).toLowerCase();
    //     const vals = val.split(" ");
    //     for (const v of vals) {
    //       bCondVisible =
    //         bCondVisible && (String(row[key]) || "").toLowerCase().includes(v);
    //     }
    //   }

    //   if (!this.rowStatus) {
    //     return bCondVisible;
    //   }
    //   bChange = bChange || bCondVisible !== this.rowStatus[index].visible;
    //   this.rowStatus[index]["visible"] = bCondVisible;
    //   this.rowStatus[index]["selected"] =
    //     this.rowStatus[index]["selected"] && bCondVisible;
    //   return bCondVisible;
    //});

    // if (bChange || bInitFilter) {
    //   this.rowStatusChange.emit(this.rowStatus);
    // }
    // // update the rows
    // this.rows = temp;
    // // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
    // this.setSelected();
  }

// TODO: TO REPLACE WITH EFFECTIVE FUNCTION
navigateToDetail(row){
  console.log("Inside navigateToDetail on eye icon",row)
}

navigateToAddChildren(_,rowId){
  console.log("Inside navigateToAddChildren:",rowId)
}



}
