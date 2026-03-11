"use client";

import dynamic from "next/dynamic";

const MapGuessLeaflet = dynamic(() => import("./MapGuessLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-xl bg-card">
      <span className="text-sm text-cream/30">Loading map…</span>
    </div>
  ),
});

interface MapGuessProps {
  pin: { lat: number; lng: number } | null;
  onPinChange: (lat: number, lng: number) => void;
}

export default function MapGuess({ pin, onPinChange }: MapGuessProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-cream/10 shadow-lg shadow-black/30"
         style={{ height: "400px" }}>
      <MapGuessLeaflet pin={pin} onPinChange={onPinChange} />
    </div>
  );
}
