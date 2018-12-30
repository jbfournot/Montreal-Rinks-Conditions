const {actionssdk} = require('actions-on-google');

const app = actionssdk();

app.intent('actions.intent.MAIN', conv => {
    console.log('Main intent call');
    conv.ask(`Hello Damien, i see you!`);
});

exports.actions = app;