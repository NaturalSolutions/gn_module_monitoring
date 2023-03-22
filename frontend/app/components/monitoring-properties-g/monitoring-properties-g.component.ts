import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { concatMap } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { ISitesGroup } from "../../interfaces/geom";
import { IobjObs, ObjDataType } from "../../interfaces/objObs";
import { FormService } from "../../services/form.service";
import { ObjectService } from "../../services/object.service";
import { JsonData } from "../../types/jsondata";

@Component({
  selector: "pnx-monitoring-properties-g",
  templateUrl: "./monitoring-properties-g.component.html",
  styleUrls: ["./monitoring-properties-g.component.css"],
})
export class MonitoringPropertiesGComponent implements OnInit {
  // selectedObj: ISitesGroup;
  @Input() selectedObj: ISitesGroup;
  @Input() bEdit: boolean;
  @Output() bEditChange = new EventEmitter<boolean>();
  @Input() objectType: IobjObs<ObjDataType>;

  color: string = "white";
  dataDetails: ISitesGroup;
  fields: JsonData;
  fieldDefinitions: JsonData;
  fieldsNames: [];

  datasetForm = new FormControl();

  constructor(
    private _formService: FormService,
    private _objService: ObjectService,
    private router: Router,
    private _Activatedroute: ActivatedRoute
  ) {}

  ngOnInit() {
    // this._objService.currentObjSelected
    //   .pipe(
    //     concatMap((obj) => {
    //       this.selectedObj = obj;
    //       console.log("Source value ", obj);
    //       console.log("Source this.selectedObj ", this.selectedObj);
    //       console.log("starting new observable");
    //       return this._objService.currentObjectTypeParent;
    //     })
    //   )
    //   .subscribe((newObjType) => {
    //     console.log(this.selectedObj);
    //     console.log(newObjType);
    //     this.objectType = newObjType;
    //     this.fieldsNames = newObjType.template.fieldNames;
    //     this.fields = newObjType.template.fieldLabels;
    //     this.fieldDefinitions = newObjType.template.fieldDefinitions;
    //     this.objectType.properties = this.selectedObj;
    //     console.log(this.objectType);
    //   });
    // this._objService.currentObjSelected.subscribe((objSelect)=> console.log(objSelect))
    this._objService.currentObjectTypeParent.subscribe((newObjType) => {
      console.log(newObjType);
      this.objectType = newObjType;
      this.fieldsNames = newObjType.template.fieldNames;
      this.fields = newObjType.template.fieldLabels;
      this.fieldDefinitions = newObjType.template.fieldDefinitions;
      this.objectType.properties = this.selectedObj
      console.log(this.objectType);
    });
  }

  onEditClick() {
    // this.router.navigate(["edit"], {
    //   relativeTo: this._Activatedroute,
    // });
    // console.log("After routing edit")
    this.bEditChange.emit(true);
    this.selectedObj["id"] = this.selectedObj[this.selectedObj.pk];
    this._formService.changeDataSub(this.selectedObj);
  }


}
