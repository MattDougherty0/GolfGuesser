import Link from "next/link";
import type { AnswerCard } from "@/lib/coursemuse/types";

interface AnswerCardViewProps {
  card: AnswerCard;
}

export default function AnswerCardView({ card }: AnswerCardViewProps) {
  return (
    <article
      id={card.id}
      className="scroll-mt-28 rounded-xl border border-cream/10 bg-card p-5 shadow-md shadow-black/20"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-accent/80">{card.shape.replace(/_/g, " ")}</p>
      <h3 className="mt-1 font-serif text-lg text-cream sm:text-xl">{card.title}</h3>
      <div className="mt-3 space-y-2 text-sm leading-relaxed text-cream/80">
        {card.lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <footer className="mt-4 flex flex-col gap-1 border-t border-cream/5 pt-3 text-xs text-cream/45">
        <span>
          <span className="text-cream/55">Source:</span> {card.sourceLabel}
        </span>
        <span>
          <span className="text-cream/55">Scope:</span> {card.scope}
        </span>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {card.courseId ? (
            <Link href={`/coursemuse/${card.courseId}`} className="text-accent hover:underline">
              Course page →
            </Link>
          ) : null}
          {card.primarySourceUrl ? (
            <a
              href={card.primarySourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline break-all"
            >
              Verify →
            </a>
          ) : null}
        </div>
      </footer>
    </article>
  );
}
