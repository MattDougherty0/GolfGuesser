/**
 * Fetches satellite imagery from Google Maps Static API for all courses.
 * Uses course name + city + state as the center parameter for accuracy.
 *
 * Usage:
 *   GOOGLE_MAPS_API_KEY=your_key node scripts/fetch-images.mjs
 *
 * Options:
 *   --dry-run        Print URLs without downloading
 *   --course=ID      Only fetch for a specific course ID
 *   --skip-existing  Skip images that already exist on disk
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local if present
const envPath = join(__dirname, "..", ".env.local");
if (existsSync(envPath)) {
  const env = readFileSync(envPath, "utf-8");
  for (const line of env.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const coursesPath = join(__dirname, "../src/data/courses.json");
const publicDir = join(__dirname, "../public");

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const DRY_RUN = process.argv.includes("--dry-run");
const SKIP_EXISTING = process.argv.includes("--skip-existing");
const COURSE_FLAG = process.argv.find((a) => a.startsWith("--course="));
const SINGLE_COURSE = COURSE_FLAG ? COURSE_FLAG.split("=")[1] : null;

if (!API_KEY && !DRY_RUN) {
  console.error("Error: GOOGLE_MAPS_API_KEY env var is required (or use --dry-run)");
  process.exit(1);
}

const zoomLevels = {
  "aerial-tight": 16,
  "aerial-medium": 15,
  "aerial-wide": 14,
};

const IMAGE_SIZE = "640x600";
const MAP_TYPE = "satellite";
const DELAY_MS = 200;

const courses = JSON.parse(readFileSync(coursesPath, "utf-8"));
const filtered = SINGLE_COURSE
  ? courses.filter((c) => c.id === SINGLE_COURSE)
  : courses;

if (filtered.length === 0) {
  console.error(`No courses found${SINGLE_COURSE ? ` matching "${SINGLE_COURSE}"` : ""}`);
  process.exit(1);
}

console.log(`Processing ${filtered.length} courses (${filtered.length * 3} images)...`);
if (DRY_RUN) console.log("(dry run - no downloads)\n");

function buildSearchQuery(course) {
  const { name } = course;
  const { city, state } = course.location;
  return encodeURIComponent(`${name} ${city} ${state}`);
}

let downloaded = 0;
let skipped = 0;
let errors = 0;

for (const course of filtered) {
  const query = buildSearchQuery(course);
  const dir = join(publicDir, "courses", course.id);

  if (!DRY_RUN) mkdirSync(dir, { recursive: true });

  for (const [filename, zoom] of Object.entries(zoomLevels)) {
    const outPath = join(dir, `${filename}.jpg`);

    if (SKIP_EXISTING && existsSync(outPath)) {
      skipped++;
      continue;
    }

    const url =
      `https://maps.googleapis.com/maps/api/staticmap` +
      `?center=${query}` +
      `&zoom=${zoom}&size=${IMAGE_SIZE}` +
      `&maptype=${MAP_TYPE}&key=${API_KEY}`;

    if (DRY_RUN) {
      console.log(`  ${course.id}/${filename}.jpg -> zoom ${zoom}`);
      continue;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const buffer = Buffer.from(await res.arrayBuffer());
      writeFileSync(outPath, buffer);
      downloaded++;
      process.stdout.write(`\r  Downloaded: ${downloaded} | Skipped: ${skipped} | Errors: ${errors}`);
      await new Promise((r) => setTimeout(r, DELAY_MS));
    } catch (err) {
      errors++;
      console.error(`\n  Error fetching ${course.id}/${filename}: ${err.message}`);
    }
  }
}

console.log(`\n\nDone! Downloaded: ${downloaded} | Skipped: ${skipped} | Errors: ${errors}`);
