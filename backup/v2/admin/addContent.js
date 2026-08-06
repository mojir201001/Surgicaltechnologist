const db = require("../database/database");
const stateManager = require("../handlers/stateManager");


function addContent(ctx, buttonId){


    stateManager.setState(
        ctx.from.id,
        "addContent",
        {
            buttonId: buttonId
        }
    );



    


    ctx.reply(
        "📤 فایل یا متن مطلب را ارسال کنید.\n\nبرای لغو عملیات /cancel را بفرستید."
    );

}



function saveContent(ctx){


    const state = stateManager.getState(ctx.from.id);


    if(!state)
        return;


    if(state.state !== "addContent")
        return;



    let file_id = null;
    let file_type = "text";
    let caption = null;



    if(ctx.message.document){

        file_id = ctx.message.document.file_id;
        file_type = "document";

    }


    else if(ctx.message.photo){

        file_id = ctx.message.photo[ctx.message.photo.length-1].file_id;
        file_type = "photo";

    }


    else if(ctx.message.video){

        file_id = ctx.message.video.file_id;
        file_type = "video";

    }


    else if(ctx.message.audio){

        file_id = ctx.message.audio.file_id;
        file_type = "audio";

    }


    else if(ctx.message.text){

        caption = ctx.message.text;

    }



    db.run(


`INSERT INTO files
(button_id,file_id,file_type,caption)
VALUES (?,?,?,?)`
,

[
state.data.buttonId,
file_id,
file_type,
caption
],


function(err){


    if(err){

        console.log(err);

        return ctx.reply(
            "❌ خطا در ذخیره مطلب"
        );

    }


    ctx.reply(
        "✅ مطلب ذخیره شد."
    );


}


);


}



module.exports = {

    addContent,
    saveContent

};