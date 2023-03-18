import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable,of } from "rxjs";
import {
  startWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
} from "rxjs/operators";
import { SitesService } from "../../services/api-geom.service";
import { ObjectService } from "../../services/object.service";
import { IobjObs, ObjDataType } from "../../interfaces/objObs";
import { endPoints } from "../../enum/endpoints";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ISiteType } from "../../interfaces/geom";
export interface EmptyObject {
    label: string;
}

@Component({
  selector: "btn-select",
  templateUrl: "./btn-select.component.html",
  styleUrls: ["./btn-select.component.css"],
})
export class BtnSelectComponent implements OnInit {
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  myControl = new FormControl();
  filteredOptions: Observable<ISiteType[]| EmptyObject>;
  listTypeSiteChosen: string[] = [];
  allFruits: string[] = ["Apple", "Lemon", "Lime", "Orange", "Strawberry"];
  newData: any = [];

  @ViewChild("fruitInput") fruitInput: ElementRef<HTMLInputElement>;
  // @ViewChild(MatMenuTrigger) ddTrigger: MatMenuTrigger;

  // myControl = new FormControl();
  // options = [];
  // filteredOptions: Observable<any[]>;
  // selectedType: string;
  // value: unknown;
  // endPoint = endPoints;
  // @Input() objectType: IobjObs<ObjDataType>;
  // @Output() addEvent = new EventEmitter<any>();

  constructor(
    private _objService: ObjectService,
    private _siteService: SitesService,
    private router: Router,
    private _Activatedroute: ActivatedRoute
  ) {}

  
  // //////////////////////////////////////////////////////////////////////

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(""),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((val: string) => {
          console.log(val)
          return this.filterTypeSite(val)
      }),
    )
    
  }

  add(event: MatChipInputEvent): void {
    console.log(event);
    const value = (event.value || "").trim();

    // Add our fruit
    if (value) {
      this.listTypeSiteChosen.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.myControl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.listTypeSiteChosen.indexOf(fruit);

    if (index >= 0) {
      this.listTypeSiteChosen.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event.option.viewValue);
    console.log(event.option);
    this.listTypeSiteChosen.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = "";
    this.myControl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter((fruit) =>
      fruit.toLowerCase().includes(filterValue)
    );
  }

  filterTypeSite(val: string): Observable<ISiteType[]> {
    return this._siteService
    .getTypeSites(1, 10000, { label_fr: val, sort_dir: "asc" }).pipe(
      map(response => 
        response.items.filter((option) => {
          // console.log(option)
          return option.label.toLowerCase().includes(val.toLowerCase());
        }
        )
      )
    )
  }
}
