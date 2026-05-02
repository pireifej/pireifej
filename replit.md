# Paul Ireifej Portfolio Website

## Overview
This portfolio website showcases Paul Ireifej's professional work as a public speaker, workshop facilitator, and the founder of Young Speakers Academy in Monmouth County, NJ. It serves as a comprehensive online presence, featuring services, portfolio projects across technical, speech, workshop, and running categories, an about section, details on workshops, a blog, and contact information. The project aims to effectively market Paul's expertise and provide valuable resources to his audience, including interactive AI and public speaking workshop materials.

## User Preferences
- Static portfolio website
- Express.js for serving files
- Port 5000 for frontend
- Template-based architecture for reusable components

## System Architecture
The project is structured as a static HTML/CSS/JavaScript frontend served by an Express.js server.
- **Frontend**: Utilizes static HTML, CSS, and JavaScript for a responsive and engaging user experience. UI/UX design emphasizes a clean, professional aesthetic, with consistent theming across various workshop modules (e.g., purple/cyan for AI workshops, green gradient for Young Speakers Academy). Interactive elements like click-to-reveal answers, flip cards, and custom timers are integrated into workshop slides.
- **Backend**: An Express.js server handles serving static files and implements a custom template system for component inclusion (e.g., `{{preloader}}`, `{{header}}`). Dynamic content, such as blog posts and portfolio items, is loaded from JSON files.
- **Content Management**: Workshop content, including detailed slide presentations and homework assignments, is structured across dedicated HTML files. This modular approach allows for easy expansion and updates of educational materials.
- **Portfolio Structure**: The portfolio is categorized into dedicated pages for technical work, speech competitions, workshops, and running races, enhancing navigation and content organization.
- **SEO**: Comprehensive SEO measures are implemented, including meta tags, Schema.org structured data, Open Graph, Twitter Cards, XML sitemap, and `robots.txt`, to optimize visibility for local searches (e.g., "public speaker Monmouth County NJ").

## Recent Changes (May 2, 2026)
### Monmouth County Government Audience — Two New Presentation Modules
- New folder **/monmouth-county/** with two 10-slide Reveal.js 5.x decks for county government audiences (~70+ people in-room).
- New shared stylesheet **/shared-assets/monmouth-style.css** — entirely new "Canva sticker" aesthetic (light/pastel, opposite of the dark AI-workshop palette): coral/peach + sunshine yellow + pink for Public Speaking (`body.theme-coral`), mint/lavender + soft pink for Active Listening (`body.theme-mint`). Quicksand body / Montserrat headers (Google Fonts), 25px rounded corners, glassmorphism `.canva-card`, and a `subtle-float` keyframe animation (5–10px bob) applied to inline SVG `.sticker` decorations (mic, ear, speech bubble, heart, star, lightbulb, mirror, pause icon, abstract people). Reveal.js setup mirrors Session 4 architecture (disableLayout, full-viewport sections, hash routing, slideNumber c/t, arrow + WASD keyboard mapping, slide transition).
- **monmouth-county/public-speaking.html** — "Finding Your Voice: Speaking with Confidence at Monmouth County" (coral theme, 10 slides): Title → Connection Factor (See/Speak To/Care About) → Taming the Butterflies (Box Breathe + Power Pose + First 30 Seconds + Reframe) → Power of Story (with/without contrast cards) → Body Language Basics → **GROUP EXERCISE: The Human Commercial** (60s learn / 30s pitch your partner) → Visuals That Work → Reading a Room of 70+ → Leadership Through Communication → Closing "Should Call Paul." with contact + Q&A.
- **monmouth-county/active-listening.html** — "Listening First: Building Better Connections at Work" (mint theme, 10 slides): Title → Hearing vs Listening → Common Roadblocks (Rehearsing/Distractions/Filtering) → Reading the Unspoken (Eyes/Hands/Tone/Pauses) → The Mirror Technique (Paraphrase → Reflect → Confirm) → **GROUP EXERCISE: The Telephone Improv** (Yes-And chain) → Empathy in Action → The Power of the Pause → Better Meetings → Closing "Should Call Paul." with contact + Q&A.
- Reusable CSS components: `.canva-card` (glassmorphism, 25px radius, 6 solid color variants), `.sticker` + `subtle-float` / `subtle-float-alt` / `float-slow` / `float-fast` keyframe animations, `.exercise-card` (warm gradient + dashed border + timer-pill), `.big-quote`, `.num-badge` (numbered step circles), `.pill` (6 color variants), `.deco-blob` (soft background blobs), `.slide-title` / `.slide-closing` layouts.
- **public-speaking-hub.html** — added a new "Monmouth County Sessions" section below the existing Professional/Youth grid, with two Canva-sticker hub cards (`.canva-hub-card.coral` linking to `monmouth-county/public-speaking.html` and `.canva-hub-card.mint` linking to `monmouth-county/active-listening.html`). Cards have floating `.canva-sticker` icon badges with their own `subtle-float-hub` animation, gradient pastel backgrounds, and bouncy hover (cubic-bezier 0.34, 1.56, 0.64, 1). Existing dark-theme cards untouched. Loaded Quicksand + Montserrat from Google Fonts at the bottom of the inline `<style>` block.

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