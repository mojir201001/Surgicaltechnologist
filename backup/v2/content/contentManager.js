const { Markup } = require("telegraf");
const db = require("../database/database");


function contentManager(ctx, buttonId){


    db.get(
        "SELECT * FROM buttons WHERE id=?",
        [buttonId],
        (err, button)=>{


            if(err || !button){

                return ctx.reply(
                    "❌ دکمه پیدا نشد."
                );

            }


            db.get(
                "SELECT COUNT(*) AS count FROM files WHERE button_id=?",
                [buttonId],
                (err, result)=>{


                    let count = 0;

                    if(result){
                        count = result.count;
                    }


                    let orderText = "🎲 رندم";


                    if(button.content_order === "old"){

                        orderText = "⬆️ قدیمی به جدید";

                    }


                    if(button.content_order === "new"){

                        orderText = "⬇️ جدید به قدیم";

                    }



                    ctx.reply(

`📖 مدیریت مطالب


📌 نام دکمه:
${button.title}


📚 تعداد مطالب:
${count}


🔀 نوع ارسال:
${orderText}


یک گزینه را انتخاب کنید:`,

Markup.inlineKeyboard([


[
{
text:"➕ افزودن مطلب",
callback_data:"add_content_" + buttonId
}
],


[
{
text:"📋 لیست مطالب",
callback_data:"list_content_" + buttonId
}
],


[
{
text:"🗑 حذف مطلب",
callback_data:"delete_content_" + buttonId
}
],


[
{
text:"🎲 رندم",
callback_data:"sort_random_" + buttonId
}
],


[
{
text:"⬆️ قدیمی به جدید",
callback_data:"sort_old_" + buttonId
}
],


[
{
text:"⬇️ جدید به قدیم",
callback_data:"sort_new_" + buttonId
}
],


[
{
text:"⬅️ بازگشت",
callback_data:"back_button_" + buttonId
},
{
text:"🏠 صفحه اصلی",
callback_data:"home"
}
]


])


);


                }


            );


        }


    );


}



module.exports = contentManager;