# gliao.xyz Astro Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild gliao.xyz as an Astro static site (data-driven YAML content, "Refined Academic" design) deployed free via GitHub Actions to GitHub Pages, with refreshed 2024–2026 content.

**Architecture:** Astro v5 static output at repo root; all mutable content in `src/data/*.yaml` rendered by `.astro` page templates; legacy Jekyll site stays live in `docs/` until an explicit owner-approved cutover flips the Pages source to GitHub Actions.

**Tech Stack:** Astro ^5, @astrojs/sitemap, @rollup/plugin-yaml, @fontsource-variable/source-serif-4, plain CSS. No client-side JavaScript.

**Spec:** `specs/2026-07-03-gliao-site-redesign-design.md`

## Global Constraints

- **Palette (exact):** paper `#FFFDF9`, ink `#1C1A17`, bronze `#8A6D3B`, hairline `#ECE7DD`, label `#A39A87`, body text `#3A362E`, muted `#8A8171`.
- **Type:** Source Serif 4 Variable (self-hosted via @fontsource) for headings/body; system sans stack for nav/labels (letterspaced small caps). No external font/CDN requests.
- **Zero client-side JS** shipped to visitors (Statcounter analytics snippet is the sole exception, carried over verbatim).
- **URL parity (must all exist in `dist/` before cutover):** `/research/`, `/speaking/`, `/media/`, `/writing/`, `/cv/`, `/tokenisation/`, `/404.html`, `papers/*` (7 legacy PDFs + 2 new mirrors), `discussion/*` (5 PDFs), `data/spx_disaster_prob_march2021update.csv`, `img/*` (5 images), `GordonLiaoCV.pdf`, `google149ed543bf9df5bc.html`, `CNAME`.
- **Content rule:** every data-file entry cites a real, verified URL. Unverifiable claims are flagged in the task output for the owner, never published.
- **Publishing gate:** Tasks 15–16 (cutover, legacy removal) run ONLY after the owner approves the local preview in Task 14. Nothing is pushed to `master` before Task 14 approval EXCEPT plain commits (pushing is safe pre-cutover only if the Pages source is still `docs/` — to stay safe, do not push until Task 15).
- **Testing adaptation:** this is a zero-JS static site; the test cycle for template tasks is `npm run build` + assertions against `dist/` (grep / node script). For content-research tasks it is an HTTP status check over every URL added. Each task states exact commands and expected output.
- **YAML dates:** always quoted strings `"YYYY-MM"` or `"YYYY-MM-DD"` (js-yaml would otherwise coerce unquoted full dates to Date objects).
- **Commits:** one per task minimum, message prefix `site:`.

---

### Task 1: Scaffold Astro project with design tokens

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/styles/global.css`, `src/pages/index.astro` (temporary), `.nvmrc`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `npm run build` → `dist/`; CSS custom properties `--paper --ink --bronze --hairline --label --body-c --muted --sans` and classes `.container .section-label .pill-journal .pill-topic` used by all later tasks.

- [ ] **Step 1: Write project files**

`package.json`:
```json
{
  "name": "gliao-xyz",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "@astrojs/sitemap": "^3.4.0",
    "@fontsource-variable/source-serif-4": "^5.2.0",
    "@rollup/plugin-yaml": "^4.1.2",
    "astro": "^5.0.0"
  }
}
```

`astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import yaml from '@rollup/plugin-yaml';

export default defineConfig({
  site: 'https://gliao.xyz',
  integrations: [sitemap()],
  vite: { plugins: [yaml()] },
});
```

`tsconfig.json`:
```json
{ "extends": "astro/tsconfigs/base" }
```

`.nvmrc`:
```
22
```

Append to `.gitignore`:
```
node_modules/
dist/
.astro/
```

`src/styles/global.css`:
```css
:root {
  --paper: #FFFDF9;
  --ink: #1C1A17;
  --bronze: #8A6D3B;
  --hairline: #ECE7DD;
  --label: #A39A87;
  --body-c: #3A362E;
  --muted: #8A8171;
  --sans: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
  --serif: "Source Serif 4 Variable", Georgia, "Times New Roman", serif;
}

* { box-sizing: border-box; }

html { background: var(--paper); }

body {
  margin: 0;
  font-family: var(--serif);
  color: var(--ink);
  font-size: 1.0625rem;
  line-height: 1.7;
}

.container {
  max-width: 46rem;
  margin: 0 auto;
  padding: 0 1.25rem;
}

a { color: var(--bronze); text-decoration: none; border-bottom: 1px solid #d8c9a8; }
a:hover { border-bottom-color: var(--bronze); }

h1, h2, h3 { line-height: 1.2; letter-spacing: -0.01em; }
h1 { font-size: 2.1rem; margin: 0; }
h2 { font-size: 1.35rem; margin: 2.5rem 0 0.75rem; }

p { color: var(--body-c); }

.section-label {
  font-family: var(--sans);
  font-size: 0.66rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--label);
  margin: 2.75rem 0 0.9rem;
}

.pill-journal {
  font-family: var(--sans);
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  background: var(--ink);
  color: var(--paper);
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  vertical-align: 2px;
  white-space: nowrap;
}

.pill-topic {
  font-family: var(--sans);
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: #f3efe6;
  color: #6b6455;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  white-space: nowrap;
}

.item {
  padding: 0.8rem 0;
  border-bottom: 1px solid #f0ece2;
}
.item:last-child { border-bottom: none; }
.item .title { font-weight: 700; }
.item .coauthors { color: var(--muted); }
.item .note { margin: 0.25rem 0 0; font-size: 0.95rem; }
.item .links {
  font-family: var(--sans);
  font-size: 0.72rem;
  color: var(--bronze);
  margin-top: 0.3rem;
}
.item .links a { border-bottom: none; }

.site-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1.4rem 0;
  border-bottom: 1px solid var(--hairline);
  font-family: var(--sans);
}
.site-nav .brand {
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  font-weight: 600;
  color: var(--ink);
  border-bottom: none;
}
.site-nav .links { display: flex; gap: 1.1rem; flex-wrap: wrap; }
.site-nav .links a {
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6b6455;
  border-bottom: none;
}
.site-nav .links a:hover, .site-nav .links a[aria-current="page"] { color: var(--bronze); }

.site-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  border-top: 1px solid var(--hairline);
  margin-top: 4rem;
  padding: 1.1rem 0 2.5rem;
  font-family: var(--sans);
  font-size: 0.7rem;
  color: var(--label);
}
.site-footer a { color: var(--label); border-bottom: none; }
```

- [ ] **Step 2: Temporary index page**

`src/pages/index.astro`:
```astro
---
---
<html lang="en"><head><title>Gordon Y. Liao</title></head>
<body><h1>Scaffold OK</h1></body></html>
```

- [ ] **Step 3: Install and build**

Run: `npm install && npm run build`
Expected: build completes; `dist/index.html` and `dist/sitemap-index.xml` exist. Verify: `ls dist/index.html dist/sitemap-index.xml`

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .nvmrc .gitignore src/
git commit -m "site: scaffold Astro project with design tokens"
```

---

### Task 2: Base layout (head, nav, footer, analytics)

**Files:**
- Create: `src/layouts/Base.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `global.css` classes from Task 1.
- Produces: `Base.astro` with props `{ title: string; description: string; ogImage?: string }` and a default slot. All pages wrap in this. Nav links: Research `/research/`, Speaking `/speaking/`, Media `/media/`, Writing `/writing/`, CV `/cv/`.

- [ ] **Step 1: Write the layout**

`src/layouts/Base.astro`:
```astro
---
import '@fontsource-variable/source-serif-4';
import '../styles/global.css';

interface Props { title: string; description: string; ogImage?: string; }
const { title, description, ogImage = '/img/headshot_GL_4ss.jpg' } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
const year = new Date().getFullYear();
const path = Astro.url.pathname;
const nav = [
  ['Research', '/research/'],
  ['Speaking', '/speaking/'],
  ['Media', '/media/'],
  ['Writing', '/writing/'],
  ['CV', '/cv/'],
];
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="sitemap" href="/sitemap-index.xml" />
    <meta name="google-site-verification" content="4DbUCUEQqZAgO5WOoKRudfma9z2KIP0AfnfHa1_BClM" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={new URL(ogImage, Astro.site)} />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@gordonliao" />
  </head>
  <body>
    <div class="container">
      <nav class="site-nav">
        <a class="brand" href="/">GORDON Y. LIAO</a>
        <div class="links">
          {nav.map(([label, href]) => (
            <a href={href} aria-current={path === href ? 'page' : undefined}>{label}</a>
          ))}
        </div>
      </nav>
      <main><slot /></main>
      <footer class="site-footer">
        <span>© {year} Gordon Y. Liao</span>
        <a href="mailto:gliao@post.harvard.edu">gliao@post.harvard.edu</a>
      </footer>
    </div>
    <!-- Statcounter (carried over from legacy site) -->
    <script type="text/javascript">
      var sc_project=12395335;
      var sc_invisible=1;
      var sc_security="315509ac";
    </script>
    <script type="text/javascript" src="https://www.statcounter.com/counter/counter.js" async></script>
    <noscript><div class="statcounter"><a title="free web stats" href="https://statcounter.com/" target="_blank"><img class="statcounter" src="https://c.statcounter.com/12395335/0/315509ac/1/" alt="free web stats"></a></div></noscript>
  </body>
</html>
```

- [ ] **Step 2: Use it from the temporary index**

`src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Gordon Y. Liao" description="Chief Economist and Head of Research at Circle. Ph.D. Economics, Harvard.">
  <h1>Layout OK</h1>
</Base>
```

- [ ] **Step 3: Build and assert**

Run: `npm run build && grep -c 'site-nav' dist/index.html && grep -c 'statcounter' dist/index.html`
Expected: build passes; both grep counts ≥ 1.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Base.astro src/pages/index.astro
git commit -m "site: base layout with nav, footer, SEO head, analytics"
```

---

### Task 3: Static asset migration + PDF mirrors + parity check

**Files:**
- Create: `public/` tree (copied from `docs/`), `public/papers/arc_litepaper_2025.pdf`, `public/papers/circle_quantum_roadmap.pdf`, `scripts/check-dist.mjs`

**Interfaces:**
- Produces: all legacy asset URLs under `public/`; `node scripts/check-dist.mjs` exits 0 when `dist/` contains every required path (later tasks extend REQUIRED_PAGES).

- [ ] **Step 1: Copy legacy assets (do NOT move — docs/ stays live until cutover)**

```bash
mkdir -p public
cp -R docs/papers docs/discussion docs/data docs/img public/
cp docs/GordonLiaoCV.pdf docs/google149ed543bf9df5bc.html docs/CNAME public/
```

- [ ] **Step 2: Mirror the two HubSpot-hosted PDFs**

```bash
curl -fL -o public/papers/arc_litepaper_2025.pdf "https://6778953.fs1.hubspotusercontent-na1.net/hubfs/6778953/Arc%20Litepaper%20-%202025.pdf"
curl -fL -o public/papers/circle_quantum_roadmap.pdf "https://6778953.fs1.hubspotusercontent-na1.net/hubfs/6778953/PDFs/quantum_paper.pdf"
file public/papers/arc_litepaper_2025.pdf public/papers/circle_quantum_roadmap.pdf
```
Expected: both report `PDF document`. If a download fails, flag to owner and continue (canonical links still used on pages).

- [ ] **Step 3: Write the parity checker**

`scripts/check-dist.mjs`:
```js
import { existsSync } from 'node:fs';

const REQUIRED_ASSETS = [
  'GordonLiaoCV.pdf', 'google149ed543bf9df5bc.html', 'CNAME',
  'data/spx_disaster_prob_march2021update.csv',
  'papers/CLVProject_WP_v5.pdf', 'papers/CLVProject_WP_v8.pdf',
  'papers/CreditCIP_JFE.pdf', 'papers/HedgingChannelofExchangeRate_Latest.pdf',
  'papers/Liao_OCC_Tokenization_Confernece.pdf', 'papers/On-Chain_FX_BOC_JUN23.pdf',
  'papers/US_Banks_Global_Liquidity.pdf',
  'papers/arc_litepaper_2025.pdf', 'papers/circle_quantum_roadmap.pdf',
  'discussion/AI_and_finance_PIFS_2024_June.pdf',
  'discussion/CooperativeAI_and_Decentralized_Trust.pdf',
  'discussion/Discussion_Stablecoins_Short_term_funding_paper.pdf',
  'discussion/Discussion_Terra_Luna_Crash.pdf',
  'discussion/Singleness_of_money.pdf',
  'img/gordon_headshot_1.jpg', 'img/gordon_headshot_2.jpg', 'img/gordon_liao_3.jpg',
  'img/headshot_GL_4ss.jpg', 'img/headshot.jpg',
];
const REQUIRED_PAGES = [
  'index.html', '404.html',
  'research/index.html', 'speaking/index.html', 'media/index.html',
  'writing/index.html', 'cv/index.html', 'tokenisation/index.html',
  'sitemap-index.xml',
];

let missing = [];
for (const p of [...REQUIRED_ASSETS, ...REQUIRED_PAGES]) {
  if (!existsSync(new URL(`../dist/${p}`, import.meta.url))) missing.push(p);
}
if (missing.length) {
  console.error('MISSING from dist/:\n' + missing.join('\n'));
  process.exit(1);
}
console.log(`parity OK: ${REQUIRED_ASSETS.length + REQUIRED_PAGES.length} paths present`);
```

- [ ] **Step 4: Run — expect failure on pages (not yet built), assets present**

Run: `npm run build && node scripts/check-dist.mjs`
Expected: exits 1 listing only the seven page paths (research/, speaking/, …) — every asset path must be present. If any *asset* is listed, fix the copy before continuing.

- [ ] **Step 5: Commit**

```bash
git add public scripts/check-dist.mjs
git commit -m "site: migrate static assets, mirror Arc/quantum PDFs, add parity check"
```

---

### Task 4: Research & draft `papers.yaml`

**Files:**
- Create: `src/data/papers.yaml`, `scripts/check-urls.mjs`

**Interfaces:**
- Produces: `papers.yaml` — array of entries with schema below; consumed by Tasks 7, 8, 9. Field names are load-bearing: `title, authors, date, status, venue, journal_tag, links{ssrn,pdf,journal,slides,code,data,mirror,video}, press[{outlet,url}], topics[], featured, note`.
- `status` ∈ `working | published | technical | other`. `topics` values used by `/tokenisation/`: `stablecoins`, `tokenization`, `amm` (others allowed, e.g. `fx`, `options`, `arc`, `quantum`, `banking`).

- [ ] **Step 1: Seed from existing site content**

Transcribe every paper in `docs/research.md` (source of truth for legacy entries — 9 working papers/publications, 3 non-refereed, plus "other writings" go to Task 5's `writing.yaml`). Example entries showing the exact schema:

```yaml
- title: "Risk-based Capital for Stable Value Tokens"
  authors: [Dan Fishman, Jeremy Fox-Geen]
  date: "2024-08"
  status: working
  venue: ""
  journal_tag: ""
  links:
    ssrn: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4926568"
  press:
    - { outlet: "Bloomberg Money Stuff", url: "https://www.bloomberg.com/opinion/articles/2024-08-15/stablecoins-can-have-bank-runs" }
  topics: [stablecoins]
  featured: true
  note: "The Token Capital Adequacy Framework (TCAF) for stablecoin issuers."

- title: "The Hedging Channel of Exchange Rate Determination"
  authors: [Tony Zhang]
  date: "2020-05"
  status: published
  venue: "Review of Financial Studies"
  journal_tag: "RFS"
  links:
    pdf: "/papers/HedgingChannelofExchangeRate_Latest.pdf"
    journal: ""   # fill with doi.org URL found in Step 2
  press:
    - { outlet: "VoxEU", url: "https://voxeu.org/article/currency-hedging-exchange-rate-movement-and-dollar-swap-line-usage-during-covid-19" }
  topics: [fx]
  featured: true
  note: ""
```

- [ ] **Step 2: Research sweep for updates and additions (2024–2026)**

Procedure (use WebSearch/WebFetch):
1. Fetch Google Scholar profile `https://scholar.google.com/citations?user=CjHJb7cAAAAJ&hl=en` sorted by year — list anything not in `docs/research.md`.
2. Search SSRN for author "Gordon Liao" for new working papers / status changes.
3. Find the published DOI + volume/year for "The Hedging Channel of Exchange Rate Determination" (*RFS*) and set `venue`, `journal_tag: RFS`, `links.journal`, and `date` to the publication year-month.
4. Check whether "What Drives Crypto Asset Prices?" or "Risk-based Capital for Stable Value Tokens" gained journal placements.
5. Add the three owner-supplied technical reports (`status: technical`):

```yaml
- title: "Arc Litepaper"
  authors: []
  date: "2025-08"   # confirm from the PDF's own date; adjust if it differs
  status: technical
  venue: "Circle"
  journal_tag: ""
  links:
    pdf: "https://6778953.fs1.hubspotusercontent-na1.net/hubfs/6778953/Arc%20Litepaper%20-%202025.pdf"
    mirror: "/papers/arc_litepaper_2025.pdf"
  press: []
  topics: [arc, tokenization]
  featured: false
  note: "Design of Arc, an economically-secured Layer-1 blockchain for stablecoin finance."

- title: "Circle Post-Quantum Roadmap"
  authors: []
  date: "2026-01"   # confirm from the PDF's own date; adjust if it differs
  status: technical
  venue: "Circle"
  journal_tag: ""
  links:
    pdf: "https://6778953.fs1.hubspotusercontent-na1.net/hubfs/6778953/PDFs/quantum_paper.pdf"
    mirror: "/papers/circle_quantum_roadmap.pdf"
  press: []
  topics: [quantum]
  featured: false
  note: "Roadmap for post-quantum security of digital-asset infrastructure."

- title: "AMP: Arc Multi-Proposer Protocol with Bounded Inclusion Guarantees"
  authors: [Daniel Cason, Sergio Mena, Nenad Milošević, Adi Seredinschi, Alessandro Sforzin, João Sousa, Preston Vander Vos]
  date: "2026-05"
  status: technical
  venue: "arXiv cs.DC"
  journal_tag: ""
  links:
    pdf: "https://arxiv.org/abs/2605.23677"
  press: []
  topics: [arc]
  featured: false
  note: "Multi-proposer consensus with bounded transaction-inclusion guarantees, developed for Arc."
```

6. Confirm the two PDF dates by opening the mirrored files (`pdftotext` first page or Read tool) and correct the `date:` fields.
7. Set `featured: true` on exactly 4 papers: TCAF, Hedging Channel (RFS), Rare Disaster (JFE), Stablecoins Growth Potential (Fed IFDP).

- [ ] **Step 3: Write the URL checker**

`scripts/check-urls.mjs`:
```js
// Usage: node scripts/check-urls.mjs src/data/*.yaml
// Extracts every http(s) URL from the given files, HEAD-requests each,
// and reports status. 200/301/302/303/307/308 pass; 403/405 are warnings
// (paywalls/bot-blockers commonly reject HEAD); anything else fails.
import { readFileSync } from 'node:fs';

const urls = new Set();
for (const f of process.argv.slice(2)) {
  for (const m of readFileSync(f, 'utf8').matchAll(/https?:\/\/[^\s"'\)\]]+/g)) {
    urls.add(m[0].replace(/[.,;]$/, ''));
  }
}
let fail = 0;
for (const u of urls) {
  try {
    const r = await fetch(u, { method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(15000) });
    const ok = [200, 301, 302, 303, 307, 308].includes(r.status);
    const warn = [403, 405, 429].includes(r.status);
    console.log(`${ok ? 'OK  ' : warn ? 'WARN' : 'FAIL'} ${r.status} ${u}`);
    if (!ok && !warn) fail++;
  } catch (e) {
    console.log(`FAIL ERR ${u} (${e.message})`);
    fail++;
  }
}
process.exit(fail ? 1 : 0);
```

- [ ] **Step 4: Verify every URL**

Run: `node scripts/check-urls.mjs src/data/papers.yaml`
Expected: exit 0. Investigate each WARN manually (open in browser/WebFetch) — replace or flag dead links to the owner; FAILs must be fixed or the entry flagged and pulled.

- [ ] **Step 5: Commit**

```bash
git add src/data/papers.yaml scripts/check-urls.mjs
git commit -m "site: papers data — legacy transcription + 2024-2026 research sweep + Arc technical reports"
```

---

### Task 5: Research & draft `talks.yaml`, `press.yaml`, `writing.yaml`

**Files:**
- Create: `src/data/talks.yaml`, `src/data/press.yaml`, `src/data/writing.yaml`

**Interfaces:**
- Produces (consumed by Tasks 9–11):
  - `talks.yaml`: `[{ event, title, date, location, kind, links{video,slides} }]`, `kind` ∈ `keynote | panel | invited | discussion`.
  - `press.yaml`: `[{ outlet, headline, url, date }]`.
  - `writing.yaml`: `[{ outlet, title, url, date, kind }]`, `kind` ∈ `op-ed | column | explainer`.
  - All sorted newest-first by `date`.

- [ ] **Step 1: Seed talks from known record**

From `docs/research.md`, `docs/tokenisation_defi.md`, and `~/Documents/GitHub/Reputation/talks/` (list that directory for 2025–2026 entries; it includes the 2026-02-19 BASS Denver talk "Quantum Risk in Blockchain and Crypto"). Known seed entries:

```yaml
- event: "BASS Denver"
  title: "Quantum Risk in Blockchain and Crypto"
  date: "2026-02"
  location: "Denver, CO"
  kind: invited
  links: {}

- event: "OCC Symposium on Tokenization of Real-World Assets and Liabilities"
  title: "Beyond Speculation: Payment Stablecoins for Real-time Gross Settlements"
  date: "2024-02"
  location: "Washington, D.C."
  kind: invited
  links: { slides: "/papers/Liao_OCC_Tokenization_Confernece.pdf" }

- event: "WFA 2024"
  title: "Discussion: Anatomy of a Run — The Terra Luna Crash"
  date: "2024-07"
  location: ""
  kind: discussion
  links: { slides: "/discussion/Discussion_Terra_Luna_Crash.pdf" }
```

Also transcribe: D.C. Fintech Week 2023 best-paper award talk (video `https://youtu.be/Iit75lVVzIk`), Bank of Canada conference (June 2023, slides `/papers/On-Chain_FX_BOC_JUN23.pdf`), SNB-CIF 2023 discussion, Harvard PIFS June 2024 (slides `/discussion/AI_and_finance_PIFS_2024_June.pdf`), Berkeley RDI summit Aug 2023, Harvard Blockchain Conference keynote Apr 2023, BIS CIP symposium May 2017, NBER SI 2020/2021.

- [ ] **Step 2: Web sweep for 2025–2026 talks and press**

Procedure: WebSearch `"Gordon Liao" (keynote OR panel OR conference) 2025`, `"Gordon Liao" Circle interview 2025..2026`, `"Gordon Liao" Bloomberg OR WSJ OR "Financial Times" OR CoinDesk 2025..2026`; fetch the Project Syndicate contributor page for Gordon Liao and list all columns; check `circle.com/blog` for research posts authored by Gordon. Add findings to the respective files. Press seed from legacy site (Bloomberg Money Stuff 2022/2024 pieces, WSJ synthetic-dollar 2020, FT, Central Banking, PYMNTS, Nasdaq, Bloomberg FX 2023).

- [ ] **Step 3: Seed writing.yaml from legacy "Other writings"**

```yaml
- outlet: "Barron's"
  title: "Banks Dominate Payment Systems. The Risks Are All Too Clear"
  url: "https://www.barrons.com/articles/svb-circle-payments-stablecoins-crypto-8ffba659"
  date: "2023-03"
  kind: op-ed

- outlet: "CEPR VoxEU"
  title: "Payment versus trading stablecoins"
  url: "https://cepr.org/voxeu/columns/payment-versus-trading-stablecoins"
  date: "2023-03"
  kind: column
```
Plus: singleness-of-money note (`/discussion/Singleness_of_money.pdf`), Circle blog "TradFi, CeFi, DeFi" keynote essay, every Project Syndicate column found in Step 2.

- [ ] **Step 4: Verify URLs**

Run: `node scripts/check-urls.mjs src/data/talks.yaml src/data/press.yaml src/data/writing.yaml`
Expected: exit 0 (investigate WARNs as in Task 4).

- [ ] **Step 5: Commit**

```bash
git add src/data/talks.yaml src/data/press.yaml src/data/writing.yaml
git commit -m "site: talks, press, and writing data from legacy site + 2024-2026 sweep"
```

---

### Task 6: Draft `profile.yaml`

**Files:**
- Create: `src/data/profile.yaml`

**Interfaces:**
- Produces (consumed by Tasks 9–11): fields `role, bio_short, bio_long, current_focus, affiliations[], expertise[], speaking_topics[{title,blurb}], social{scholar,ssrn,linkedin,x,email}, headshot`.

- [ ] **Step 1: Write the profile draft**

```yaml
role: "Chief Economist & Head of Research · Circle (NYSE: CRCL)"
headshot: "/img/headshot_GL_4ss.jpg"

bio_short: >-
  Gordon Y. Liao is Chief Economist and Head of Research at Circle (NYSE: CRCL),
  issuer of USDC. An economist bridging traditional finance and digital assets,
  he has shaped monetary-policy analysis at the Federal Reserve Board, led research
  at Uniswap Labs, and managed fixed-income portfolios at the Harvard endowment.
  His research on stablecoins, exchange rates, and market structure appears in the
  Review of Financial Studies and the Journal of Financial Economics. He holds a
  Ph.D. in Economics and an A.B. in Applied Mathematics from Harvard.

bio_long: >-
  Gordon Y. Liao serves as Chief Economist and Head of Research at Circle
  (NYSE: CRCL), the issuer of USDC, where he leads economic research and R&D
  spanning stablecoin capital adequacy (the Token Capital Adequacy Framework),
  the design of Arc, an economically-secured Layer-1 blockchain, and post-quantum
  security for digital assets. His career bridges traditional finance and digital
  assets: he advised on short-term funding markets as a senior economist at the
  Federal Reserve Board of Governors, led research at Uniswap Labs, and managed
  fixed-income portfolios at Harvard Management Company. His academic research on
  exchange rates, credit markets, and stablecoins appears in the Review of
  Financial Studies, the Journal of Financial Economics, and the Journal of
  Financial Regulation, with co-authors including Robert Barro, Gita Gopinath,
  Robin Greenwood, and Samuel Hanson. He is a CEPR Research Affiliate, a Cornell
  FinTech Fellow, co-chair of the NABE Finance Roundtable, a World Economic Forum
  Agenda Contributor, and a Project Syndicate columnist. His work has been
  featured in Bloomberg, the Wall Street Journal, the Financial Times, and
  Barron's. He holds a Ph.D. and A.M. in Economics and an A.B. in Applied
  Mathematics from Harvard University.
  # ^ verify each affiliation/claim against Task 4-5 findings before commit;
  #   remove anything that cannot be sourced.

current_focus: >-
  Building the economic foundations of digital money: capital adequacy for
  stablecoins (TCAF), the design of Arc — an economically-secured Layer-1
  blockchain — and what tokenization means for the dollar system.

affiliations:
  - "CEPR Research Affiliate"
  - "Cornell FinTech Fellow"
  - "NABE Finance Roundtable Co-Chair"
  - "WEF Agenda Contributor"
  - "Project Syndicate Columnist"

expertise:
  - "Stablecoins & tokenized money"
  - "Monetary policy & the dollar system"
  - "Crypto market structure & DeFi"
  - "Payments & cross-border FX"
  - "Blockchain infrastructure & quantum risk"

speaking_topics:
  - title: "The Stablecoin Standard"
    blurb: "How payment stablecoins become reserve infrastructure for the digital dollar — from an economist who helped write the capital rules (TCAF)."
  - title: "From the Fed to DeFi"
    blurb: "What central banks, DeFi protocols, and public companies each get wrong about the other — lessons from working inside all three."
  - title: "Quantum Risk Is Crypto's Y2K"
    blurb: "The unaddressed vulnerability in blockchain security and the roadmap for post-quantum digital assets."

social:
  scholar: "https://scholar.google.com/citations?user=CjHJb7cAAAAJ&hl=en"
  ssrn: ""        # fill with SSRN author page found in Task 4 research; omit link at render if empty
  linkedin: "https://www.linkedin.com/in/gordonyuliao/"
  x: "https://twitter.com/gordonliao"
  email: "gliao@post.harvard.edu"
```

Note: `bio_long` must be fully written (no placeholder) before commit — draft it from the assembled data; affiliation list confirmed against the owner's Reputation project profile (April 2026).

- [ ] **Step 2: Build still passes**

Run: `npx js-yaml src/data/profile.yaml > /dev/null && echo YAML_OK`
Expected: `YAML_OK` (validates YAML syntax now; the file is first imported by a page in Task 9).

- [ ] **Step 3: Commit**

```bash
git add src/data/profile.yaml
git commit -m "site: profile data — bios, affiliations, expertise, speaking topics"
```

---

### Task 7: Research page + paper rendering

**Files:**
- Create: `src/components/PaperItem.astro`, `src/lib/format.js`, `src/pages/research.astro`

**Interfaces:**
- Consumes: `papers.yaml` (Task 4 schema), `Base.astro`.
- Produces: `PaperItem.astro` props `{ paper }`; `formatMonth("YYYY-MM"|"YYYY") → "Mon YYYY"|"YYYY"` in `src/lib/format.js`; both reused by Tasks 8–9.

- [ ] **Step 1: Format helper**

`src/lib/format.js`:
```js
export function formatMonth(d) {
  if (!d) return '';
  const [y, m] = String(d).split('-').map(Number);
  if (!m) return String(y);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}
```

- [ ] **Step 2: Paper component**

`src/components/PaperItem.astro`:
```astro
---
import { formatMonth } from '../lib/format.js';
const { paper } = Astro.props;
const l = paper.links ?? {};
const primary = l.journal || l.ssrn || l.pdf || '';
const linkRow = [
  l.ssrn && ['SSRN', l.ssrn],
  l.journal && ['Journal', l.journal],
  l.pdf && ['PDF', l.pdf],
  l.mirror && ['Mirror', l.mirror],
  l.slides && ['Slides', l.slides],
  l.video && ['Video', l.video],
  l.code && ['Code', l.code],
  l.data && ['Data', l.data],
].filter(Boolean);
---
<div class="item">
  <span class="title">
    {primary ? <a href={primary}>{paper.title}</a> : paper.title}
  </span>
  {paper.journal_tag && <span class="pill-journal">{paper.journal_tag}</span>}
  {paper.authors?.length > 0 && <span class="coauthors"> with {paper.authors.join(', ')}</span>}
  {paper.venue && <span class="coauthors"> — {paper.venue}{paper.status === 'published' ? '' : `, ${formatMonth(paper.date)}`}</span>}
  {paper.note && <p class="note">{paper.note}</p>}
  {(linkRow.length > 0 || paper.press?.length > 0) && (
    <div class="links">
      {linkRow.map(([label, href], i) => <><a href={href}>{label}</a>{(i < linkRow.length - 1 || paper.press?.length > 0) ? ' · ' : ''}</>)}
      {paper.press?.length > 0 && <>Press: {paper.press.map((p, i) => <><a href={p.url}>{p.outlet}</a>{i < paper.press.length - 1 ? ', ' : ''}</>)}</>}
    </div>
  )}
</div>
```

- [ ] **Step 3: Research page**

`src/pages/research.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import PaperItem from '../components/PaperItem.astro';
import papers from '../data/papers.yaml';

const byDate = (a, b) => String(b.date).localeCompare(String(a.date));
const groups = [
  ['Working papers', papers.filter(p => p.status === 'working').sort(byDate)],
  ['Publications', papers.filter(p => p.status === 'published').sort(byDate)],
  ['Technical reports', papers.filter(p => p.status === 'technical').sort(byDate)],
  ['Other manuscripts', papers.filter(p => p.status === 'other').sort(byDate)],
];
---
<Base title="Research — Gordon Y. Liao" description="Working papers and publications by Gordon Y. Liao on stablecoins, tokenization, exchange rates, monetary policy, and financial markets.">
  <h1>Research</h1>
  {groups.map(([label, list]) => list.length > 0 && (
    <section>
      <div class="section-label">{label}</div>
      {list.map(p => <PaperItem paper={p} />)}
    </section>
  ))}
</Base>
```

- [ ] **Step 4: Build and assert**

Run:
```bash
npm run build \
  && grep -c 'Arc Multi-Proposer' dist/research/index.html \
  && grep -c 'pill-journal' dist/research/index.html \
  && grep -o 'Technical reports' dist/research/index.html
```
Expected: build passes; counts ≥ 1; `Technical reports` printed.

- [ ] **Step 5: Commit**

```bash
git add src/components/PaperItem.astro src/lib/format.js src/pages/research.astro
git commit -m "site: research page rendering grouped papers from data"
```

---

### Task 8: Tokenisation topic view

**Files:**
- Create: `src/pages/tokenisation.astro`

**Interfaces:**
- Consumes: `papers.yaml`, `PaperItem.astro`, `Base.astro`.

- [ ] **Step 1: Page**

`src/pages/tokenisation.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import PaperItem from '../components/PaperItem.astro';
import papers from '../data/papers.yaml';

const byDate = (a, b) => String(b.date).localeCompare(String(a.date));
const has = (p, ...ts) => (p.topics ?? []).some(t => ts.includes(t));
const groups = [
  ['Payment stablecoins & tokenised money', papers.filter(p => has(p, 'stablecoins', 'tokenization')).sort(byDate)],
  ['Blockchain infrastructure', papers.filter(p => has(p, 'arc', 'quantum')).sort(byDate)],
  ['Automated market makers & on-chain FX', papers.filter(p => has(p, 'amm')).sort(byDate)],
];
---
<Base title="Tokenisation — Gordon Y. Liao" description="Gordon Y. Liao's research on payment stablecoins, tokenized money, DeFi, and blockchain infrastructure.">
  <h1>Tokenisation</h1>
  <p>Research on stablecoins, tokenised money, and the market infrastructure of digital assets — auto-collected from <a href="/research/">Research</a> by topic.</p>
  {groups.map(([label, list]) => list.length > 0 && (
    <section>
      <div class="section-label">{label}</div>
      {list.map(p => <PaperItem paper={p} />)}
    </section>
  ))}
</Base>
```

- [ ] **Step 2: Build and assert**

Run: `npm run build && grep -c 'Stable Value Tokens' dist/tokenisation/index.html && grep -c 'Arc Litepaper' dist/tokenisation/index.html`
Expected: both ≥ 1.

- [ ] **Step 3: Commit**

```bash
git add src/pages/tokenisation.astro
git commit -m "site: tokenisation topic view generated from paper tags"
```

---

### Task 9: Homepage (zones 1–5)

**Files:**
- Create: `src/pages/index.astro` (replaces temporary version)
- Modify: `src/styles/global.css` (append homepage styles)

**Interfaces:**
- Consumes: all five data files, `formatMonth`, `Base.astro`.

- [ ] **Step 1: Append homepage styles to `src/styles/global.css`**

```css
/* homepage */
.hero { display: flex; gap: 2.2rem; padding: 2.8rem 0 2.2rem; align-items: flex-start; }
.hero img { width: 150px; height: auto; border-radius: 3px; flex-shrink: 0; }
.hero .role { font-family: var(--sans); font-size: 0.85rem; color: var(--bronze); margin: 0.35rem 0 0; }
.hero .bio { max-width: 34rem; margin-top: 1rem; }
.hero .quick-links { font-family: var(--sans); font-size: 0.75rem; margin-top: 1rem; }
.hero .quick-links a { border-bottom: none; }
.affil-strip {
  font-family: var(--sans); font-size: 0.72rem; color: #6b6455; letter-spacing: 0.03em;
  border-top: 1px solid var(--hairline); border-bottom: 1px solid var(--hairline);
  padding: 0.8rem 0;
}
.affil-strip .lead { font-size: 0.6rem; letter-spacing: 0.15em; color: var(--label); }
.recent-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; font-family: var(--sans); }
.recent-grid > div { border-top: 2px solid var(--ink); padding-top: 0.6rem; }
.recent-grid .k { font-size: 0.6rem; letter-spacing: 0.15em; color: var(--label); }
.recent-grid .v { font-family: var(--serif); font-size: 0.85rem; line-height: 1.5; margin-top: 0.4rem; }
.see-all { font-family: var(--sans); font-size: 0.72rem; }
@media (max-width: 640px) {
  .hero { flex-direction: column; }
  .recent-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Homepage**

`src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import { formatMonth } from '../lib/format.js';
import profile from '../data/profile.yaml';
import papers from '../data/papers.yaml';
import talks from '../data/talks.yaml';
import press from '../data/press.yaml';
import writing from '../data/writing.yaml';

const byDate = (a, b) => String(b.date).localeCompare(String(a.date));
const featured = papers.filter(p => p.featured).sort(byDate).slice(0, 4);
const latestTalk = [...talks].sort(byDate)[0];
const latestPress = [...press].sort(byDate)[0];
const latestWriting = [...writing].sort(byDate)[0];
const s = profile.social;
const quick = [
  ['Google Scholar', s.scholar], ['SSRN', s.ssrn], ['LinkedIn', s.linkedin],
  ['X', s.x], ['Email', `mailto:${s.email}`],
].filter(([, href]) => href);
---
<Base title="Gordon Y. Liao" description={profile.bio_short.slice(0, 155)}>
  <section class="hero">
    <img src={profile.headshot} alt="Gordon Y. Liao" width="150" />
    <div>
      <h1>Gordon Y. Liao</h1>
      <p class="role">{profile.role}</p>
      <p class="bio">{profile.bio_short}</p>
      <p class="quick-links">{quick.map(([label, href], i) => <>{i > 0 && ' · '}<a href={href}>{label}</a></>)}</p>
    </div>
  </section>

  <div class="affil-strip"><span class="lead">AFFILIATIONS&ensp;</span>{profile.affiliations.join(' · ')}</div>

  <section>
    <div class="section-label">Current focus</div>
    <p style="max-width: 38rem;">{profile.current_focus}</p>
  </section>

  <section>
    <div class="section-label">Selected work</div>
    {featured.map(p => (
      <div class="item">
        <span class="title"><a href={p.links?.journal || p.links?.ssrn || p.links?.pdf}>{p.title}</a></span>
        {p.journal_tag && <span class="pill-journal">{p.journal_tag}</span>}
        {p.venue && !p.journal_tag && <span class="coauthors"> — {p.venue}</span>}
        {p.note && <span class="coauthors"> — {p.note}</span>}
      </div>
    ))}
    <p class="see-all"><a href="/research/">All research →</a></p>
  </section>

  <section>
    <div class="section-label">Recent</div>
    <div class="recent-grid">
      {latestTalk && <div><div class="k">SPEAKING</div><div class="v">"{latestTalk.title}" — {latestTalk.event} · {formatMonth(latestTalk.date)}</div></div>}
      {latestPress && <div><div class="k">IN THE PRESS</div><div class="v"><a href={latestPress.url}>{latestPress.headline}</a> — {latestPress.outlet}</div></div>}
      {latestWriting && <div><div class="k">WRITING</div><div class="v"><a href={latestWriting.url}>{latestWriting.title}</a> — {latestWriting.outlet}</div></div>}
    </div>
  </section>
</Base>
```

- [ ] **Step 3: Build and assert**

Run:
```bash
npm run build \
  && grep -c 'CEPR Research Affiliate' dist/index.html \
  && grep -c 'Current focus' dist/index.html \
  && grep -c 'class="item"' dist/index.html
```
Expected: affiliations ≥ 1; Current focus ≥ 1; item count = 4.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/styles/global.css
git commit -m "site: homepage with hero, affiliations, focus, selected work, recent strip"
```

---

### Task 10: Speaking page + print one-sheet

**Files:**
- Create: `src/pages/speaking.astro`
- Modify: `src/styles/global.css` (append print styles)

**Interfaces:**
- Consumes: `talks.yaml`, `profile.yaml` (`speaking_topics`, `bio_short`, `social.email`, `headshot`), `formatMonth`.

- [ ] **Step 1: Page**

`src/pages/speaking.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import { formatMonth } from '../lib/format.js';
import profile from '../data/profile.yaml';
import talks from '../data/talks.yaml';

const byDate = (a, b) => String(b.date).localeCompare(String(a.date));
const sorted = [...talks].sort(byDate);
const KIND = { keynote: 'Keynote', panel: 'Panel', invited: 'Invited talk', discussion: 'Discussion' };
---
<Base title="Speaking — Gordon Y. Liao" description="Talk topics and selected speaking engagements — stablecoins, digital assets, monetary policy. Booking information for conferences and media.">
  <h1>Speaking</h1>
  <p style="max-width: 38rem;">{profile.bio_short}</p>

  <div class="section-label">Talk topics</div>
  {profile.speaking_topics.map(t => (
    <div class="item">
      <span class="title">{t.title}</span>
      <p class="note">{t.blurb}</p>
    </div>
  ))}

  <div class="section-label">Selected engagements</div>
  {sorted.map(t => (
    <div class="item">
      <span class="title">{t.event}</span>
      <span class="coauthors"> · {formatMonth(t.date)}{t.location ? ` · ${t.location}` : ''}</span>
      <p class="note">{KIND[t.kind] ?? t.kind}: “{t.title}”</p>
      {(t.links?.video || t.links?.slides) && (
        <div class="links">
          {t.links.video && <a href={t.links.video}>Video</a>}{t.links.video && t.links.slides && ' · '}
          {t.links.slides && <a href={t.links.slides}>Slides</a>}
        </div>
      )}
    </div>
  ))}

  <div class="section-label">Booking</div>
  <p>For speaking inquiries: <a href={`mailto:${profile.social.email}`}>{profile.social.email}</a>. Print this page for a one-page speaker sheet.</p>
</Base>
```

- [ ] **Step 2: Append print stylesheet to `src/styles/global.css`**

```css
@media print {
  .site-nav .links, .site-footer, .statcounter { display: none; }
  body { font-size: 10.5pt; }
  .item { break-inside: avoid; padding: 0.35rem 0; }
  a { color: inherit; border-bottom: none; }
  .section-label { margin: 1.1rem 0 0.4rem; }
}
```

- [ ] **Step 3: Build and assert**

Run: `npm run build && grep -c 'Talk topics' dist/speaking/index.html && grep -c 'Booking' dist/speaking/index.html`
Expected: both ≥ 1.

- [ ] **Step 4: Commit**

```bash
git add src/pages/speaking.astro src/styles/global.css
git commit -m "site: speaking page with topics, engagements, print one-sheet"
```

---

### Task 11: Media, Writing, CV, and 404 pages

**Files:**
- Create: `src/pages/media.astro`, `src/pages/writing.astro`, `src/pages/cv.astro`, `src/pages/404.astro`

**Interfaces:**
- Consumes: `press.yaml`, `writing.yaml`, `profile.yaml`, `formatMonth`.

- [ ] **Step 1: Media page**

`src/pages/media.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import { formatMonth } from '../lib/format.js';
import profile from '../data/profile.yaml';
import press from '../data/press.yaml';

const byDate = (a, b) => String(b.date).localeCompare(String(a.date));
const sorted = [...press].sort(byDate);
const years = [...new Set(sorted.map(p => String(p.date).slice(0, 4)))];
---
<Base title="Media — Gordon Y. Liao" description="Press mentions and media appearances. Expertise: stablecoins, digital assets, monetary policy, payments. Contact for journalists.">
  <h1>Media</h1>
  <div class="section-label">Commentary areas</div>
  <p style="max-width: 38rem;">{profile.expertise.join(' · ')}</p>
  <p class="see-all">Media inquiries: <a href={`mailto:${profile.social.email}`}>{profile.social.email}</a> · <a href={profile.headshot} download>Download headshot</a></p>

  {years.map(y => (
    <section>
      <div class="section-label">{y}</div>
      {sorted.filter(p => String(p.date).startsWith(y)).map(p => (
        <div class="item">
          <span class="title"><a href={p.url}>{p.headline}</a></span>
          <span class="coauthors"> — {p.outlet}, {formatMonth(p.date)}</span>
        </div>
      ))}
    </section>
  ))}
</Base>
```

- [ ] **Step 2: Writing page**

`src/pages/writing.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import { formatMonth } from '../lib/format.js';
import writing from '../data/writing.yaml';

const byDate = (a, b) => String(b.date).localeCompare(String(a.date));
const sorted = [...writing].sort(byDate);
---
<Base title="Writing — Gordon Y. Liao" description="Op-eds, columns, and commentary by Gordon Y. Liao — Project Syndicate, Barron's, VoxEU — on stablecoins, digital assets, and monetary policy.">
  <h1>Writing</h1>
  <p style="max-width: 38rem;">Op-eds, columns, and commentary. Academic papers live under <a href="/research/">Research</a>.</p>
  {sorted.map(w => (
    <div class="item">
      <span class="title"><a href={w.url}>{w.title}</a></span>
      <span class="coauthors"> — {w.outlet}, {formatMonth(w.date)}</span>
    </div>
  ))}
</Base>
```

- [ ] **Step 3: CV page**

`src/pages/cv.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import profile from '../data/profile.yaml';
---
<Base title="CV — Gordon Y. Liao" description="Curriculum vitae and short bio of Gordon Y. Liao — Chief Economist and Head of Research at Circle, Harvard Ph.D. economist.">
  <h1>Curriculum Vitae</h1>
  <p><a href="/GordonLiaoCV.pdf">Download CV (PDF)</a></p>
  <div class="section-label">Short bio</div>
  <p style="max-width: 38rem;">{profile.bio_long}</p>
</Base>
```

- [ ] **Step 4: 404 page**

`src/pages/404.astro`:
```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Page not found — Gordon Y. Liao" description="Page not found.">
  <h1>Page not found</h1>
  <p>Try the <a href="/">homepage</a> or <a href="/research/">research</a>.</p>
</Base>
```

- [ ] **Step 5: Build and assert**

Run: `npm run build && node scripts/check-dist.mjs`
Expected: `parity OK` — all pages and assets now present.

- [ ] **Step 6: Commit**

```bash
git add src/pages/media.astro src/pages/writing.astro src/pages/cv.astro src/pages/404.astro
git commit -m "site: media, writing, cv, and 404 pages"
```

---

### Task 12: SEO finish — JSON-LD, robots.txt

**Files:**
- Create: `src/components/PersonSchema.astro`, `public/robots.txt`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `profile.yaml`. Adapted from the legacy `docs/_includes/custom-head.html` JSON-LD.

- [ ] **Step 1: JSON-LD component**

`src/components/PersonSchema.astro`:
```astro
---
import profile from '../data/profile.yaml';
const schema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Gordon Y. Liao',
  url: 'https://gliao.xyz',
  image: `https://gliao.xyz${profile.headshot}`,
  jobTitle: 'Chief Economist and Head of Research',
  worksFor: { '@type': 'Organization', name: 'Circle', url: 'https://www.circle.com' },
  alumniOf: [
    { '@type': 'EducationalOrganization', name: 'Harvard University', description: 'Ph.D. and A.M. in Economics' },
    { '@type': 'EducationalOrganization', name: 'Harvard College', description: 'A.B. in Applied Mathematics' },
  ],
  memberOf: profile.affiliations.map(a => ({ '@type': 'Organization', name: a })),
  sameAs: [profile.social.x, profile.social.linkedin, profile.social.scholar, profile.social.ssrn].filter(Boolean),
  knowsAbout: ['Stablecoins', 'Decentralized Finance', 'Monetary Policy', 'Tokenization', 'Payment Systems', 'Exchange Rate Determination', 'Financial Stability', 'Blockchain Infrastructure', 'USDC'],
};
---
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

- [ ] **Step 2: Include on homepage**

In `src/pages/index.astro` frontmatter add `import PersonSchema from '../components/PersonSchema.astro';` and place `<PersonSchema />` immediately after `<Base …>`'s opening tag content (first child inside the Base slot).

- [ ] **Step 3: robots.txt**

`public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://gliao.xyz/sitemap-index.xml
```

- [ ] **Step 4: Build and validate JSON-LD**

Run:
```bash
npm run build \
  && node -e "
const html = require('node:fs').readFileSync('dist/index.html','utf8');
const m = html.match(/<script type=\"application\/ld\+json\">(.*?)<\/script>/s);
const j = JSON.parse(m[1]);
if (j['@type'] !== 'Person' || !j.sameAs.length) throw new Error('bad schema');
console.log('JSONLD_OK', j.sameAs.length, 'profiles');
"
```
Expected: `JSONLD_OK` with ≥ 3 profiles.

- [ ] **Step 5: Commit**

```bash
git add src/components/PersonSchema.astro src/pages/index.astro public/robots.txt
git commit -m "site: JSON-LD person schema and robots.txt"
```

---

### Task 13: Full verification — internal link check

**Files:**
- Modify: `scripts/check-dist.mjs` (append link crawl)

- [ ] **Step 1: Extend the checker — append below the existing parity code (before the final console.log, replacing the exit logic)**

Full final file `scripts/check-dist.mjs`:
```js
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist', import.meta.url));

const REQUIRED_ASSETS = [
  'GordonLiaoCV.pdf', 'google149ed543bf9df5bc.html', 'CNAME',
  'data/spx_disaster_prob_march2021update.csv',
  'papers/CLVProject_WP_v5.pdf', 'papers/CLVProject_WP_v8.pdf',
  'papers/CreditCIP_JFE.pdf', 'papers/HedgingChannelofExchangeRate_Latest.pdf',
  'papers/Liao_OCC_Tokenization_Confernece.pdf', 'papers/On-Chain_FX_BOC_JUN23.pdf',
  'papers/US_Banks_Global_Liquidity.pdf',
  'papers/arc_litepaper_2025.pdf', 'papers/circle_quantum_roadmap.pdf',
  'discussion/AI_and_finance_PIFS_2024_June.pdf',
  'discussion/CooperativeAI_and_Decentralized_Trust.pdf',
  'discussion/Discussion_Stablecoins_Short_term_funding_paper.pdf',
  'discussion/Discussion_Terra_Luna_Crash.pdf',
  'discussion/Singleness_of_money.pdf',
  'img/gordon_headshot_1.jpg', 'img/gordon_headshot_2.jpg', 'img/gordon_liao_3.jpg',
  'img/headshot_GL_4ss.jpg', 'img/headshot.jpg',
];
const REQUIRED_PAGES = [
  'index.html', '404.html',
  'research/index.html', 'speaking/index.html', 'media/index.html',
  'writing/index.html', 'cv/index.html', 'tokenisation/index.html',
  'sitemap-index.xml',
];

let failures = [];
for (const p of [...REQUIRED_ASSETS, ...REQUIRED_PAGES]) {
  if (!existsSync(join(DIST, p))) failures.push(`missing: ${p}`);
}

// crawl internal links in every built HTML file
function* htmlFiles(dir) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) yield* htmlFiles(full);
    else if (e.endsWith('.html')) yield full;
  }
}
for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const target = m[1];
    const candidates = [
      join(DIST, target),
      join(DIST, target, 'index.html'),
      join(DIST, target.replace(/\/$/, '') + '.html'),
    ];
    if (!candidates.some(c => existsSync(c))) {
      failures.push(`broken internal link ${target} in ${file.slice(DIST.length)}`);
    }
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('check-dist OK: parity + internal links');
```

- [ ] **Step 2: Run full verification**

Run: `npm run build && node scripts/check-dist.mjs && node scripts/check-urls.mjs src/data/*.yaml`
Expected: `check-dist OK` and URL checker exit 0. Fix any broken internal links (typically data-file paths) before continuing.

- [ ] **Step 3: Commit**

```bash
git add scripts/check-dist.mjs
git commit -m "site: full parity + internal link verification"
```

---

### Task 14: Owner preview gate — STOP

**Files:** none.

- [ ] **Step 1: Serve the built site**

Run: `npm run preview` (serves `dist/` at http://localhost:4321)

- [ ] **Step 2: Owner review**

Present to the owner: the preview URL, a summary of every drafted content item (papers added/updated, talks, press, writing, bios) with anything flagged as unverifiable, and the reminder that approval triggers cutover (Tasks 15–16), which changes the live site.

**STOP. Do not proceed to Task 15 without explicit owner approval of the previewed site.** Incorporate any requested content/design changes and re-run Task 13 verification before asking again.

---

### Task 15: Cutover — deploy workflow + Pages source flip (POST-APPROVAL ONLY)

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Checkpoint legacy uncommitted edits (docs/ has local modifications that predate this project — preserve them in history before anything else)**

```bash
git add docs/ && git commit -m "site: checkpoint legacy Jekyll site state before cutover"
```

- [ ] **Step 2: Deploy workflow**

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

```bash
git add .github/workflows/deploy.yml
git commit -m "site: GitHub Actions deploy workflow"
```

- [ ] **Step 3: Flip Pages source to GitHub Actions BEFORE pushing**

```bash
gh api --method PUT repos/goliao/goliao.github.io/pages -f build_type=workflow
gh api repos/goliao/goliao.github.io/pages --jq '.build_type'
```
Expected: `workflow`.

- [ ] **Step 4: Push and watch the deploy**

```bash
git push origin master
gh run watch --exit-status
```
Expected: run completes green (build + deploy jobs).

- [ ] **Step 5: Smoke check (retry up to ~2 min for CDN propagation)**

```bash
curl -sI https://gliao.xyz | head -1
curl -sI https://gliao.xyz/papers/CreditCIP_JFE.pdf | head -1
curl -sI https://gliao.xyz/research/ | head -1
curl -s https://gliao.xyz | grep -c 'Current focus'
```
Expected: three `200`s and grep ≥ 1 (new site is live). If anything fails, revert: `gh api --method PUT repos/goliao/goliao.github.io/pages -f build_type=legacy -f 'source[branch]=master' -f 'source[path]=/docs'` restores the Jekyll site.

---

### Task 16: Remove legacy site + update project docs

**Files:**
- Delete: `docs/` (entire tree)
- Modify: `CLAUDE.md`

- [ ] **Step 1: Remove Jekyll site**

```bash
git rm -r --quiet docs && git commit -m "site: remove legacy Jekyll site (replaced by Astro; history preserved)"
```

- [ ] **Step 2: Rewrite `CLAUDE.md`**

Replace the Commands and Site Structure sections to reflect: Astro at repo root; `npm install`, `npm run dev` (http://localhost:4321), `npm run build`, `node scripts/check-dist.mjs`, `node scripts/check-urls.mjs src/data/*.yaml`; content lives in `src/data/*.yaml` (papers/talks/press/writing/profile — adding an entry is the standard update); pages in `src/pages/`, layout `src/layouts/Base.astro`, styles `src/styles/global.css`; static assets in `public/` (URL parity with legacy site must be preserved); deploys automatically on push to `master` via `.github/workflows/deploy.yml`; navigation is hardcoded in `Base.astro`.

```bash
git add CLAUDE.md && git commit -m "docs: update CLAUDE.md for Astro stack"
```

- [ ] **Step 3: Push and final smoke check**

```bash
git push origin master
gh run watch --exit-status
curl -sI https://gliao.xyz | head -1
curl -sI https://gliao.xyz/GordonLiaoCV.pdf | head -1
```
Expected: green run; both `200`.

---

## Self-Review Notes

- **Spec coverage:** goals→Tasks 1–13; site map & zones→Tasks 7–12; content model→Tasks 4–6; content refresh incl. 3 Arc items→Tasks 4–5; visual system→Tasks 1, 9, 10; URL parity→Tasks 3, 13; SEO→Tasks 2, 12; build/deploy/cutover→Task 15; verification→Tasks 13–15; publishing gate→Task 14; maintenance docs→Task 16; open items (CV PDF, headshot) surfaced at Task 14 review.
- Legacy `/bio.md` URL is not preserved (folded into `/cv/`) — accepted in spec §3 (not in parity list).
- `feed.xml` intentionally dropped (spec non-goal).
