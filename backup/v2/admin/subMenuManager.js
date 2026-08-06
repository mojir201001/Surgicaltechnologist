const { Markup } = require("telegraf");
const db = require("../database/database");
const stateManager = require("../handlers/stateManager");


// نمایش مدیریت زیرشاخه‌ها
function subMenuManager(ctx, buttonId, title){

    ctx.reply(

`📂 مدیریت زیرشاخه‌ها

دکمه اصلی:
${title}

یک گزینه انتخاب کنید:`,

Markup.inlineKeyboard([

[
{
text:"➕ افزودن زیرشاخه",
callback_data:`add_sub_${buttonId}`
}
],

[
{
text:"📋 مشاهده زیرشاخه‌ها",
callback_data:`list_sub_${buttonId}`
}
],

[
{
text:"⬅️ بازگشت",
callback_data:"back_button_settings"
}
]

])

);

}



// شروع ساخت زیرشاخه
function addSubMenu(ctx, buttonId){


    stateManager.setState(

        ctx.from.id,

        "createSub",

        {
            parentId:buttonId
        }

    );


    ctx.reply(
        "✏️ نام زیرشاخه جدید را ارسال کنید:"
    );

}



// ذخیره زیرشاخه
function saveSubMenu(ctx){


    const state = stateManager.getState(
        ctx.from.id
    );


    if(!state)
        return;


    if(state.state !== "createSub")
        return;



    let title = ctx.message.text;


    db.run(

        `INSERT INTO buttons
        (parent_id,title,mode)
        VALUES (?,?,?)`
        ,
        
        [
        state.data.parentId,
        title,
        "none"
        ],
        
        
        function(err){
        
        
            if(err){
        
                console.log(err);
        
                return ctx.reply(
                    "❌ خطا در ساخت زیرشاخه"
                );
        
            }
        
        
            // تبدیل دکمه مادر به پوشه
            db.run(
                "UPDATE buttons SET mode=? WHERE id=?",
                [
                    "folder",
                    state.data.parentId
                ]
            );
        
        
            stateManager.clearState(
                ctx.from.id
            );
        
        
            ctx.reply(
                `✅ زیرشاخه "${title}" ساخته شد.`
            );
        
        
        });

}



module.exports = {

    subMenuManager,
    addSubMenu,
    saveSubMenu

};