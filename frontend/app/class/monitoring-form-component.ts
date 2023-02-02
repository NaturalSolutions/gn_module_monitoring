import { ISite, ISitesGroup } from "../interfaces/geom";
import { Observable } from "rxjs";
import { JsonData } from "../types/jsondata";
import { Resp } from "../types/response";

type patchPostFunction = (
  id: number,
  data: JsonData | ISitesGroup | ISite
) => Observable<Resp>;
export class MonitoringFormComponent {
  protected patchItemCallback: patchPostFunction;
  protected postItemCallback: patchPostFunction;

  constructor() {}
}
