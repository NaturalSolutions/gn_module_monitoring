import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
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
  @Input() selectedObj: ISitesGroup;
  @Input() bEdit: boolean;
  @Output() bEditChange = new EventEmitter<boolean>();
  @Input() objectType: IobjObs<ObjDataType>;

  color: string = "white";
  dataDetails: ISitesGroup;
  fields: JsonData;
  fieldsNames: [];

  datasetForm = new FormControl();

  constructor(
    private _formService: FormService,
    private _objService: ObjectService,
  ) {}

  ngOnInit() {
    
    this._objService.currentObjectTypeParent.subscribe((newObjType) => {
      this.objectType = newObjType;
      this.fieldsNames = newObjType.template.fieldNames;
      this.fields= newObjType.template.fieldLabels;
    });
  }

  onEditClick() {
    this.bEditChange.emit(true);
    console.log(this.selectedObj)
    this.selectedObj["id"] = this.selectedObj[this.selectedObj.pk];
    this._formService.changeDataSub(this.selectedObj);
  }
}
