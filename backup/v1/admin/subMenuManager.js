const { Markup } = require("telegraf");
const db = require("../database/database");


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

    global.newSubMenu = {

        user:ctx.from.id,
        parentId:buttonId

    };


    ctx.reply(
        "✏️ نام زیرشاخه جدید را ارسال کنید:"
    );

}



// ذخیره زیرشاخه
function saveSubMenu(ctx){

    if(!global.newSubMenu)
        return;


    if(global.newSubMenu.user !== ctx.from.id)
        return;



    let title = ctx.message.text;


    db.run(


`INSERT INTO buttons
(parent_id,title,mode)
VALUES (?,?,?)`
,

[
global.newSubMenu.parentId,
title,
"folder"
],


function(err){

    if(err){

        console.log(err);

        return ctx.reply(
            "❌ خطا در ساخت زیرشاخه"
        );

    }


    global.newSubMenu = null;


    ctx.reply(
        `✅ زیرشاخه "${title}" ساخته شد.`
    );


}

);


}



module.exports = {

    subMenuManager,
    addSubMenu,
    saveSubMenu

};