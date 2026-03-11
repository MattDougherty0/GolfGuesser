"use client";

import type { Course } from "@/lib/types";

interface CourseProfileProps {
  course: Course;
}

export default function CourseProfile({ course }: CourseProfileProps) {
  const { details, reveal } = course;

  return (
    <div className="w-full rounded-xl border border-cream/10 bg-card p-5 space-y-5">
      {/* Quick stats row */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Stat label="Architect" value={details.architect} />
        <Stat label="Opened" value={String(details.yearOpened)} />
        <Stat label="Par" value={String(details.par)} />
        <Stat label="Yardage" value={details.yardage.toLocaleString()} />
      </div>

      <hr className="border-cream/5" />

      {/* Notable Tournaments */}
      {reveal.notableTournaments.length > 0 && (
        <Section title="Notable Tournaments">
          <ul className="space-y-1">
            {reveal.notableTournaments.map((t, i) => (
              <li key={i} className="text-sm text-cream/70 flex gap-2">
                <span className="text-accent/60 shrink-0">•</span>
                {t}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Famous Moments */}
      {reveal.famousMoments.length > 0 && (
        <Section title="Famous Moments">
          <ul className="space-y-2">
            {reveal.famousMoments.map((m, i) => (
              <li key={i} className="text-sm text-cream/70 flex gap-2">
                <span className="text-accent/60 shrink-0">•</span>
                {m}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Signature Hole */}
      <Section title="Signature Hole">
        <p className="text-sm text-cream/70">{reveal.signatureHole}</p>
      </Section>

      {/* Did You Know callout */}
      <div className="rounded-lg border-l-2 border-accent/50 bg-accent/5 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent/70 mb-1">
          Did you know?
        </p>
        <p className="text-sm text-cream/80 leading-relaxed">
          {reveal.description}
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-cream/40 text-xs">{label}</span>
      <p className="text-cream font-medium">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-accent/70 mb-2">
        {title}
      </h4>
      {children}
    </div>
  );
}
