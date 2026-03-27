"use client";

import { useState } from "react";

interface AerialFrameProps {
  src: string;
  alt: string;
  className?: string;
}

/** CourseMuse-local image frame (does not import game ClueImage). */
export default function AerialFrame({ src, alt, className = "" }: AerialFrameProps) {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-cream/10 shadow-lg shadow-black/30 ${className}`}
    >
      <div className="relative aspect-[16/10] w-full bg-primary/50">
        {hasError ? (
          <div className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-2 text-cream/40 p-6">
            <span className="text-sm">Aerial unavailable</span>
          </div>
        ) : (
          <>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/50">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-cream/20 border-t-accent" />
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/${src}`}
              alt={alt}
              onError={() => setHasError(true)}
              onLoad={() => setLoading(false)}
              className={`h-full w-full object-cover transition-opacity duration-300 ${
                loading ? "opacity-0" : "opacity-100"
              }`}
              draggable={false}
            />
          </>
        )}
      </div>
    </div>
  );
}
