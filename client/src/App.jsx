import React, { useState, useEffect } from "react";
import Map, {
  Marker,
  Popup,
  GeolocateControl,
  NavigationControl,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import LogEntryForm from "./LogEntryForm";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { logout } from "./api";
import { listLogEntries } from "./api";
import "./index.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [addEntryLocation, setAddEntryLocation] = useState({});

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/check", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setLoggedIn(data.loggedIn))
      .catch((err) => {
        setLoggedIn(false);
      });
  }, []);

  useEffect(() => {
    if (loggedIn) getEntries();
    else setLogEntries([]);
  }, [loggedIn]);

  const showAddMarkerPopup = (event) => {
    const { lng, lat } = event.lngLat;
    setAddEntryLocation({
      longitude: lng,
      latitude: lat,
    });
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {!loggedIn && (
        <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}>
          <button
            style={{
              margin: "5px",
              padding: "8px 16px",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => {
              setShowSignupForm(() => false);
              setShowLoginForm((prev) => !prev);
            }}
          >
            Login
          </button>
          <button
            style={{
              margin: "5px",
              padding: "8px 16px",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => {
              setShowSignupForm((prev) => !prev);
              setShowLoginForm(() => false);
            }}
          >
            Signup
          </button>
        </div>
      )}
      {loggedIn && (
        <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}>
          <button
            style={{
              margin: "5px",
              padding: "8px 16px",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={async () => {
              await logout();
              setLoggedIn(() => false);
            }}
          >
            Logout
          </button>
        </div>
      )}
      <Map
        initialViewState={{
          longitude: 82.9739,
          latitude: 25.3176,
          zoom: 12,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${
          import.meta.env.VITE_MAPTILER_API_KEY
        }`}
        doubleClickZoom={false}
        onDblClick={showAddMarkerPopup}
      >
        <GeolocateControl
          position="bottom-right"
          positionOptions={{
            enableHighAccuracy: true,
            trackUserLocation: true,
          }}
        />
        <NavigationControl position="bottom-right" showCompass={false} />

        {logEntries.map((entry) => (
          <React.Fragment key={entry._id}>
            <Marker
              longitude={entry.longitude}
              latitude={entry.latitude}
              anchor="bottom"
            >
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
                anchor="bottom"
                closeButton={true}
                closeOnClick={false}
                dynamicPosition={true}
                onClose={() => {
                  setShowPopup({});
                }}
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
                anchor="bottom"
                closeButton={true}
                closeOnClick={false}
                onClose={() => setAddEntryLocation(null)}
              >
                <LogEntryForm
                  loggedIn={loggedIn}
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
      {showLoginForm && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          <LoginForm
            onClose={() => {
              setShowLoginForm(false);
              setLoggedIn(true);
            }}
          />
        </div>
      )}
      {showSignupForm && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          <SignupForm
            onClose={() => {
              setShowSignupForm(false);
              setLoggedIn(true);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
