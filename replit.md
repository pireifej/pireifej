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

## Recent Changes (April 28, 2026)
### AI Workshop Session 5 — "The Future of Thinking"
- Created **session-5/index.html** — 16-slide Reveal.js 5.x deck matching Session 4's exact look/feel (dark navy/purple gradient, #00d4ff cyan + #6c5ce7 purple accents, Inter font, ai-orb, hl/hlp/hlw/hlr/hlg color spans, content-slide layout). Visual-first, bullets only where needed.
- Slides: Title → Roadmap (4 icon-tiles) → Reality Check (5 displacement stat cards: Oracle 12K+, Amazon 30K, Intel 24K, Chegg 45%, Block 6K cap) → What They're NOT Cutting (3 trait icon-tiles) → Safe Zones (4 industries + 3 trait pills) → Paul's Take (clickable flip card: Old Contract → New Contract) → Purpose Economy (hero quote + 3 contribution tiles) → Education Crisis (hero quote: "Information FREE / Wisdom EXPENSIVE") → Editor-in-Chief mindset (Old vs New + click-to-reveal takeaway) → Engagement Trap (danger card + Engagement→Retention→Revenue→Harm step-flow) → The Fix (Walled Gardens + Verification cards) → Group Brainstorm (3 problem tracks: Senior Isolation, Traffic Safety, Food Pantry + 3 constraint badges) → Suno break-tip → All-Star Recognition (gold star cards for Susan Patla, Shaati Chattopadhyay, Nerias Lopez — 3 attendees who came to all 4 prior sessions) → Closing "Being Human is the Premium" finale → Resources (Deloitte, Mo Gawdat, Center for Humane Technology)
- New reusable CSS components added in this deck: `.stat-card` (red glow displacement stats), `.icon-tile` (4 color variants), `.trait-pill`, `.constraint-badge`, `.hero-quote`, `.flip-stage`/`.flip-card` (click-to-flip), `.star-card` (gold all-star tile), `.finale-slide` (gradient-text closer)
- Unlocked Session 5 in **ai-workshops-hub.html** (removed lock-overlay, added Start Slides link to `session-5/`); no homework page created (not requested)

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