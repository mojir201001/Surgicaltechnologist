const db = require("../database/database");


function confirmDelete(ctx, buttonId){


    const deletedBy = ctx.from.id;
    const now = new Date().toISOString();
    const deletedRootId = buttonId;


    db.all(

`WITH RECURSIVE tree(id) AS (

    SELECT id
    FROM buttons
    WHERE id = ?
    AND deleted = 0

    UNION ALL

    SELECT buttons.id
    FROM buttons
    JOIN tree
    ON buttons.parent_id = tree.id
    WHERE buttons.deleted = 0

)

SELECT id FROM tree`
,
[buttonId],

(err, rows)=>{


    if(err){

        console.log(err);

        return ctx.reply(
            "❌ خطا در پیدا کردن زیرشاخه‌ها."
        );

    }



    const ids = rows.map(item=>item.id);

    console.log("DELETE IDS:", ids);

    if(ids.length===0){

        return ctx.reply(
            "❌ چیزی برای حذف پیدا نشد."
        );

    }



    const placeholders = ids.map(()=>"?").join(",");



    // حذف فایل‌های مربوط به این شاخه

    db.run(

`UPDATE files
SET 
deleted = 1,
deleted_at = ?,
deleted_by = ?,
deleted_root_id = ?


WHERE button_id IN (${placeholders})`
,
[
    now,
    deletedBy,
    deletedRootId,
    ...ids
],

(err)=>{


    if(err){

        console.log(err);

    }



    // حذف خود دکمه‌ها و زیرشاخه‌ها


    db.run(

`UPDATE buttons
SET
deleted = 1,
deleted_at = ?,
deleted_by = ?,
deleted_root_id = ?

WHERE id IN (${placeholders})`
,
[
    now,
    deletedBy,
    deletedRootId,
    ...ids
],

(err)=>{


    if(err){

        console.log(err);

        return ctx.reply(
            "❌ خطا در انتقال به سطل زباله."
        );

    }



    ctx.reply(

`🗑 انتقال انجام شد.

📂 تعداد دکمه‌ها:
${ids.length}

📄 فایل‌های داخل آن‌ها نیز به سطل زباله منتقل شدند.

♻️ امکان بازیابی در سطل زباله وجود دارد.`

    );


});


});


});


}



module.exports = confirmDelete;