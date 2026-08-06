const db = require("../database/database");
const buttonSettings = require("./buttonSettings");
const stateManager = require("../handlers/stateManager");


function createButton(ctx){

    stateManager.setState(
        ctx.from.id,
        "createButton"
    );


    ctx.reply(
        "✏️ نام دکمه جدید را ارسال کنید:"
    );

}



function handleCreateButton(ctx){

    const state = stateManager.getState(
        ctx.from.id
    );


    if(!state) return;


    if(state.state !== "createButton")
        return;



    const title = ctx.message.text;



    db.run(
        `INSERT INTO buttons
        (title, mode)
        VALUES (?,?)`,
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


            stateManager.clearState(
                ctx.from.id
            );


            ctx.reply(
                "✅ دکمه ساخته شد."
            );


            buttonSettings.buttonSettings(
                ctx,
                this.lastID
            );


        }
    );


}



module.exports = {
    createButton,
    handleCreateButton
};