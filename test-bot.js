require("dotenv").config();

const { Telegraf } = require("telegraf");
const HttpsProxyAgent = require("https-proxy-agent");

const agent = new HttpsProxyAgent(
    "http://127.0.0.1:8580"
);

const bot = new Telegraf(
    process.env.BOT_TOKEN,
    {
        telegram: {
            agent
        }
    }
);

bot.start((ctx) => {
    console.log("START RECEIVED");
    ctx.reply("✅ ربات تست کار می‌کند");
});

bot.on("message", (ctx) => {
    console.log("MESSAGE RECEIVED");
});

bot.launch()
    .then(() => {
        console.log("✅ TEST BOT CONNECTED");
    })
    .catch((err) => {
        console.log("❌ ERROR:", err);
    });

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));