import type { CitationGap } from "@/lib/coursemuse/types";

/**
 * Cards shipped without a `primarySourceUrl` on the AnswerCard model.
 * Primary statistical authority for these rows is often the 2026 PGA TOUR Media Guide (local PDF),
 * which does not have one stable public URL per table row.
 *
 * Handoff: review this list when auditing citations.
 */
export const CITATION_GAPS: CitationGap[] = [
  {
    cardId: "rb-most-hio-career",
    reason:
      "Career holes-in-one table exists in the 2026 PGA TOUR Media Guide (PDF). PGA TOUR web stats pages change format/IDs; no single durable URL was verified for the same ranked table.",
  },
  {
    cardId: "rb-last-hio-par-4",
    reason:
      '"Last Time (Holes-in-One)" entry verified in Media Guide PDF; PGA TOUR news archives cover Magee but no single official permalink was locked for this prototype.',
  },
  {
    cardId: "rb-tournament-most-hio",
    reason:
      "Tournament holes-in-one counts verified in Media Guide PDF; no one official web page reproduces the full 'tournament with the most' ranking.",
  },
  {
    cardId: "rescue-pga-leaderboard",
    reason:
      "Product-intent demo only (routing narrative); not a factual stat with an external primary URL.",
  },
];
