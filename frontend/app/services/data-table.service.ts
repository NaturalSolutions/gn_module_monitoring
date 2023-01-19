import { Injectable } from "@angular/core";
import { Observable} from "rxjs";


interface Page {
  count: number;
  limit: number;
  page: number;
}

interface ColName {
  name: string,
  prop: string,
  description?: string,
}

interface ItemObjectTable {
  id:number|null;
  selected:boolean;
  visible:boolean;
  current:boolean;
  }

type ItemsObjectTable = { [key: string]: ItemObjectTable }

@Injectable()
export class DataTableService {

obj:ItemsObjectTable;
objectsStatus:ItemsObjectTable;
rowStatus:ItemObjectTable;
idObj:number;

public page: Page = {count: 0, limit: 0, page: 0}; 
  constructor(
  ) {}

  
  setPaginationConfig(count:number=0,limit:number=0, page:number=0):Page{
    return {"count":count,"limit":limit,"page":page}
  }
//   setPage(e){
//     this.obj
//   }

colsTable(colName,dataTable):ColName[] {
  const arr = Object.keys(dataTable[0]);
  const allColName: ColName[] = []
  arr.forEach((element) => {
    allColName.push({
      name:
        element in ["id", "id_group_site"]
          ? element
          : colName[element],
      prop: element,
      description: undefined
    });
  });
  return allColName;
}

initObjectsStatus(obj,key) {
  const objectsStatus = {};
  // for (const childrenType of Object.keys(this.obj.children)) {
  objectsStatus[key] = obj.features.map(
    (groupSite) => {
      return {
        id: groupSite.properties.id_sites_group,
        selected: false,
        visible: true,
        current: false,
      };
    }
  );
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
  console.log("datatable service",this.rowStatus)
  return [this.objectsStatus ,this.rowStatus]
}

  
}
