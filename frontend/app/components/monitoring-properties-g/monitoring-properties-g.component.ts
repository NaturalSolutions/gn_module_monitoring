import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import {
  MonitoringSitesGroup,
  extendedDetailsSiteGroup,
} from "../../class/monitoring-sites-group";

@Component({
  selector: "pnx-monitoring-properties-g",
  templateUrl: "./monitoring-properties-g.component.html",
  styleUrls: ["./monitoring-properties-g.component.css"],
})
export class MonitoringPropertiesGComponent implements OnInit {
  @Input() selectedObj: MonitoringSitesGroup;
  @Input() bEdit: boolean;
  @Output() bEditChange = new EventEmitter<boolean>();

  Object = Object;

  // @Input() currentUser;
  infosColsSiteGroups: typeof extendedDetailsSiteGroup =
    extendedDetailsSiteGroup;
  color: string = "white";
  dataDetails: MonitoringSitesGroup;

  datasetForm = new FormControl();
  bUpdateSyntheseSpinner = false;
  public modalReference;

  constructor() {}

  ngOnInit() {
    console.log("selectedObj", this.selectedObj);
    console.log("infosColsSiteGroups", this.infosColsSiteGroups);
  }

  onEditClick() {
    this.bEditChange.emit(true);
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   console.log("inside ngOnChanges");
  //   console.log("changes", changes);
  //   if (changes["selectedObj"] && this.selectedObj) {
  //   console.log(this.selectedObj)
  //   }
  // }
}
