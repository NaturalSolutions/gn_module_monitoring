import { PageInfo } from "../interfaces/page";
import { JsonData } from "../types/jsondata";

const LIMIT = 10;

type callbackFunction = (pageNumber: number, filters: JsonData) => void;

export class MonitoringGeomComponent {
  protected getAllItemsCallback: callbackFunction;
  protected limit = LIMIT;
  public filters = {};

  constructor() {}

  setPage(page: PageInfo) {
    this.getAllItemsCallback(page.offset + 1, this.filters);
  }

  setSort(filters: JsonData) {
    this.filters = filters;
    const pageNumber = 1;
    this.getAllItemsCallback(pageNumber, this.filters);
  }

  setFilter(filters) {
    console.log("onFilterEvent sitegroups component, filters", filters);
    this.filters = filters;
    this.getAllItemsCallback(1, this.filters);
  }
}
