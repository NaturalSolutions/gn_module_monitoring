import { Component, OnInit } from "@angular/core";
import { FormService } from "../../services/form.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ISite } from "../../interfaces/geom";


@Component({
  selector: "monitoring-sites-create",
  templateUrl: "./monitoring-sites-create.component.html",
  styleUrls: ["./monitoring-sites-create.component.css"],
})
export class MonitoringSitesCreateComponent implements OnInit {
  site: ISite;
  form: FormGroup;
  constructor(
    private _formService: FormService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this._formService.changeDataSub({});
    this.form = this._formBuilder.group({});
  }
}
