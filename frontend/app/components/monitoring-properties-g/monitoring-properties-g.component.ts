import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { extendedDetailsSiteGroup } from "../../class/monitoring-sites-group";
import { ISitesGroup } from "../../interfaces/geom";
import { EditObjectService } from "../../services/edit-object.service";

@Component({
  selector: "pnx-monitoring-properties-g",
  templateUrl: "./monitoring-properties-g.component.html",
  styleUrls: ["./monitoring-properties-g.component.css"],
})
export class MonitoringPropertiesGComponent implements OnInit {
  @Input() selectedObj: ISitesGroup;
  @Input() bEdit: boolean;
  @Output() bEditChange = new EventEmitter<boolean>();

  Object = Object;

  // @Input() currentUser;
  infosColsSiteGroups: typeof extendedDetailsSiteGroup =
    extendedDetailsSiteGroup;
  color: string = "white";
  dataDetails: ISitesGroup;

  datasetForm = new FormControl();
  bUpdateSyntheseSpinner = false;
  public modalReference;

  constructor(private _editService: EditObjectService) {}

  ngOnInit() {
    console.log("selectedObj", this.selectedObj);
    console.log("infosColsSiteGroups", this.infosColsSiteGroups);
  }

  onEditClick() {
    this.bEditChange.emit(true);
    console.log("edit");
    console.log("obj inside PROPERTIES", this.selectedObj);
    let id_object = this.getId()
    this.selectedObj["id"] = this.selectedObj[id_object[0]]
    this._editService.changeDataSub(this.selectedObj);
  }

  getId(){
    return Object.keys(this.selectedObj).filter(k => k.startsWith('id'))
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   console.log("inside ngOnChanges");
  //   console.log("changes", changes);
  //   if (changes["selectedObj"] && this.selectedObj) {
  //   console.log(this.selectedObj)
  //   }
  // }
}
