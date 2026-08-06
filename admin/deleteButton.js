const db = require("../database/database");
const { Markup } = require("telegraf");


function deleteButton(ctx, buttonId){


    db.get(
        "SELECT * FROM buttons WHERE id=?",
        [buttonId],
        (err,button)=>{


            if(err || !button){

                return ctx.reply(
                    "❌ دکمه پیدا نشد."
                );

            }



            db.all(

`WITH RECURSIVE tree(id) AS (

    SELECT id 
    FROM buttons
    WHERE id = ?

    UNION ALL

    SELECT buttons.id
    FROM buttons
    JOIN tree
    ON buttons.parent_id = tree.id

)

SELECT id FROM tree`
,
[buttonId],

(err,rows)=>{


    let ids = rows.map(x=>x.id);



    db.get(
        "SELECT COUNT(*) AS count FROM files WHERE button_id IN ("+
        ids.map(()=>"?").join(",")+
        ")",
        ids,
        (err,fileCount)=>{


            ctx.reply(

`⚠️ انتقال به سطل زباله

📂 نام:
${button.title}

📂 تعداد زیرشاخه:
${ids.length-1}

📄 تعداد فایل:
${fileCount.count}


آیا مطمئن هستید؟`
,
Markup.inlineKeyboard([
[
{
text:"✅ انتقال به سطل زباله",
callback_data:`confirm_delete_${buttonId}`
}
],
[
{
text:"❌ انصراف",
callback_data:"cancel_delete"
}
]
])

            );


        }
    );


});


        }

    );


}



module.exports = deleteButton;