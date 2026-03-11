"use client";

import { useState } from "react";

interface ClueImageProps {
  src: string;
  alt?: string;
}

export default function ClueImage({ src, alt = "Aerial view of a golf course" }: ClueImageProps) {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative min-w-0 w-full max-w-[500px] overflow-hidden rounded-xl border border-cream/10 shadow-lg shadow-black/30">
      <div className="relative aspect-square w-full bg-primary/50">
        {hasError ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-cream/30 p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-cream/40">Aerial view unavailable</span>
            <span className="text-xs text-cream/20">Use the hints below to identify this course</span>
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
              className={`h-full w-full object-cover select-none pointer-events-none transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
              draggable={false}
            />
          </>
        )}
      </div>
    </div>
  );
}
