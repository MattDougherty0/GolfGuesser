"use client";

import { Suspense, useReducer, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getTodayPuzzle } from "@/lib/daily";
import { getCourseById } from "@/lib/courses";
import { getLocalPlayerId, submitExploreScore } from "@/lib/db";
import { buildExplorePuzzle } from "@/lib/explore";
import { calculatePinDistance, calculateRoundScore, calculateHintPenalty } from "@/lib/scoring";
import { getTodayResults, saveRoundResult } from "@/lib/storage";
import type { Course, DailyPuzzle, GuessResult, PuzzleRound } from "@/lib/types";

import ClueImage from "@/components/game/ClueImage";
import HintPanel from "@/components/game/HintPanel";
import GuessInput from "@/components/game/GuessInput";
import MapGuess from "@/components/game/MapGuess";
import Timer from "@/components/game/Timer";
import RevealCard from "@/components/reveal/RevealCard";

// ── State ──────────────────────────────────────────────

interface GameState {
  status: "loading" | "no-puzzle" | "playing" | "done";
  puzzle: { rounds: PuzzleRound[] } | null;
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
  | { type: "LOADED"; puzzle: { rounds: PuzzleRound[] }; courses: (Course | undefined)[]; resumeRound: number; priorResults: GuessResult[] }
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

function PlayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, dispatch] = useReducer(reducer, initialState);

  const isExploreMode =
    searchParams.get("mode") === "explore" &&
    searchParams.get("set") &&
    searchParams.get("count");

  // ── Mount: load puzzle + check progress ──
  useEffect(() => {
    if (isExploreMode) {
      const setId = searchParams.get("set")!;
      const countParam = searchParams.get("count")!;
      const count = countParam === "all" ? 999 : parseInt(countParam, 10);
      if (isNaN(count) || count < 1) {
        dispatch({ type: "NO_PUZZLE" });
        return;
      }
      const puzzle = buildExplorePuzzle(setId, count);
      if (!puzzle) {
        dispatch({ type: "NO_PUZZLE" });
        return;
      }
      const courses = puzzle.rounds.map((r) => getCourseById(r.courseId));
      dispatch({ type: "LOADED", puzzle, courses, resumeRound: 0, priorResults: [] });
      return;
    }

    const puzzle = getTodayPuzzle();
    if (!puzzle) {
      dispatch({ type: "NO_PUZZLE" });
      return;
    }

    const courses = puzzle.rounds.map((r) => getCourseById(r.courseId));
    const saved = getTodayResults();
    if (saved?.completed) {
      router.replace("/results");
      return;
    }

    const resumeRound = saved?.rounds.length ?? 0;
    const priorResults: GuessResult[] = (saved?.rounds ?? []).map((r) => ({
      courseId: r.courseId,
      nameGuess: "",
      nameCorrect: r.nameCorrect,
      pinLat: r.pinLat ?? 0,
      pinLng: r.pinLng ?? 0,
      pinDistance: r.pinDistance,
      hintsUsed: r.hintsUsed,
      hintPenalty: calculateHintPenalty(r.hintsUsed),
      timeSeconds: r.timeSeconds,
      score: r.score,
    }));

    dispatch({ type: "LOADED", puzzle, courses, resumeRound, priorResults });
  }, [router, isExploreMode, searchParams]);

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

  const imageKey = currentRound?.imageKey ?? "aerialMedium";
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

    if (!isExploreMode) {
      saveRoundResult({
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
      });
    }

    dispatch({ type: "SUBMIT", result: guessResult });
  }, [currentCourse, state.pin, state.selectedCourseId, state.selectedCourseName, state.elapsed, state.hintsUsed, state.hintPenalty, isExploreMode]);

  const totalRounds = state.puzzle?.rounds.length ?? 0;

  // ── Next round / finish ──
  const handleNext = useCallback(async () => {
    if (state.roundIndex + 1 >= totalRounds) {
      if (isExploreMode) {
        const finalTotal = state.guessResults.reduce((sum, r) => sum + r.score, 0);
        const setId = searchParams.get("set")!;
        const countParam = searchParams.get("count")!;
        const count = (countParam === "all" ? "all" : countParam) as "5" | "10" | "all";
        const playerId = getLocalPlayerId();
        if (playerId) {
          await submitExploreScore({ playerId, setId, count, totalScore: finalTotal });
        }
        router.push(`/explore?done=1&score=${finalTotal}`);
      } else {
        router.push("/results");
      }
    } else {
      dispatch({ type: "NEXT_ROUND" });
    }
  }, [state.roundIndex, state.guessResults, totalRounds, isExploreMode, router, searchParams]);

  // ── Latest guess result (for reveal) ──
  const latestResult = state.guessResults[state.guessResults.length - 1] ?? null;

  // Scroll to top on every phase/round change
  useEffect(() => {
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, [state.status, state.phase, state.roundIndex]);

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
      <div className="min-h-screen w-full overflow-x-hidden px-4 py-6 sm:py-10">
        <div className="mx-auto flex min-w-0 w-full max-w-full flex-col items-stretch gap-5 sm:max-w-4xl">
          {/* Header row: round + timer */}
          <div className="flex min-w-0 items-center justify-between">
            <span className="text-sm font-medium text-cream/60">
              Round {state.roundIndex + 1} of {totalRounds}
            </span>
            <Timer running={state.timerRunning} elapsed={state.elapsed} onTick={handleTick} />
          </div>

          {/* Points available */}
          <div className="text-center">
            <span className="text-2xl font-bold tabular-nums text-accent">
              {1000 - state.hintPenalty}
            </span>
            <span className="ml-2 text-xs font-medium uppercase tracking-wider text-accent/50">
              pts available
            </span>
          </div>

          {/* Clue image */}
          <ClueImage src={imageSrc} />

          {/* Hints label + panel */}
          <div className="min-w-0">
            <p className="mb-2 text-center text-xs font-medium uppercase tracking-wider text-accent/60">Hints</p>
            <HintPanel key={`hints-${state.roundIndex}`} clues={currentCourse.clues} onHintsUsedChange={handleHintsChange} />
          </div>

          {/* Guess section: name, submit button, then map */}
          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-cream/40">
                Course Name
              </label>
              <GuessInput key={`guess-${state.roundIndex}`} onChange={handleCourseChange} />
            </div>

            {/* Submit button — below course name, above pin */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`
                rounded-full px-10 py-3 text-sm font-semibold transition-all
                ${canSubmit
                  ? "bg-accent text-background hover:brightness-110 hover:shadow-lg hover:shadow-accent/20"
                  : "bg-cream/10 text-cream/25 cursor-not-allowed"
                }
              `}
            >
              Submit Guess
            </button>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-cream/40">
                Pin Location
              </label>
              <MapGuess key={`map-${state.roundIndex}`} pin={state.pin} onPinChange={handlePinChange} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Reveal Phase ──
  if (state.phase === "reveal" && currentCourse && latestResult) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden px-4 py-6 sm:py-10">
        <RevealCard
          course={currentCourse}
          result={latestResult}
          roundNumber={state.roundIndex + 1}
          totalRounds={totalRounds}
          onNext={handleNext}
        />
      </div>
    );
  }

  return null;
}

export default function PlayPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-cream/40">Loading puzzle…</span>
      </div>
    }>
      <PlayContent />
    </Suspense>
  );
}
