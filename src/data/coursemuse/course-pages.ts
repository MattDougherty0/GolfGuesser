import type { CoursePageContent, CourseMuseCourseId } from "@/lib/coursemuse/types";

const byId = new Map<CourseMuseCourseId, CoursePageContent>();

const pages: CoursePageContent[] = [
  {
    courseId: "pinehurst-no-2",
    identityLine:
      "Donald Ross masterpiece in the North Carolina Sandhills — a USGA anchor venue with turtleback greens and major championship density.",
    whyItMatters:
      "Pinehurst No. 2 is the subtle American strategic test: crowned greens and sandy surrounds punish sloppy approaches, and the course has repeatedly hosted the game’s biggest events on one walking canvas.",
    cardIds: [
      "venue-pinehurst-entity",
      "ph-us-open-winners",
      "ph-why-hard",
      "ph-signature-features",
      "player-rory-pinehurst",
    ],
    queryChips: [
      "U.S. Open winners at Pinehurst No. 2",
      "Why is Pinehurst No. 2 hard?",
      "Rory McIlroy at Pinehurst No. 2",
    ],
  },
  {
    courseId: "augusta-national-golf-club",
    identityLine:
      "Private Augusta, Georgia club; home of the Masters Tournament since 1934 — the clearest case where venue and invitational major are inseparable.",
    whyItMatters:
      "Augusta is where course and tournament identity merge: one place, one April story, and decades of champions tied to the same routing and visuals.",
    cardIds: [
      "venue-augusta-entity",
      "aug-masters-winners",
      "aug-low-72",
      "aug-low-18",
      "aug-unique",
      "player-tiger-augusta",
    ],
    queryChips: [
      "Masters champions at Augusta National",
      "Lowest Masters round at Augusta",
      "Tiger Woods at Augusta National",
    ],
  },
  {
    courseId: "bethpage-black",
    identityLine:
      "A.W. Tillinghast layout in Bethpage State Park — a public-access major host on Long Island.",
    whyItMatters:
      "Bethpage Black is the people’s heavyweight stage: a state-park course that proved public golf could carry PGA and U.S. Open championships at the highest level.",
    cardIds: [
      "venue-bethpage-entity",
      "beth-majors",
      "beth-2019-pga-winner",
      "beth-public-profile",
    ],
    queryChips: [
      "Major championships at Bethpage Black",
      "Who won the 2019 PGA at Bethpage Black?",
      "Bethpage Black public-course profile",
    ],
  },
  {
    courseId: "tpc-sawgrass-stadium-course",
    identityLine:
      "Pete Dye Stadium Course in Ponte Vedra Beach — permanent home of THE PLAYERS since 1982.",
    whyItMatters:
      "TPC Sawgrass is the clean PGA TOUR-native venue: built for THE PLAYERS, designed for theater, and backed by deep tournament record tables in the official Media Guide.",
    cardIds: [
      "rb-players-low-72-tpc",
      "rb-players-margin-tpc",
      "rb-players-low-18",
      "saw-adam-scott",
      "saw-players-2025",
      "venue-sawgrass-entity",
    ],
    queryChips: [
      "Lowest 72-hole score at THE PLAYERS",
      "Biggest win margin at THE PLAYERS",
      "Adam Scott at TPC Sawgrass",
    ],
  },
  {
    courseId: "oakmont-country-club",
    identityLine:
      "Henry Fownes design near Pittsburgh — the U.S. Open’s most frequent single-course host.",
    whyItMatters:
      "Oakmont is the brutal precision benchmark: lightning greens, Church Pews, and a USGA story built on repetition — the same venue returning for Open after Open.",
    cardIds: [
      "rb-us-open-most-at-venue",
      "oak-us-open-winners-sample",
      "oak-why-hard",
      "venue-oakmont-entity",
    ],
    queryChips: [
      "Oakmont U.S. Open winners",
      "Why is Oakmont so hard?",
      "Most U.S. Opens hosted at one course",
    ],
  },
];

for (const p of pages) {
  byId.set(p.courseId, p);
}

export const COURSE_PAGE_CONTENT: readonly CoursePageContent[] = pages;

export function getCoursePageContent(courseId: CourseMuseCourseId): CoursePageContent | undefined {
  return byId.get(courseId);
}
