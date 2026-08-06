const registerUser = require("./userHandler");
const getMainKeyboard = require("../keyboards/mainKeyboard");
const userMainMenu = require("../keyboards/userMainMenu");
const updateUserIdentity = require("../utils/updateUserIdentity");



module.exports = (bot) => {

    bot.start((ctx) => {


        updateUserIdentity(ctx,(userId)=>{

            console.log("USER UPDATED:", userId);
            
            });



        registerUser(ctx);


        const welcomeText = 
`🌟 به ربات اختصاصی دانشجویان اتاق عمل کد 1️⃣ خوش آمدید.

از طریق این ربات می‌توانید:

📚 به جزوه‌ها و فایل‌های آموزشی دسترسی داشته باشید.
🎓 از محتوای اختصاصی بهره‌مند شوید.
💯 و از امکانات متنوع ربات برای یادگیری بهتر استفاده کنید.

لطفاً یکی از گزینه‌های زیر را انتخاب کنید.`;


        getMainKeyboard(ctx.from.id, (keyboard)=>{


            // مدیر
            if(keyboard){


                ctx.reply(
                    welcomeText,
                    keyboard
                );

                return;

            }



            // کاربر عادی
            userMainMenu((menu)=>{


                ctx.reply(
                    welcomeText,
                    menu
                );


            });



        });



    });

};