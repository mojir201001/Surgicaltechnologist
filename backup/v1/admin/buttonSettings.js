const { Markup } = require("telegraf");


function buttonSettings(ctx, title){

    ctx.reply(
`⚙️ تنظیمات دکمه

📌 نام دکمه: ${title}

انتخاب کنید:`,
Markup.inlineKeyboard([

[
{
text:"📂 ایجاد زیرشاخه",
callback_data:"set_folder"
}
],

[
{
text:"📖 نمایش مطلب",
callback_data:"set_content"
}
],

[
{
text:"📥 دریافت مطلب",
callback_data:"set_input"
}
],

[
{
text:"✏ تغییر نام",
callback_data:"rename_button"
}
],

[
{
text:"🎨 تغییر ظاهر",
callback_data:"style_button"
}
],

[
{
text:"🔗 لینک دکمه",
callback_data:"link_button"
}
],

[
{
text:"🗑 حذف دکمه",
callback_data:"delete_button"
}
],

[
{
text:"⬅️ بازگشت",
callback_data:"admin_back"
}
]

])
);
}



function setButtonType(ctx,type){

    ctx.answerCbQuery();


    if(type==="folder"){
        ctx.reply("📂 مدیریت زیرشاخه‌ها فعال شد.");
    }

    if(type==="content"){
        ctx.reply("📖 حالت نمایش مطلب فعال شد.");
    }

    if(type==="input"){
        ctx.reply("📥 حالت دریافت مطلب فعال شد.");
    }

}



module.exports={
    buttonSettings,
    setButtonType
};