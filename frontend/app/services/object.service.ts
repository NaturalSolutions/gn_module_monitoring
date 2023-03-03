import { Injectable } from "@angular/core";
import { BehaviorSubject,ReplaySubject } from "rxjs";
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
    schema:{},
    template:{fieldNames:[],  fieldLabels:{}}
  };


  private dataObjType = new ReplaySubject<IobjObs>(1);
  // private dataObjType = new BehaviorSubject<IobjObs>(this.objObs);
  currentObjectType = this.dataObjType.asObservable();

  // private dataObjTypeParent = new BehaviorSubject<IobjObs>(this.objObs);
  private dataObjTypeParent = new ReplaySubject<IobjObs>(1);
  currentObjectTypeParent = this.dataObjTypeParent.asObservable();

  constructor() {
    let storedObjectType = localStorage.getItem('storedObjectType');
    let storedObjectTypeParent = localStorage.getItem('storedObjectTypeParent');
    if (storedObjectType)
        this.changeObjectType(JSON.parse(storedObjectType), false);

    if (storedObjectTypeParent)
        this.changeObjectTypeParent(JSON.parse(storedObjectTypeParent), false);
}


  changeObjectType(newObjType: IobjObs,storeObjectType: boolean = false) {
    if (storeObjectType)
      localStorage.setItem('storedObjectType', JSON.stringify(newObjType));
    this.dataObjType.next(newObjType);
  }

  changeObjectTypeParent(newObjType: IobjObs,storeObjectTypeParent: boolean = false) {
    if (storeObjectTypeParent)
      localStorage.setItem('storedObjectTypeParent', JSON.stringify(newObjType));
    this.dataObjTypeParent.next(newObjType);
  }
}
