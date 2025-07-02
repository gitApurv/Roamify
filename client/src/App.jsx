import { useState, useEffect } from "react";
import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import { listLogEntries } from "./api";

function App() {
  const [logEntries, setLogEntries] = useState([]);

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    console.log(logEntries);
    setLogEntries(logEntries);
  };

  useEffect(() => {
    getEntries();
  }, []);

  return (
    <Map
      initialViewState={{
        longitude: 82.991257,
        latitude: 25.267719,
        zoom: 12,
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle={`https://api.maptiler.com/maps/outdoor-v2/style.json?key=${
        import.meta.env.VITE_MAPTILER_API_KEY
      }`}
    >
      {logEntries.map((entry) => {
        return (
          <Marker
            key={entry.id}
            longitude={entry.longitude}
            latitude={entry.latitude}
            anchor="bottom"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
              alt="marker"
              style={{ width: "30px", height: "30px" }}
            />
          </Marker>
        );
      })}
    </Map>
  );
}

export default App;
