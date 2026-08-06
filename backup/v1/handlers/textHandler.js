const db = require("../database/database");
const stateManager = require("./stateManager");


function textHandler(ctx){

    const userId = ctx.from.id;

    const state = stateManager.getState(userId);


    if(!state){
        return;
    }


    if(state.state === "createSub"){


        const title = ctx.message.text;


        db.run(
            "INSERT INTO buttons (parent_id, title, mode) VALUES (?, ?, ?)",
            [
                state.data.parentId,
                title,
                "folder"
            ],
            function(err){


                if(err){

                    return ctx.reply("❌ خطا در ساخت زیرشاخه");

                }


                stateManager.clearState(userId);


                ctx.reply(
                    "✅ زیرشاخه ساخته شد."
                );


            }
        );


    }

}


module.exports = textHandler;