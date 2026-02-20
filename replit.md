# Paul Ireifej Portfolio Website

## Overview
This is a portfolio website showcasing Paul Ireifej's work as a public speaker, workshop facilitator, and founder of Young Speakers Academy in Monmouth County, NJ. The site includes sections for services, portfolio projects, about information, workshops, blog, and contact details.

## Project Architecture
- **Frontend**: Static HTML/CSS/JavaScript portfolio website
- **Server**: Express.js server running on port 5000 to serve static files and handle template replacement
- **Template System**: Uses placeholders {{preloader}} and {{header}} for component inclusion
- **Static Assets**: Images, CSS, JavaScript files served directly
- **Data**: JSON files in `/nodejs/` directory for dynamic content loading
- **SEO Files**: sitemap.xml, robots.txt for search engine optimization

## Recent Changes (February 20, 2026)
### AI Workshop Session 2 Homework
- Created **ai-workshop-homework-2.html** - 5-section homework page with 6 quizzes
  - Recommendation Systems (collaborative filtering, cold start problem)
  - Say What You See activity with link to artsandculture.google.com/experiment/say-what-you-see
  - How ChatGPT Works (3 training stages)
  - AI Ethics & COMPAS Case (recidivism, ProPublica findings)
  - Prompt Engineering (formula: Role + Task + Format + Constraints)
- Added Homework button to Session 2 on **ai-workshops-hub.html**
- Purple/cyan theme matching Session 2 slides
- Score tracker (0/6) and progress dots

### COMPAS Case Study Slides
- Replaced generic "Bias in AI" slide with **2 dedicated COMPAS case study slides** (slides 21-22)
  - Slide 21: COMPAS intro - black box algorithm, 137 questions, recidivism definition, ProPublica 2016 investigation
  - Slide 22: ProPublica findings - 2x bias against Black defendants, low-risk mislabeling for White defendants, key takeaway
- Total slide count now **38 slides** (up from 37)
- All slide IDs and navigation dots properly renumbered

### Previous AI Workshop Session 2 Updates
- SVG-based collaborative filtering animation (slide 4) with proper line drawing from node centers
- Self-contained persona exercise slides (11-13) with photos, mini-grids, reveal buttons
- "Inside the Node" neuron diagram slide (slide 7)

### AI Workshop Session 2 Slideshow
- Created **ai-workshop-slides-2.html** - Full 38-slide presentation for "From Algorithms to Ethics"
  - Section 1: Recommendation Systems (Collaborative Filtering, YouTube's 80B signals, Cold Start, Persona flip cards)
  - Section 2: ChatGPT demystified (Model analogy, Pre-training/RLHF timeline, Reward Model)
  - Section 3: Ethics (COMPAS case study, Hallucination Hunt, 4 ethics scenario flip cards, Transparency Mandate, AI Nutrition Labels, Alert Warning System)
  - Section 4: Prompt-Off Competition (Prompt Engineering formula slide, 3 challenges)
  - Interactive flip cards for personas and ethics scenarios
  - Matches Session 1 purple/cyan dark theme exactly
- Unlocked Session 2 on **ai-workshops-hub.html** with "Start Slides" button

### Young Speakers Academy Session 3
- Added Web Audio API timer alerts (warning beeps at 15s/10s/5s, alarm at 0) to speech-structure-slides.html
- Created **speech-structure-homework.html** - 7 quiz items (5 quizzes + 2 matching exercises) with green theme
- Unlocked Session 3 on young-speakers-academy.html hub with Homework link

## Previous Changes (December 31, 2025)
### Blog System
- Created **blogs.html** - Blog index page showing all 12 blog posts as cards with thumbnails
- Created **blog.html** - Individual blog viewer using URL parameter (e.g., blog.html?id=chicago)
- Added js/blogs-portfolio.js for blog card rendering and filtering
- Blog categories: Toastmasters, Conferences (CFCA)
- Added Blog tile to Personal Journeys section on homepage (next to Running)

## Previous Changes (December 13, 2025)
### Portfolio Restructure - Separate Pages
- Created 4 dedicated portfolio pages instead of inline homepage content:
  - **tech.html** - Technical portfolio (Work Projects, Conferences, Hackathons, Patents) with filters
  - **speech.html** - Speech Competitions (Toastmasters speeches)
  - **workshops.html** - Workshops with AI/Public Speaking filters
  - **races.html** - Running Journey with distance filters (5K, 10K, Half Marathon, Marathon)
- Updated homepage with navigation tiles linking to the 4 portfolio pages
- Added css/portfolio-pages.css for shared portfolio page styles
- Added js/tech-portfolio.js, js/speech-portfolio.js, js/workshops-portfolio.js
- Simplified js/homepage-portfolio.js to only handle Hobbies/Races section

### Previous Changes (November 30, 2025)
### Google SEO Optimization
- Added comprehensive meta tags targeting "public speaker Monmouth County NJ" searches
- Implemented Schema.org structured data (LocalBusiness, Person, Service, FAQ schemas)
- Added Open Graph and Twitter Card tags for social sharing
- Created XML sitemap (sitemap.xml) for Google indexing
- Added robots.txt for search engine crawling
- Added geographic meta tags (geo.region, geo.placename, geo.position)
- Updated footer with location keywords
- Optimized page titles with local keywords

### Previous Changes
- Created Express.js server (server.js) to serve static files on port 5000
- Added template replacement functionality for header and preloader components
- Configured Replit workflow to run the portfolio server
- Set up deployment configuration for autoscale deployment

## User Preferences
- Static portfolio website
- Express.js for serving files
- Port 5000 for frontend
- Template-based architecture for reusable components

## Dependencies
- express: Web server framework
- multer: File upload handling (from original project)

## Development Setup
1. Run `npm start` to start the development server
2. Server runs on http://0.0.0.0:5000
3. Template placeholders are automatically replaced on request

## Deployment
- Configured for autoscale deployment
- Uses `npm start` command
- No build step required (static files)