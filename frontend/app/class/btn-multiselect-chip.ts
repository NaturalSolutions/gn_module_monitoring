import { Observable } from 'rxjs';

import { ISite, ISitesGroup } from '../interfaces/geom';
import { IPaginated } from '../interfaces/page';
import { JsonData } from '../types/jsondata';

const LIMIT = 50;

type callbackFunction = (
  pageNumber: number,
  limit: number,
  filters: JsonData
) => Observable<IPaginated<ISitesGroup> | IPaginated<ISite>>;

export class BtnMuliSelectChipClass {
  protected getItemsCallBack: callbackFunction;
  protected limit = LIMIT;
  public page = 1;
  public filters = {};

  constructor() {}
}
