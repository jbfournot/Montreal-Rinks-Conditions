const express = require('express');
const bodyParser = require('body-parser')
const {setRinks, getRinks} = require('./cron');
const {actions} = require('./actions');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('It works!');
});

// Call by Google Actions
app.post('/', actions);

// Call by Google Cloud Scheduler each hour — GCS can't start a node process and need a HTTP link.
app.post('/refresh', (req, res) => {
    setRinks();
    return res.send('ok');
});

app.listen(8080);