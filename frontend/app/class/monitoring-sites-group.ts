import { ISitesGroup, JsonData } from "../interfaces/geom";
import { GeoJSON } from "geojson";

export class MonitoringSitesGroup implements ISitesGroup {
  id_sites_group: number;
  sites_group_name: string;
  sites_group_code: string;
  sites_group_description: string;
  geometry: GeoJSON.FeatureCollection;
  data: JsonData;
  nb_sites: number;
  nb_visits: number;
  uuid_sites_group: string; //FIXME: see if OK

  constructor(
    id_sites_group: number,
    sites_group_name: string,
    sites_group_code: string,
    sites_group_description: string,
    geometry: GeoJSON.FeatureCollection,
    data: JsonData,
    nb_sites: number,
    nb_visits: number,
    uuid_sites_group: string = "" //FIXME: see if OK
  ) {
    this.id_sites_group = id_sites_group;
    this.sites_group_name = sites_group_name;
    this.sites_group_code = sites_group_code;
    this.sites_group_description = sites_group_description;
    this.geometry = geometry;
    this.data = data;
    this.nb_sites = nb_sites;
    this.nb_visits = nb_visits;
    this.uuid_sites_group = uuid_sites_group;
  }
}
