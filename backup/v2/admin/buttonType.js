const db = require("../database/database");
const { Markup } = require("telegraf");


function buttonTypeMenu(ctx, buttonId){


    db.get(
        "SELECT * FROM buttons WHERE id=?",
        [buttonId],
        (err, button)=>{


            if(err || !button){

                return ctx.reply("❌ دکمه پیدا نشد.");

            }


            let currentType = "نامشخص";

            
            if(button.mode === "none")
            currentType = "⚪ بدون تنظیم";


            if(button.mode === "folder")
                currentType = "📂 ایجاد زیرشاخه";


            if(button.mode === "content")
                currentType = "📖 نمایش مطلب";


            if(button.mode === "input")
                currentType = "📥 دریافت مطلب";


            if(button.mode === "mixed")
                currentType = "🔀 ترکیبی";

                
                if(button.mode === "link")
                currentType = "🔗 لینک";



                let keyboard = [];


                if(button.mode !== "folder"){
                
                    keyboard.push([
                        {
                            text:"📂 ایجاد زیرشاخه",
                            callback_data:"change_type_folder_" + buttonId
                        }
                    ]);
                
                }
                
                
                if(button.mode !== "content"){
                
                    keyboard.push([
                        {
                            text:"📖 نمایش مطلب",
                            callback_data:"change_type_content_" + buttonId
                        }
                    ]);
                
                }
                
                
                if(button.mode !== "input"){
                
                    keyboard.push([
                        {
                            text:"📥 دریافت مطلب",
                            callback_data:"change_type_input_" + buttonId
                        }
                    ]);
                
                }

                
                if(button.mode !== "link"){

                    keyboard.push([
                        {
                            text:"🔗 لینک",
                            callback_data:"change_type_link_" + buttonId
                        }
                    ]);
                
                }
                
                
                if(button.mode !== "mixed"){
                
                    keyboard.push([
                        {
                            text:"🔀 ترکیبی",
                            callback_data:"change_type_mixed_" + buttonId
                        }
                    ]);
                
                }
                
                
                keyboard.push([
                    {
                        text:"⬅️ بازگشت",
                        callback_data:"back_button_" + buttonId
                    },
                    {
                        text:"🏠 صفحه اصلی",
                        callback_data:"home"
                    }
                ]);


            ctx.reply(

`⚙️ تنظیم نوع دکمه

📌 نام دکمه:
${button.title}


🔹 نوع فعلی:
${currentType}


نوع جدید را انتخاب کنید:`,

Markup.inlineKeyboard(keyboard)

);


        }
    );


}


function changeButtonType(ctx, buttonId, type){


db.get(
"SELECT * FROM buttons WHERE id=?",
[buttonId],
(err,button)=>{


if(err || !button)
return ctx.reply("❌ دکمه پیدا نشد");


db.get(
"SELECT COUNT(*) AS count FROM files WHERE button_id=?",
[buttonId],
(err,files)=>{


db.get(
"SELECT COUNT(*) AS count FROM buttons WHERE parent_id=?",
[buttonId],
(err,subs)=>{


if(files.count > 0 || subs.count > 0){


return ctx.reply(
`⚠️ این دکمه دارای اطلاعات است:

📎 فایل:
${files.count}

📂 زیرشاخه:
${subs.count}

با تغییر نوع، ممکن است دسترسی به این اطلاعات تغییر کند.

آیا ادامه می‌دهید؟`,
Markup.inlineKeyboard([
[
{
text:"✅ تایید تغییر",
callback_data:`confirm_type_${buttonId}_${type}`
}
],
[
{
text:"❌ لغو",
callback_data:"cancel_operation"
}
]
])
);


}



updateType(ctx,buttonId,type);


});


});


});


}



function updateType(ctx,id,type){


db.run(
"UPDATE buttons SET mode=? WHERE id=?",
[type,id],
()=>{


ctx.reply(
"✅ نوع دکمه تغییر کرد."
);


});


}



module.exports={
buttonTypeMenu,
changeButtonType,
updateType
};