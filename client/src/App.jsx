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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
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
  const [anchorEl, setAnchorEl] = useState(null);
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Authentication Menu */}
      <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 20 }}>
        <IconButton
          id="basic-button"
          onClick={handleClick}
          aria-controls={Boolean(anchorEl) ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={Boolean(anchorEl) ? "true" : undefined}
        >
          <AccountCircleIcon sx={{ fontSize: 36, color: "primary.main" }} />
        </IconButton>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={{ mt: 1 }}
        >
          {!loggedIn ? (
            [
              <MenuItem
                key="login"
                onClick={() => {
                  setShowSignupForm(false);
                  setShowLoginForm((prev) => !prev);
                  setAnchorEl(null);
                }}
              >
                Login
              </MenuItem>,
              <MenuItem
                key="signup"
                onClick={() => {
                  setShowSignupForm((prev) => !prev);
                  setShowLoginForm(false);
                  setAnchorEl(null);
                }}
              >
                Signup
              </MenuItem>,
            ]
          ) : (
            <MenuItem
              onClick={async () => {
                await logout();
                setLoggedIn(false);
                setAnchorEl(null);
              }}
            >
              Logout
            </MenuItem>
          )}
        </Menu>
      </Box>

      {/* Map Component */}
      <Map
        initialViewState={{
          longitude: 77.216721,
          latitude: 28.6448,
          zoom: 5,
        }}
        mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${
          import.meta.env.VITE_MAPTILER_API_KEY
        }`}
        doubleClickZoom={false}
        onDblClick={showAddMarkerPopup}
      >
        <GeocoderControl
          position="top-left"
          marker={false}
          placeholder="Search for a place"
        />
        <GeolocateControl
          position="bottom-right"
          positionOptions={{
            enableHighAccuracy: true,
            trackUserLocation: true,
          }}
          showAccuracyCircle={false}
        />
        <NavigationControl position="bottom-right" showCompass={false} />

        {/* Markers + Popups */}
        {logEntries.map((entry) => (
          <Box key={entry._id}>
            <Marker
              longitude={entry.longitude}
              latitude={entry.latitude}
              anchor="bottom"
              onClick={() => setShowPopup({ [entry._id]: true })}
            >
              <RoomIcon
                sx={{ color: "error.main", fontSize: 48, cursor: "pointer" }}
              />
            </Marker>
            {showPopup[entry._id] && (
              <Popup
                latitude={entry.latitude}
                longitude={entry.longitude}
                anchor="bottom"
                closeButton
                closeOnClick={false}
                dynamicPosition
                onClose={() => setShowPopup({})}
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

        {/* Add Entry Popup */}
        {Number.isFinite(addEntryLocation?.latitude) &&
          Number.isFinite(addEntryLocation?.longitude) && (
            <Box>
              <Marker
                latitude={addEntryLocation.latitude}
                longitude={addEntryLocation.longitude}
              >
                <RoomIcon sx={{ color: "error.main", fontSize: 48 }} />
              </Marker>
              <Popup
                latitude={addEntryLocation.latitude}
                longitude={addEntryLocation.longitude}
                anchor="bottom"
                closeButton
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

        {/* Edit Entry Popup */}
        {Number.isFinite(editEntry?.latitude) &&
          Number.isFinite(editEntry?.longitude) && (
            <Box>
              <Marker
                latitude={editEntry.latitude}
                longitude={editEntry.longitude}
              >
                <RoomIcon sx={{ color: "error.main", fontSize: 48 }} />
              </Marker>
              <Popup
                latitude={editEntry.latitude}
                longitude={editEntry.longitude}
                anchor="bottom"
                closeButton
                closeOnClick={false}
                onClose={() => setEditEntry(null)}
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

      {/* Login & Signup Forms */}
      {(showLoginForm || showSignupForm) && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 30,
            bgcolor: "white",
            p: { xs: 2, sm: 4 },
            borderRadius: 3,
            boxShadow: 5,
            width: { xs: "90%", sm: "auto" },
            maxWidth: 400,
            minWidth: { sm: 350 },
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => {
              setShowLoginForm(false);
              setShowSignupForm(false);
            }}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h5" color="primary" fontWeight="bold">
              {showLoginForm ? "Login" : "Sign Up"}
            </Typography>
          </Box>
          {showLoginForm ? (
            <LoginForm
              onClose={() => {
                setShowLoginForm(false);
                setLoggedIn(true);
              }}
            />
          ) : (
            <SignupForm
              onClose={() => {
                setShowSignupForm(false);
                setLoggedIn(true);
              }}
            />
          )}
        </Box>
      )}
    </div>
  );
}

export default App;
