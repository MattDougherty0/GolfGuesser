"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pinIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});

interface MapGuessLeafletProps {
  pin: { lat: number; lng: number } | null;
  onPinChange: (lat: number, lng: number) => void;
}

function MapClickHandler({ onPinChange }: { onPinChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPinChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapGuessLeaflet({ pin, onPinChange }: MapGuessLeafletProps) {
  const center: [number, number] = [39.5, -98.5];

  return (
    <MapContainer
      center={center}
      zoom={4}
      minZoom={3}
      maxZoom={10}
      zoomControl={false}
      dragging={true}
      scrollWheelZoom={true}
      doubleClickZoom={false}
      touchZoom={true}
      attributionControl={false}
      className="h-full w-full rounded-xl"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
      />
      <ZoomControl position="bottomright" />
      <MapClickHandler onPinChange={onPinChange} />
      {pin && <Marker position={[pin.lat, pin.lng]} icon={pinIcon} />}
    </MapContainer>
  );
}
