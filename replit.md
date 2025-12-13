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

## Recent Changes (December 13, 2025)
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