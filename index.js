const { Telegraf } = require("telegraf");


const config = require("./config/config");

const startHandler = require("./handlers/startHandler");
const messageHandler = require("./handlers/messageHandler");
const callbackHandler = require("./handlers/callbackHandler");
const textHandler = require("./handlers/textHandler");



const HttpsProxyAgent = require("https-proxy-agent");
const proxyConfig = require("./config/proxy");


let agent = null;


if(proxyConfig.enabled){

    agent = new HttpsProxyAgent(proxyConfig.proxy);

}




const botOptions = {};

if(agent){

    botOptions.telegram = {
        agent
    };

}


const bot = new Telegraf(
    config.BOT_TOKEN,
    botOptions
);







startHandler(bot);

messageHandler(bot);

callbackHandler(bot);

textHandler(bot);



bot.launch()
.then(()=>{
    console.log("✅ اتصال به تلگرام برقرار شد.");
})
.catch((err)=>{
    console.log("❌ خطای اجرای ربات:");
    console.log(err);
});


console.log("ربات با موفقیت اجرا شد.");