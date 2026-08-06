const { Markup } = require("telegraf");
const db = require("../database/database");


function userMenu(ctx){

    console.log("USER MENU START");


    db.all(
        "SELECT * FROM buttons WHERE parent_id=0 AND visible=1 ORDER BY position ASC",
        [],
        (err, rows)=>{

            
            console.log("DB ERROR:", err);
            console.log("ROWS:", rows);


            if(err){
                return ctx.reply("❌ خطا در دریافت منو");
            }


            let keyboard = [];


            rows.forEach(button=>{

                keyboard.push([
                    {
                        text: button.title,
                        callback_data: "user_button_" + button.id
                    }
                ]);

            });


            ctx.reply(
                "📚 منوی اصلی",
                Markup.inlineKeyboard(keyboard)
            );

        }
    );

}


module.exports = userMenu;