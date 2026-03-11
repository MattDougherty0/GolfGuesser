import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const coursesPath = join(__dirname, "../src/data/courses.json");
const outputPath = join(__dirname, "../src/data/schedule.json");

const courses = JSON.parse(readFileSync(coursesPath, "utf-8"));

const DAYS = 180;
const ROUNDS_PER_DAY = 3;
const START_DATE = new Date("2026-03-11T12:00:00-05:00");

const imageKeys = ["aerialTight", "aerialMedium", "aerialWide"];
const difficulties = ["easy", "medium", "hard"];

// Tier 1: Courses most golf fans recognize instantly
const TIER1 = new Set([
  "pebble-beach-golf-links", "augusta-national-golf-club",
  "tpc-sawgrass-stadium-course", "pinehurst-no-2", "oakmont-country-club",
  "torrey-pines-south-course", "bethpage-black", "shinnecock-hills-golf-club",
  "winged-foot-golf-club", "kiawah-island-ocean-course",
  "whistling-straits", "riviera-country-club", "merion-golf-club",
  "valhalla-golf-club", "tpc-scottsdale-stadium-course",
  "los-angeles-country-club", "chambers-bay", "quail-hollow-club",
  "harbour-town-golf-links", "east-lake-golf-club",
  "muirfield-village-golf-club", "bay-hill-club-and-lodge",
  "olympic-club", "the-country-club", "hazeltine-national-golf-club",
  "cypress-point-club", "pine-valley-golf-club", "bandon-dunes",
  "pacific-dunes", "seminole-golf-club", "shadow-creek",
  "spyglass-hill-golf-course", "colonial-country-club",
]);

// Tier 2: Well-known among dedicated golf fans
const TIER2 = new Set([
  "congressional-country-club", "southern-hills-country-club",
  "baltusrol-golf-club", "medinah-country-club", "erin-hills",
  "bellerive-country-club", "oakland-hills-country-club",
  "inverness-club", "olympia-fields-country-club", "crooked-stick-golf-club",
  "tpc-harding-park", "firestone-country-club", "liberty-national-golf-club",
  "tpc-southwind", "congaree-golf-club", "pga-west-stadium-course",
  "streamsong-red-course", "sand-valley", "arcadia-bluffs",
  "crystal-downs-country-club", "prairie-dunes-country-club",
  "sand-hills-golf-club", "national-golf-links-of-america",
  "blackwolf-run-river-course", "pga-national-champion-course",
  "innisbrook-copperhead-course", "sea-island-golf-club-seaside",
  "pasatiempo-golf-club", "tpc-river-highlands",
]);

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

const rand = seededRandom(77);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getTier(id) {
  if (TIER1.has(id)) return 1;
  if (TIER2.has(id)) return 2;
  return 3;
}

const allIds = courses.map((c) => c.id);
const tier1Ids = allIds.filter((id) => getTier(id) === 1);
const tier2Ids = allIds.filter((id) => getTier(id) === 2);
const tier3Ids = allIds.filter((id) => getTier(id) === 3);

const schedule = [];
const usedRecently = new Set();
const COOLDOWN = 5;
const recentQueue = [];

for (let day = 0; day < DAYS; day++) {
  const date = new Date(START_DATE);
  date.setDate(date.getDate() + day);
  const dateStr = date.toISOString().split("T")[0];

  const avail1 = shuffle(tier1Ids.filter((id) => !usedRecently.has(id)));
  const avail2 = shuffle(tier2Ids.filter((id) => !usedRecently.has(id)));
  const avail3 = shuffle(tier3Ids.filter((id) => !usedRecently.has(id)));

  let picked;
  if (day < 14) {
    // Launch window: 2 iconic + 1 moderate. Never 3 super-famous.
    picked = [...avail1.slice(0, 2), ...avail2.slice(0, 1)];
  } else if (day < 45) {
    // Weeks 3-6: 1 iconic + 1 moderate + 1 deep cut
    picked = [...avail1.slice(0, 1), ...avail2.slice(0, 1), ...avail3.slice(0, 1)];
  } else {
    // After week 6: fully random mix from all tiers
    const allAvail = shuffle([...avail1, ...avail2, ...avail3]);
    picked = allAvail.slice(0, 3);
  }

  // Fallback if any tier ran dry
  if (picked.length < 3) {
    const remaining = shuffle(allIds.filter((id) => !usedRecently.has(id) && !picked.includes(id)));
    while (picked.length < 3 && remaining.length > 0) {
      picked.push(remaining.shift());
    }
  }
  // Last resort: allow repeats
  if (picked.length < 3) {
    const fallback = shuffle(allIds.filter((id) => !picked.includes(id)));
    while (picked.length < 3) picked.push(fallback.shift());
  }

  // Shuffle the 3 picks so the iconic one isn't always round 1
  const shuffledPicked = shuffle(picked);

  const rounds = shuffledPicked.map((courseId, i) => ({
    courseId,
    imageKey: imageKeys[(day * ROUNDS_PER_DAY + i) % imageKeys.length],
    difficulty: difficulties[i],
  }));

  schedule.push({ date: dateStr, rounds });

  for (const id of shuffledPicked) {
    usedRecently.add(id);
    recentQueue.push({ id, expiresDay: day + COOLDOWN });
  }

  while (recentQueue.length > 0 && recentQueue[0].expiresDay <= day) {
    usedRecently.delete(recentQueue.shift().id);
  }
}

writeFileSync(outputPath, JSON.stringify(schedule, null, 2));
console.log(`Generated ${schedule.length} days of schedule (${DAYS * ROUNDS_PER_DAY} rounds total)`);
console.log(`Courses in pool: ${allIds.length} (T1: ${tier1Ids.length}, T2: ${tier2Ids.length}, T3: ${tier3Ids.length})`);
console.log(`Date range: ${schedule[0].date} to ${schedule[schedule.length - 1].date}`);
