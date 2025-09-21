# Paul Ireifej Portfolio Website

## Overview
This is a static portfolio website showcasing Paul Ireifej's work as a developer, public speaker, runner, comedian, and father. The site includes sections for services, portfolio projects, about information, workshops, blog, and contact details.

## Project Architecture
- **Frontend**: Static HTML/CSS/JavaScript portfolio website
- **Server**: Express.js server running on port 5000 to serve static files and handle template replacement
- **Template System**: Uses placeholders {{preloader}} and {{header}} for component inclusion
- **Static Assets**: Images, CSS, JavaScript files served directly
- **Data**: JSON files in `/nodejs/` directory for dynamic content loading

## Recent Changes (September 21, 2025)
- Created Express.js server (server.js) to serve static files on port 5000
- Added template replacement functionality for header and preloader components
- Fixed missing main-pic-banner.png image reference
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