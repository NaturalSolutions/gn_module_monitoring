import { Component, OnInit } from "@angular/core";
import { FormService } from "../../services/form.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ISite } from "../../interfaces/geom";
import { SitesService } from "../../services/api-geom.service";
import { Observable } from "rxjs";

@Component({
  selector: "monitoring-sites-create",
  templateUrl: "./monitoring-sites-create.component.html",
  styleUrls: ["./monitoring-sites-create.component.css"],
})
export class MonitoringSitesCreateComponent implements OnInit {
  site: ISite;
  form: FormGroup;
  paramToFilt:string = 'label';
  funcToFilt:Function;
  titleBtn:string = 'Choix des types de sites';
  placeholderText:string ='Sélectionnez les types de site';

  constructor(
    private _formService: FormService,
    private _formBuilder: FormBuilder,
    private siteService: SitesService,
  ) {}

  ngOnInit() {
    this._formService.changeDataSub({});
    this.form = this._formBuilder.group({});
    this.funcToFilt = this.partialfuncToFilt.bind(this);
  }

  partialfuncToFilt(pageNumber:number,limit:number,valueToFilter:string ):Observable<any>{
    return this.siteService.getTypeSites(pageNumber,limit,{label_fr:valueToFilter,sort_dir:"desc"});
  }
}
