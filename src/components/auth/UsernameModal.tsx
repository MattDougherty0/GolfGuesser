"use client";

import { useState } from "react";

interface UsernameModalProps {
  onSubmit: (name: string) => Promise<boolean>;
  onSkip: () => void;
}

export default function UsernameModal({ onSubmit, onSkip }: UsernameModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    if (trimmed.length > 20) {
      setError("Name must be 20 characters or less");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const success = await onSubmit(trimmed);
      if (!success) {
        setError("Could not create player. Try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl border border-cream/10 bg-card p-6 shadow-2xl">
        <h2 className="font-serif text-2xl text-cream text-center">Welcome to GolfGuessr</h2>
        <p className="mt-2 text-sm text-cream/50 text-center">
          Pick a display name for the leaderboard
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={20}
            autoFocus
            className="w-full rounded-lg border border-cream/15 bg-primary px-4 py-3 text-sm text-cream placeholder:text-cream/30 outline-none focus:border-accent/40"
          />

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading || name.trim().length < 2}
            className={`
              w-full rounded-full py-3 text-sm font-semibold transition-all
              ${name.trim().length >= 2
                ? "bg-accent text-background hover:brightness-110"
                : "bg-cream/10 text-cream/25 cursor-not-allowed"
              }
            `}
          >
            {loading ? "Creating…" : "Let's Play"}
          </button>
        </form>

        <button
          type="button"
          onClick={onSkip}
          className="mt-3 w-full text-center text-xs text-cream/35 transition-colors hover:text-cream/55"
        >
          Continue without a name &mdash; no leaderboard tracking
        </button>
      </div>
    </div>
  );
}
