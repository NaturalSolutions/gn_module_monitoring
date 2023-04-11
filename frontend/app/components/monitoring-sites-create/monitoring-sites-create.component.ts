import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormService } from "../../services/form.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ISite } from "../../interfaces/geom";
import { SitesService } from "../../services/api-geom.service";
import { Observable, forkJoin, of } from "rxjs";
import { concatMap, map, mergeMap } from "rxjs/operators";
import { IobjObs, ObjDataType } from "../../interfaces/objObs";
import { MonitoringFormComponentG } from "../monitoring-form-g/monitoring-form.component-g";
import { ObjectService } from "../../services/object.service";
import { JsonData } from "../../types/jsondata";
import { endPoints } from "../../enum/endpoints";

@Component({
  selector: "monitoring-sites-create",
  templateUrl: "./monitoring-sites-create.component.html",
  styleUrls: ["./monitoring-sites-create.component.css"],
})
export class MonitoringSitesCreateComponent implements OnInit {
  site: ISite;
  form: FormGroup;
  paramToFilt: string = "label";
  funcToFilt: Function;
  titleBtn: string = "Choix des types de sites";
  placeholderText: string = "Sélectionnez les types de site";
  id_sites_group:number;
  types_site:string[];
  @ViewChild("subscritionObjConfig")
  monitoringFormComponentG: MonitoringFormComponentG;
  objToCreate: IobjObs<ObjDataType>;

  constructor(
    private _formService: FormService,
    private _formBuilder: FormBuilder,
    private siteService: SitesService,
    private _Activatedroute: ActivatedRoute,
    private _objService:ObjectService
  ) {}

  ngOnInit() {

    // let $obs1 = this._objService.currentObjSelected
    // let $obs2 = this._objService.currentObjectType
    // forkJoin([$obs1,$obs2]).subscribe( results =>{
    //   console.log(results[0])
    //   let objParent = results[0]
    //   let objChild = results[1]
    //   this.id_sites_group = objParent.id_sites_group
    //   this._formService.dataToCreate({ module: "generic", objectType: "site", id_sites_group : this.id_sites_group, id_relationship: ['id_sites_group','types_site'],endPoint:endPoints.sites,objSelected:objChild.objectType});
    //     this.form = this._formBuilder.group({});
    //     this.funcToFilt = this.partialfuncToFilt.bind(this);
    // }
    // )

    // TODO: Dans l'idéal ça serait d'appeler en parallèle les observables currentObjSelected et currentObjectType pour obtenir le endPoint depuis l'objet . Tentative
    // réalisée dans le code au dessus mais ça ne fonctionne pas . Il ne rentre pas dans le subscribe .. 

    this._objService.currentObjSelected.subscribe((objParent) => {
      this.id_sites_group = objParent.id_sites_group
      this._formService.dataToCreate({ module: "generic", objectType: "site", id_sites_group : this.id_sites_group, id_relationship: ['id_sites_group','types_site'],endPoint:endPoints.sites,objSelected:{}});
      this.form = this._formBuilder.group({});
      this.funcToFilt = this.partialfuncToFilt.bind(this);
    })

    // this._Activatedroute.params
    // .pipe(
    //   map((params) => params["id"] as number))
    // .subscribe(
    //   (id_site_group) => {
    //     console.log(id_site_group)
    //     this.id_sites_group = id_site_group
    //     this._formService.dataToCreate({ module: "generic", objectType: "site", id_sites_group : this.id_sites_group });
    //     this.form = this._formBuilder.group({});
    //     this.funcToFilt = this.partialfuncToFilt.bind(this);
    //   }
    // );
  
  }



  partialfuncToFilt(
    pageNumber: number,
    limit: number,
    valueToFilter: string
  ): Observable<any> {
    return this.siteService.getTypeSites(pageNumber, limit, {
      label_fr: valueToFilter,
      sort_dir: "desc",
    });
  }

  onSendConfig(config: JsonData): void {
    config  = this.addTypeSiteListIds(config)
    this.monitoringFormComponentG.getConfigFromBtnSelect(config);
  }

  addTypeSiteListIds(config:JsonData):JsonData{
    if (config && config.length !=0){
      config["types_site"]=[]
      for (const key in config ){
        if ('id_nomenclature_type_site' in config[key]) {
          config["types_site"].push(config[key]['id_nomenclature_type_site']);
        }
      }
      
    }
    return config
  }
}
