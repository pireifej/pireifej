const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const port = 5000;

app.use(express.json());

const PROTECTED_PATTERNS = [
    /^\/ai-workshops-hub\.html$/i,
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

app.listen(port, '0.0.0.0', () => {
    console.log(`Portfolio server running on http://0.0.0.0:${port}`);
});
