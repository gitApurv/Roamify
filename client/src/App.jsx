import React, { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import { listLogEntries } from "./api";

function App() {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});

  const [viewPort, setViewPort] = useState({
    longitude: 82.991257,
    latitude: 25.267719,
    zoom: 14,
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  useEffect(() => {
    getEntries();
  }, []);

  return (
    <Map
      initialViewState={viewPort}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle={`https://api.maptiler.com/maps/outdoor-v2/style.json?key=${
        import.meta.env.VITE_MAPTILER_API_KEY
      }`}
    >
      {logEntries.map((entry) => (
        <React.Fragment key={entry._id}>
          <Marker longitude={entry.longitude} latitude={entry.latitude}>
            <div
              onClick={() => {
                setShowPopup({
                  [entry._id]: true,
                });
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                alt="marker"
                style={{
                  height: `30px`,
                  width: `30px`,
                  cursor: "pointer",
                  transition: "width 0.2s, height 0.2s",
                }}
              />
            </div>
          </Marker>
          {showPopup[entry._id] && (
            <Popup
              latitude={entry.latitude}
              longitude={entry.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => {
                setShowPopup({});
              }}
              anchor="top"
            >
              <div>
                <h3>{entry.title}</h3>
                <p>{entry.comments}</p>
                <small>
                  Visited on: {new Date(entry.visitDate).toLocaleDateString()}
                </small>
                {entry.image && (
                  <img
                    src={entry.image}
                    alt={entry.title}
                    style={{
                      width: "100%",
                      maxHeight: "150px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
            </Popup>
          )}
        </React.Fragment>
      ))}
    </Map>
  );
}

export default App;
