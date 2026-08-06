const db = require("../database/database");



// پیدا کردن والدهای حذف شده و بازگرداندن آن‌ها
function restoreParents(buttonId, callback){


db.get(
"SELECT parent_id FROM buttons WHERE id=?",
[buttonId],
(err,row)=>{


if(err){
callback(err);
return;
}


if(!row || row.parent_id===0){

callback(null);
return;

}



db.get(
"SELECT deleted FROM buttons WHERE id=?",
[row.parent_id],
(err,parent)=>{


if(err){
callback(err);
return;
}



if(parent && parent.deleted===1){


db.run(

`UPDATE buttons
SET deleted=0,
deleted_at=NULL,
deleted_by=NULL
WHERE id=?`
,
[row.parent_id],
(err)=>{


if(err){
callback(err);
return;
}


restoreParents(row.parent_id,callback);


});


}
else{


restoreParents(row.parent_id,callback);


}



});


});


}





// فقط خود مورد + والدهای ضروری
function restoreOnly(buttonId,callback){



restoreParents(buttonId,(err)=>{


if(err){
callback(err);
return;
}



db.run(


`UPDATE buttons
SET deleted=0,
deleted_at=NULL,
deleted_by=NULL
WHERE id=?`
,

[buttonId],

(err)=>{


if(err){
callback(err);
return;
}



// اگر خود آیتم فایل داشت، فایل‌های خودش برگردد

db.run(


`UPDATE files
SET deleted=0,
deleted_at=NULL,
deleted_by=NULL
WHERE button_id=?
AND deleted=1`
,

[buttonId],

callback


);


});


});


}







// بازیابی کامل شاخه
function restoreFull(buttonId,callback){



db.run(


`UPDATE buttons
SET deleted=0,
deleted_at=NULL,
deleted_by=NULL
WHERE id=?`
,

[buttonId],

(err)=>{


if(err){
callback(err);
return;
}



db.run(


`UPDATE files
SET deleted=0,
deleted_at=NULL,
deleted_by=NULL
WHERE button_id=?
AND deleted=1`
,

[buttonId],

(err)=>{


if(err){
callback(err);
return;
}



db.all(


`SELECT id
FROM buttons
WHERE parent_id=?
AND deleted=1`
,

[buttonId],

(err,rows)=>{


if(err){
callback(err);
return;
}



if(rows.length===0){

callback(null);
return;

}



let count=rows.length;


rows.forEach(item=>{


restoreFull(item.id,(err)=>{


if(err){
callback(err);
return;
}


count--;


if(count===0){

callback(null);

}


});


});


});


});


});


}



module.exports={

restoreOnly,
restoreFull

};