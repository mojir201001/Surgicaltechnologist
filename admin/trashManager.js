const db = require("../database/database");
const listEngine = require("../utils/listEngine");
const listCache = require("../utils/listCache");
const { Markup } = require("telegraf");
const { getButtonPath } = require("../utils/pathBuilder");
const {formatDateTime} = require("../utils/dateTime");
const { getButtonMode } = require("../utils/buttonMode");
const buildTrashTree = require("../utils/trashTree");




function trashManager(ctx){


ctx.reply(
"🗑 سطل زباله",
Markup.inlineKeyboard([

[
{
text:"📂 دکمه‌های حذف شده",
callback_data:"trash_buttons"
}
],

[
{
text:"📄 فایل‌های حذف شده",
callback_data:"trash_files"
}
],

[
{
text:"🔍 جستجو",
callback_data:"trash_search"
}
],

[
{
text:"⬅️ بازگشت",
callback_data:"admin_panel"
}
]

])
);


}




function showDeletedButtons(ctx){

    db.all(

`SELECT *
FROM buttons
WHERE deleted = 1
AND (
    parent_id = 0
    OR parent_id NOT IN (
        SELECT id
        FROM buttons
        WHERE deleted = 1
    )
)
ORDER BY deleted_at DESC`,

[],
(err,rows)=>{


    if(err){

        return ctx.reply("❌ خطا در دریافت سطل زباله.");

    }


    if(rows.length===0){

        return ctx.reply("🗑 سطل زباله خالی است.");

    }



    const items = rows.map(button=>{

        return {

            text:"📂 " + button.title,

            callback_data:"trash_button_" + button.id

        };

    });



    listCache.saveList(
        "trash_buttons",
        items
    );



    let keyboard = listEngine(
        items,
        1,
        20,
        "trash_buttons"
    );
    
    
    keyboard.reply_markup.inline_keyboard.push([
        {
            text:"🏠 صفحه اصلی",
            callback_data:"admin_panel"
        }
    ]);
    
    
    ctx.reply(
        "🗑 سطل زباله",
        keyboard
    );

});


}




function showTrashItem(ctx,id){


    db.get(
    
    "SELECT * FROM buttons WHERE id=? AND deleted=1",
    
    [id],
    
    (err,button)=>{
    
    
    if(err || !button){
    
        return ctx.reply(
            "❌ مورد پیدا نشد یا قبلاً بازیابی شده است."
        );
    
    }
    
    
    
    db.get(
    
    "SELECT COUNT(*) AS count FROM files WHERE button_id=? AND deleted=1",
    
    [button.id],
    
    (err,fileResult)=>{
    
    
    db.get(
    
    "SELECT COUNT(*) AS count FROM buttons WHERE parent_id=? AND deleted=1",
    
    [button.id],
    
    (err,subResult)=>{
    
    
    let files = fileResult ? fileResult.count : 0;
    let subs = subResult ? subResult.count : 0;
    
    

    getButtonPath(button.id, (path)=>{


    

    const dt = formatDateTime(button.deleted_at);


    buildTrashTree(button.id,(err,tree)=>{


        if(err){
        
        return ctx.reply(
        "❌ خطا در خواندن ساختار حذف شده."
        );
        
        }



    ctx.reply(

`🗑 اطلاعات مورد حذف شده


📌 نام:
${button.title}


📂 نوع:
${getButtonMode(button.mode)}


📍 مسیر:
${path}


📦 محتویات حذف شده:

${tree}


📅 تاریخ حذف:
${dt.date}


🕒 ساعت حذف:
${dt.time}


👤 حذف شده توسط:
${button.deleted_by || "مدیر"}


🆔 شناسه:
${button.id}`,





Markup.inlineKeyboard([


    [
    {
    text:"♻️ فقط همین مورد",
    callback_data:"restore_only_"+button.id
    }
    ],
    
    
    [
    {
    text:"🌲 بازیابی کامل شاخه",
    callback_data:"restore_full_"+button.id
    }
    ],
    
    
    [
    {
    text:"🗑 حذف دائمی",
    callback_data:"force_delete_button_"+button.id
    }
    ],
    
    
    [
    {
    text:"⬅️ بازگشت",
    callback_data:"trash_buttons"
    }
    ]
    
    
    ])
    
   
    
    )
    
    ;
    
    }); // getButtonPath
    
    
    }); // subCount db.get
    
    
    }); // fileCount db.get
    
    
    }); // button db.get
    
    
}

    )}




function getDeletedTree(parentId, callback){

    db.all(

`WITH RECURSIVE tree(id,title,parent_id) AS (

    SELECT id,title,parent_id
    FROM buttons
    WHERE parent_id=? 
    AND deleted=1

    UNION ALL

    SELECT buttons.id,buttons.title,buttons.parent_id
    FROM buttons
    JOIN tree
    ON buttons.parent_id = tree.id
    WHERE buttons.deleted=1

)

SELECT *
FROM tree`
,
[parentId],
(err,rows)=>{

    if(err){
        callback([]);
        return;
    }

    callback(rows);

});

}



module.exports = {
    trashManager,
    showDeletedButtons,
    showTrashItem
};