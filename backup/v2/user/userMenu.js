const { Markup } = require("telegraf");
const db = require("../database/database");


function showUserMenu(ctx, parentId = 0){


db.all(


`SELECT * FROM buttons
WHERE parent_id = ?
AND visible = 1
ORDER BY position ASC`


,
[parentId],

(err,buttons)=>{


if(err){

return ctx.reply(
"❌ خطا در دریافت منو"
);

}



let keyboard=[];



buttons.forEach(button=>{


keyboard.push([

{
text:"📂 " + button.title,
callback_data:"user_button_"+button.id
}

]);


});



keyboard.push([

{
text:"⬅️ بازگشت",
callback_data:"user_back_"+parentId
},

{
text:"🏠 صفحه اصلی",
callback_data:"home"
}

]);



ctx.reply(

"📚 منو",

Markup.inlineKeyboard(keyboard)

);


});


}



module.exports = showUserMenu;