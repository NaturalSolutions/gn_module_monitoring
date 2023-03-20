import { JsonData } from "../types/jsondata";
import { Observable } from "rxjs";
import {
    map,
  } from "rxjs/operators";
import { IPaginated } from "../interfaces/page";
import { ISite, ISitesGroup } from "../interfaces/geom";

const LIMIT = 50;

type callbackFunction = (pageNumber: number, limit:number, filters: JsonData) => Observable<IPaginated<ISitesGroup> | IPaginated<ISite>>;

export class BtnMuliSelectChipClass {
  protected getItemsCallBack: callbackFunction;
  protected limit = LIMIT;
  public page = 1;
  public filters = {};

  constructor() {}

//   filterObject(val: string ,keyToFilt:string):Observable<ISitesGroup[] | ISite[]>{
//     return this.getItemsCallBack(this.page,this.limit, this.filters).pipe(
//         map((response) =>
//         response.items.filter((option) => {
//           return option[keyToFilt].toLowerCase().includes(val.toLowerCase());
//         })
//       )
//     );
//   }

}
