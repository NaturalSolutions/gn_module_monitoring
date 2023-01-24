import { Injectable } from "@angular/core";
import * as L from "leaflet";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { GeoJSON } from "geojson";
import { MapService } from "@geonature_common/map/map.service";

import { SitesGroupService } from "./sites_group.service";
import { SitesService } from "./sites.service";

// This service will be used for sites and sites groups

const siteGroupStyle = {
  fillColor: "#800080",
  fillOpacity: 0.5,
  color: "#800080",
  opacity: 0.8,
  weight: 2,
  fill: true,
};

@Injectable()
export class GeoJSONService {
  geojsonSitesGroups: GeoJSON.FeatureCollection;
  geojsonSites: GeoJSON.FeatureCollection;
  sitesGroupFeatureGroup: L.FeatureGroup;
  sitesFeatureGroup: L.FeatureGroup;

  constructor(
    private _sites_group_service: SitesGroupService,
    private _sites_service: SitesService,
    private _mapService: MapService
  ) {}

  getSitesGroupsGeometries(params = {}) {
    this._sites_group_service
      .get_geometries(params)
      .subscribe((data: GeoJSON.FeatureCollection) => {
        this.geojsonSitesGroups = data;
        this.sitesGroupFeatureGroup = this.setMapData(data, siteGroupStyle);
      });
  }

  getSitesGroupsChildGeometries(params = {}) {
    this._sites_service
      .get_geometries(params)
      .subscribe((data: GeoJSON.FeatureCollection) => {
        //this.removeFeatureGroup(this.sitesFeatureGroup);
        this.sitesFeatureGroup = this.setMapData(data);
      });
  }

  setMapData(geojson: GeoJSON.FeatureCollection, style?) {
    const map = this._mapService.getMap();
    const layer: L.Layer = this._mapService.createGeojson(
      geojson,
      false,
      this.onEachFeature(),
      style
    );
    const featureGroup = new L.FeatureGroup();
    this._mapService.map.addLayer(featureGroup);
    featureGroup.addLayer(layer);
    map.fitBounds(featureGroup.getBounds());
    return featureGroup;
  }

  removeFeatureGroup(feature: L.FeatureGroup) {
    if (feature) {
      this._mapService.map.removeLayer(feature);
    }
  }

  onEachFeature() {}

  filterSitesGroups(siteGroupId: number) {
    if (this.geojsonSitesGroups !== undefined) {
      const features = this.geojsonSitesGroups.features.filter(
        (feature) => feature.properties.id_sites_group == siteGroupId
      );
      this.geojsonSitesGroups.features = features;
      this.removeFeatureGroup(this.sitesGroupFeatureGroup);
      this.setMapData(this.geojsonSitesGroups, siteGroupStyle);
    }
  }
}
