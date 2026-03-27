# DevPulse — Frontend

> A modern developer newsroom dashboard built with Angular 19 + Tailwind CSS v4.

Live URL: `https://dev-pulse-fe.vercel.app`

---

## What It Does

DevPulse is a personalized tech news aggregator. You search any technology (React, Rust, Docker, Python, etc.) and the app fetches live data from **8 developer sources simultaneously** and displays them in a unified dashboard.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Angular | 19+ | Frontend framework (standalone components) |
| Tailwind CSS | v4 (PostCSS) | Utility styling |
| TypeScript | 5+ | Type safety |
| Chart.js | Latest | Trending technology bar chart |
| RxJS | Latest | Reactive search with debounce |
| Space Grotesk | Google Fonts | Display typography |
| JetBrains Mono | Google Fonts | Monospace / meta text |

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/
│   │   │   ├── navbar.ts          — Sticky glass navbar, dark mode toggle, smooth scroll
│   │   │   └── navbar.html        — Logo with animated SVG ring, nav buttons
│   │   ├── tech-selector/
│   │   │   ├── tech-selector.ts   — Main dashboard logic, feed state, bookmarks, chart
│   │   │   └── tech-selector.html — Search bar, feed grid, skeleton loading, empty state
│   │   └── trending-chart/
│   │       └── trending-chart.ts  — Chart.js bar chart, dark/light aware, animated
│   ├── services/
│   │   ├── feed.ts                — Calls /feed endpoint, returns all 8 sources
│   │   └── tech.ts                — Calls /tech/suggest for autocomplete
│   ├── app.ts                     — Root component
│   ├── app.html                   — Hero section + router outlet
│   └── app.config.ts              — provideHttpClient, provideRouter
├── environments/
│   ├── environment.ts             — Local: http://localhost:3000
│   └── environment.prod.ts        — Production: https://devpulse-be.onrender.com
├── styles.css                     — Global design system, CSS variables, animations
└── index.html                     — Mesh background divs injected here
```

---

## Key Features

### Search & Autocomplete
- Debounced search using `Subject + debounceTime(300) + distinctUntilChanged + switchMap`
- Suggestions fetched from StackOverflow Tags API + GitHub Topics API
- Users must select from suggestions (prevents invalid tech searches)
- Recent searches stored in component state, shown as clickable chips

### Feed Sources (8 total)
| Source | What it shows |
|---|---|
| GitHub Releases | Latest version releases for the technology |
| GitHub Trending | New repos created in last 30 days, sorted by stars |
| Reddit | Posts from programming subreddits |
| Stack Overflow | Active questions tagged with the technology |
| Hacker News | Stories via Algolia HN API |
| Dev.to | Articles tagged with the technology |
| Tech News | NewsAPI articles filtered for developer context |
| NPM | Package search results with weekly download counts |

### Validation
- Backend checks `developerSignals` (GitHub + Reddit + SO + HN + Dev.to counts)
- If signals are zero and news < 3, returns error — prevents random words like "pizza"
- Frontend shows `alert()` with the error message

### Trending Chart
- Chart.js bar chart showing "Pulse Score" per technology
- Score formula: `github×5 + trending×3 + reddit×3 + stackoverflow×3 + hackernews×2 + devto×2 + npm×2 + news×1`
- Each technology gets a unique color from a 12-color palette
- Chart re-renders with animation on each new search
- Dark/light mode aware — text and grid colors swap automatically

### Bookmarks
- Saved to `localStorage` under key `devpulse-bookmarks`
- Duplicate prevention via URL comparison
- Remove individual or clear all
- Persist across page refreshes

### UI Effects
- **Animated mesh background** — 4 blurred color blobs float at different speeds using CSS keyframes
- **Glass morphism cards** — `backdrop-filter: blur(16px)` with border and shadow
- **Top shimmer on card hover** — `::before` pseudo element scaled from 0→1 via `scaleX`
- **Skeleton loading** — shimmer animation on placeholder cards while fetching
- **Stagger animations** — `animation-delay` on nth-child creates cascade reveal
- **Concentric ring empty state** — radar-ping animation using `scale + opacity`
- **Live indicator** — pulsing green dot when results are displayed

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
ng serve

# Open browser
http://localhost:4200
```

Backend must be running at `http://localhost:3000` for API calls to work.

---

## Production Build

```bash
ng build --configuration production
```

This automatically swaps `environment.ts` with `environment.prod.ts` via `fileReplacements` in `angular.json`, so all API calls point to the Render backend URL.

---

## Deployment (Vercel)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set these in Vercel project settings:

| Setting | Value |
|---|---|
| Framework | Angular |
| Build Command | `ng build --configuration production` |
| Output Directory | `dist/devpulse/browser` |
| Install Command | `npm install` |

4. Click Deploy

Vercel auto-deploys on every `git push` to main.

---

## Problems Fixed During Development

### CORS Error
- **Problem:** Angular at `localhost:4200` blocked from calling NestJS at `localhost:3000`
- **Fix:** `app.enableCors({ origin: 'http://localhost:4200' })` in NestJS `main.ts`
- **Production fix:** `origin: '*'` with `credentials: false` for Render deployment

### Angular Change Detection Not Triggering
- **Problem:** API data arrived but UI didn't update until another button was clicked
- **Root cause:** Angular's zone.js not detecting changes inside RxJS `subscribe()` in some cases
- **Fix:** Call both `ChangeDetectorRef.detectChanges()` AND `ApplicationRef.tick()` after state updates

### Suggestions Lag / Race Conditions
- **Problem:** Typing fast showed old/wrong suggestions, multiple API calls fired simultaneously
- **Fix:** RxJS pattern — `Subject` → `debounceTime(300)` → `distinctUntilChanged()` → `switchMap()`
- `debounceTime` waits 300ms after last keystroke before firing
- `distinctUntilChanged` skips duplicate values
- `switchMap` cancels in-flight requests when new value arrives

### NestJS Dependency Injection Error
- **Problem:** `FeedModule` couldn't resolve `NewsService`, `GithubService`, `RedditService`
- **Root cause:** NestJS modules are isolated — services must be exported from their module and imported into `FeedModule`
- **Fix:** Add `exports: [ServiceName]` to each module, add `imports: [ModuleName]` to `FeedModule`

### Invalid Tech Validation (pizza passing as valid)
- **Problem:** NewsAPI returns articles for any word, so "pizza" passed validation
- **Fix:** Require `developerSignals > 0` — GitHub + Reddit + SO + HN + Dev.to must have at least one result

### Different Platform Naming (node vs nodejs vs node.js)
- **Problem:** Each platform uses different names — Reddit uses `nodejs`, GitHub uses `node`
- **Fix:** `normalizeTech()` strips `.js` suffixes before querying, expanded Reddit subreddit list covers all tech communities

### Dev.to 404 Error
- **Problem:** `generateKeywords()` created variants like `java.js` and sent them to Dev.to → 404
- **Fix:** Only send the clean base keyword to Dev.to, HackerNews, StackOverflow — aliases only used for GitHub

### GitHub Hardcoded Repo Map
- **Problem:** GitHub service only worked for ~5 hardcoded repos (react, node, tailwind, etc.)
- **Fix:** Dynamic GitHub search API — searches by topic and name, tries top 3 repos for releases, falls back to trending repos

### Reddit Non-Tech Results
- **Problem:** Searching "react" returned Epstein files and political posts
- **Fix:** Filter by `allowedSubreddits` set — 50+ programming community names covering all tech stacks

### Chart Empty Despite Data
- **Problem:** Chart.js tried to render before Angular's `ViewChild` was ready
- **Fix:** `AfterViewInit` lifecycle hook sets `viewReady = true`, `createChart()` returns early if not ready

### Score Accumulating on Re-search
- **Problem:** Searching "react" twice doubled the score in the chart
- **Fix:** `this.techPopularity[canonical] = score` (assignment, not addition)

### Angular Standalone Import Errors
- **Problem:** `app-navbar is not a known element`, `*ngFor not recognized`
- **Root cause:** Angular 17+ uses standalone components — each component must declare its imports
- **Fix:** Add `imports: [CommonModule, NavbarComponent, ...]` to each `@Component` decorator

---

## Interview Talking Points

- **Reactive search:** `Subject + debounceTime + distinctUntilChanged + switchMap` is the standard Angular typeahead pattern
- **Change detection:** Angular uses zone.js to detect changes; `ApplicationRef.tick()` forces a full app cycle when zone misses async updates
- **CSS performance:** Mesh background blobs use `will-change: transform` to promote to GPU compositor layer — zero layout cost
- **Glass morphism:** `backdrop-filter: blur()` requires the element to have a semi-transparent background — fully transparent won't work
- **Aggregator pattern:** `FeedService` calls all 8 sources in parallel with `Promise.all()` — sequential calls would be 8× slower
