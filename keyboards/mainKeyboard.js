const { Markup } = require("telegraf");
const db = require("../database/database");
const config = require("../config/config");


function getMainKeyboard(userId, callback){


    if(userId == config.ADMIN_ID){

        callback(

            Markup.keyboard([
                ["🛠 پنل مدیریت","👤 نمای کاربر"]
            ])
            .resize()

        );

        return;

    }


    callback(null);


}


module.exports=getMainKeyboard;