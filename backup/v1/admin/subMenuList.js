const { Markup } = require("telegraf");
const db = require("../database/database");


function subMenuList(ctx, parentId){


    db.all(
        "SELECT * FROM buttons WHERE parent_id = ? ORDER BY position ASC",
        [parentId],
        (err, rows)=>{


            if(err){
                return ctx.reply("❌ خطا در دریافت زیرشاخه‌ها");
            }


            let keyboard = [];


            rows.forEach(button=>{


                keyboard.push([
                    {
                        text:"📂 " + button.title,
                        callback_data:"manage_button_" + button.id
                    }
                ]);


            });



            keyboard.push([
                {
                    text:"➕ ایجاد زیرشاخه",
                    callback_data:"add_sub_" + parentId
                }
            ]);



            keyboard.push([
                {
                    text:"⬅️ بازگشت",
                    callback_data:"back_button_" + parentId
                },
                {
                    text:"🏠 صفحه اصلی",
                    callback_data:"main_menu"
                }
            ]);



            ctx.reply(
                "📂 مدیریت زیرشاخه‌ها",
                Markup.inlineKeyboard(keyboard)
            );


        }
    );


}


module.exports = subMenuList;