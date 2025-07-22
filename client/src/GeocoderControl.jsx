/* global fetch */
import React, { useState } from "react";
import { useControl, Marker } from "react-map-gl/maplibre";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";

const geocoderApi = {
  forwardGeocode: async (config) => {
    const features = [];
    try {
      const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&polygon_geojson=1&addressdetails=1`;
      const response = await fetch(request);
      const geojson = await response.json();

      for (const feature of geojson.features) {
        const center = [
          feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
          feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
        ];

        const point = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: center,
          },
          place_name: feature.properties.display_name,
          properties: feature.properties,
          text: feature.properties.display_name,
          place_type: ["place"],
          center,
        };

        features.push(point);
      }
    } catch (e) {
      console.error(`Failed to forwardGeocode with error: ${e}`);
    }

    return { features };
  },
};

export default function GeocoderControl(props) {
  const [marker, setMarker] = useState(null);

  const geocoder = useControl(
    ({ mapLib }) => {
      const ctrl = new MaplibreGeocoder(geocoderApi, {
        ...props,
        marker: false,
        maplibregl: mapLib,
      });

      if (typeof props.onLoading === "function")
        ctrl.on("loading", props.onLoading);
      if (typeof props.onResults === "function")
        ctrl.on("results", props.onResults);
      if (typeof props.onResult === "function") {
        ctrl.on("result", (evt) => {
          props.onResult(evt);
          const { result } = evt;

          const location =
            result &&
            (result.center ||
              (result.geometry?.type === "Point" &&
                result.geometry.coordinates));

          if (location && props.marker) {
            const markerProps =
              typeof props.marker === "object" ? props.marker : {};
            setMarker(
              <Marker
                {...markerProps}
                longitude={location[0]}
                latitude={location[1]}
              />
            );
          } else {
            setMarker(null);
          }
        });
      }
      if (typeof props.onError === "function") ctrl.on("error", props.onError);

      return ctrl;
    },
    { position: props.position }
  );

  // Maplibre options update
  if (geocoder._map) {
    if (
      geocoder.getProximity() !== props.proximity &&
      props.proximity !== undefined
    ) {
      geocoder.setProximity(props.proximity);
    }
    if (
      geocoder.getRenderFunction() !== props.render &&
      props.render !== undefined
    ) {
      geocoder.setRenderFunction(props.render);
    }
    if (
      geocoder.getLanguage() !== props.language &&
      props.language !== undefined
    ) {
      geocoder.setLanguage(props.language);
    }
    if (geocoder.getZoom() !== props.zoom && props.zoom !== undefined) {
      geocoder.setZoom(props.zoom);
    }
    if (geocoder.getFlyTo() !== props.flyTo && props.flyTo !== undefined) {
      geocoder.setFlyTo(props.flyTo);
    }
    if (
      geocoder.getPlaceholder() !== props.placeholder &&
      props.placeholder !== undefined
    ) {
      geocoder.setPlaceholder(props.placeholder);
    }
    if (
      geocoder.getCountries() !== props.countries &&
      props.countries !== undefined
    ) {
      geocoder.setCountries(props.countries);
    }
    if (geocoder.getTypes() !== props.types && props.types !== undefined) {
      geocoder.setTypes(props.types);
    }
    if (
      geocoder.getMinLength() !== props.minLength &&
      props.minLength !== undefined
    ) {
      geocoder.setMinLength(props.minLength);
    }
    if (geocoder.getLimit() !== props.limit && props.limit !== undefined) {
      geocoder.setLimit(props.limit);
    }
    if (geocoder.getFilter() !== props.filter && props.filter !== undefined) {
      geocoder.setFilter(props.filter);
    }
  }

  return marker;
}

// Default Props
const noop = () => {};

GeocoderControl.defaultProps = {
  marker: true,
  onLoading: noop,
  onResults: noop,
  onResult: noop,
  onError: noop,
};
