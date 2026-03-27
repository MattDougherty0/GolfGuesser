"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ANSWER_CARDS } from "@/data/coursemuse/answer-cards";
import { CURATED_QUERIES } from "@/data/coursemuse/curated-queries";
import { COURSE_MUSE_COURSE_IDS, COURSE_MUSE_DISPLAY_NAME } from "@/lib/coursemuse/constants";
import type { AnswerShape } from "@/lib/coursemuse/types";
import AnswerCardView from "./AnswerCardView";
import CourseMuseSearch from "./CourseMuseSearch";
import QueryChipRow from "./QueryChipRow";

const SHAPE_ORDER: AnswerShape[] = [
  "venue_entity",
  "venue_record",
  "player_at_venue",
  "event_at_venue",
  "query_rescue",
  "record_book",
];

const SECTION_TITLE: Record<AnswerShape, string> = {
  venue_entity: "Venue entity",
  venue_record: "Venue record",
  player_at_venue: "Player at venue",
  event_at_venue: "Event / venue history",
  query_rescue: "Query rescue",
  record_book: "Official record book",
};

export default function CourseMuseHome() {
  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  const chips = [
    "Pinehurst No. 2",
    "Lowest 72-hole score at THE PLAYERS",
    "current leaderboard at the pga",
    "Tiger Woods at Augusta",
    "Most U.S. Opens hosted by a course",
  ];

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-8">
      <p className="text-xs font-medium uppercase tracking-widest text-accent/70">StatMuse Golf Lab</p>
      <h1 className="mt-2 font-serif text-3xl tracking-tight text-cream sm:text-4xl">CourseMuse</h1>
      <p className="mt-3 text-sm leading-relaxed text-cream/55">
        Golf fans think in venues and championships as much as players — courses and official record-book facts should be
        first-class answer objects. This prototype shows answer shapes across five iconic venues.
      </p>

      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-cream/45">Five courses</h2>
        <div className="flex flex-wrap gap-2">
          {COURSE_MUSE_COURSE_IDS.map((id) => (
            <Link
              key={id}
              href={`/coursemuse/${id}`}
              className="rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
            >
              {COURSE_MUSE_DISPLAY_NAME[id]}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-serif text-xl text-cream">Search-first</h2>
        <CourseMuseSearch queries={CURATED_QUERIES} />
        <div>
          <p className="mb-2 text-xs text-cream/45">Try</p>
          <QueryChipRow
            chips={chips}
            onChip={(label) => {
              const match = CURATED_QUERIES.find((c) => c.label === label);
              if (match) {
                if (match.action.type === "scroll") {
                  window.location.hash = match.action.cardId;
                  document.getElementById(match.action.cardId)?.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.location.href = `/coursemuse/${match.action.courseId}`;
                }
              }
            }}
          />
        </div>
      </section>

      <section className="mt-14 space-y-10">
        {SHAPE_ORDER.map((shape) => {
          const cards = ANSWER_CARDS.filter((c) => c.shape === shape);
          if (cards.length === 0) return null;
          return (
            <div key={shape}>
              <h2 className="mb-4 border-b border-cream/10 pb-2 font-serif text-2xl text-cream">
                {SECTION_TITLE[shape]}
              </h2>
              <div className="space-y-4">
                {cards.map((card) => (
                  <AnswerCardView key={card.id} card={card} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
