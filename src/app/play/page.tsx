"use client";

import { useReducer, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getTodayPuzzle } from "@/lib/daily";
import { getCourseById } from "@/lib/courses";
import { calculatePinDistance, calculateRoundScore, calculateHintPenalty } from "@/lib/scoring";
import { getTodayResults, saveRoundResult } from "@/lib/storage";
import type { Course, DailyPuzzle, GuessResult } from "@/lib/types";

import ClueImage from "@/components/game/ClueImage";
import HintPanel from "@/components/game/HintPanel";
import GuessInput from "@/components/game/GuessInput";
import MapGuess from "@/components/game/MapGuess";
import Timer from "@/components/game/Timer";
import RevealCard from "@/components/reveal/RevealCard";

// ── State ──────────────────────────────────────────────

interface GameState {
  status: "loading" | "no-puzzle" | "playing" | "done";
  puzzle: DailyPuzzle | null;
  courses: (Course | undefined)[];
  roundIndex: number;
  phase: "guessing" | "reveal";
  hintsUsed: number;
  hintPenalty: number;
  timerRunning: boolean;
  elapsed: number;
  selectedCourseId: string | null;
  selectedCourseName: string | null;
  pin: { lat: number; lng: number } | null;
  guessResults: GuessResult[];
}

type GameAction =
  | { type: "LOADED"; puzzle: DailyPuzzle; courses: (Course | undefined)[]; resumeRound: number; priorResults: GuessResult[] }
  | { type: "NO_PUZZLE" }
  | { type: "DONE" }
  | { type: "SET_HINTS"; count: number; penalty: number }
  | { type: "TICK"; elapsed: number }
  | { type: "SELECT_COURSE"; id: string; name: string }
  | { type: "SET_PIN"; lat: number; lng: number }
  | { type: "SUBMIT"; result: GuessResult }
  | { type: "NEXT_ROUND" };

const initialState: GameState = {
  status: "loading",
  puzzle: null,
  courses: [],
  roundIndex: 0,
  phase: "guessing",
  hintsUsed: 0,
  hintPenalty: 0,
  timerRunning: false,
  elapsed: 0,
  selectedCourseId: null,
  selectedCourseName: null,
  pin: null,
  guessResults: [],
};

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "LOADED":
      return {
        ...state,
        status: "playing",
        puzzle: action.puzzle,
        courses: action.courses,
        roundIndex: action.resumeRound,
        guessResults: action.priorResults,
        phase: "guessing",
        timerRunning: true,
        elapsed: 0,
        hintsUsed: 0,
        selectedCourseId: null,
        selectedCourseName: null,
        pin: null,
      };

    case "NO_PUZZLE":
      return { ...state, status: "no-puzzle" };

    case "DONE":
      return { ...state, status: "done" };

    case "SET_HINTS":
      return { ...state, hintsUsed: action.count, hintPenalty: action.penalty };

    case "TICK":
      return { ...state, elapsed: action.elapsed };

    case "SELECT_COURSE":
      return { ...state, selectedCourseId: action.id, selectedCourseName: action.name };

    case "SET_PIN":
      return { ...state, pin: { lat: action.lat, lng: action.lng } };

    case "SUBMIT":
      return {
        ...state,
        phase: "reveal",
        timerRunning: false,
        guessResults: [...state.guessResults, action.result],
      };

    case "NEXT_ROUND":
      return {
        ...state,
        roundIndex: state.roundIndex + 1,
        phase: "guessing",
        hintsUsed: 0,
        hintPenalty: 0,
        timerRunning: true,
        elapsed: 0,
        selectedCourseId: null,
        selectedCourseName: null,
        pin: null,
      };

    default:
      return state;
  }
}

// ── Component ──────────────────────────────────────────

const TOTAL_ROUNDS = 3;

export default function PlayPage() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);

  // ── Mount: load puzzle + check progress ──
  useEffect(() => {
    const puzzle = getTodayPuzzle();

    if (!puzzle) {
      dispatch({ type: "NO_PUZZLE" });
      return;
    }

    // Load courses for all 3 rounds
    const courses = puzzle.rounds.map((r) => getCourseById(r.courseId));

    // Check localStorage for in-progress results
    const saved = getTodayResults();
    if (saved?.completed) {
      router.replace("/results");
      return;
    }

    const resumeRound = saved?.rounds.length ?? 0;

    // Reconstruct GuessResults from saved RoundResults for reveal cards
    const priorResults: GuessResult[] = (saved?.rounds ?? []).map((r) => ({
      courseId: r.courseId,
      nameGuess: "",
      nameCorrect: r.nameCorrect,
      pinLat: 0,
      pinLng: 0,
      pinDistance: r.pinDistance,
      hintsUsed: r.hintsUsed,
      hintPenalty: calculateHintPenalty(r.hintsUsed),
      timeSeconds: r.timeSeconds,
      score: r.score,
    }));

    dispatch({ type: "LOADED", puzzle, courses, resumeRound, priorResults });
  }, [router]);

  // ── Callbacks ──
  const handleTick = useCallback((elapsed: number) => {
    dispatch({ type: "TICK", elapsed });
  }, []);

  const handleHintsChange = useCallback((count: number, penalty: number) => {
    dispatch({ type: "SET_HINTS", count, penalty });
  }, []);

  const handleCourseChange = useCallback((id: string | null, name: string) => {
    dispatch({ type: "SELECT_COURSE", id: id ?? "", name });
  }, []);

  const handlePinChange = useCallback((lat: number, lng: number) => {
    dispatch({ type: "SET_PIN", lat, lng });
  }, []);

  // ── Current round data ──
  const currentRound = state.puzzle?.rounds[state.roundIndex];
  const currentCourse = state.courses[state.roundIndex];

  const imageKey = currentRound?.imageKey ?? "aerialTight";
  const imageSrc = currentCourse?.images[imageKey] ?? "";

  const canSubmit = state.pin !== null;

  // ── Submit guess ──
  const handleSubmit = useCallback(() => {
    if (!currentCourse || !state.pin) return;

    const nameCorrect =
      (!!state.selectedCourseId && state.selectedCourseId === currentCourse.id) ||
      (!!state.selectedCourseName &&
        state.selectedCourseName.trim().toLowerCase() === currentCourse.name.toLowerCase());
    const pinDistance = calculatePinDistance(
      state.pin.lat,
      state.pin.lng,
      currentCourse.location.latitude,
      currentCourse.location.longitude
    );
    const score = calculateRoundScore({
      nameCorrect,
      pinDistanceMiles: pinDistance,
      timeSeconds: state.elapsed,
      hintsUsed: state.hintsUsed,
      hintPenalty: state.hintPenalty,
    });

    const guessResult: GuessResult = {
      courseId: currentCourse.id,
      nameGuess: state.selectedCourseName ?? "",
      nameCorrect,
      pinLat: state.pin.lat,
      pinLng: state.pin.lng,
      pinDistance,
      hintsUsed: state.hintsUsed,
      hintPenalty: state.hintPenalty,
      timeSeconds: state.elapsed,
      score,
    };

    // Persist to localStorage
    saveRoundResult({
      courseId: currentCourse.id,
      nameCorrect,
      pinDistance,
      hintsUsed: state.hintsUsed,
      timeSeconds: state.elapsed,
      score,
    });

    dispatch({ type: "SUBMIT", result: guessResult });
  }, [currentCourse, state.pin, state.selectedCourseId, state.selectedCourseName, state.elapsed, state.hintsUsed, state.hintPenalty]);

  // ── Next round / finish ──
  const handleNext = useCallback(() => {
    if (state.roundIndex + 1 >= TOTAL_ROUNDS) {
      router.push("/results");
    } else {
      dispatch({ type: "NEXT_ROUND" });
    }
  }, [state.roundIndex, router]);

  // ── Latest guess result (for reveal) ──
  const latestResult = state.guessResults[state.guessResults.length - 1] ?? null;

  // ── Render ──

  if (state.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-cream/40">Loading puzzle…</span>
      </div>
    );
  }

  if (state.status === "no-puzzle") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-cream/60 text-lg">No puzzle scheduled for today.</p>
        <button
          onClick={() => router.push("/")}
          className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-background"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (state.status === "done") {
    return null; // redirecting
  }

  // ── Guessing Phase ──
  if (state.phase === "guessing" && currentCourse) {
    return (
      <div className="min-h-screen px-4 py-6 sm:py-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5">
          {/* Header row: round + timer */}
          <div className="flex w-full max-w-[500px] items-center justify-between">
            <span className="text-sm font-medium text-cream/60">
              Round {state.roundIndex + 1} of {TOTAL_ROUNDS}
            </span>
            <Timer running={state.timerRunning} elapsed={state.elapsed} onTick={handleTick} />
          </div>

          {/* Clue image */}
          <ClueImage src={imageSrc} />

          {/* Hint panel — key forces remount on round change */}
          <HintPanel key={`hints-${state.roundIndex}`} clues={currentCourse.clues} onHintsUsedChange={handleHintsChange} />

          {/* Guess section: name then map, stacked */}
          <div className="w-full max-w-[500px] flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-cream/40">
                Course Name
              </label>
              <GuessInput key={`guess-${state.roundIndex}`} onChange={handleCourseChange} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-cream/40">
                Pin Location
              </label>
              <MapGuess key={`map-${state.roundIndex}`} pin={state.pin} onPinChange={handlePinChange} />
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`
              mt-2 rounded-full px-10 py-3 text-sm font-semibold transition-all
              ${canSubmit
                ? "bg-accent text-background hover:brightness-110 hover:shadow-lg hover:shadow-accent/20"
                : "bg-cream/10 text-cream/25 cursor-not-allowed"
              }
            `}
          >
            Submit Guess
          </button>
        </div>
      </div>
    );
  }

  // ── Reveal Phase ──
  if (state.phase === "reveal" && currentCourse && latestResult) {
    return (
      <div className="min-h-screen px-4 py-6 sm:py-10">
        <RevealCard
          course={currentCourse}
          result={latestResult}
          roundNumber={state.roundIndex + 1}
          totalRounds={TOTAL_ROUNDS}
          onNext={handleNext}
        />
      </div>
    );
  }

  return null;
}
