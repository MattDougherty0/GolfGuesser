"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";

const SCORING = [
  { label: "Course Name", max: 300, desc: "Correctly identify the course by name." },
  { label: "Pin Accuracy", max: 300, desc: "Full marks within 25 miles, scales to 0 at 200 miles." },
  { label: "Hints Unused", max: 300, desc: "Start with a 300-point pool\u2014each hint you reveal deducts from it." },
  { label: "Speed", max: 100, desc: "Full marks under 15 seconds, scales to 0 at 90 seconds." },
];

const HINTS = [
  { label: "Region", cost: 85 },
  { label: "Type", cost: 45 },
  { label: "Architect", cost: 20 },
  { label: "Tournament", cost: 105 },
  { label: "Fun Fact", cost: 45 },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:py-16">
        {/* Title */}
        <h1 className="font-serif text-4xl tracking-tight text-cream sm:text-5xl">
          About GolfGuessr
        </h1>
        <p className="mt-3 text-cream/60 leading-relaxed">
          A daily golf geography challenge. Each day you get three rounds&mdash;three
          aerial satellite images of real courses from across the continental United
          States. Name the course, drop a pin on the map, and earn up to{" "}
          <span className="text-accent font-semibold">3,000 points</span>.
        </p>

        {/* How to Play */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-accent tracking-wide uppercase">
            How to Play
          </h2>
          <ol className="mt-4 space-y-3 text-cream/70 leading-relaxed list-decimal list-inside marker:text-accent/50">
            <li>Study the aerial image of a golf course.</li>
            <li>Optionally reveal hints&mdash;but each one costs points.</li>
            <li>Type the course name (or leave it blank for a pin-only guess).</li>
            <li>Drop a pin on the map where you think the course is located.</li>
            <li>Submit and see how you did. Repeat for all three rounds.</li>
          </ol>
        </section>

        {/* Scoring */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-accent tracking-wide uppercase">
            Scoring
          </h2>
          <p className="mt-3 text-sm text-cream/50">
            Each round is worth up to 1,000 points.
          </p>

          <div className="mt-4 space-y-2">
            {SCORING.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 rounded-xl border border-cream/8 bg-card/50 px-4 py-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent/10 text-sm font-bold tabular-nums text-accent">
                  {s.max}
                </span>
                <div>
                  <p className="text-sm font-medium text-cream">{s.label}</p>
                  <p className="text-xs text-cream/50 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hint Costs */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-accent tracking-wide uppercase">
            Hint Costs
          </h2>
          <p className="mt-3 text-sm text-cream/50">
            You can reveal any hint in any order. Each deducts from your 300-point hint pool.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {HINTS.map((h) => (
              <span
                key={h.label}
                className="rounded-full border border-cream/10 bg-card/60 px-3.5 py-1.5 text-xs text-cream/80"
              >
                {h.label}{" "}
                <span className="text-accent/60 font-medium">-{h.cost}</span>
              </span>
            ))}
          </div>
        </section>

        {/* The Courses */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-accent tracking-wide uppercase">
            The Courses
          </h2>
          <p className="mt-3 text-cream/60 leading-relaxed">
            The game features <span className="text-cream font-medium">100 courses</span> spread
            across <span className="text-cream font-medium">30 states</span> in the continental
            U.S.&mdash;from bucket-list icons to hidden gems. The mix includes:
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { count: 62, label: "Private" },
              { count: 20, label: "Resort" },
              { count: 18, label: "Public" },
            ].map((t) => (
              <div
                key={t.label}
                className="rounded-xl border border-cream/8 bg-card/50 py-3"
              >
                <p className="text-2xl font-bold tabular-nums text-accent">{t.count}</p>
                <p className="text-xs text-cream/50">{t.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-cream/50 leading-relaxed">
            New puzzles rotate through the full roster on a 180-day schedule, with
            difficulty that ramps up as you go&mdash;iconic courses appear early,
            deep cuts come later.
          </p>
        </section>

        {/* Back link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block rounded-full border border-cream/15 bg-card px-6 py-2.5 text-sm font-medium text-cream transition-all hover:border-accent/30 hover:bg-accent/5"
          >
            &larr; Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
