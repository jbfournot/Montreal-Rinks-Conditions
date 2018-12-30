const express = require('express');
const app = express();
const {setRinks, getRinks} = require('./cron');

app.get('/', (req, res) => {
    getRinks(req.query.caption);
    res.send();
});

// Call by Google Cloud Scheduler each hour — GCS can't start a node process and need a HTTP link.
app.post('/refresh', (req, res) => {
    setRinks();
    return res.send('ok');
});

app.listen(8080);