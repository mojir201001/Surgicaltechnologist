const { Markup } = require("telegraf");
const { buttonSettings } = require("./buttonSettings");
const db = require("../database/database");


function createButton(ctx){

    ctx.reply(
        "✏️ نام دکمه جدید را ارسال کنید:"
    );


    global.newButton = {
        user: ctx.from.id,
        step:"name"
    };

}



function handleCreateButton(ctx){

    if(!global.newButton) return;

    if(global.newButton.user !== ctx.from.id)
        return;


    if(global.newButton.step === "name"){


        const title = ctx.message.text;


        db.run(
            
            `INSERT INTO buttons
            (title, mode)
            VALUES (?,?)`
            ,
            [
                title,
                "none"
            ],
            function(err){


                if(err){

                    console.log(err);

                    return ctx.reply(
                        "❌ خطا در ساخت دکمه"
                    );

                }


                global.newButton = null;


                ctx.reply(
                    "✅ دکمه ساخته شد."
                );


                buttonSettings(ctx,title);


            }
        );


    }


}



module.exports = {
    createButton,
    handleCreateButton
};