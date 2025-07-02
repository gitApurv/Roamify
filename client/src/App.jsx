import React, { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { listLogEntries } from "./api";
import LogEntryForm from "./LogEntryForm";

import "./index.css";

function App() {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState({});

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  useEffect(() => {
    getEntries();
  }, []);

  const showAddMarkerPopup = (event) => {
    const { lng, lat } = event.lngLat;
    setAddEntryLocation({
      longitude: lng,
      latitude: lat,
    });
  };

  return (
    <Map
      initialViewState={{
        longitude: 82.9739,
        latitude: 25.3176,
        zoom: 14,
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${
        import.meta.env.VITE_MAPTILER_API_KEY
      }`}
      doubleClickZoom={false}
      onDblClick={showAddMarkerPopup}
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
                  height: "30px",
                  width: "30px",
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
      {Number.isFinite(addEntryLocation?.latitude) &&
        Number.isFinite(addEntryLocation?.longitude) && (
          <>
            <Marker
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
            >
              <div className="popup">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                  alt="marker"
                  style={{ height: "30px", width: "30px" }}
                />
              </div>
            </Marker>
            <Popup
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setAddEntryLocation(null)}
              anchor="top"
            >
              <LogEntryForm
                location={addEntryLocation}
                onClose={() => {
                  setAddEntryLocation(null);
                  getEntries();
                }}
              />
            </Popup>
          </>
        )}
    </Map>
  );
}

export default App;
