import { DatatableComponent } from "@swimlane/ngx-datatable";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  SimpleChanges,
  TemplateRef,
} from "@angular/core";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { DataTableService } from "../../services/data-table.service";

interface ColName {
  name: string;
  prop: string;
  description?: string;
}

interface Page {
  count: number;
  limit: number;
  offset: number;
}

interface ItemObjectTable {
  id: number | null;
  selected: boolean;
  visible: boolean;
  current: boolean;
}
type ItemsObjectTable = { [key: string]: ItemObjectTable };

@Component({
  selector: "pnx-monitoring-datatable-g",
  templateUrl: "./monitoring-datatable-g.component.html",
  styleUrls: ["./monitoring-datatable-g.component.css"],
})
export class MonitoringDatatableGComponent implements OnInit {
  @Input() rows;
  @Input() colsname: ColName[];
  @Input() page: Page = { count: 0, limit: 0, offset: 0 };
  @Input() obj;

  @Input() rowStatus: Array<any>;
  @Output() rowStatusChange = new EventEmitter<Object>();

  @Output() bEditChanged = new EventEmitter<boolean>();

  @Input() currentUser;

  @Output() onSort = new EventEmitter<any>();
  @Output() onFilter = new EventEmitter<any>();
  @Output() onSetPage = new EventEmitter<any>();
  @Output() onDetailsRow = new EventEmitter<any>();

  private filterSubject: Subject<string> = new Subject();
  private subscription: any;
  displayFilter: boolean = false;
  objectsStatus: ItemsObjectTable;

  columns;
  row_save;
  selected = [];
  filters = {};

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("actionsTemplate") actionsTemplate: TemplateRef<any>;
  @ViewChild("hdrTpl") hdrTpl: TemplateRef<any>;

  constructor(private _dataTableService: DataTableService) {}

  ngOnInit() {
    console.log("DataTableComponent colname", this.colsname);
    console.log("DataTableComponent rows", this.rows);
    this.initDatatable();
  }

  initDatatable() {
    console.log("Inside initDatatable");
    console.log("this.rows", this.rows);
    this.filters = {};
    this.filterSubject.pipe(debounceTime(500)).subscribe(() => {
      this.filter();
    });
  }

  onSortEvent($event) {
    console.log("onSortEvent, $event", $event);
    this.filters = {
      ...this.filters,
      sort: $event.column.prop,
      sort_dir: $event.newValue,
    };
    console.log("onSortEvent, this.filters", this.filters);
    this.onSort.emit(this.filters);
  }

  setPage($event) {
    this.onSetPage.emit($event);
  }

  filterInput($event) {
    console.log("filterInput, $event", $event);
    this.filterSubject.next();
  }

  filter(bInitFilter = false) {
    // filter all
    console.log("Inside DataTable-G , filter()", this.filters);
    const oldFilters = this.filters;
    this.filters = Object.keys(oldFilters).reduce(function (r, e) {
      if (![undefined, "", null].includes(oldFilters[e])) r[e] = oldFilters[e];
      return r;
    }, {});
    this.onFilter.emit(this.filters);
  }

  onSelectEvent({ selected }) {
    console.log("Select Row", selected, this.selected);
    console.log("this.table", this.table);
    console.log(this.table._internalRows);
    console.log("selected[0]", selected[0]);
    console.log("selected[0].id", selected[0].id_group_site);
    const id = selected[0].id_group_site;

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

  ngOnDestroy() {
    this.filterSubject.unsubscribe();
  }

  // tooltip(column) {
  //   return this.child0.template.fieldDefinitions[column.prop]
  //     ? column.name + " : " + this.child0.template.fieldDefinitions[column.prop]
  //     : column.name;
  // }

  ngOnChanges(changes: SimpleChanges) {
    console.log("inside ngOnChanges");
    console.log("changes", changes);
    if (changes["rows"] && this.rows) {
      this.columns = this._dataTableService.colsTable(
        this.colsname,
        this.rows[0]
      );
    }

    if (changes["obj"] && this.obj) {
      this.objectsStatus,
        (this.rowStatus = this._dataTableService.initObjectsStatus(
          this.obj,
          "sites_groups"
        ));
    }
    for (const propName of Object.keys(changes)) {
      const chng = changes[propName];
      const cur = chng.currentValue;
      const pre = chng.currentValue;
      switch (propName) {
        case "rowStatus":
          this.setSelected();
          break;
      }
    }
  }
  navigateToAddChildren(_, rowId) {
    console.log("Inside navigateToAddChildren:", rowId);
  }
  navigateToDetail(row) {
    console.log("Inside navigateToDetail:", row);
    this.onDetailsRow.emit(row);
  }
}
