# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the Astro-based personal site for Gordon Y. Liao, deployed to https://gliao.xyz via GitHub Actions → GitHub Pages. The site is fully static (zero client-side JavaScript except the Statcounter analytics snippet) and data-driven: all mutable content lives in YAML files.

## Commands

```bash
# Install dependencies
npm install

# Local development server (http://localhost:4321)
npm run dev

# Build static site to dist/
npm run build

# Serve the built dist/ (what production serves)
npm run preview

# Verify: URL parity + internal links over dist/ (run after build)
node scripts/check-dist.mjs

# Verify: every external URL in the data files resolves
node scripts/check-urls.mjs src/data/*.yaml
```

## Site Structure

- `src/data/*.yaml` — **all content lives here**; routine updates only touch these:
  - `papers.yaml` — research (status: working | published | technical | other; topic tags drive `/tokenisation/`; `featured: true` on exactly 4 papers drives homepage Selected Work)
  - `talks.yaml` — speaking engagements (kind: keynote | panel | invited | discussion)
  - `press.yaml` — media & podcast appearances
  - `writing.yaml` — op-eds, columns, explainers
  - `profile.yaml` — bios, affiliations, expertise, speaking topics, social links
- `src/pages/` — one `.astro` file per page (index, research, speaking, media, writing, cv, tokenisation, 404)
- `src/layouts/Base.astro` — shared head/nav/footer; navigation is hardcoded here
- `src/components/` — `PaperItem.astro` (paper rendering), `PersonSchema.astro` (JSON-LD)
- `src/styles/global.css` — design tokens ("Refined Academic": paper #FFFDF9, ink #1C1A17, bronze #8A6D3B) + print stylesheet for the speaking one-sheet
- `public/` — static assets served at their exact paths: `papers/`, `discussion/`, `data/`, `img/`, `GordonLiaoCV.pdf`, `CNAME`
- `cv-src/GordonLiaoCV.tex` — LaTeX CV source; build with `pdflatex` (2 passes) and copy the PDF to `public/GordonLiaoCV.pdf`
- `.github/workflows/deploy.yml` — builds and deploys on every push to `master`

## Key Conventions

**Adding content:** "Add this paper/talk/press hit" = add one YAML block to the matching data file. Homepage Recent strip, topic views, and page lists update automatically at build.

**YAML dates:** always quoted strings — `"YYYY-MM"` or `"YYYY"` (unquoted dates get coerced to Date objects by the YAML parser and break sorting).

**URL parity:** never move or rename anything under `public/papers/`, `public/discussion/`, `public/data/`, or `GordonLiaoCV.pdf` — external sites and search results link to those exact paths. `scripts/check-dist.mjs` enforces the required list; add new assets to it.

**Content verification:** every entry must cite a real, verified URL. Never attribute articles or affiliations without confirming authorship (owner rule from the Reputation project).

**Deploys:** push to `master` = deploy to gliao.xyz. Nothing ships without Gordon's explicit approval of a preview. A failed build leaves the live site untouched. Rollback = `git revert` + push.

**Specs and plans** live in root-level `specs/` and `plans/` (public repo — keep wording neutral).
