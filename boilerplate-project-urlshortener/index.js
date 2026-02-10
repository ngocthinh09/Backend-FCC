require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const urlParser = require('url');
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/public', express.static(`${process.cwd()}/public`));


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urlDatabase = [];
let numUrl = 1;

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  const parsedUrl = urlParser.parse(originalUrl);

  const protocolRegex = /^https?:\/\/(.*)/;
  if (!protocolRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  dns.lookup(parsedUrl.hostname, (err) => {
    if (err)
      return res.json({ error: 'invalid url' });
    
    const shortUrl = numUrl++;
    urlDatabase.push({
      original_url: originalUrl,
      short_url: shortUrl
    });

    res.json({ original_url: originalUrl, short_url: shortUrl });
  });
});

app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = parseInt(req.params.shortUrl);
  const foundUrl = urlDatabase[shortUrl - 1];
  res.redirect(foundUrl.original_url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
