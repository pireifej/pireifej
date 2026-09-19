# Paul Ireifej Portfolio Website

## Overview
This portfolio website showcases Paul Ireifej's professional work as a public speaker, workshop facilitator, and the founder of Young Speakers Academy in Monmouth County, NJ. It serves as a comprehensive online presence, featuring services, portfolio projects across technical, speech, workshop, and running categories, an about section, details on workshops, a blog, and contact information. The project aims to effectively market Paul's expertise and provide valuable resources to his audience, including interactive AI and public speaking workshop materials.

## User Preferences
- Static portfolio website
- Express.js for serving files
- Port 5000 for frontend
- Template-based architecture for reusable components
- No emojis in slides or copy unless explicitly requested
- Casual, non-technical tone in chat replies
- Never regenerate PDF/PPTX exports unless explicitly asked
- Monmouth County cards and deck controls link to pre-generated PPTX downloads in `exports/`. These image-based exports are admin-protected and must be regenerated with `node scripts/export-pptx.js` when an updated export is explicitly requested; slide edits alone do not refresh them.

## How-To: Export Slide Decks to PPTX (for email / Google Drive)
Use this whenever the user asks for a PowerPoint version of any slide deck on the site (Reveal.js decks and the static print-ready Monmouth County public-speaking deck). Output is image-based PPTX (one image per slide) — opens in PowerPoint, Google Slides, Keynote. Email-safe (~5-10 MB per deck).

**Script:** `scripts/export-pptx.js` (already in repo). Edit the `DECKS` array at the top to add/remove decks — each entry needs `{ url, title, out }`.

**Run:**
```bash
# 1. Make sure Portfolio Server workflow is running on :5000
# 2. Install deps if missing (they're not in package.json by design — only needed for exports):
npm ci
# 3. Run the export:
node scripts/export-pptx.js
```

**Output:** `exports/<deck-name>.pptx` (16:9 PPT layout). The static public-speaking slides are captured at their fixed 1280×720 dimensions; the active-listening Reveal deck remains 1920×1080.

**Key technical bits:**
- Uses `puppeteer-core` + system Chromium at `/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium`
- Navigates each Reveal.js slide via `Reveal.slide(i)`, screenshots the 1920×1080 viewport, and embeds each full-bleed image into a `pptxgenjs` slide. The static public-speaking deck instead captures `.print-slide#slide-1` through `.print-slide#slide-14` at exactly 1280×720.
- 600ms wait per slide for animations/orbs to settle
- Background color `#0F0E2E` set behind images (matches dark theme so any rounding gaps don't show white)

**For PDF exports** (also email-friendly): use the same puppeteer flow but with `?print-pdf` query param + `page.pdf()`, then compress with `gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook` (Ghostscript at `/nix/store/.../ghostscript-with-X-10.05.1/bin/gs`). The `/ebook` preset typically shrinks 49 MB → 1-2 MB.

## System Architecture
The project is structured as a static HTML/CSS/JavaScript frontend served by an Express.js server.
- **Frontend**: Utilizes static HTML, CSS, and JavaScript for a responsive and engaging user experience. UI/UX design emphasizes a clean, professional aesthetic, with consistent theming across various workshop modules (e.g., purple/cyan for AI workshops, green gradient for Young Speakers Academy). Interactive elements like click-to-reveal answers, flip cards, and custom timers are integrated into workshop slides.
- **Backend**: An Express.js server handles serving static files and implements a custom template system for component inclusion (e.g., `{{preloader}}`, `{{header}}`). Dynamic content, such as blog posts and portfolio items, is loaded from JSON files.
- **Content Management**: Workshop content, including detailed slide presentations and homework assignments, is structured across dedicated HTML files. This modular approach allows for easy expansion and updates of educational materials.
- **Portfolio Structure**: The portfolio is categorized into dedicated pages for technical work, speech competitions, workshops, and running races, enhancing navigation and content organization.
- **SEO**: Comprehensive SEO measures are implemented, including meta tags, Schema.org structured data, Open Graph, Twitter Cards, XML sitemap, and `robots.txt`, to optimize visibility for local searches (e.g., "public speaker Monmouth County NJ").

## Recent Changes (May 2, 2026)
### Monmouth County Government Audience — Presentation Modules
- Folder **/monmouth-county/** contains a static 14-slide public-speaking intensive and a 10-slide Reveal.js active-listening deck for county government audiences (~70+ people in-room).
- New shared stylesheet **/shared-assets/monmouth-style.css** — entirely new "Canva sticker" aesthetic (light/pastel, opposite of the dark AI-workshop palette): coral/peach + sunshine yellow + pink for Public Speaking (`body.theme-coral`), mint/lavender + soft pink for Active Listening (`body.theme-mint`). Quicksand body / Montserrat headers (Google Fonts), 25px rounded corners, glassmorphism `.canva-card`, and a `subtle-float` keyframe animation (5–10px bob) applied to inline SVG `.sticker` decorations (mic, ear, speech bubble, heart, star, lightbulb, mirror, pause icon, abstract people). Reveal.js setup mirrors Session 4 architecture (disableLayout, full-viewport sections, hash routing, slideNumber c/t, arrow + WASD keyboard mapping, slide transition).
- **monmouth-county/public-speaking.html** — "Find Your Voice / Speak So Others Will Listen," a static, print-ready 14-slide, 50-minute interactive intensive (fixed 1280×720 `.print-slide` containers): Title → Origin Story / Pattern Interrupt → Somatic & Vocal Activation → Mental Reframe → Pair Friction Warm-Up → Room-Wide Story Dash → Applied Improv in Tough Meetings → Rapid-Thinking Framework divider → PREP Model → Partner PREP Sprint → Hot-Seat Interruption Coaching → 2.0-Second Micro-Pause → Scripted Oratory vs. Spontaneous Presence comparison → Daily Practice closing and Paul Ireifej contact. The print layout supports browser Print / Save to PDF and image-based PPTX export.
- **monmouth-county/active-listening.html** — "Listening First: Building Better Connections at Work" (mint theme, 10 slides): Title → Hearing vs Listening → Common Roadblocks (Rehearsing/Distractions/Filtering) → Reading the Unspoken (Eyes/Hands/Tone/Pauses) → The Mirror Technique (Paraphrase → Reflect → Confirm) → **GROUP EXERCISE: The Telephone Improv** (Yes-And chain) → Empathy in Action → The Power of the Pause → Better Meetings → Closing "Should Call Paul." with contact + Q&A.
- Reusable CSS components: `.canva-card` (glassmorphism, 25px radius, 6 solid color variants), `.sticker` + `subtle-float` / `subtle-float-alt` / `float-slow` / `float-fast` keyframe animations, `.exercise-card` (warm gradient + dashed border + timer-pill), `.big-quote`, `.num-badge` (numbered step circles), `.pill` (6 color variants), `.deco-blob` (soft background blobs), `.slide-title` / `.slide-closing` layouts.
- **slides-hub.html** — primary categories are Public Speaking, AI Workshops, and Professional Workshops; unrelated Fire Emblem content remains under Side Projects.
- **public-speaking-hub.html** — youth-only grouping: Young Speakers Academy and School Career Talks.
- **professional-workshops-hub.html** — admin-protected hub with organization dividers: United Teletech Credit Union (Operational Resilience), CFCA (Fraud Resilience Testing), Monmouth County Prosecutor’s Office (One Agency; Leadership & Accountability), and Monmouth County Sessions (Find Your Voice / Speak So Others Will Listen; Listening First; De-escalation & Diplomacy Under Pressure). The Monmouth cards retain their Canva sticker styling and print action. Resilience Toolkit is homework linked from the final Operational Resilience slide, not a hub card.
- **monmouth-county/de-escalation-diplomacy.html** — static 14-slide, 50-minute mint/lavender deck with fixed 1280×720 slides and Print / Save to PDF. Reuses Monmouth brand styles and the existing print action script. The PPTX exporter supports `--de-escalation` when an export is explicitly requested.

## Recent Changes (April 28, 2026)
### AI Workshop Session 5 — "The Future of Thinking"
- Created **session-5/index.html** — 17-slide Reveal.js 5.x deck matching Session 4's exact look/feel (dark navy/purple gradient, #00d4ff cyan + #6c5ce7 purple accents, Inter font, ai-orb, hl/hlp/hlw/hlr/hlg color spans, content-slide layout). Visual-first, bullets only where needed.
- Slides: Title → Roadmap (4 icon-tiles) → **Reality Check (5 flippable stat cards** — front shows displacement stat, click to rotate and reveal short list of specific job categories cut at each: Oracle 12K+, Amazon 30K, Intel 24K, Chegg 45%, Block 6K cap) → What They're NOT Cutting → Safe Zones (4 industries + 3 trait pills) → Paul's Take (clickable Old→New Contract flip card) → Purpose Economy (hero quote + 3 contribution tiles) → Education Crisis ("Information FREE / Wisdom EXPENSIVE") → Editor-in-Chief mindset (Old vs New + click-to-reveal takeaway) → Engagement Trap (danger card + Engagement→Retention→Revenue→Harm step-flow) → The Fix (Walled Gardens + Verification) → Group Brainstorm (3 problem tracks + 3 constraint badges) → Suno break-tip → All-Star Recognition (gold star cards: Susan Patla, Shaati Chattopadhyay, Nerias Lopez — 3 attendees who came to all 4 prior sessions) → **Left Brain vs Right Brain** (Jimmy Carr YouTube Short embed + Logic vs Creativity pills + Open on YouTube link) → Closing "Being Human is the Premium" finale → Resources (Deloitte, Mo Gawdat, Center for Humane Technology)
- Reusable CSS components: `.stat-card` (3D-flippable front/back with `transform-style: preserve-3d` + `backface-visibility`, toggles `.flipped` class on click to show specific role list), `.icon-tile` (4 color variants), `.trait-pill`, `.constraint-badge`, `.hero-quote`, `.flip-stage`/`.flip-card` (Old→New Contract flip), `.star-card` (gold all-star tile), `.finale-slide` (gradient-text closer)
- Unlocked Session 5 in **ai-workshops-hub.html** (removed lock-overlay, added Start Slides link to `session-5/`); no homework page created (not requested)
- Updated session counts to **5 Presentations Live** in both `slides-hub.html` (line 198) and `ai-workshops-hub.html` (line 291)

## Recent Changes (April 25, 2026)
### Featured On Toastmasters Band (Homepage)
- New dark band immediately after the hero on `index.html` (`section#featured-on`)
- Two-column layout (collapses to one on tablet/mobile):
  - Left: embedded Cloudinary video player for the official "Toastmasters Journey Workshop Speaker" reel (iframe, lazy-loaded, 16:9 responsive)
  - Right: pull-quote block with **placeholder text** marked `[Quote coming soon — Paul will add the official Toastmasters quote here.]` plus a 3-item credentials list (Convention Panel Speaker, Journey Workshop Featured Speaker, DTM)
- Below grid: 2-photo strip — `img-new/toastmasters/panel.jpg` (panel-of-4 stage shot, Paul leftmost) and `img-new/toastmasters/selfie.jpg` (audience-facing selfie with countdown clock + QR code)
- Photos processed via `scripts/process-toastmasters-photos.js` (sharp pipeline: brightness/contrast/saturation polish, sharpen, downscale to 1600px, JPG + WebP). Panel image cropped to 16:9 to drop most of the audience-back-of-heads foreground.
- Theme: dark navy gradient with purple/cyan radial glows and gradient-text accent on "Toastmasters International" — matches the existing portfolio brand palette (#6c5ce7 / #00d4ff)

## Recent Changes (April 8, 2026)
### Testimonials Redesign
- Replaced homepage Swiper carousel with 3 static preview cards (Konstantina, Eva, Margaret) + "See All Testimonials" button
- Subtitle changed from "My Expertise" to "What People Say"
- Created **testimonials.html** — dedicated testimonials page with stats bar, 4 categorized sections (Educators, Students, Workshop Attendees, Colleagues), context tags, and expandable long quotes
- Follows site template pattern (sidebar, preloader, portfolio-page-wrapper)

### AI Workshop Session 4
- Created **session-4/index.html** — 30-slide Reveal.js 5.x presentation "Securing the Future" (fraud, deepfakes, security, jailbreaks, Claude Mythos)
- Interactive elements: Slide 4 red-flag email tags, Slide 5 Traditional→Reasoning AI flip, Slide 9 Gemini accordion, Slide 16 MFA click-to-swap (SMS shatters → Hardware Keys slide in), Slides 18/19 Email A/B click-to-reveal red/green flag callouts with verdict
- Created **ai-workshop-homework-4.html** — 12 quizzes + 4-term defenses-vs-threats matching exercise across 5 sections (threat landscape, phishing, deepfakes/GANs, jailbreaks/Mythos, modern shield)
- Unlocked Session 4 + Homework link on **ai-workshops-hub.html**

### Other Changes
- Removed Fiverr link from Mobile App & Web Development tile and "Let's Work Together" button
- Moved Young Speakers Academy from Coming Soon to Already Completed
- Expanded Session 3 homework from 7 to 12 quizzes

## External Dependencies
- **express**: Used as the web server framework for serving static files and handling template replacements.
- **multer**: Integrated for handling file uploads (though its direct application in the current static site context might be for future expansion or specific interactive features).
- **Reveal.js**: Utilized for creating interactive, slide-based presentations, particularly for the AI workshops.
- **p5.js**: Employed for interactive visual elements within workshop slides, such as the diffusion lab animation.
- **Web Audio API**: Used for generating audio alerts and timers in workshop sessions (e.g., speech timers).