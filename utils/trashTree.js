const db = require("../database/database");


function buildTrashTree(buttonId, callback){


let result = "";


// گرفتن فایل‌های همین شاخه

db.all(

`SELECT *
FROM files
WHERE button_id=?
AND deleted=1
ORDER BY id ASC`,

[buttonId],

(err,files)=>{


if(err){
callback(err);
return;
}



files.forEach(file=>{


if(file.file_type==="document"){

result += `📄 فایل: ${file.caption || "بدون نام"}\n`;

}

else if(file.file_type==="photo"){

result += `🖼 عکس: ${file.caption || "بدون نام"}\n`;

}

else if(file.file_type==="video"){

result += `🎬 ویدیو: ${file.caption || "بدون نام"}\n`;

}

else{

result += `📎 مطلب: ${file.caption || "بدون نام"}\n`;

}


});





// گرفتن زیرشاخه‌های حذف شده

db.all(

`SELECT *
FROM buttons
WHERE parent_id=?
AND deleted=1
ORDER BY id ASC`,

[buttonId],

(err,children)=>{


if(err){
callback(err);
return;
}



if(children.length===0){

callback(null,result);
return;

}



let count=children.length;


children.forEach(child=>{


buildTrashTree(child.id,(err,text)=>{


if(err){

callback(err);
return;

}


result += 
`\n📁 ${child.title}\n`;


result += text;



count--;


if(count===0){

callback(null,result);

}


});


});



});


});


}



module.exports = buildTrashTree;