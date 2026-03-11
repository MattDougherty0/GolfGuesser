"use client";

import { useEffect, useRef, useCallback } from "react";

interface TimerProps {
  running: boolean;
  elapsed: number;
  onTick: (seconds: number) => void;
}

export default function Timer({ running, elapsed, onTick }: TimerProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const baseElapsedRef = useRef(elapsed);

  const tick = useCallback(() => {
    if (startTimeRef.current === null) return;
    const now = Date.now();
    const secs = baseElapsedRef.current + Math.floor((now - startTimeRef.current) / 1000);
    onTick(secs);
  }, [onTick]);

  useEffect(() => {
    if (running) {
      baseElapsedRef.current = elapsed;
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(tick, 200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      startTimeRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, tick, elapsed]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <span className="tabular-nums text-sm text-cream/40 font-mono">
      {minutes}:{seconds.toString().padStart(2, "0")}
    </span>
  );
}
