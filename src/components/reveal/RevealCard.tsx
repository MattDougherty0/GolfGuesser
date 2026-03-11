"use client";

import { useEffect, useState } from "react";
import type { Course, GuessResult } from "@/lib/types";
import RevealMap from "./RevealMap";
import CourseProfile from "./CourseProfile";
import ScoreBreakdown from "@/components/game/ScoreBreakdown";

interface RevealCardProps {
  course: Course;
  result: GuessResult;
  roundNumber: number; // 1-based
  totalRounds: number;
  onNext: () => void;
}

export default function RevealCard({
  course,
  result,
  roundNumber,
  totalRounds,
  onNext,
}: RevealCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation on next frame
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const isFinalRound = roundNumber >= totalRounds;

  return (
    <div
      className={`w-full max-w-2xl mx-auto space-y-5 pb-8 transition-all duration-500 ease-out ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6"
      }`}
    >
      {/* Course name */}
      <div className="text-center">
        <p className="text-xs uppercase tracking-wider text-accent/60 mb-1">
          Round {roundNumber} of {totalRounds}
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-cream tracking-tight">
          {course.name}
        </h2>
        <p className="mt-1 text-sm text-cream/50">
          {course.location.city}, {course.location.state}
        </p>
      </div>

      {/* Map */}
      <RevealMap
        courseLat={course.location.latitude}
        courseLng={course.location.longitude}
        guessLat={result.pinLat}
        guessLng={result.pinLng}
        distanceMiles={result.pinDistance}
        courseName={course.name}
      />

      {/* Score breakdown */}
      <ScoreBreakdown result={result} />

      {/* Course profile */}
      <CourseProfile course={course} />

      {/* Next button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onNext}
          className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-background transition-all hover:brightness-110 hover:shadow-lg hover:shadow-accent/20"
        >
          {isFinalRound ? "See Results" : "Next Round"}
        </button>
      </div>
    </div>
  );
}
