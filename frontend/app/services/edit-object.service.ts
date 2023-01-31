import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, forkJoin } from "rxjs";
import { mergeMap, concatMap } from "rxjs/operators";

import { JsonData } from "../types/jsondata";
import { ConfigService } from "./config.service";

import { Utils } from "../utils/utils";
import { DataUtilsService } from "./data-utils.service";

@Injectable()
export class EditObjectService {
  data: JsonData = {};
  private dataSub = new BehaviorSubject<object>(this.data);
  currentData = this.dataSub.asObservable();
  private _config;
  properties: JsonData;
  moduleCode:string;
  objecType:string;

  constructor(
    private _configService: ConfigService,
    private _dataUtilsService: DataUtilsService
  ) {}

  changeDataSub(newDat: JsonData) {
    this.properties = newDat;
    newDat.moduleCode = "generic";
    newDat.objectType = "sites_group";
    this.moduleCode=  "generic";
    this.objecType=  "sites_group"
    this.dataSub.next(newDat)
    
  }



  formValues(obj): Observable<any> {
    const properties = Utils.copy(this.properties);
    const observables = {};
    const schema = obj[this.moduleCode];
    for (const attribut_name of Object.keys(schema)) {
      if (attribut_name == "id_module" || attribut_name =="medias" ){
        continue;
      }
      const elem = schema[attribut_name];
      if (!elem.type_widget) {
        continue;
      }
      observables[attribut_name] = this.toForm(elem, properties[attribut_name]);
    }
    console.log(observables)
    return forkJoin(observables).pipe(
      concatMap((formValues_in) => {
        const formValues = Utils.copy(formValues_in);
        // geometry
        // if (this.config["geometry_type"]) {
        //   formValues["geometry"] = this.geometry; // copy???
        // }
        return of(formValues);
      })
    );
  }

  toForm(elem, val): Observable<any> {
    let x = val;
    // valeur par default depuis la config schema
    x = [undefined, null].includes(x) ? elem.value || null : x;

    switch (elem.type_widget) {
      case "date": {
        const date = new Date(x);
        x = x
          ? {
              year: date.getUTCFullYear(),
              month: date.getUTCMonth() + 1,
              day: date.getUTCDate(),
            }
          : null;
        break;
      }
      case "observers": {
        x = !(x instanceof Array) ? [x] : x;
        break;
      }
      case "taxonomy": {
        x = x ? this._dataUtilsService.getUtil("taxonomy", x, "all") : null;
        break;
      }
    }
    if (
      elem.type_util === "nomenclature" &&
      Utils.isObject(x) &&
      x.code_nomenclature_type &&
      x.cd_nomenclature
    ) {
      x = this._dataUtilsService
        .getNomenclature(x.code_nomenclature_type, x.cd_nomenclature)
        .pipe(
          mergeMap((nomenclature) => {
            return of(nomenclature["id_nomenclature"]);
          })
        );
    }

    x = x instanceof Observable ? x : of(x);
    return x;
  }
}
