const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

// Middleware to serve static files
app.use(express.static('.', {
    setHeaders: (res, path, stat) => {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
    }
}));

// Template replacement function
function replaceTemplates(content) {
    // Read template files
    const preloader = fs.readFileSync('preloader.html', 'utf8');
    const header = fs.readFileSync('header.html', 'utf8');
    
    // Replace placeholders
    content = content.replace('{{preloader}}', preloader);
    content = content.replace('{{header}}', header);
    
    return content;
}

// Route to serve index.html with template replacements
app.get('/', (req, res) => {
    try {
        let content = fs.readFileSync('index.html', 'utf8');
        content = replaceTemplates(content);
        res.send(content);
    } catch (error) {
        console.error('Error serving index.html:', error);
        res.status(500).send('Server error');
    }
});

// Route to serve portfolio.html with template replacements
app.get('/portfolio.html', (req, res) => {
    try {
        let content = fs.readFileSync('portfolio.html', 'utf8');
        content = replaceTemplates(content);
        res.send(content);
    } catch (error) {
        console.error('Error serving portfolio.html:', error);
        res.status(500).send('Server error');
    }
});

// Catch-all route for other HTML files
app.get('/:filename.html', (req, res) => {
    const filename = req.params.filename + '.html';
    try {
        if (fs.existsSync(filename)) {
            let content = fs.readFileSync(filename, 'utf8');
            // Check if file contains template placeholders
            if (content.includes('{{')) {
                content = replaceTemplates(content);
            }
            res.send(content);
        } else {
            res.status(404).send('File not found');
        }
    } catch (error) {
        console.error(`Error serving ${filename}:`, error);
        res.status(500).send('Server error');
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Portfolio server running on http://0.0.0.0:${port}`);
    console.log('Server started successfully!');
});