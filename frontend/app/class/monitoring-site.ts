import { ISite, JsonData } from "../interfaces/geom";
import { GeoJSON } from "geojson";

export enum columnNameSite{
  base_site_name = "Nom",
  last_visit = "Dernière visite",
  nb_visits = "Nb. visites",
  base_site_code = "Code",
  altitude_max = "Alt.max",
  altitude_min = "Alt.min"
}

export const extendedDetailsSite= {
  ...columnNameSite,
  base_site_description: "Description",
};
export class MonitoringSite implements ISite {
  altitude_max: number;
  altitude_min: number;
  base_site_code: string;
  base_site_description?: string;
  base_site_name: string;
  data: JsonData;
  first_use_date: string;
  geometry: GeoJSON.FeatureCollection;
  id_base_site: number;
  id_nomenclature_type_site?: number;
  last_visit?: Date;
  meta_create_date: Date;
  meta_update_date: Date;
  nb_visits: number;
  uuid_base_site: string;

  constructor(
    altitude_max: number,
    altitude_min: number,
    base_site_code: string,
    base_site_description: string,
    base_site_name: string,
    data: JsonData,
    geometry: GeoJSON.FeatureCollection,
    first_use_date: string,
    id_base_site: number,
    id_nomenclature_type_site: number,
    last_visit: Date,
    meta_create_date: Date,
    meta_update_date: Date,
    nb_visits: number,
    uuid_base_site: string
  ) {
    this.altitude_max = altitude_max;
    this.altitude_min = altitude_min;
    this.base_site_code = base_site_code;
    this.base_site_description = base_site_description;
    this.base_site_name = base_site_name;
    this.data = data;
    this.first_use_date = first_use_date;
    this.geometry = geometry;
    this.id_base_site = id_base_site;
    this.id_nomenclature_type_site = id_nomenclature_type_site;
    this.last_visit = last_visit;
    this.meta_create_date = meta_create_date;
    this.meta_update_date = meta_update_date;
    this.nb_visits = nb_visits;
    this.uuid_base_site = uuid_base_site;
  }
}
