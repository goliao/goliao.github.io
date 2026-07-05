# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Jekyll-based personal academic/professional website for Gordon Y. Liao, deployed via GitHub Pages to https://gliao.xyz. All web source files live in the `docs/` directory.

## Commands

All commands must be run from the `docs/` directory:

```bash
cd docs

# Install dependencies
bundle install

# Local development server (available at http://localhost:4000)
bundle exec jekyll serve

# Build static site
bundle exec jekyll build
```

Note: `_config.yml` changes require restarting the dev server — live reload does not apply to config changes.

## Site Structure

- `docs/_config.yml` — site settings, navigation order (`header_pages`), plugins
- `docs/index.markdown` — homepage (bio, education, links)
- `docs/research.md` — publications and working papers list
- `docs/academicCV.md` — CV page
- `docs/tokenisation_defi.md` — topic-specific page
- `docs/bio.md` — short bio
- `docs/papers/` — PDF files for papers and slides
- `docs/discussion/` — PDF files for discussion papers
- `docs/data/` — data files (CSV)
- `docs/img/` — images including headshots
- `docs/_layouts/` — custom layout overrides (default, home, page, post)
- `docs/_includes/` — custom includes (header, footer, custom-head)

## Key Conventions

**Navigation:** Pages shown in the header are controlled by `header_pages` in `_config.yml`. To add a new page to navigation, add its filename to that list.

**Theme:** Uses the `minima` theme with custom layout overrides in `_layouts/`. The header template hides the site title and shows only navigation links.

**Analytics:** Statcounter tracking code is embedded directly in `docs/_layouts/default.html`.

**Linking to local PDFs:** Papers and slides are referenced with relative paths like `../papers/filename.pdf` or `papers/filename.pdf` from within markdown files.

**Front matter:** All pages use Jekyll front matter with `layout`, `title`, and `permalink` fields.
