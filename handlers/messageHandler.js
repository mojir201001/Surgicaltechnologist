module.exports = (bot) => {


    bot.hears("🛠 پنل مدیریت", (ctx)=>{

        const config = require("../config/config");
        const adminPanel = require("../admin/adminPanel");

        if(ctx.from.id != config.ADMIN_ID)
            return;


        adminPanel(ctx);

    });



    bot.hears("👤 نمای کاربر", (ctx)=>{


        

        const userMenu = require("../keyboards/userMenu");


        userMenu(ctx);


    });


};