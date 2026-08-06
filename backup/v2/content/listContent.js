const { Markup } = require("telegraf");
const db = require("../database/database");


function listContent(ctx, buttonId){


db.all(

"SELECT * FROM files WHERE button_id=? ORDER BY id DESC",

[buttonId],

(err,files)=>{


if(err){

return ctx.reply("❌ خطا در دریافت مطالب");

}



let text = "📖 لیست مطالب\n\n";


if(files.length === 0){

text += "❌ هنوز مطلبی ثبت نشده است.";

}

else{


files.forEach((file,index)=>{


let icon="📄";


if(file.file_type==="photo")
icon="🖼";

if(file.file_type==="video")
icon="🎬";

if(file.file_type==="audio")
icon="🎵";


text += 
`${index+1}️⃣ ${icon} ${file.file_type}\n`;


if(file.caption){

text += `📝 ${file.caption}\n`;

}


text += "\n";


});


}



ctx.reply(

text,

Markup.inlineKeyboard([


[
{
text:"➕ افزودن مطلب",
callback_data:"add_content_"+buttonId
}
],


[
{
text:"🗑 حذف همه",
callback_data:"delete_all_content_"+buttonId
}
],


[
{
text:"⬅️ بازگشت",
callback_data:"button_"+buttonId
},
{
text:"🏠 صفحه اصلی",
callback_data:"home"
}
]


])


);



});


}



module.exports=listContent;