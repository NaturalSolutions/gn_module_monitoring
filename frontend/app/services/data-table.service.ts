import { Injectable } from "@angular/core";
import { Column } from "../interfaces/column";

interface ItemObjectTable {
  id: number | null;
  selected: boolean;
  visible: boolean;
  current: boolean;
}

type ItemsObjectTable = { [key: string]: ItemObjectTable };

@Injectable()
export class DataTableService {
  obj: ItemsObjectTable;
  objectsStatus: ItemsObjectTable;
  rowStatus: ItemObjectTable;
  idObj: number;

  constructor() {}

  colsTable(colName, dataTable): Column[] {
    const arr = Object.keys(colName);
    const allColumn: Column[] = arr
      .filter((item) => Object.keys(dataTable).includes(item))
      .map((elm) => ({
        name: colName[elm],
        prop: elm,
        description: elm,
      }));
    return allColumn;
  }

  initObjectsStatus(obj, key) {
    console.log("obj InitObjectStatus", obj);
    const objectsStatus = {};
    // for (const childrenType of Object.keys(this.obj.children)) {
    objectsStatus[key] = obj.map((groupSite) => {
      return {
        id: groupSite.id_sites_group,
        selected: false,
        visible: true,
        current: false,
      };
    });
    console.log("objectsStatus", objectsStatus);
    // }

    // init site status
    if (this.idObj) {
      objectsStatus[key] = [];
      obj.features.forEach((f) => {
        // determination du site courrant
        let cur = false;
        if (f.properties.id_sites_group == this.idObj) {
          cur = true;
        }

        objectsStatus[key].push({
          id: f.properties.id_sites_group,
          selected: false,
          visible: true,
          current: cur,
        });
      });
    }

    this.objectsStatus = objectsStatus;
    this.rowStatus = this.objectsStatus[key];
    console.log("datatable service", this.rowStatus);
    return [this.objectsStatus, this.rowStatus];
  }
}
