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

## Recent Changes (April 8, 2026)
### Testimonials Redesign
- Replaced homepage Swiper carousel with 3 static preview cards (Konstantina, Eva, Margaret) + "See All Testimonials" button
- Subtitle changed from "My Expertise" to "What People Say"
- Created **testimonials.html** — dedicated testimonials page with stats bar, 4 categorized sections (Educators, Students, Workshop Attendees, Colleagues), context tags, and expandable long quotes
- Follows site template pattern (sidebar, preloader, portfolio-page-wrapper)

### AI Workshop Session 4
- Created **session-4/index.html** — 24-slide Reveal.js 5.x presentation "Securing the Future" (fraud, deepfakes, security)
- Unlocked Session 4 on **ai-workshops-hub.html** (counter: 4 Presentations Live)

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