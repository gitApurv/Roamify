import { useState, useEffect } from "react";
import Map, {
  Marker,
  Popup,
  GeolocateControl,
  NavigationControl,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import GeocoderControl from "./GeocoderControl";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import RoomIcon from "@mui/icons-material/Room";
import { Box } from "@mui/material";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import StyledPopup from "./StyledPopup";
import LogEntryForm from "./LogEntryForm";
import LogEditForm from "./LogEditForm";
import { listLogEntries, deleteLogEntry, logout } from "./api";
import "./index.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [logEntries, setLogEntries] = useState([]);
  const [addEntryLocation, setAddEntryLocation] = useState({});
  const [editEntry, setEditEntry] = useState({});
  const [showPopup, setShowPopup] = useState({});
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);

  // Function to load all Entries
  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  // Checking state of User
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/check`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setLoggedIn(data.loggedIn))
      .catch((err) => {
        setLoggedIn(false);
      });
  }, []);

  // Showing Entries according to User state
  useEffect(() => {
    if (loggedIn) getEntries();
    else setLogEntries([]);
  }, [loggedIn]);

  // Edit handling function
  const handleEdit = async (entry) => {
    setEditEntry(entry);
  };

  // Delete handling function
  const handleDelete = async (entry) => {
    await deleteLogEntry(entry._id);
    getEntries();
  };

  // Add new Entry handling function
  const showAddMarkerPopup = (event) => {
    const { lng, lat } = event.lngLat;
    setAddEntryLocation({
      longitude: lng,
      latitude: lat,
    });
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Authentication Buttons  */}
      {!loggedIn ? (
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
      ) : (
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

      {/* Map Component  */}
      <Map
        initialViewState={{
          longitude: 77.216721, //Initial Longitude
          latitude: 28.6448, //Initial Latitude
          zoom: 5, //Initial Zoom
        }}
        mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${
          import.meta.env.VITE_MAPTILER_API_KEY
        }`}
        doubleClickZoom={false}
        onDblClick={showAddMarkerPopup}
      >
        {/* Geocoding Control */}
        <GeocoderControl position="top-left" />

        {/* Geolocate Control */}
        <GeolocateControl
          position="bottom-right"
          positionOptions={{
            enableHighAccuracy: true,
            trackUserLocation: true,
          }}
          showAccuracyCircle={false}
        />

        {/* Navigation Controls  */}
        <NavigationControl position="bottom-right" showCompass={false} />

        {/* Showing all logEntries */}
        {logEntries.map((entry) => (
          <Box key={entry._id}>
            {/* Marker  */}
            <Marker
              longitude={entry.longitude}
              latitude={entry.latitude}
              anchor="bottom"
              onClick={() => {
                setShowPopup({
                  [entry._id]: true,
                });
              }}
            >
              <RoomIcon
                style={{
                  color: "red",
                  height: "60px",
                  width: "60px",
                  cursor: "pointer",
                }}
              />
            </Marker>
            {/* Popup */}
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
                <StyledPopup
                  entry={entry}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </Popup>
            )}
          </Box>
        ))}

        {/* Add Entry Popup  */}
        {Number.isFinite(addEntryLocation?.latitude) &&
          Number.isFinite(addEntryLocation?.longitude) && (
            <Box>
              <Marker
                latitude={addEntryLocation.latitude}
                longitude={addEntryLocation.longitude}
              >
                <RoomIcon
                  style={{
                    color: "red",
                    height: "60px",
                    width: "60px",
                    cursor: "pointer",
                  }}
                />
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
            </Box>
          )}

        {/* Edit Entry Popup  */}
        {Number.isFinite(editEntry?.latitude) &&
          Number.isFinite(editEntry?.longitude) && (
            <Box>
              <Marker
                latitude={editEntry.latitude}
                longitude={editEntry.longitude}
              >
                <RoomIcon
                  style={{
                    color: "red",
                    height: "60px",
                    width: "60px",
                    cursor: "pointer",
                  }}
                />
              </Marker>
              <Popup
                latitude={editEntry.latitude}
                longitude={editEntry.longitude}
                anchor="bottom"
                closeButton={true}
                closeOnClick={false}
                onClose={() => {
                  setEditEntry(null);
                }}
              >
                <LogEditForm
                  entry={editEntry}
                  onClose={() => {
                    setEditEntry(null);
                    getEntries();
                  }}
                />
              </Popup>
            </Box>
          )}
      </Map>

      {/* Login Form  */}
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

      {/* Signup Form  */}
      {showSignupForm && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            zIndex: 10,
            backgroundColor: "rgba(255,255,255,0.95)",
            padding: 2,
            borderRadius: 2,
            transform: "translate(-50%,-50%)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          <SignupForm
            onClose={() => {
              setShowSignupForm(false);
              setLoggedIn(true);
            }}
          />
        </Box>
      )}
    </div>
  );
}

export default App;
