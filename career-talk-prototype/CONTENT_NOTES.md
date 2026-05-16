# Career Talk — Content Working Doc

> Raw notes from Paul. NOT a 1:1 slide map — Paul wants to reinvent/upgrade,
> with more interactive group exercises and (if possible) a live AI app-building
> or song-making demo. Audience: Indian Hill School (where his kids attend).

## Audience
- Indian Hill School students (Paul's kids Gabriel & Raphael attend there)
- Career talk, ~45 minutes
- Internet access: UNCONFIRMED. Plan for both with/without.

## Tone goals
- Funny, energetic, physical (he runs around the room for the "hacker" bit)
- Reinvent old slides, don't port 1:1
- MORE interactive group exercises
- Flashy if possible

---

## Slide content (so far)

### S1 — Intro / Who I Am
- Currently: "I am a software engineer for AT&T" + name
- ACTUAL job: Principal Member of Technical Staff at AT&T
- Team lead-ish role. Does:
  - Cloud architecture
  - Overall system architecture
  - Networking (certificates, SSH keys, exposing internal services to external customers)
  - Compliance
  - Boring team-lead management
  - On-call (gets paged at night when prod breaks — "sucks")
- Wants to upgrade how this is framed for kids

### S2 — Kid Paul + His Kids Coding
- Photo of Paul as a kid (he'll upload)
- Photo of Gabriel & Raphael at iCode camp "coding" at a computer
- Connection: his kids go to Indian Hill — the school he's presenting at

### S3 — ZZT-OOP (his first language)
- Picture of ZZT-OOP
- He was 6 or 7 (worth mentioning — kids will relate)
- ZZT came out in 1991, he started shortly after
- Point: "I've been coding for a really long time"

### S4 — The Big WHAT???
- Setup slide for a comedy bit
- Asks the kids: "So what do I actually DO?"
- Leads into a series of joke "Maybe I'm a ___?" slides

### S4a — "Hacker?"
- Image: Tom Cruise hanging from ceiling in Mission Impossible 1
- Paul plays MI theme music
- Runs around the room pretending to be a spy
- Bit: "I break into high security buildings, jump off helicopters, ride motorcycles, steal data, then escape as everything blows up"

### S4b — "Code?"
- Animation of a guy coding in the dark (looks great per Paul)
- Bit: "Maybe I'm a coder writing complex code only I understand"

### S4c — "Tech Support?"
- Animation of guy smiling with headset
- Bit: "Maybe I answer the phone and help with computer problems"

### S4d — "Help Grandma?"
- Image: kid helping grandma use a computer
- Bit: "Maybe I just help people one-on-one with tech"

### S4e (real answer setup)
- Wants to land on: "I help design REQUIREMENTS — I understand business needs and figure out how best to solve them"
- This is the honest answer after all the jokes

### S5 — "Honestly... a little bit of everything"
- Admits he does a bit of everything
- Lists: Network Security, Computer Programming, [more to come]
- Transitions into the live exercise

### S5a — LIVE EXERCISE: "Code Me to Brush My Teeth"
- Cute cartoon toothbrush brushing its own teeth on slide
- Paul brings real toothbrush + toothpaste to class
- Kids give step-by-step instructions; Paul takes them literally
  (e.g., "open the toothpaste" — he tries to open the cap without removing it, etc.)
- Tons of laughs and engagement
- **Paul wants to RETIRE the toothbrush bit** — done it 2 years in a row.
- Wants a NEW exercise — possibly leaning into AI demo instead of "strict coding"
  since kids may not need to learn raw coding anymore.
- **TODO: brainstorm replacement exercise(s)** — see chat for ideas.

### S5b — Back to the "I do everything" list
- Adds two more items after the exercise:
  - "Helping others"
  - "Explaining things"

### S6 — "So what?" (the artifacts of his job)

#### S6a — Websites
- Side-by-side: shouldcallpaul.com desktop vs mobile view
- Point: websites must be designed mobile-friendly
- Contrast slide: a NJ.gov-style site that looks IDENTICAL on desktop and mobile
  (i.e., not mobile-optimized) — "this is what you don't want"

#### S6b — Apps
- Back to "So what?" framing
- Asks kids: what apps do you use daily?
- Open class conversation

#### S6c — Games
- Same conversational format
- Kids share favorite games

#### S6d — Tools
- Calculator, alarm clock, health apps
- Also ChatGPT, Gemini — frames AI as just another tool

---

## TBD from Paul
- Rest of slides after S6d
- Photos to upload (kid Paul, Gabriel & Raphael at iCode, ZZT-OOP screenshot,
  Tom Cruise MI hacker shot, coder-in-the-dark animation source,
  tech support headset guy, kid helping grandma, cartoon toothbrush,
  shouldcallpaul.com desktop+mobile screenshots, NJ.gov non-responsive example)
- Whether the school has wifi for him
- Decision on the toothbrush-replacement exercise

---

## Big asks from Paul that we need to solve

### 1. Live "build an app from a prompt" demo
- Ideally works without internet
- Could run on his phone or tablet so kids interact during the session
- Kids give prompts, see app appear

### 2. Live "make a song from a prompt" demo
- Same idea — kids come up with song ideas

### 3. More interactive group exercises throughout (flashier the better)

---

## Brainstorm: tools for the live demos (see chat for full discussion)

**Reality check on offline AI:**
- Real prompt-to-app and prompt-to-song tools (Replit Agent, v0, Bolt, Lovable,
  Suno, Udio) all need internet — the AI models are too big to run on phones.
- Local models exist (Ollama + coding models on a laptop) but won't run on
  phones/tablets and aren't visual app-builders.

**Realistic options to explore (ranked):**
1. **Plan for internet + have a backup recording.** 90% of schools have wifi
   for presenters. Confirm with Indian Hill IT in advance. Bring a 4G hotspot
   as second backup.
2. **Pre-recorded "live" demo as fallback.** Record yourself prompting Replit
   Agent / v0 / Suno on video; play it if wifi fails. Looks 95% as live.
3. **Kids submit prompts on YOUR device** — pass around your tablet, or have
   them shout suggestions you type. No app needed.
4. **Pre-built mini "prompt sandbox" page on this site** — a single page where
   you type a song idea or app idea, hit a button, and a pre-canned cute thing
   happens. Not real AI, but offline-safe and great for elementary-age laughs.
5. **Open-source local song generators** exist (e.g., browser MIDI loops, simple
   beat sequencers) — not "real AI music" but interactive and offline.
