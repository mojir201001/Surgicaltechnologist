const db = require("../database/database");


function sendUserContent(ctx, buttonId){


db.get(
"SELECT * FROM buttons WHERE id=?",
[buttonId],
(err,button)=>{


if(err || !button){
return ctx.reply("❌ دکمه پیدا نشد");
}



let order="ORDER BY id DESC";


if(button.content_order==="old"){
order="ORDER BY id ASC";
}


if(button.content_order==="random"){
order="ORDER BY RANDOM()";
}



db.all(

`SELECT * FROM files 
WHERE button_id=?
${order}`,

[buttonId],

(err,files)=>{


if(err){
return ctx.reply("❌ خطا در دریافت مطالب");
}



if(files.length===0){

return ctx.reply(
"📭 مطلبی برای این بخش وجود ندارد."
);

}



files.forEach(file=>{


    console.log("SEND TO CHAT:", ctx.chat.id);
    console.log("FILE TYPE:", file.file_type);


if(file.file_type==="document"){

ctx.replyWithDocument(file.file_id);

}


else if(file.file_type==="photo"){

ctx.replyWithPhoto(file.file_id);

}


else if(file.file_type==="video"){

ctx.replyWithVideo(file.file_id);

}


else if(file.file_type==="audio"){

ctx.replyWithAudio(file.file_id);

}


else if(file.caption){

ctx.reply(file.caption);

}



});



});


});


}



module.exports=sendUserContent;