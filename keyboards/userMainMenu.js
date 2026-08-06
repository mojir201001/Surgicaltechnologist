const { Markup } = require("telegraf");
const db = require("../database/database");


function userMainMenu(callback){

    db.all(
        "SELECT * FROM buttons WHERE parent_id = 0 AND visible = 1 AND deleted = 0 ORDER BY position ASC",
        [],
        (err, rows)=>{

            let keyboard=[];


            if(rows && rows.length > 0){

                rows.forEach(button=>{

                    keyboard.push([
                        {
                            text: button.title,
                            callback_data:"user_button_" + button.id
                        }
                    ]);

                });

            }


            if(callback){

                callback(
                    Markup.inlineKeyboard(keyboard)
                );

            }

        }
    );

}


module.exports=userMainMenu;