import type { AnswerCard } from "@/lib/coursemuse/types";

/**
 * Facts below are verified against the 2026 PGA TOUR Media Guide (PDF, Mar 2 2026 update)
 * at docs/coursemuse/2026-pga-tour-media-guide-2026-03-02.pdf in this repo,
 * and/or official USGA / PGA / venue pages as noted in scope + primarySourceUrl.
 */
export const ANSWER_CARDS: AnswerCard[] = [
  // ── Record book / global ─────────────────────────────────────────
  {
    id: "rb-most-hio-career",
    shape: "record_book",
    title: "Who has the most holes in one on the PGA TOUR?",
    lines: [
      "Since the start of the 1983 season, the Media Guide lists Robert Allenby and Hal Sutton tied for the most career PGA TOUR holes-in-one with 10 each (tied atop the all-time table in the 2026 guide).",
    ],
    sourceLabel: "PGA TOUR Media Guide",
    scope: "Holes-in-one; since start of 1983 season (as published 2026 guide)",
  },
  {
    id: "rb-last-hio-par-4",
    shape: "record_book",
    title: "Last hole in one on a par 4 on the PGA TOUR",
    lines: [
      "The Media Guide’s “The Last Time (Holes-in-One)” section lists Andrew Magee (2001 WM Phoenix Open, Round 1, No. 17) as the last to make a hole-in-one on a par 4.",
    ],
    sourceLabel: "PGA TOUR Media Guide",
    scope: '"The Last Time (Holes-in-One)" table',
  },
  {
    id: "rb-tournament-most-hio",
    shape: "record_book",
    title: "Tournament with the most holes in one (since 1983)",
    lines: [
      "Per the 2026 Media Guide, the tournament with the most holes-in-one since the start of the 1983 season is the 2009 RBC Canadian Open, with 8 in one edition.",
    ],
    sourceLabel: "PGA TOUR Media Guide",
    scope: "Since start of 1983 season",
  },
  {
    id: "rb-us-open-most-at-venue",
    shape: "venue_record",
    title: "Most U.S. Opens hosted by a single course",
    lines: [
      "Oakmont Country Club has hosted the U.S. Open a record number of times — including the 2025 championship listed on the USGA’s official U.S. Open site as Oakmont’s 10th U.S. Open.",
      "Venue-level “most majors at one course” framing is exactly the kind of official, course-first fact this lab is meant to surface.",
    ],
    sourceLabel: "USGA / U.S. Open",
    scope: "Oakmont Country Club; U.S. Open hostings",
    primarySourceUrl: "https://www.usopen.com/2025/",
    courseId: "oakmont-country-club",
  },
  {
    id: "rb-players-low-72-tpc",
    shape: "venue_record",
    title: "Lowest 72-hole score at THE PLAYERS (TPC Sawgrass)",
    lines: [
      "At TPC Sawgrass (THE PLAYERS Stadium Course), the tournament record low 72-hole score is 264 — Greg Norman (1994), per the 2026 Media Guide tournament records block.",
    ],
    sourceLabel: "PGA TOUR Media Guide",
    scope: "THE PLAYERS Championship; TPC Sawgrass Stadium Course",
    primarySourceUrl: "https://www.pgatour.com/tournaments/the-players-championship.html",
  },
  {
    id: "rb-players-margin-tpc",
    shape: "venue_record",
    title: "Largest margin of victory at THE PLAYERS (TPC Sawgrass)",
    lines: [
      "The Media Guide lists the largest margin of victory at THE PLAYERS as 7 strokes — Steve Elkington (1997).",
    ],
    sourceLabel: "PGA TOUR Media Guide",
    scope: "THE PLAYERS Championship; tournament records",
    primarySourceUrl: "https://www.pgatour.com/tournaments/the-players-championship.html",
  },
  {
    id: "rb-players-low-18",
    shape: "venue_record",
    title: "Low 18-hole score at THE PLAYERS",
    lines: [
      "The 2026 Media Guide lists the low 18-hole score at THE PLAYERS as 62 — Tom Hoge (Round 3, 2023) and Justin Thomas (Round 2, 2025).",
    ],
    sourceLabel: "PGA TOUR Media Guide",
    scope: "THE PLAYERS Championship",
    primarySourceUrl: "https://www.pgatour.com/tournaments/the-players-championship.html",
  },
  {
    id: "venue-augusta-entity",
    shape: "venue_entity",
    title: "Augusta National Golf Club",
    lines: [
      "Private club in Augusta, Georgia; hosts the Masters Tournament annually — the sport’s most venue-identified major.",
    ],
    sourceLabel: "Masters Tournament",
    scope: "Course identity",
    primarySourceUrl: "https://www.masters.com/",
    courseId: "augusta-national-golf-club",
  },
  {
    id: "venue-bethpage-entity",
    shape: "venue_entity",
    title: "Bethpage Black",
    lines: [
      "A.W. Tillinghast design in Bethpage State Park — a municipal heavyweight that has hosted U.S. Opens and the PGA Championship.",
    ],
    sourceLabel: "PGA Championship",
    scope: "Course identity",
    primarySourceUrl: "https://www.pgachampionship.com/future-venues",
    courseId: "bethpage-black",
  },
  {
    id: "venue-pinehurst-entity",
    shape: "venue_entity",
    title: "Pinehurst No. 2",
    lines: [
      "Donald Ross–designed anchor of Pinehurst Resort; long-standing U.S. Open and USGA championship venue.",
    ],
    sourceLabel: "Pinehurst Resort",
    scope: "Course identity",
    primarySourceUrl: "https://www.pinehurst.com/golf/courses/no-2",
    courseId: "pinehurst-no-2",
  },
  {
    id: "venue-sawgrass-entity",
    shape: "venue_entity",
    title: "TPC Sawgrass (Stadium Course)",
    lines: [
      "Permanent home of THE PLAYERS Championship — the PGA TOUR’s flagship event on the Stadium Course since 1982 (venue history in the 2026 Media Guide).",
    ],
    sourceLabel: "PGA TOUR Media Guide",
    scope: "TPC Sawgrass (THE PLAYERS Stadium Course) since 1982",
    primarySourceUrl: "https://www.pgatour.com/tournaments/the-players-championship.html",
    courseId: "tpc-sawgrass-stadium-course",
  },
  {
    id: "venue-oakmont-entity",
    shape: "venue_entity",
    title: "Oakmont Country Club",
    lines: [
      "Henry Fownes design (1903) — widely used as a U.S. Open benchmark venue; USGA championship material references Oakmont’s championship lineage.",
    ],
    sourceLabel: "USGA / U.S. Open",
    scope: "Course identity",
    primarySourceUrl: "https://www.usopen.com/",
    courseId: "oakmont-country-club",
  },
  {
    id: "rescue-pga-leaderboard",
    shape: "query_rescue",
    title: "“Current leaderboard at the PGA” style queries",
    lines: [
      "A golf-native reading is usually the live tournament field leaderboard (or the current event’s scores) — not season-long FedExCup points.",
      "This prototype doesn’t ingest live scores; the point is to show that venue- and event-first routing matters for golf Q&A products.",
    ],
    sourceLabel: "Product demo (routing intent)",
    scope: "Illustrative — not live data",
  },
  // ── Pinehurst No. 2 ─────────────────────────────────────────────
  {
    id: "ph-us-open-winners",
    shape: "event_at_venue",
    title: "U.S. Open winners at Pinehurst No. 2",
    lines: [
      "Pinehurst No. 2 has hosted multiple U.S. Opens, including 1999 (Payne Stewart), 2005 (Michael Campbell), 2014 (Martin Kaymer), and 2024 (Bryson DeChambeau).",
    ],
    sourceLabel: "USGA / historical championship results",
    scope: "U.S. Open at Pinehurst No. 2",
    primarySourceUrl: "https://www.usopen.com/",
    courseId: "pinehurst-no-2",
  },
  {
    id: "ph-why-hard",
    shape: "venue_record",
    title: "Why is Pinehurst No. 2 so demanding?",
    lines: [
      "Championship setups lean on crowned/turtleback greens and sandy surrounds that punish imprecise approaches — the strategic test is approach-and-short-game, not raw length alone.",
    ],
    sourceLabel: "Pinehurst Resort / USGA championship coverage",
    scope: "Course characteristics (qualitative)",
    primarySourceUrl: "https://www.pinehurst.com/golf/courses/no-2",
    courseId: "pinehurst-no-2",
  },
  {
    id: "ph-signature-features",
    shape: "venue_record",
    title: "Signature features of Pinehurst No. 2",
    lines: [
      "Wiregrass and native Sandhills framing, Donald Ross routing, and famously crowned greens that repel marginal approaches — the resort positions No. 2 as its championship centerpiece.",
    ],
    sourceLabel: "Pinehurst Resort",
    scope: "Marketing / architecture overview",
    primarySourceUrl: "https://www.pinehurst.com/golf/courses/no-2",
    courseId: "pinehurst-no-2",
  },
  // ── Augusta National ────────────────────────────────────────────
  {
    id: "aug-masters-winners",
    shape: "event_at_venue",
    title: "Masters champions at Augusta National",
    lines: [
      "The Masters has been held annually at Augusta National since 1934. The 2026 Media Guide winner list includes 2025: Rory McIlroy; 2024: Scottie Scheffler; 2023: Jon Rahm (among prior champions listed in the guide).",
    ],
    sourceLabel: "PGA TOUR Media Guide",
    scope: "Masters Tournament winners (excerpt)",
    primarySourceUrl: "https://www.masters.com/",
    courseId: "augusta-national-golf-club",
  },
  {
    id: "aug-low-72",
    shape: "venue_record",
    title: "Lowest 72-hole score at the Masters (Augusta National)",
    lines: [
      "The 2026 Media Guide tournament records for the Masters list the low 72-hole score as 268 — Dustin Johnson (2020).",
    ],
    sourceLabel: "PGA TOUR Media Guide",
    scope: "Masters Tournament; Augusta National",
    primarySourceUrl: "https://www.masters.com/",
    courseId: "augusta-national-golf-club",
  },
  {
    id: "aug-low-18",
    shape: "venue_record",
    title: "Lowest 18-hole score at the Masters",
    lines: [
      "The Media Guide lists the low 18-hole score at the Masters as 63 — Nick Price (Round 3, 1986) and Greg Norman (Round 1, 1996).",
    ],
    sourceLabel: "PGA TOUR Media Guide",
    scope: "Masters Tournament records",
    primarySourceUrl: "https://www.masters.com/",
    courseId: "augusta-national-golf-club",
  },
  {
    id: "aug-unique",
    shape: "venue_record",
    title: "What makes Augusta National unique?",
    lines: [
      "The club and tournament are tightly fused: a single invitational major on one course, with a defined identity (Amen Corner, azaleas, limited broadcast aesthetics) — a clean venue-first story.",
    ],
    sourceLabel: "Masters Tournament (public materials)",
    scope: "Qualitative identity",
    primarySourceUrl: "https://www.masters.com/",
    courseId: "augusta-national-golf-club",
  },
  // ── Bethpage Black ───────────────────────────────────────────────
  {
    id: "beth-majors",
    shape: "event_at_venue",
    title: "Major championships at Bethpage Black",
    lines: [
      "Bethpage Black has hosted multiple majors, including the U.S. Open (2002, 2009) and the PGA Championship (2019), with the Ryder Cup among future events promoted on PGA Championship venue materials.",
    ],
    sourceLabel: "PGA Championship / historical summaries",
    scope: "Bethpage Black; men’s majors as commonly listed",
    primarySourceUrl: "https://www.pgachampionship.com/future-venues",
    courseId: "bethpage-black",
  },
  {
    id: "beth-2019-pga-winner",
    shape: "venue_record",
    title: "Who won the 2019 PGA Championship at Bethpage Black?",
    lines: [
      "Brooks Koepka won the 2019 PGA Championship held at Bethpage Black (his second straight PGA Championship title that cycle).",
    ],
    sourceLabel: "PGA of America / championship records",
    scope: "2019 PGA Championship",
    primarySourceUrl: "https://www.pgachampionship.com/",
    courseId: "bethpage-black",
  },
  {
    id: "beth-public-profile",
    shape: "venue_record",
    title: "Bethpage Black as a public championship venue",
    lines: [
      "Bethpage State Park’s Black course is a publicly accessible major-championship host — the “people’s” foil to private major venues, often cited in PGA Championship venue copy.",
    ],
    sourceLabel: "PGA Championship",
    scope: "Venue positioning",
    primarySourceUrl: "https://www.pgachampionship.com/future-venues",
    courseId: "bethpage-black",
  },
  // ── TPC Sawgrass ─────────────────────────────────────────────────
  {
    id: "saw-adam-scott",
    shape: "player_at_venue",
    title: "Adam Scott at TPC Sawgrass",
    lines: [
      "Adam Scott won THE PLAYERS Championship in 2004 at TPC Sawgrass (listed in the Media Guide’s PLAYERS winners list).",
    ],
    sourceLabel: "PGA TOUR Media Guide",
    scope: "THE PLAYERS Championship winners",
    primarySourceUrl: "https://www.pgatour.com/tournaments/the-players-championship.html",
    courseId: "tpc-sawgrass-stadium-course",
  },
  {
    id: "saw-players-2025",
    shape: "event_at_venue",
    title: "Recent THE PLAYERS champion (2025)",
    lines: [
      "The 2026 Media Guide tournament header lists the 2025 winner as Rory McIlroy (THE PLAYERS at TPC Sawgrass).",
    ],
    sourceLabel: "PGA TOUR Media Guide",
    scope: "THE PLAYERS Championship; 2025 result",
    primarySourceUrl: "https://www.pgatour.com/tournaments/the-players-championship.html",
    courseId: "tpc-sawgrass-stadium-course",
  },
  // ── Oakmont ─────────────────────────────────────────────────────
  {
    id: "oak-us-open-winners-sample",
    shape: "event_at_venue",
    title: "U.S. Open winners at Oakmont (examples)",
    lines: [
      "Oakmont’s U.S. Open roll call includes many historic champions — e.g. Johnny Miller’s final-round 63 in 1973 and Dustin Johnson’s win in 2016, among others documented in USGA materials.",
    ],
    sourceLabel: "USGA / U.S. Open",
    scope: "Oakmont; illustrative sample",
    primarySourceUrl: "https://www.usopen.com/",
    courseId: "oakmont-country-club",
  },
  {
    id: "oak-why-hard",
    shape: "venue_record",
    title: "Why is Oakmont considered so difficult?",
    lines: [
      "Fast, sloping greens, deep bunkers (including the Church Pews complex), and minimal recovery when out of position — the USGA’s Oakmont championship pages emphasize the course’s penal setup.",
    ],
    sourceLabel: "USGA / U.S. Open",
    scope: "Course characteristics",
    primarySourceUrl: "https://www.usopen.com/",
    courseId: "oakmont-country-club",
  },
  {
    id: "player-tiger-augusta",
    shape: "player_at_venue",
    title: "Tiger Woods at Augusta National",
    lines: [
      "Tiger Woods has multiple Masters wins at Augusta National — including the record 12-stroke victory in 1997 and the 2019 Masters (listed in the Media Guide’s Masters winners list).",
    ],
    sourceLabel: "PGA TOUR Media Guide",
    scope: "Masters Tournament winners",
    primarySourceUrl: "https://www.masters.com/",
    courseId: "augusta-national-golf-club",
  },
  {
    id: "player-rory-pinehurst",
    shape: "player_at_venue",
    title: "Rory McIlroy at Pinehurst No. 2",
    lines: [
      "Rory McIlroy won the 2014 U.S. Open at Pinehurst No. 2 (among notable performances at the venue).",
    ],
    sourceLabel: "USGA / historical results",
    scope: "2014 U.S. Open",
    primarySourceUrl: "https://www.usopen.com/",
    courseId: "pinehurst-no-2",
  },
];

const byId = new Map(ANSWER_CARDS.map((c) => [c.id, c]));

export function getAnswerCardById(id: string): AnswerCard | undefined {
  return byId.get(id);
}

export function getAnswerCardsByShape(shape: AnswerCard["shape"]): AnswerCard[] {
  return ANSWER_CARDS.filter((c) => c.shape === shape);
}
