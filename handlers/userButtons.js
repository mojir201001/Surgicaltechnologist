const { Markup } = require("telegraf");
const db = require("../database/database");


function showUserButtons(ctx,parentId=0){


db.all(

"SELECT * FROM buttons WHERE parent_id=? AND visible=1 AND deleted=0 ORDER BY position ASC",

[parentId],

(err,buttons)=>{


if(err){
return ctx.reply("❌ خطا در دریافت دکمه‌ها");
}



let keyboard=[];



buttons.forEach(btn=>{


    let icon="🔘";

    if(btn.mode==="folder"){
        icon="📂";
    }
    
    if(btn.mode==="content"){
        icon="📖";
    }
    
    if(btn.mode==="input"){
        icon="📥";
    }
    
    if(btn.mode==="mixed"){
        icon="🔀";
    }
    
    if(btn.mode==="link"){
        icon="🔗";
    }

keyboard.push([

{
text: icon+" "+btn.title,
callback_data:"user_button_"+btn.id
}

]);


});




// جستجو برای کاربر

keyboard.push([

{
text:"🔍 جستجو",
callback_data:"search"
}

]);




// اگر داخل زیرشاخه هستیم

if(parentId !== 0){

keyboard.push([

{
text:"⬅️ بازگشت",
callback_data:"user_back_"+parentId
}

]);

}




// همیشه صفحه اصلی

keyboard.push([

{
text:"🏠 صفحه اصلی",
callback_data:"home"

}

]);




ctx.reply(

"📚 انتخاب کنید:",

Markup.inlineKeyboard(keyboard)

);


});


}



module.exports=showUserButtons;