# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Professional coaching website for Constanze Hevelke (German language). Static site built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, no dependencies.

## Development

### Dev Server

```bash
# Start via serve.py (preferred)
python serve.py
# Or directly
python -m http.server 8080
```

Access at `http://localhost:8080`. Preview tool config is in `.claude/launch.json` (name: `coaching-website`).

There is no build step, linting, or test suite. Changes are verified visually via the preview server.

### Project Structure

- `index.html` — Main single-page site with all sections (Hero, About, Angebote, Methoden, Quote, Testimonials, Instagram, Kontakt, Footer)
- `impressum.html` / `datenschutz.html` — Legal pages (German law requirement)
- `css/style.css` — Main stylesheet with CSS custom properties design system
- `css/legal.css` — Styles for legal pages only
- `js/main.js` — Interactivity: navbar scroll effect, mobile menu, smooth scroll, fade-in animations, form handling
- `serve.py` — Simple Python HTTP server

## Architecture

**Single-page layout** with section-based navigation (`#about`, `#angebote`, `#methoden`, `#testimonials`, `#kontakt`). No routing or SPA framework.

**Design system** uses CSS custom properties in `:root` for colors, typography, shadows, radii, and transitions. The color palette is sage/forest green (`--color-primary: #6B9E7E`). Typography: Cormorant Garamond (headings) + Quicksand (body), loaded from Google Fonts.

**Responsive breakpoints**: 1024px (tablet), 768px (mobile with hamburger nav), 480px (small mobile).

**Contact form** is client-side only — shows a success message but does not actually send data. Needs backend integration before going live.

## Placeholder Content

Many values are marked with `[X]` or `[Stadt, PLZ]` and need to be filled in:
- Stats (years experience, client count, coaching hours)
- Coaching package details (session count, weeks)
- Contact info (phone, address)
- Images (currently using dashed-border placeholder divs)
- Impressum/Datenschutz legal details

## Pending Tasks

- **Inhalte vom Instagram-Profil übernehmen**: Bio-Text, Angebote, Highlight-Themen von @constanze.hevelke_coaching einpflegen (automatisches Auslesen nicht möglich, Nutzerin muss Inhalte manuell bereitstellen)
- **Kontaktformular-Backend**: Aktuell nur client-side Simulation, benötigt echte Backend-Anbindung (z.B. Formspree, Netlify Forms, oder eigener Server)
- **Hosting/Deployment**: Nutzerin hat bereits eine Domain, Hosting-Setup steht noch aus
- **Echte Bilder**: Platzhalter-Divs durch echte Fotos ersetzen
- **Rechtliche Texte**: Impressum und Datenschutzerklärung mit echten Daten ausfüllen

## Key Conventions

- All content is in German
- Colors must stay consistent with the sage green branding from the Instagram profile (@constanze.hevelke_coaching)
- Primary color is sage green (`--color-primary: #6B9E7E`) — do NOT change this, it was specifically chosen to match the Instagram branding
- Inline SVG icons throughout (no icon library)
- Fade-in animations via Intersection Observer on scroll
- Target audience: selbstständige / weibliche Unternehmerinnen (female entrepreneurs)
- Coaching topics: Branding, Business-Prozesse, Kreativität, Unternehmenswachstum
