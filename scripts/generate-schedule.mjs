import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const coursesPath = join(__dirname, "../src/data/courses.json");
const outputPath = join(__dirname, "../src/data/schedule.json");

const courses = JSON.parse(readFileSync(coursesPath, "utf-8"));

const DAYS_ORIGINAL = 180;
const DAYS_NEW = 60; // Days after original schedule, using only newly added courses
const ROUNDS_PER_DAY = 3;
const START_DATE = new Date("2026-03-11T12:00:00-05:00");

const IMAGE_KEY = "aerialMedium";
const difficulties = ["easy", "medium", "hard"];

// Original 100 course IDs (do not seed new courses into first 180 days)
const ORIGINAL_IDS = new Set([
  "pebble-beach-golf-links", "augusta-national-golf-club", "tpc-sawgrass-stadium-course",
  "pinehurst-no-2", "oakmont-country-club", "torrey-pines-south-course", "bethpage-black",
  "shinnecock-hills-golf-club", "valhalla-golf-club", "tpc-scottsdale-stadium-course",
  "winged-foot-golf-club", "merion-golf-club", "congressional-country-club",
  "southern-hills-country-club", "baltusrol-golf-club", "olympic-club", "medinah-country-club",
  "hazeltine-national-golf-club", "erin-hills", "chambers-bay", "whistling-straits",
  "kiawah-island-ocean-course", "bellerive-country-club", "quail-hollow-club",
  "the-country-club", "oakland-hills-country-club", "inverness-club", "los-angeles-country-club",
  "olympia-fields-country-club", "crooked-stick-golf-club", "riviera-country-club",
  "harbour-town-golf-links", "bay-hill-club-and-lodge", "east-lake-golf-club",
  "muirfield-village-golf-club", "tpc-harding-park", "colonial-country-club",
  "firestone-country-club", "tpc-river-highlands", "tpc-summerlin", "sedgefield-country-club",
  "tpc-southwind", "congaree-golf-club", "pga-west-stadium-course", "cog-hill-dubsdread",
  "liberty-national-golf-club", "caves-valley-golf-club", "tpc-craig-ranch", "tpc-deere-run",
  "silverado-resort-north-course", "bandon-dunes", "pacific-dunes", "streamsong-red",
  "sand-valley", "spyglass-hill", "shadow-creek", "arcadia-bluffs", "pasatiempo",
  "streamsong-blue", "we-ko-pa-saguaro", "cypress-point", "pine-valley", "national-golf-links",
  "seminole", "crystal-downs", "prairie-dunes", "sand-hills", "chicago-golf-club",
  "fishers-island", "camargo", "garden-city-golf-club", "aronimink", "friars-head",
  "tpc-louisiana", "greenbrier-old-white", "sea-island-golf-club-seaside",
  "pga-national-champion-course", "tpc-san-antonio-oaks-course", "innisbrook-copperhead-course",
  "blackwolf-run-river-course", "atlantic-golf-club", "sage-valley-golf-club", "yeamans-hall-club",
  "calusa-pines-golf-club", "pete-dye-golf-club", "maidstone-club", "bandon-trails",
  "old-macdonald", "sheep-ranch", "trump-national-golf-club-bedminster",
  "sawgrass-country-club-east-course", "the-honors-course", "wade-hampton-golf-club",
  "secession-golf-club", "peachtree-golf-club", "shoreacres", "kingsley-club",
  "milwaukee-country-club", "old-sandwich-golf-club", "somerset-hills-country-club",
]);

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
const originalIds = allIds.filter((id) => ORIGINAL_IDS.has(id));
const newIds = allIds.filter((id) => !ORIGINAL_IDS.has(id));

const tier1Ids = originalIds.filter((id) => getTier(id) === 1);
const tier2Ids = originalIds.filter((id) => getTier(id) === 2);
const tier3Ids = originalIds.filter((id) => getTier(id) === 3);

const schedule = [];
const usedRecently = new Set();
const COOLDOWN = 5;
const recentQueue = [];

// Phase 1: Days 1-180 using only original 100 courses
for (let day = 0; day < DAYS_ORIGINAL; day++) {
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

  // Fallback if any tier ran dry (original pool only)
  if (picked.length < 3) {
    const remaining = shuffle(originalIds.filter((id) => !usedRecently.has(id) && !picked.includes(id)));
    while (picked.length < 3 && remaining.length > 0) {
      picked.push(remaining.shift());
    }
  }
  // Last resort: allow repeats
  if (picked.length < 3) {
    const fallback = shuffle(originalIds.filter((id) => !picked.includes(id)));
    while (picked.length < 3) picked.push(fallback.shift());
  }

  // Shuffle the 3 picks so the iconic one isn't always round 1
  const shuffledPicked = shuffle(picked);

  const rounds = shuffledPicked.map((courseId, i) => ({
    courseId,
    imageKey: IMAGE_KEY,
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

// Phase 2: Days 181+ using only newly added courses (if any)
if (newIds.length >= 3) {
  usedRecently.clear();
  recentQueue.length = 0;
  const newRand = seededRandom(177); // Different seed for new section
  const newShuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(newRand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  for (let day = 0; day < DAYS_NEW; day++) {
    const date = new Date(START_DATE);
    date.setDate(date.getDate() + DAYS_ORIGINAL + day);
    const dateStr = date.toISOString().split("T")[0];

    const avail = newShuffle(newIds.filter((id) => !usedRecently.has(id)));
    let picked = avail.slice(0, 3);
    if (picked.length < 3) {
      const remaining = newShuffle(newIds.filter((id) => !usedRecently.has(id) && !picked.includes(id)));
      while (picked.length < 3 && remaining.length > 0) picked.push(remaining.shift());
    }
    if (picked.length < 3) {
      const fallback = newShuffle(newIds.filter((id) => !picked.includes(id)));
      while (picked.length < 3 && fallback.length > 0) picked.push(fallback.shift());
    }
    picked = newShuffle(picked);

    schedule.push({
      date: dateStr,
      rounds: picked.map((courseId, i) => ({
        courseId,
        imageKey: IMAGE_KEY,
        difficulty: difficulties[i],
      })),
    });

    for (const id of picked) {
      usedRecently.add(id);
      recentQueue.push({ id, expiresDay: day + COOLDOWN });
    }
    while (recentQueue.length > 0 && recentQueue[0].expiresDay <= day) {
      usedRecently.delete(recentQueue.shift().id);
    }
  }
}

writeFileSync(outputPath, JSON.stringify(schedule, null, 2));
console.log(`Generated ${schedule.length} days of schedule`);
console.log(`Original pool: ${originalIds.length} (T1: ${tier1Ids.length}, T2: ${tier2Ids.length}, T3: ${tier3Ids.length})`);
if (newIds.length > 0) {
  console.log(`New pool: ${newIds.length} (days ${DAYS_ORIGINAL + 1}–${schedule.length})`);
}
console.log(`Date range: ${schedule[0].date} to ${schedule[schedule.length - 1].date}`);
