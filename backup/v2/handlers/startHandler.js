const registerUser = require("./userHandler");
const getMainKeyboard = require("../keyboards/mainKeyboard");

module.exports = (bot) => 

    bot.start((ctx) => {

        registerUser(ctx);

        getMainKeyboard(ctx.from.id, (keyboard)=>{

            ctx.reply(
        `🌟 به ربات اختصاصی دانشجویان اتاق عمل کد 1️⃣ خوش آمدید.
        
        از طریق این ربات می‌توانید:
        
        📚 به جزوه‌ها و فایل‌های آموزشی دسترسی داشته باشید.
        🎓 از محتوای اختصاصی بهره‌مند شوید.
        💯 و از امکانات متنوع ربات برای یادگیری بهتر استفاده کنید.
        
        لطفاً یکی از گزینه‌های زیر را انتخاب کنید.`,
                keyboard
            );
        
        });
    });