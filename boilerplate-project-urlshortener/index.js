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
  const foundUrl = urlDatabase.find((value) => (value.short_url === shortUrl));
  if (foundUrl)
    res.redirect(foundUrl.original_url);
  else res.json({ error: "No short URL found" })
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
