const path = require('path');
let express = require('express');
const bodyParser = require('body-parser');

let app = express();
require('dotenv').config();


console.log("Hello World")
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

app.get("/", function(req, res) {
    let absolutePath = path.join(__dirname, 'views', 'index.html');
    res.sendFile(absolutePath);
});

app.get("/json", function(req, res) {
    let messageResponse = "Hello json";
    if (process.env.MESSAGE_STYLE === "uppercase")
        messageResponse = messageResponse.toUpperCase();
    res.json({ "message": messageResponse })
})

app.get('/now', (req, res, next) => {
    req.time = new Date().toString();
    next();
}, (req, res) => {
    res.json({ "time": req.time });
});

app.get('/:word/echo', (req, res) => {
    res.json({ "echo": req.params.word });
});

app.get('/name', (req, res) => {
    const firstName = req.query.first;
    const lastName = req.query.last;
    res.json({ "name": `${firstName} ${lastName}` });
});

app.post('/name', (req, res) => {
    const firstName = req.body.first;
    const lastName = req.body.last;
    res.json({ "name": `${firstName} ${lastName}` });
})

module.exports = app;