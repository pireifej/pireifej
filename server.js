const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { createClient } = require('pexels');

const app = express();
const port = 5000;

app.use(express.json());

const pexelsClient = process.env.PEXELS_API_KEY ? createClient(process.env.PEXELS_API_KEY) : null;

const storyRateLimit = new Map();
const STORY_LIMIT_MAX = 12;
const STORY_LIMIT_WINDOW_MS = 5 * 60 * 1000;
function checkStoryRateLimit(ip) {
    const now = Date.now();
    const entry = storyRateLimit.get(ip);
    if (!entry || now > entry.resetAt) {
        storyRateLimit.set(ip, { count: 1, resetAt: now + STORY_LIMIT_WINDOW_MS });
        return true;
    }
    if (entry.count >= STORY_LIMIT_MAX) return false;
    entry.count += 1;
    return true;
}

const STORY_STYLES = [
    'a noir detective narrating a mystery',
    'a breathless sports commentator calling live action',
    'a nature documentary narrator describing rare wildlife',
    'a swashbuckling pirate spinning a tall tale',
    'a hyper-dramatic movie trailer voice',
    'a tabloid gossip columnist sharing scandalous news',
    'a grumpy old wizard recounting an annoying day',
    'an enthusiastic infomercial host pitching the story',
    'a stand-up comedian doing crowd work'
];

const PROTECTED_PATTERNS = [
    /^\/ai-workshops-hub\.html$/i,
    /^\/slides-hub\.html$/i,
    /^\/public-speaking-hub\.html$/i,
    /^\/session-[^/]+(\/.*)?$/i,
    /^\/monmouth-county(\/.*)?$/i
];

function isProtected(reqPath) {
    return PROTECTED_PATTERNS.some(re => re.test(reqPath));
}

function requireAdmin(req, res, next) {
    if (!isProtected(req.path)) return next();

    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPass = process.env.ADMIN_PASSWORD;

    if (!expectedUser || !expectedPass) {
        console.error('ADMIN_USERNAME/ADMIN_PASSWORD not set — blocking protected route');
        res.set('WWW-Authenticate', 'Basic realm="Paul Slides"');
        return res.status(401).send('Auth not configured');
    }

    const header = req.headers.authorization || '';
    if (header.startsWith('Basic ')) {
        try {
            const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
            const idx = decoded.indexOf(':');
            const user = decoded.slice(0, idx);
            const pass = decoded.slice(idx + 1);
            if (user === expectedUser && pass === expectedPass) {
                return next();
            }
        } catch (e) { /* fall through */ }
    }

    res.set('WWW-Authenticate', 'Basic realm="Paul Slides"');
    res.set('Cache-Control', 'no-store');
    return res.status(401).send('Authentication required');
}

app.use(requireAdmin);

function replaceTemplates(content) {
    const preloader = fs.readFileSync('preloader.html', 'utf8');
    const header = fs.readFileSync('header.html', 'utf8');
    const sidebar = fs.readFileSync('sidebar.html', 'utf8');
    content = content.replace('{{preloader}}', preloader);
    content = content.replace('{{header}}', header);
    content = content.replace('{{sidebar}}', sidebar);
    return content;
}

app.get('/', (req, res) => {
    try {
        let content = fs.readFileSync('index.html', 'utf8');
        content = replaceTemplates(content);
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.send(content);
    } catch (error) {
        console.error('Error serving index.html:', error);
        res.status(500).send('Server error');
    }
});

app.get('/:page.html', (req, res, next) => {
    const filename = req.params.page + '.html';
    try {
        if (fs.existsSync(filename)) {
            let content = fs.readFileSync(filename, 'utf8');
            if (content.includes('{{')) {
                content = replaceTemplates(content);
            }
            res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.send(content);
        } else {
            next();
        }
    } catch (error) {
        console.error(`Error serving ${filename}:`, error);
        next();
    }
});

app.use(express.static('.', {
    setHeaders: (res, filePath, stat) => {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
    }
}));

app.post('/api/contact', async (req, res) => {
    try {
        const { subject, to, content } = req.body;
        const username = process.env.CONTACT_API_USERNAME;
        const password = process.env.CONTACT_API_PASSWORD;
        
        if (!username || !password) {
            return res.status(500).json({ error: 1, message: 'Missing API credentials' });
        }
        
        const credentials = Buffer.from(`${username}:${password}`).toString('base64');
        
        const response = await fetch('https://shouldcallpaul.replit.app/contact', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Basic ${credentials}`
            },
            body: JSON.stringify({ subject, to, content })
        });
        
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 1, message: 'Failed to send message' });
    }
});

app.post('/api/story', async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || 'unknown';
        if (!checkStoryRateLimit(ip)) {
            return res.status(429).json({ error: 'Too many stories — try again in a few minutes.' });
        }

        const { name, likes, dislikes, scenario } = req.body || {};
        const cleanName = (name || 'the kid').toString().slice(0, 40).trim() || 'the kid';
        const cleanLikes = (likes || 'pizza, dragons').toString().slice(0, 100).trim();
        const cleanDislikes = (dislikes || 'broccoli').toString().slice(0, 80).trim();
        const cleanScenario = (scenario || 'on a wild adventure').toString().slice(0, 120).trim();

        const username = process.env.SCP_API_USERNAME;
        const password = process.env.SCP_API_PASSWORD;
        if (!username || !password) {
            return res.status(500).json({ error: 'Story service not configured.' });
        }

        const style = STORY_STYLES[Math.floor(Math.random() * STORY_STYLES.length)];

        const systemMessage = `You are a wild flash-fiction generator for kids ages 9-12.

ABSOLUTE HARD RULES — VIOLATIONS WILL BE REJECTED:
1. MAX 120 WORDS in the story. Count carefully. Under 120 is fine. Over 120 is FAILURE.
2. NEVER begin with "Once upon a time", "There was", "In a [place]", "Long ago", or any traditional opener. Start MID-SCENE with action or dialogue.
3. NEVER end with "the end", "and they lived", "learned a lesson", "from that day on", or any moral wrap-up. End on a cliffhanger, a weird image, or a question.
4. BANNED WORDS (do not use): happy, sad, fun, amazing, beautiful, wonderful, friendship, learned, lesson, journey, adventure (the word itself), suddenly, magical.
5. Narrate in this voice the whole way through: ${style}. Commit hard to it. The voice should be obvious from the first sentence.
6. The hero is ${cleanName}. Name appears 2-3 times max.
7. Include the love (${cleanLikes}) as a plot driver AND the hate (${cleanDislikes}) as a comedic obstacle. Setting: ${cleanScenario}.
8. One absurd surprise twist required (talking object, sudden swap, ridiculous coincidence).
9. School-appropriate. No violence, no scary content.

OUTPUT FORMAT — follow EXACTLY:
Your entire reply must be plain text in this exact shape, with these exact uppercase labels on their own lines, and nothing else (no markdown, no code fences, no preamble):

STORY:
<the story as one or two paragraphs of flowing prose, 90-130 words>

IMAGE_QUERY:
<3 to 6 words for a stock-photo search that captures the visual vibe — e.g. "astronaut kid space adventure" or "pizza floating colorful" — NOT a literal description>

Example of a correct reply (the entire reply, nothing else):

STORY:
Detective Maya squinted through the jelly fog of cargo bay seven, where her pet dragon Pickles had eaten three pizzas and was now jiggling suspiciously. A talking broccoli cleared its throat from the airlock. "Hand over the cheese," it demanded. Maya gasped. Pickles burped a small fireball. Somewhere, an alarm started playing kazoo music. The spaceship lurched. A jelly tsunami rolled down the corridor, scooping the broccoli mid-monologue. Maya grabbed Pickles and surfed a pizza slice toward the bridge, where the captain was crying because the steering wheel had turned into a banana.

IMAGE_QUERY:
astronaut kid dragon space`;

        const userContent = `Hero: ${cleanName}. Loves: ${cleanLikes}. Hates: ${cleanDislikes}. Setting: ${cleanScenario}. Write the story now in the exact STORY: / IMAGE_QUERY: format.`;

        const credentials = Buffer.from(`${username}:${password}`).toString('base64');
        const scpResponse = await fetch('https://shouldcallpaul.replit.app/getChatCompletion', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Basic ${credentials}`
            },
            body: JSON.stringify({
                content: userContent,
                systemMessage,
                model: 'gpt-4o-mini',
                temperature: 1.0,
                max_tokens: 280,
                maxTokens: 280
            })
        });

        if (!scpResponse.ok) {
            const text = await scpResponse.text();
            console.error('SCP API error:', scpResponse.status, text);
            return res.status(502).json({ error: 'Story service hiccup. Try again.' });
        }

        const scpData = await scpResponse.json();
        const raw = (scpData?.choices?.[0]?.message?.content || '').trim();

        // Parse plain-text STORY: / IMAGE_QUERY: format
        let storyText = '';
        let queryText = '';
        const storyMatch = raw.match(/STORY:\s*([\s\S]*?)(?:\n\s*IMAGE_QUERY:|$)/i);
        const queryMatch = raw.match(/IMAGE_QUERY:\s*([^\n]+)/i);
        if (storyMatch) storyText = storyMatch[1].trim();
        if (queryMatch) queryText = queryMatch[1].trim().replace(/^["']|["']$/g, '');

        // Fallback: if labels were missing, treat the whole reply as the story
        if (!storyText && raw.length > 30) {
            storyText = raw.replace(/^(STORY|IMAGE_QUERY):\s*/gi, '').trim();
        }

        if (!storyText) {
            console.error('Story parse failed. Raw content:', raw);
            return res.status(502).json({ error: 'Story came back garbled. Try again.' });
        }

        // Strip banned openers — the model loves "Once upon a time" no matter what we tell it
        storyText = storyText.replace(/^(once upon a time[,\s]*(in [^,.]*[,.])?|long ago[,\s]*|in a (galaxy|land|world|place)[^,.]*[,.]|there (was|lived) [^,.]*[,.])\s*/i, '');
        // Capitalize first letter after strip
        if (storyText.length > 0) storyText = storyText.charAt(0).toUpperCase() + storyText.slice(1);

        // Trim to ~140 words at a sentence boundary (safety net if the model ignores the word limit)
        const words = storyText.split(/\s+/);
        if (words.length > 140) {
            const cut = words.slice(0, 140).join(' ');
            const lastEnd = Math.max(
                cut.lastIndexOf('.'),
                cut.lastIndexOf('!'),
                cut.lastIndexOf('?')
            );
            storyText = lastEnd > cut.length * 0.5
                ? cut.slice(0, lastEnd + 1)
                : cut + '...';
        }

        let imageUrl = null;
        let imageCredit = null;
        // Clamp image query to first 6 words for cleaner Pexels results
        const rawQuery = (queryText || cleanScenario || 'adventure').toString();
        const query = rawQuery
            .replace(/[^a-zA-Z0-9\s]/g, ' ')
            .trim()
            .split(/\s+/)
            .slice(0, 6)
            .join(' ');
        if (pexelsClient) {
            try {
                const photoRes = await pexelsClient.photos.search({
                    query,
                    per_page: 15,
                    orientation: 'landscape'
                });
                if (photoRes?.photos?.length > 0) {
                    const pick = photoRes.photos[Math.floor(Math.random() * photoRes.photos.length)];
                    imageUrl = pick.src.large2x || pick.src.large || pick.src.original;
                    imageCredit = { photographer: pick.photographer, url: pick.url };
                }
            } catch (pexErr) {
                console.error('Pexels error:', pexErr?.message || pexErr);
            }
        }

        res.json({
            story: storyText,
            imageQuery: query,
            imageUrl,
            imageCredit,
            style
        });

    } catch (error) {
        console.error('Story endpoint error:', error);
        res.status(500).json({ error: 'Story generator crashed. Try again.' });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Portfolio server running on http://0.0.0.0:${port}`);
});
