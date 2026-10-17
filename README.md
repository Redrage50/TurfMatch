# TurfMatch — Mumbai Turf Booking & Matchmaking

A React (Vite) app for booking football turfs in Mumbai, recruiting solo players by
position, matching up with other teams, enrolling player/team profiles, and rating
players/teams after a match. Role-based auth (Player / Team Captain / Turf Admin) and
all data are mocked in the browser via `localStorage` — no backend required to run it.

## Features

- **Home / Book a Turf** — Mumbai-only turf listings on an interactive Leaflet map
  (OpenStreetMap tiles, no API key needed) with search by name/area, area filter, and
  sort by rating or price. Click "Book Slot" to pick a date + time slot.
- **Find Players & Teams** — tabbed page for:
  - **Solo Players**: filter by position (Goalkeeper / Defender / Midfielder / Striker)
    and area, then "Recruit" a player.
  - **Team Matchmaking**: browse teams and the positions they're short on, then "Request
    Match".
- **Player Enrollment** — form to create a solo player profile (position, area, age,
  skill level, bio, avatar). Once submitted, the profile appears on the recruitment page.
- **Team Enrollment** — form to register a team (name, area, squad size, positions
  needed, skill level, bio). Appears under the Team Matchmaking tab.
- **Rating system** — rate any player or team (1–5 stars + optional comment) from the
  recruitment page or from **My Matches**, where your bookings and recruited
  players/teams are tracked.
- **Role-based auth** — sign up as a Player, Team Captain, or Turf Admin. Enrollment and
  matches pages are protected routes that require login.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/     Reusable UI: Navbar, TurfCard, PersonCard, TurfMap, modals, stars
  context/        AuthContext (role-based auth) and DataContext (players/teams/bookings/ratings)
  data/           Seed data — Mumbai turfs, sample players & teams
  pages/          Home, Recruitment, Login, Register, PlayerEnroll, TeamEnroll, Matches
  utils/store.js  Tiny localStorage wrapper standing in for a backend
```

## How the pieces map to your spec

1. **Home page** — turf booking with a map and search, Mumbai only for now.
2. **Recruitment page** — solo player recruitment filtered by position (defender,
   striker, goalkeeper, midfielder) plus team matchmaking, in one tabbed page.
3. **Rating** — after "recruiting" a player/team (or from My Matches), you can rate them.
4. **Enrollment forms** — separate single-player and team enrollment pages; submitted
   profiles immediately become visible on the recruitment page.
5. **Role-based auth** — register as Player / Team Captain / Turf Admin; protected
   routes gate enrollment and match-history pages.

## Notes & next steps for a real backend

This is a frontend-only prototype: auth, profiles, bookings, and ratings all live in
`localStorage` (see `src/utils/store.js`) so the app is fully runnable without a server.
To make it production-ready you'd swap `DataContext`/`AuthContext` calls for real API
requests (e.g. Node/Express + PostgreSQL, or Firebase), add password hashing and JWT/
session auth, expand turf coverage beyond Mumbai, and add server-side validation for
enrollment forms and ratings (e.g. one rating per completed match, admin approval for
new turfs, etc).
