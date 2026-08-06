const { Telegraf } = require("telegraf");
const HttpsProxyAgent = require("https-proxy-agent");

const config = require("./config/config");

const startHandler = require("./handlers/startHandler");
const messageHandler = require("./handlers/messageHandler");
const callbackHandler = require("./handlers/callbackHandler");
const textHandler = require("./handlers/textHandler");


const agent = new HttpsProxyAgent("http://127.0.0.1:8580");


const bot = new Telegraf(config.BOT_TOKEN, {

    telegram: {
        agent
    }

});






startHandler(bot);

messageHandler(bot);

callbackHandler(bot);

textHandler(bot);



bot.launch()
.catch((err)=>{
    console.log("❌ خطای اجرای ربات:");
    console.log(err);
});


console.log("ربات با موفقیت اجرا شد.");