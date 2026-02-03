
/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import Button from "./Button";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import useUrlPosition from "../hooks/useUrlPosition";

function Map() {
  const navigate = useNavigate();
  const { cities } = useCities();

  const [mapPosition, setMapPosition] = useState([40, 0]);

  const {
    position: geolocationPosition,
    isLoading: isLoadingPosition,
    getPosition,
  } = useGeolocation();

  // Get position from URL
  const [mapLat, mapLng] = useUrlPosition(
  );

  // Set position from geolocation
  useEffect(() => {
    if (!geolocationPosition) return;

    setMapPosition([
      geolocationPosition.lat,
      geolocationPosition.lng,
    ]);
  }, [geolocationPosition]);

  // Set position from URL
  useEffect(() => {
    if (!mapLat || !mapLng) return;

    setMapPosition([Number(mapLat), Number(mapLng)]);
  }, [mapLat, mapLng]);

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your location"}
        </Button>
      )}

      {mapPosition && (
        <MapContainer
          center={mapPosition}
          zoom={6}
          scrollWheelZoom
          className={styles.map}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          />

          <ChangeCenter position={mapPosition} />

          {cities.map((city) => (
            <Marker
              key={city.id}
              position={[
                city.position.lat,
                city.position.lng,
              ]}
            >
              <Popup>
                <span>{city.emoji}</span>{" "}
                <span>{city.cityName}</span>
              </Popup>
            </Marker>
          ))}

          <DetectClick />
        </MapContainer>
      )}
    </div>
  );
}

/* ================= Helpers ================= */

function ChangeCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (!position || position.length !== 2) return;

    const [lat, lng] = position;
    if (isNaN(lat) || isNaN(lng)) return;

    map.setView(position, 6);
  }, [position, map]);

  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvent({
    click: (e) =>
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });

  return null;
}

export default Map;
