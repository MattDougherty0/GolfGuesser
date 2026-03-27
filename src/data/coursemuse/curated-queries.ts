import type { CuratedQuery } from "@/lib/coursemuse/types";

/** Search index for CourseMuse home (curated, not open web search). */
export const CURATED_QUERIES: CuratedQuery[] = [
  // Venue entities
  {
    id: "q-pinehurst",
    label: "Pinehurst No. 2",
    shape: "venue_entity",
    keywords: ["pinehurst", "no. 2", "no 2", "pinehurst no"],
    action: { type: "course", courseId: "pinehurst-no-2" },
  },
  {
    id: "q-augusta",
    label: "Augusta National Golf Club",
    shape: "venue_entity",
    keywords: ["augusta", "augusta national", "masters venue"],
    action: { type: "course", courseId: "augusta-national-golf-club" },
  },
  {
    id: "q-bethpage",
    label: "Bethpage Black",
    shape: "venue_entity",
    keywords: ["bethpage", "bethpage black", "farmingdale"],
    action: { type: "course", courseId: "bethpage-black" },
  },
  {
    id: "q-sawgrass",
    label: "TPC Sawgrass Stadium Course",
    shape: "venue_entity",
    keywords: ["sawgrass", "tpc sawgrass", "players stadium", "ponte vedra"],
    action: { type: "course", courseId: "tpc-sawgrass-stadium-course" },
  },
  {
    id: "q-oakmont",
    label: "Oakmont Country Club",
    shape: "venue_entity",
    keywords: ["oakmont", "oakmont country"],
    action: { type: "course", courseId: "oakmont-country-club" },
  },
  // Record book
  {
    id: "q-hio-most",
    label: "Most holes in one on the PGA TOUR",
    shape: "record_book",
    keywords: ["holes in one", "hole in one", "most aces", "ace"],
    action: { type: "scroll", cardId: "rb-most-hio-career" },
  },
  {
    id: "q-hio-par4",
    label: "Last hole in one on a par 4",
    shape: "record_book",
    keywords: ["par 4", "par-4", "magee"],
    action: { type: "scroll", cardId: "rb-last-hio-par-4" },
  },
  {
    id: "q-hio-tournament",
    label: "Tournament with the most holes in one",
    shape: "record_book",
    keywords: ["tournament", "most holes"],
    action: { type: "scroll", cardId: "rb-tournament-most-hio" },
  },
  {
    id: "q-us-open-hosts",
    label: "Most U.S. Opens hosted by a course",
    shape: "venue_record",
    keywords: ["u.s. open", "us open", "hosted", "oakmont", "most opens"],
    action: { type: "scroll", cardId: "rb-us-open-most-at-venue" },
  },
  {
    id: "q-players-low",
    label: "Lowest 72-hole score at THE PLAYERS",
    shape: "venue_record",
    keywords: ["lowest", "72", "players", "264", "norman"],
    action: { type: "scroll", cardId: "rb-players-low-72-tpc" },
  },
  {
    id: "q-players-margin",
    label: "Largest margin at THE PLAYERS",
    shape: "venue_record",
    keywords: ["margin", "elkington", "players"],
    action: { type: "scroll", cardId: "rb-players-margin-tpc" },
  },
  // Player at venue
  {
    id: "q-adam-scott",
    label: "Adam Scott at Sawgrass",
    shape: "player_at_venue",
    keywords: ["adam scott", "scott sawgrass"],
    action: { type: "scroll", cardId: "saw-adam-scott" },
  },
  {
    id: "q-tiger-augusta",
    label: "Tiger Woods at Augusta",
    shape: "player_at_venue",
    keywords: ["tiger", "woods", "augusta"],
    action: { type: "scroll", cardId: "player-tiger-augusta" },
  },
  {
    id: "q-rory-pinehurst",
    label: "Rory McIlroy at Pinehurst No. 2",
    shape: "player_at_venue",
    keywords: ["rory", "mcilroy", "pinehurst"],
    action: { type: "scroll", cardId: "player-rory-pinehurst" },
  },
  // Event at venue
  {
    id: "q-masters-winners",
    label: "Masters champions at Augusta",
    shape: "event_at_venue",
    keywords: ["masters", "champions", "green jacket"],
    action: { type: "scroll", cardId: "aug-masters-winners" },
  },
  {
    id: "q-beth-majors",
    label: "Major championships at Bethpage Black",
    shape: "event_at_venue",
    keywords: ["bethpage", "major", "pga 2019"],
    action: { type: "scroll", cardId: "beth-majors" },
  },
  // Query rescue
  {
    id: "q-rescue-leaderboard",
    label: "current leaderboard at the pga",
    shape: "query_rescue",
    keywords: ["leaderboard", "pga", "today", "live", "scores"],
    action: { type: "scroll", cardId: "rescue-pga-leaderboard" },
  },
];
