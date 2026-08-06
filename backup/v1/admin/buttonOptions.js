const { Markup } = require("telegraf");
const db = require("../database/database");

function buttonOptions(ctx, buttonId){

    db.get(
        "SELECT * FROM buttons WHERE id=?",
        [buttonId],
        function(err, button){

            if(err || !button){

                return ctx.reply("❌ دکمه پیدا نشد.");

            }

            let keyboard = [];

            if(button.mode == "folder"){

                keyboard.push([
                    { text:"📂 مدیریت زیرشاخه‌ها", callback_data:"submenu_"+button.id }
                ]);

            }else{

                keyboard.push([
                    { text:"📖 نمایش مطلب", callback_data:"content_"+button.id },
                    { text:"📥 دریافت مطلب", callback_data:"input_"+button.id }
                ]);

                keyboard.push([
                    { text:"📂 ایجاد زیرشاخه", callback_data:"folder_"+button.id }
                ]);

            }

            keyboard.push([
                { text:"✏️ تغییر نام", callback_data:"rename_"+button.id },
                { text:"🎨 تغییر ظاهر", callback_data:"color_"+button.id }
            ]);

            keyboard.push([
                { text:"🔗 لینک دکمه", callback_data:"link_"+button.id },
                { text:"/ ایجاد دستور", callback_data:"command_"+button.id }
            ]);

            keyboard.push([
                { text:"🔒 قفل", callback_data:"lock_"+button.id },
                { text:"👁 مخفی/نمایش", callback_data:"visible_"+button.id }
            ]);

            keyboard.push([
                { text:"↕ انتقال", callback_data:"move_"+button.id },
                { text:"🗑 حذف", callback_data:"delete_"+button.id }
            ]);

            keyboard.push([
                { text:"⬅️ بازگشت", callback_data:"buttons" },
                { text:"🏠 صفحه اصلی", callback_data:"home" }
            ]);

            ctx.reply(
                "⚙ مدیریت دکمه: " + button.title,
                Markup.inlineKeyboard(keyboard)
            );

        }
    );

}

module.exports = buttonOptions;