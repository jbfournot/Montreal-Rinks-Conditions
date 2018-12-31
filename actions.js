const i18n = require('i18n');
const {actionssdk} = require('actions-on-google');
const {getRinks} = require('./cron');

const app = actionssdk();

i18n.configure({
    locales: ['en-US', 'fr-CA'],
    directory: __dirname + '/locales',
    defaultLocale: 'en-US'
});

app.middleware((conv) => {
    console.log(conv.user.locale)
    i18n.setLocale(conv.user.locale);
});

app.intent('actions.intent.MAIN', conv => {
    conv.ask(i18n.__('welcome'));
});

app.intent('actions.intent.TEXT', (conv, input) => {
    return new Promise((resolve) => {
        const rinks = getRinks(input);
        if(rinks.length > 0){
            const space = ' ';
            const near_rink = rinks[0];
            if(!near_rink.is_open){
                conv.close(i18n.__('rink_closed', {name: near_rink.name}));
            } else {
                if(near_rink.condition == 'mauvaise'){
                    ice_conditions = i18n.__('icecondition_message', {quality: i18n.__('quality_bad')});
                } else if(near_rink.condition == 'bonne'){
                    ice_conditions = i18n.__('icecondition_message', {quality: i18n.__('quality_good')});
                } else {
                    ice_conditions = i18n.__('icecondition_error');
                }
                conv.close(i18n.__('rink_open', {name: near_rink.name}) + space + ice_conditions)
            }
        } else {
            conv.close(i18n.__('rink_error'));
        }
        resolve();
    });
});

exports.actions = app;