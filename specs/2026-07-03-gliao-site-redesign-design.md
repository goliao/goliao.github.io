# gliao.xyz Redesign — Design Spec

**Date:** 2026-07-03
**Status:** Approved (design sections reviewed and approved by owner in brainstorming session)

## 1. Goals

- Present Gordon Y. Liao's full professional record — research, speaking, media, writing, and engineering work — currently understated or missing from the site.
- Make ongoing maintenance trivial: every routine update is a YAML entry, never template surgery.
- Retire the Ruby/Jekyll toolchain; keep hosting free with no new vendor accounts.
- Preserve every existing URL that the outside world links to (pages and PDFs).

### Non-goals (v1)

- Newsletter/email capture, dark mode, web-based CMS, blog engine, RSS feed.
- Regenerating the CV PDF (site links to the existing `GordonLiaoCV.pdf`; refreshing that document is a separate task for the owner).

## 2. Audiences

Served equally: executive recruiters and board committees, journalists, and conference organizers — plus academic peers. The homepage gives all of them the complete picture in one screen; dedicated sections serve each in depth.

## 3. Site map & navigation

Nav: **Research · Speaking · Media · Writing · CV** (small-caps, letterspaced).

| URL | Page | Content |
|-----|------|---------|
| `/` | Home | Executive homepage (zones below) |
| `/research/` | Research | All papers grouped: Working papers → Publications (journal tags) → Technical reports → Other writings |
| `/speaking/` | Speaking | Talk topics (3 modular), selected past stages, video links, booking contact; print stylesheet doubles as speaker one-sheet |
| `/media/` | Media | Expertise areas for journalists, selected press mentions by year, downloadable headshot, contact |
| `/writing/` | Writing | Op-eds, Project Syndicate columns, VoxEU pieces, explainers |
| `/cv/` | CV | CV PDF link + short bio |
| `/tokenisation/` | Topic view | Auto-generated from papers tagged `stablecoins`/`tokenization`/`amm` — URL preserved, zero duplicate maintenance; not in nav |
| `/404.html` | 404 | Simple, styled |

### Homepage zones

1. **Hero** — headshot; name; "Chief Economist & Head of Research · Circle (NYSE: CRCL)"; 4-sentence bio telling the Federal Reserve → Uniswap Labs → Circle arc with journals (*RFS*, *JFE*) and Harvard Ph.D.; links: Google Scholar · SSRN · LinkedIn · X · Contact.
2. **Affiliations strip** — CEPR Research Affiliate · Cornell FinTech Fellow · NABE Finance Roundtable Co-Chair · WEF Agenda Contributor · Project Syndicate Columnist.
3. **Current focus** — one editable paragraph naming signature work (TCAF, Arc, tokenization); updated a few times a year via `profile.yaml`.
4. **Selected work** — 4 items flagged `featured` in `papers.yaml`.
5. **Recent** — three columns auto-pulling the newest talk, press mention, and writing entry.

## 4. Content model

All mutable content lives in `src/data/*.yaml`. Pages are Astro templates rendering these files. A routine update ("add this paper") is one YAML block.

### `papers.yaml`
```yaml
- title: Risk-based Capital for Stable Value Tokens
  authors: [Dan Fishman, Jeremy Fox-Geen]   # co-authors, owner implied
  date: 2024-08
  status: working        # working | published | technical | other
  venue: ""              # journal name when published
  journal_tag: ""        # RFS / JFE / JFR — rendered as pill
  links: { ssrn: "…", pdf: "…", slides: "…", code: "…", data: "…" }
  press: [{ outlet: Bloomberg Money Stuff, url: "…" }]
  topics: [stablecoins]
  featured: true
  note: ""               # optional one-line description
```

### `talks.yaml`
`event, title, date, location, kind (keynote|panel|discussion|invited), links {video, slides}`

### `press.yaml`
`outlet, headline, url, date`

### `writing.yaml`
`outlet, title, url, date, kind (op-ed|column|explainer)`

### `profile.yaml`
`role, bio_short, bio_long, current_focus, affiliations[], social {scholar, ssrn, linkedin, x, email}, headshot`

## 5. Content refresh (research-then-draft)

Owner-approved plan: Claude researches the public record and drafts all content for owner review before anything ships. Sources: Google Scholar, SSRN author page, Project Syndicate author page, VoxEU, Barron's, Circle blog/research, press archives (Bloomberg, WSJ, FT, CoinDesk), conference agendas, and the owner's local talks archive. **Every entry must cite a verifiable source URL; anything unverifiable is flagged for the owner, not published.**

### Confirmed new content (owner-supplied, 2026-07-03)

Include under Research → **Technical reports**, tagged `arc`/`quantum`:

1. **Arc Litepaper** (2025) — https://6778953.fs1.hubspotusercontent-na1.net/hubfs/6778953/Arc%20Litepaper%20-%202025.pdf
2. **Circle post-quantum roadmap** — https://6778953.fs1.hubspotusercontent-na1.net/hubfs/6778953/PDFs/quantum_paper.pdf
3. **AMP: Arc Multi-Proposer Protocol with Bounded Inclusion Guarantees** — Cason, Liao, Mena, Milošević, Seredinschi, Sforzin, Sousa, Vander Vos; arXiv cs.DC, May 2026 — https://arxiv.org/abs/2605.23677

(Exact titles/metadata for items 1–2 verified from the PDFs during content research. Mirror copies of the two HubSpot-hosted PDFs are saved under `public/papers/` and linked as fallback, since marketing-CDN URLs rot; primary links point to the canonical URLs.)

Known status updates: "The Hedging Channel of Exchange Rate Determination" is published at *RFS* (update from "Accepted"); sweep for anything newer than Aug 2024.

## 6. Visual system — "Refined Academic"

- **Type:** Source Serif 4 (self-hosted via `@fontsource`, no external font requests) for headings and body; system sans stack for nav/labels in letterspaced small caps.
- **Palette:** paper `#FFFDF9`, ink `#1C1A17`, bronze accent `#8A6D3B` (links), hairline `#ECE7DD`, label `#A39A87`.
- **Layout:** single readable column (~68ch), generous whitespace, hairline rules between list items.
- **Journal pills:** RFS/JFE/JFR tags as small ink-on-paper pills — the one loud element, reserved for top credentials. Topic tags as muted pills.
- **No dark mode** (single theme, warm paper is the identity). Contrast meets WCAG AA.
- **Print stylesheet** on `/speaking/` producing a clean one-page speaker sheet.
- Zero client-side JavaScript shipped.

## 7. Architecture

- **Astro** (static output) at repo root: `src/pages/`, `src/components/`, `src/data/`, `src/styles/`, `public/`.
- Plain CSS with custom properties; no CSS framework; minimal dependencies (`astro`, `@astrojs/sitemap`, `@fontsource-variable/source-serif-4`), lockfile committed.
- **URL parity:** all existing assets keep exact paths — `public/papers/…`, `public/discussion/…`, `public/data/…`, `public/img/…`, `public/GordonLiaoCV.pdf`, `public/google149ed543bf9df5bc.html`, `public/CNAME`. Page routes `/research/`, `/tokenisation/`, `/cv/` unchanged.
- **SEO:** per-page title/description, Open Graph + Twitter cards, sitemap, JSON-LD `Person` markup (name, role, affiliation, alumniOf, sameAs → Scholar/LinkedIn/X/SSRN) on the homepage.
- **Analytics:** existing Statcounter snippet carried over into the base layout.
- The legacy Jekyll site in `docs/` remains untouched until cutover, then is removed in a follow-up commit (history preserved in git).

## 8. Build, deploy, cutover

- GitHub Actions workflow: on push to `master`, `npm ci && astro build` → `actions/upload-pages-artifact` → `actions/deploy-pages`. A failed build leaves the live site untouched and emails the owner.
- One-time cutover (only after owner approves the previewed site): switch Pages source from `docs/` folder to GitHub Actions; custom domain `gliao.xyz` setting unchanged.
- Rollback: `git revert` + push redeploys the previous state.

## 9. Verification

Pre-cutover: `astro build` passes; link check over the built site (every internal link and PDF path resolves); owner reviews the site via local preview and approves. Post-cutover smoke check: `https://gliao.xyz` serves the new site; spot-check old PDF URLs return 200; sitemap and verification file reachable.

**Publishing gate:** nothing deploys — and the Pages setting is not flipped — without explicit owner approval of the previewed site.

## 10. Maintenance workflow (post-launch)

- "Add this paper/talk/press hit" → one YAML block; homepage Recent, topic views, and lists update automatically on deploy.
- "Update current focus" → edit one string in `profile.yaml`.
- Local preview: `npm run dev`. No Ruby.

## 11. Decision log

- **Astro + GitHub Pages via Actions** over (a) Jekyll-in-place — retires fragile Ruby toolchain, same free hosting; and (b) Cloudflare Pages — marginal benefit for a six-page site vs. a new account + DNS change; static output keeps that door open.
- **Direction A (Refined Academic)** chosen from three mockups (vs. dark executive-brand and editorial magazine directions).
- **Data-driven `/tokenisation/`** topic view instead of a second hand-maintained list.
- **No newsletter** section (owner declined); Speaking/Media/Writing sections added.

## 12. Open items

- CV PDF is dated June 2024 — owner to supply a refresh; site links to it regardless.
- Headshot: reuse `img/headshot_GL_4ss.jpg` unless owner supplies a newer one.
