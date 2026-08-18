require("dotenv").config();
const { Telegraf } = require("telegraf");


const config = require("./config/config");

const startHandler = require("./handlers/startHandler");
const messageHandler = require("./handlers/messageHandler");
const callbackHandler = require("./handlers/callbackHandler");
const textHandler = require("./handlers/textHandler");



const HttpsProxyAgent = require("https-proxy-agent");
const proxyConfig = require("./config/proxy");

let agent = null;

const proxyEnabled =
    process.env.PROXY_ENABLED !== undefined
        ? process.env.PROXY_ENABLED === "true"
        : proxyConfig.enabled;

if (proxyEnabled) {
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




bot.use(async (ctx, next) => {
    console.log("📥 UPDATE:", ctx.updateType);
    console.log("📦 DATA:", ctx.update);
    await next();
});





console.log("🚀 قبل از bot.launch");

console.log("🚀 قبل از bot.launch");
console.log("🔎 TEST TELEGRAM API");

bot.telegram.getMe()
    .then((me) => {
        console.log("✅ Telegram API OK:", me.username);
    })
    .catch((err) => {
        console.log("❌ Telegram API ERROR:", err.message);
    });
bot.launch({
    dropPendingUpdates: true
})
.then(() => {
    console.log("✅ اتصال به تلگرام برقرار شد.");
})
.catch((err) => {
    console.log("❌ خطای اجرای ربات:");
    console.log(err);
});

console.log("🚀 بعد از bot.launch");

setInterval(() => {
    console.log("💓 ربات هنوز در حال اجراست...");
}, 10000);

console.log("ربات با موفقیت اجرا شد.");