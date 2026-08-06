const { Markup } = require("telegraf");
const db = require("../database/database");

function listButtons(ctx){

    db.all(
        "SELECT * FROM buttons WHERE parent_id = 0 ORDER BY position ASC",
        [],
        function(err, rows){

            if(err){
                return ctx.reply("❌ خطا در دریافت دکمه‌ها");
            }

            let keyboard = [];

            keyboard.push([
                {
                    text:"➕ ایجاد دکمه جدید",
                    callback_data:"create_button"
                }
            ]);

            rows.forEach(button=>{

                keyboard.push([
                    {
                        text:"📂 " + button.title,
                        callback_data:"button_" + button.id
                    }
                ]);

            });

            keyboard.push([
                {
                    text:"⬅️ بازگشت",
                    callback_data:"admin_back"
                },
                {
                    text:"🏠 صفحه اصلی",
                    callback_data:"home"
                }
            ]);

            ctx.reply(
                "📂 مدیریت دکمه‌ها",
                Markup.inlineKeyboard(keyboard)
            );

        }
    );

}

module.exports = listButtons;