import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";
import { Observable } from "rxjs";
import { SelectObject } from "../../interfaces/object";

@Component({
  selector: "select-btn",
  templateUrl: "./select-btn.component.html",
  styleUrls: ["./select-btn.component.css"],
})
export class SelectButtonComponent {
  @ViewChild(MatMenuTrigger) ddTrigger: MatMenuTrigger;

  myControl = new FormControl();
  private _optionList: SelectObject[];
  @Input() set optionList(value: SelectObject[]) {
    this._optionList = value;
  }

  get optionList(): SelectObject[] {
    // other logic
    return this._optionList;
  }
  @Output() onSaved = new EventEmitter<SelectObject>();
  @Output() onDeployed = new EventEmitter<void>();

  constructor() {}

  cancelClick(ev: MouseEvent) {
    ev.stopPropagation();
  }

  onCancel() {
    this.ddTrigger.closeMenu();
  }

  onSave() {
    this.ddTrigger.closeMenu();
    this.onSaved.emit(this.myControl.value);
  }

  onDeploy() {
    this.onDeployed.emit();
  }

  displayFn(value: SelectObject) {
    return value.label;
  }
}
