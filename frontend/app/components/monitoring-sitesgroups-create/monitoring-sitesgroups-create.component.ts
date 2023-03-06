import { Component, OnInit } from "@angular/core";
import { FormService } from "../../services/form.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ISitesGroup } from "../../interfaces/geom";

@Component({
  selector: "monitoring-sitesgroups-create",
  templateUrl: "./monitoring-sitesgroups-create.component.html",
  styleUrls: ["./monitoring-sitesgroups-create.component.css"],
})
export class MonitoringSitesGroupsCreateComponent implements OnInit {
  siteGroup: ISitesGroup;
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
