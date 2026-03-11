"use client";

import { useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export default function PlayViewportEffect() {
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    if (!meta) return;

    const isMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
    const previous = meta.getAttribute("content") ?? "";

    if (isMobile) {
      meta.setAttribute("content", "width=device-width, initial-scale=1.15");
    }

    return () => {
      meta.setAttribute("content", previous);
    };
  }, []);

  return null;
}
