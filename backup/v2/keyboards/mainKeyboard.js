const { Markup } = require("telegraf");
const db = require("../database/database");
const config = require("../config/config");


function getMainKeyboard(userId, callback){

    db.all(
        "SELECT * FROM buttons WHERE parent_id = 0 AND visible = 1 ORDER BY position ASC",
        [],
        (err, rows)=>{


            let keyboard = [];


            if(rows && rows.length > 0){


                rows.forEach(button=>{

                    keyboard.push([
                        {
                            text: button.title,
                            callback_data: "user_button_" + button.id
                        }
                    ]);

                });


            }



            if(userId == config.ADMIN_ID){

                keyboard.push([
                    {
                        text:"🛠 پنل مدیریت",
                        callback_data:"admin_panel"
                    }
                ]);

            }



            if(callback){

                callback(
                    Markup.inlineKeyboard(keyboard)
                );

            }


        }
    );

}



module.exports = getMainKeyboard;