"use client";

import dynamic from "next/dynamic";

const RevealMapLeaflet = dynamic(() => import("./RevealMapLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-xl bg-card">
      <span className="text-sm text-cream/30">Loading map…</span>
    </div>
  ),
});

interface RevealMapProps {
  courseLat: number;
  courseLng: number;
  guessLat: number;
  guessLng: number;
  distanceMiles: number;
}

export default function RevealMap(props: RevealMapProps) {
  return (
    <div
      className="w-full overflow-hidden rounded-xl border border-cream/10 shadow-lg shadow-black/30"
      style={{ height: "300px" }}
    >
      <RevealMapLeaflet {...props} />
    </div>
  );
}
