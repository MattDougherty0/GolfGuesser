# GolfGuessr

A daily golf geography challenge. How well do you know America's golf courses?

## What It Is

Each day you get **three rounds**—three aerial satellite images of real courses from across the continental U.S. Your job: name the course, drop a pin on the map where you think it's located, and earn up to **3,000 points**.

- **Course name** — Type it in (or skip for pin-only)
- **Pin location** — Drop a marker on the map
- **Hints** — Reveal region, architect, tournament info, etc.—but each one costs points
- **Speed** — Faster guesses score higher

New puzzles drop at midnight Eastern. 100 courses across 30 states, from bucket-list icons to hidden gems.

## What We Built

- **Daily puzzle system** — 3 rounds per day, 180-day rotating schedule
- **Interactive map guessing** — Leaflet-based pin drop with distance scoring
- **Course autocomplete** — Search 100 courses by name
- **Hint system** — 5 hint types with different point costs
- **Leaderboard** — Optional sign-in to track scores (Supabase)
- **Results & reveal** — See how you did, compare your pin to the real location, read course profiles

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16, React 19 |
| Styling | Tailwind CSS 4 |
| Maps | Leaflet, React-Leaflet |
| Backend | Supabase (auth, leaderboard) |
| Data | Static JSON (courses, schedule) |

## Deploy

Built for [Vercel](https://vercel.com). Connect the repo and deploy.
