const { Telegraf } = require("telegraf");
const HttpsProxyAgent = require("https-proxy-agent");
const config = require("./config/config");
const registerUser = require("./handlers/userHandler");
const getMainKeyboard = require("./keyboards/mainKeyboard");
const adminPanel = require("./admin/adminPanel");
const buttonManager = require("./admin/buttonManager");
const createButton = require("./admin/createButton");
const buttonSettings = require("./admin/buttonSettings");
const subMenuManager = require("./admin/subMenuManager");
const listButtons = require("./admin/listButtons");
const buttonOptions = require("./admin/buttonOptions");
const subMenuList = require("./admin/subMenuList");
const textHandler = require("./handlers/textHandler");






const agent = new HttpsProxyAgent("http://127.0.0.1:8580");

const bot = new Telegraf(config.BOT_TOKEN, {
    telegram: {
        agent
    }
});
bot.start((ctx) => {

    registerUser(ctx);

    ctx.reply(
        `🌟 به ربات اختصاصی دانشجویان اتاق عمل کد 1⃣ خوش آمدید.

از طریق این ربات می‌توانید:

📚 به جزوه‌ها و فایل‌های آموزشی دسترسی داشته باشید.
🎓 از محتوای اختصاصی بهره‌مند شوید.
💯 و از امکانات متنوع ربات برای یادگیری بهتر استفاده کنید.

لطفاً یکی از گزینه‌های زیر را انتخاب کنید.`,
        getMainKeyboard(ctx.from.id)
    );

});



bot.hears("🛠 پنل مدیریت", (ctx) => {

    if (ctx.from.id != config.ADMIN_ID) return;

    adminPanel(ctx);

});



bot.action("buttons", (ctx) => {

    listButtons(ctx);

});



bot.action("create_button",(ctx)=>{

    createButton.createButton(ctx);

});



bot.on("text",(ctx)=>{

    createButton.handleCreateButton(ctx);

});




bot.action("set_folder",(ctx)=>{

    buttonSettings.setButtonType(ctx,"folder");

});


bot.action(/^add_sub_(.+)$/, (ctx) => {

    subMenuManager.addSubMenu(
        ctx,
        ctx.match[1]
    );

});


bot.action("set_content",(ctx)=>{

    buttonSettings.setButtonType(ctx,"content");

});


bot.action("set_input",(ctx)=>{

    buttonSettings.setButtonType(ctx,"input");

});



bot.on("text", (ctx) => {

    subMenuManager.saveSubMenu(ctx);

});


bot.action(/^button_(.+)$/, (ctx) => {

    buttonOptions(
        ctx,
        ctx.match[1]
    );

});




bot.action(/^submenu_(.+)$/, (ctx)=>{

    subMenuList(
        ctx,
        ctx.match[1]
    );

});


const stateManager = require("./handlers/stateManager");


bot.action(/^add_sub_(.+)$/, (ctx)=>{


    const parentId = ctx.match[1];


    stateManager.setState(
        ctx.from.id,
        "createSub",
        {
            parentId: parentId
        }
    );


    ctx.reply(
        "✏️ نام زیرشاخه را ارسال کنید.\n\nبرای لغو عملیات روی دکمه زیر بزنید.",
        {
            reply_markup:{
                inline_keyboard:[
                    [
                        {
                            text:"❌ لغو عملیات",
                            callback_data:"cancel_operation"
                        }
                    ]
                ]
            }
        }
    );


});



bot.on("text", (ctx)=>{

    textHandler(ctx);

});





bot.action("cancel_operation",(ctx)=>{


    const stateManager = require("./handlers/stateManager");


    stateManager.clearState(
        ctx.from.id
    );


    ctx.reply(
        "❌ عملیات لغو شد."
    );


});


bot.action("cancel_operation",(ctx)=>{

    stateManager.clearState(ctx.from.id);

    ctx.reply("❌ عملیات لغو شد.");

});


bot.launch();

console.log("ربات با موفقیت اجرا شد.");