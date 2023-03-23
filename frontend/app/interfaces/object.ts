import { JsonData } from "../types/jsondata";
import { IPaginated } from "./page";
import { GeoJSON } from "geojson";
import { Observable } from "rxjs";

export interface IObject {
  data: JsonData;
}

export interface IService<T> {
  get(limit: number, page: number, params: JsonData): Observable<IPaginated<T>>;
  create(postdata: T): Observable<T>;
  patch(id: number, updatedData: T): Observable<T>;
  // delete(obj: IGeomObject)
}

export type SelectObject = {
  id: string;
  label: string;
};
