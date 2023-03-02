import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { endPoints } from "../enum/endpoints";
import { IobjObs } from "../interfaces/objObs";

@Injectable()
export class ObjectService {
  objObs: IobjObs = {
    properties: {},
    endPoint: endPoints.sites,
    addObjLabel: "Ajouter",
    label: "",
    editObjLabel: "Editer",
    id: null,
    moduleCode: "generic",
  };

  private dataObjType = new BehaviorSubject<IobjObs>(this.objObs);
  currentObjectType = this.dataObjType.asObservable();

  private dataObjTypeParent = new BehaviorSubject<IobjObs>(this.objObs);
  currentObjectTypeParent = this.dataObjTypeParent.asObservable();

  constructor() {}

  changeObjectType(newObjType: IobjObs) {
    this.dataObjType.next(newObjType);
  }

  changeObjectTypeParent(newObjType: IobjObs) {
    this.dataObjTypeParent.next(newObjType);
  }
}
