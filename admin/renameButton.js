const db = require("../database/database");
const stateManager = require("../handlers/stateManager");
const buttonSettings = require("./buttonSettings");


module.exports = function renameButton(ctx){

    const state = stateManager.getState(ctx.from.id);


    if(!state || !state.data.buttonId){

        return ctx.reply("❌ اطلاعات تغییر نام پیدا نشد.");

    }


    const buttonId = state.data.buttonId;


    const newName = ctx.message.text.trim();


    if(!newName){

        return ctx.reply("❌ نام نمی‌تواند خالی باشد.");

    }


    db.run(
        "UPDATE buttons SET title=? WHERE id=?",
        [
            newName,
            buttonId
        ],
        function(err){


            if(err){

                console.log(err);

                return ctx.reply(
                    "❌ خطا در تغییر نام."
                );

            }


            stateManager.clearState(
                ctx.from.id
            );


            ctx.reply(
                "✅ نام دکمه تغییر کرد."
            );


            buttonSettings.buttonSettings(
                ctx,
                buttonId
            );


        }
    );

};