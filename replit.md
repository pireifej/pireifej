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

## Recent Changes (March 18, 2026)
### AI Workshop Session 3
- Created **ai-workshop-slides-3.html** - 32-slide presentation for "A Look Under the Hood"
  - Part I: The "Smart Autocomplete" Hook (slides 1-8)
    - Title slide, section divider, "Autocomplete on Caffeine" analogy, library metaphor
    - Human Autocomplete exercise (click-to-reveal phrase cards)
    - Stochastic Parrot slide with hover squawk bubble (cycles probabilistic completions)
    - Next-word probability visualization with animated bars
  - Part II: Tokens, Patterns, and Pixels (slides 9-19)
    - Tokenization animation with real GPT-4 token IDs: "un"(359) + "h"(71) + "appiness"(67391)
    - Token explanation: IDs assigned by frequency (common = low ID, rare = high ID)
    - OpenAI Tokenizer demo slide (slide 11): clickable link to platform.openai.com/tokenizer with try-it suggestions (strawberry, unhappiness, other languages)
    - Strawberry Lab interactive slide (slide 12): Zone 1 shows [STRAW][BERRY] blocks → wrong answer (2 r's), Zone 2 shatters into individual letter blocks → count reveals 3 r's with glow animation
    - Diffusion demo (canvas noise → SVG statue over 3s with progress bar)
    - AI Layers diagram (AI → ML → Deep Learning → Generative AI + Responsible AI)
    - Key terms: Machine Learning, Deep Learning, Generative AI
    - Predictive Story Chain: facilitator-led whole-room exercise (Round 1: boring/predictable, Round 2: weird/unexpected)
    - Temperature comparison (low vs high, boring vs creative words)
  - Part III: The "Hallucination" Reality Check (slides 20-32)
    - Why AI "lies" explanation with examples
    - 4 Live Hallucination Prompts (slides 22-25): audience types into ChatGPT, flip card reveals truth
      - Prompt 1: 1954 Nobel winner's moon landing speech (Hemingway, impossible timeline)
      - Prompt 2: Quantum sourdough paper (fake paper, AI fabricates summary)
      - Prompt 3: Einstein 1998 NYT interview (died 1955)
      - Prompt 4: Malcolm Gladwell books before 2000 (only 1 exists)
    - Truth or Probability: split into 2 separate slides (26=Fact, 27=Hallucination)
    - Key Terms Recap (click-to-reveal Q&A accordion)
    - Closing quotes (John Searle paraphrase + Dijkstra submarine quote)
    - Q&A section, Session 4 preview (Prompt Engineering, April 27, 2026)
  - Interactive features: keyboard arrow navigation, 33 nav dots, click-to-reveal, flip cards, hover parrot, clickable story starters
  - Purple/cyan dark theme matching Sessions 1-2 exactly
  - Back link goes to shouldcallpaul.com (hiding hub from students)
- Unlocked Session 3 on **ai-workshops-hub.html** with Start Slides button
- Created **ai-workshop-homework-3.html** - 5-section homework page with 7 quizzes + 1 matching
  - The Big Picture: AI layers diagram, quizzes on Machine Learning and Deep Learning definitions
  - Terminology Deep Dive: 5-term matching exercise (AI, ML, Deep Learning, Generative AI, Responsible AI)
  - Discriminative vs Generative: classification vs creation quizzes with real-world examples
  - Tokens & Hallucinations: tokenization explanation, strawberry problem, hallucination quiz
  - Putting It All Together: LLM generation quiz, closing quotes (Searle + Dijkstra)
  - Score tracker (0/7) and progress dots
  - Purple/cyan theme matching Sessions 1-2 homework
- Added Homework button to Session 3 on **ai-workshops-hub.html**

## Previous Changes (March 16, 2026)
### Young Speakers Academy Session 6
- Created **speech-evaluation-slides.html** - 8-section scroll-based slideshow for "Speech Evaluation & Feedback"
  - Section 1: Full Speaker's Warm-Up (all exercises from Sessions 1-5: Big Stretch, Accordion Breath, Vocal Siren, Raspberries & Lip Trills, Volume Dial)
  - Section 2: Prepared Speeches with 60-second timer (beeps at 15s/10s/5s, alarm at 0), finale prep
  - Section 3: What Is a Speech Evaluation? (Be Kind, Be Specific, Be Helpful cards)
  - Section 4: The Feedback Sandwich (compliment → suggestion → encouragement, Feedback vs Criticism examples)
  - Section 5: Evaluation Practice (6-item checklist + live evaluation round)
  - Section 6: How to Receive Feedback (Listen, Thank You, Don't Defend, Write It Down + Thank You Challenge)
  - Section 7: Hero's Pose closing + homework (practice finale speech, get Feedback Sandwich from family)
- Unlocked Session 6 on **young-speakers-academy.html** with Start Session link (counter: 6 Sessions Live)
- Green gradient theme (#00b894 to #55efc4) matching Sessions 1-5

### Navigation Updates
- Workshops nav link now goes to workshops.html page (updated in header.html, sidebar.html, index.html, speak.html, speak-register.html, portfolio.html)
- Resume nav link now directly downloads PDF (sidebar.html, index.html)
- Resume PDF updated to "Paul Ireifej - Speaker & Workshop Facilitator.pdf"

## Previous Changes (March 5, 2026)
### Young Speakers Academy Session 5
- Created **storytelling-slides.html** - 6-section scroll-based slideshow for "Storytelling & Personal Narrative"
  - Section 1: Physical & Vocal Warm-Up (Big Stretch, Accordion Breath, Vocal Siren, Volume Dial with Level 1-5)
  - Section 2: Prepared Speeches with 90-second timer (beeps at 15s/10s/5s, alarm at 0), focus on Projection + peer volume feedback
  - Section 3: Anatomy of a Personal Story (Hook, Conflict, Resolution cards + Hook vs No Hook examples)
  - Section 4: The 3-Sentence Story crafting exercise (Setup/Problem/Takeaway)
  - Section 5: Hero's Pose closing + homework (practice 3-sentence story at Level 5 volume)
- Unlocked Session 5 on **young-speakers-academy.html** with Start Session link
- Green gradient theme (#00b894 to #55efc4) matching Sessions 1-4

### AI Workshop Session 2 Updates
- Updated YouTube recommendation signals to real weights from Google's 2016 paper (Session Time ×1.2, Watch Time ×0.9, Engagement ×0.8, Click-Through ×0.7, Freshness ×0.5)
- Split "How a Model is Built" into 4 individual slides (Pre-Training, Post-Training/RLHF, The Model, Deployment) with step progress dots
- Removed redundant "How AI Models Learn" timeline slide
- Updated Session 2 homework to match 4-step model pipeline
- Changed homework back links to shouldcallpaul.com (hiding hub pages from students)
- Total slide count: 45

## Previous Changes (February 21, 2026)
### Young Speakers Academy Session 4
- Created **vocal-variety-slides.html** - 9-section scroll-based slideshow for "Vocal Variety & Body Language"
  - Section 1: Physical & Vocal Warm-Up (Big Stretch, Accordion Breath, Vocal Siren, Raspberries, Volume Dial visual)
  - Section 2: Prepared Speeches with 90-second timer (beeps at 15s/10s/5s, alarm at 0)
  - Section 3: Vocal Variety (Whisper, Megaphone, Speed Pedal, Character Switch)
  - Section 4: The Mystery Tone group exercise (4 emotion cards: Surprised, Sarcastic, Suspicious, Exhausted)
  - Section 5: Body Language (Base Camp, 3 Tool Gestures: Number/Size/Heart, Walk and Plant)
  - Section 6: The Silent Storyteller exercise (4 acting prompts)
  - Section 7: Impromptu Speaking Frameworks (OREO, Time Traveler, Sandwich with 6 practice prompts)
  - Section 8: Mirror Challenge closing + homework assignment
- Created **vocal-variety-homework.html** - 5-section homework page with 7 quiz items (6 quizzes + 1 matching)
  - Vocal Variety (whisper timing, character switch)
  - Body Language (Base Camp, gesture tool matching)
  - Stage Movement (Tiger in the Cage)
  - Impromptu Frameworks (OREO vs Time Traveler selection)
  - Practice & Homework (Silent Watcher assignment)
- Unlocked Session 4 on **young-speakers-academy.html** with Start Session + Homework links
- Green gradient theme (#00b894 to #55efc4) matching Sessions 1-3

## Previous Changes (February 20, 2026)
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
- Total slide count now **43 slides** (up from 37)
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