import { useState } from "react";
import { useControl, Marker } from "react-map-gl/maplibre";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";

// Custom geocoder API
const geocoderApi = {
  forwardGeocode: async ({ query }) => {
    const features = [];
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=geojson&polygon_geojson=1&addressdetails=1`;
      const response = await fetch(url);
      const geojson = await response.json();

      geojson.features.forEach((f) => {
        const [minX, minY, maxX, maxY] = f.bbox;
        const center = [minX + (maxX - minX) / 2, minY + (maxY - minY) / 2];

        features.push({
          type: "Feature",
          geometry: { type: "Point", coordinates: center },
          place_name: f.properties.display_name,
          text: f.properties.display_name,
          place_type: ["place"],
          properties: f.properties,
          center,
        });
      });
    } catch (e) {
      console.error("Geocoding failed:", e);
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

      const events = ["loading", "results", "error"];
      events.forEach((ev) => {
        if (
          typeof props[`on${ev[0].toUpperCase() + ev.slice(1)}`] === "function"
        ) {
          ctrl.on(ev, props[`on${ev[0].toUpperCase() + ev.slice(1)}`]);
        }
      });

      if (typeof props.onResult === "function") {
        ctrl.on("result", (evt) => {
          props.onResult(evt);
          const { result } = evt;
          const location =
            result?.center ??
            (result.geometry?.type === "Point" && result.geometry.coordinates);

          if (location && props.marker) {
            const markerProps =
              typeof props.marker === "object" ? props.marker : {};
            setMarker(
              <Marker
                longitude={location[0]}
                latitude={location[1]}
                {...markerProps}
              />
            );
          } else {
            setMarker(null);
          }
        });
      }

      return ctrl;
    },
    { position: props.position }
  );

  if (geocoder._map) {
    const setters = {
      proximity: "setProximity",
      render: "setRenderFunction",
      language: "setLanguage",
      zoom: "setZoom",
      flyTo: "setFlyTo",
      placeholder: "setPlaceholder",
      countries: "setCountries",
      types: "setTypes",
      minLength: "setMinLength",
      limit: "setLimit",
      filter: "setFilter",
    };

    Object.entries(setters).forEach(([prop, setter]) => {
      if (
        props[prop] !== undefined &&
        geocoder[`get${setter.slice(3)}`]() !== props[prop]
      ) {
        geocoder[setter](props[prop]);
      }
    });
  }

  return marker;
}

GeocoderControl.defaultProps = {
  marker: true,
  onLoading: () => {},
  onResults: () => {},
  onResult: () => {},
  onError: () => {},
};
