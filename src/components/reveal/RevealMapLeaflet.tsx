"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Green pin for correct location
const correctIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Red pin for player's guess
const guessIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface RevealMapLeafletProps {
  courseLat: number;
  courseLng: number;
  guessLat: number;
  guessLng: number;
  distanceMiles: number;
}

function FitBounds({ courseLat, courseLng, guessLat, guessLng }: {
  courseLat: number;
  courseLng: number;
  guessLat: number;
  guessLng: number;
}) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(
      [courseLat, courseLng],
      [guessLat, guessLng]
    );
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
  }, [map, courseLat, courseLng, guessLat, guessLng]);

  return null;
}

export default function RevealMapLeaflet({
  courseLat,
  courseLng,
  guessLat,
  guessLng,
  distanceMiles,
}: RevealMapLeafletProps) {
  const linePositions: [number, number][] = useMemo(
    () => [
      [courseLat, courseLng],
      [guessLat, guessLng],
    ],
    [courseLat, courseLng, guessLat, guessLng]
  );

  const midpoint: [number, number] = [
    (courseLat + guessLat) / 2,
    (courseLng + guessLng) / 2,
  ];

  return (
    <MapContainer
      center={[39.5, -98.5]}
      zoom={4}
      scrollWheelZoom={true}
      zoomControl={true}
      attributionControl={false}
      className="h-full w-full rounded-xl"
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />

      <FitBounds
        courseLat={courseLat}
        courseLng={courseLng}
        guessLat={guessLat}
        guessLng={guessLng}
      />

      {/* Correct course location */}
      <Marker position={[courseLat, courseLng]} icon={correctIcon}>
        <Tooltip permanent direction="top" offset={[0, -42]} className="reveal-tooltip">
          Correct
        </Tooltip>
      </Marker>

      {/* Player's guess */}
      <Marker position={[guessLat, guessLng]} icon={guessIcon}>
        <Tooltip permanent direction="top" offset={[0, -42]} className="reveal-tooltip">
          Your guess
        </Tooltip>
      </Marker>

      {/* Line between the two */}
      <Polyline
        positions={linePositions}
        pathOptions={{ color: "#C9A84C", weight: 2, dashArray: "6 4", opacity: 0.8 }}
      />

      {/* Distance label at midpoint */}
      <Marker
        position={midpoint}
        icon={L.divIcon({
          className: "distance-label",
          html: `<span style="
            background: rgba(13,31,23,0.85);
            color: #C9A84C;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
            border: 1px solid rgba(201,168,76,0.3);
          ">${Math.round(distanceMiles)} miles</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        })}
      />
    </MapContainer>
  );
}
