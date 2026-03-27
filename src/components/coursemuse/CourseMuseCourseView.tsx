"use client";

import Link from "next/link";
import type { Course } from "@/lib/types";
import type { AnswerCard, CoursePageContent } from "@/lib/coursemuse/types";
import AnswerCardView from "./AnswerCardView";
import CourseHero from "./CourseHero";
import QueryChipRow from "./QueryChipRow";

interface CourseMuseCourseViewProps {
  course: Course;
  lab: CoursePageContent;
  cards: AnswerCard[];
}

export default function CourseMuseCourseView({ course, lab, cards }: CourseMuseCourseViewProps) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-8">
      <Link
        href="/coursemuse"
        className="mb-4 inline-block text-sm text-cream/50 transition-colors hover:text-cream"
      >
        ← CourseMuse home
      </Link>

      <CourseHero course={course} identityLine={lab.identityLine} />

      <section className="mt-10">
        <h2 className="font-serif text-xl text-cream">Why this course matters</h2>
        <p className="mt-3 text-sm leading-relaxed text-cream/75">{lab.whyItMatters}</p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-serif text-xl text-cream">Official-style answer cards</h2>
        {cards.map((card) => (
          <AnswerCardView key={card.id} card={card} />
        ))}
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-serif text-xl text-cream">Example questions</h2>
        <QueryChipRow
          chips={lab.queryChips}
          onChip={(label) => {
            const card = cards.find((c) => c.title === label);
            if (card) {
              document.getElementById(card.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
        />
      </section>
    </main>
  );
}
