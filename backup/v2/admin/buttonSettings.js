const { Markup } = require("telegraf");
const db = require("../database/database");



function buttonSettings(ctx, buttonId){


    db.get(
        "SELECT * FROM buttons WHERE id=?",
        [buttonId],
        (err, button)=>{


            if(err || !button){

                return ctx.reply(
                    "❌ دکمه پیدا نشد."
                );

            }


            console.log("BUTTON ID:", button.id);
console.log("BUTTON MODE:", button.mode);

db.get(
    "SELECT COUNT(*) AS count FROM files WHERE button_id=?",
    [buttonId],
    (err,fileResult)=>{


        db.get(
            "SELECT COUNT(*) AS count FROM buttons WHERE parent_id=?",
            [buttonId],
            (err,subResult)=>{


                button.fileCount = fileResult ? fileResult.count : 0;

                button.subCount = subResult ? subResult.count : 0;
db.all(
    
    `WITH RECURSIVE path(id,parent_id,title) AS (
        SELECT id,parent_id,title
        FROM buttons
        WHERE id = ?

        UNION ALL

        SELECT b.id,b.parent_id,b.title
        FROM buttons b
        JOIN path p
        ON b.id = p.parent_id
    )

    SELECT title FROM path
    ORDER BY id ASC`
    ,
    [buttonId],
    (err,path)=>{

        let route = "";

        if(path){
            route = path
            .map(p=>p.title)
            .reverse()
            .join(" ➜ ");
        }



            let buttons = [];


            // اگر زیرشاخه دارد
            if(button.mode === "folder"){


                buttons.push([
                    {
                        text:"📂 مدیریت زیرشاخه‌ها",
                        callback_data:`submenu_${button.id}`
                    }
                ]);


            }

            // اگر زیرشاخه ندارد



// اگر هنوز نوع ندارد
else if(button.mode === "none"){

    buttons.push([
        {
            text:"📂 ایجاد زیرشاخه",
            callback_data:"add_sub_" + button.id
        }
    ]);

    buttons.push([
        {
            text:"📖 نمایش مطلب",
            callback_data:"set_content_" + button.id
        }
    ]);

    buttons.push([
        {
            text:"📥 دریافت مطلب",
            callback_data:"set_input_" + button.id
        }
    ]);

}


// اگر حالت نمایش مطلب دارد
else if(button.mode === "content"){

    buttons.push([
        {
            text:"📖 مدیریت مطالب",
            callback_data:"set_content_" + button.id
        }
    ]);

}


// اگر حالت دریافت مطلب دارد
else if(button.mode === "input"){

    buttons.push([
        {
            text:"📥 مدیریت فایل‌ها",
            callback_data:"set_input_" + button.id
        }
    ]);

}


            buttons.push(
                
                [
                    {
                    text:"⚙️ تنظیم نوع دکمه",
                    callback_data:"button_type_" + button.id
                    }
                    ],
                
                [
                    {
                        
                        text:"✏️ تغییر نام",
                        callback_data:`rename_${button.id}`
                    }
                ],

                [
                    {
                        text:"🎨 تغییر ظاهر",
                        callback_data:`style_${button.id}`
                    }
                ],

                [
                    {
                        text:"🔗 لینک دکمه",
                        callback_data:`link_${button.id}`
                    }
                ],

                [
                    {
                        text:"/ ایجاد دستور",
                        callback_data:`command_${button.id}`
                    }
                ],

                [
                    {
                        text:"🔒 قفل دکمه",
                        callback_data:`lock_${button.id}`
                    }
                ],

                [
                    {
                        text:"👁 مخفی / نمایش",
                        callback_data:`hide_${button.id}`
                    }
                ],

                [
                    {
                        text:"↕️ انتقال جایگاه",
                        callback_data:`move_${button.id}`
                    }
                ],

                [
                    {
                        text:"🗑 حذف دکمه",
                        callback_data:`delete_${button.id}`
                    }
                ],

                [
                    {
                        text:"⬅️ بازگشت",
                        callback_data:"admin_back"
                    },
                    {
                        text:"🏠 صفحه اصلی",
                        callback_data:"home"
                    }
                ]

            );



            ctx.reply(

                `⚙️ مدیریت دکمه
                
                📌 مسیر:
                ${route}
                
                📌 نام:
                ${button.title}
                
                📊 آمار:
                📂 زیرشاخه‌ها: ${button.subCount || 0}
                📄 مطالب: ${button.fileCount || 0}
                
                انتخاب کنید:`,
                
                Markup.inlineKeyboard(buttons)
                
                );
                
                
                    });
                
                  });
                
        });
                
                });

            }



function setButtonType(ctx,type,buttonId){

    ctx.answerCbQuery();


    db.run(
        "UPDATE buttons SET mode=? WHERE id=?",
        [
            type,
            buttonId
        ],
        function(err){

            if(err){
                console.log(err);
                return ctx.reply("❌ خطا در تغییر حالت");
            }


            if(type==="content"){

                const contentManager = require("../content/contentManager");

                contentManager(
                    ctx,
                    buttonId
                );

                return;

            }


            if(type==="input"){

                ctx.reply(
                    "📥 حالت دریافت مطلب فعال شد."
                );

                return;

            }


            if(type==="folder"){

                ctx.reply(
                    "📂 حالت پوشه فعال شد."
                );

                return;

            }




            if(type==="mixed"){
                ctx.reply("🔀 حالت ترکیبی فعال شد.");
                return;
            }
            
            if(type==="link"){
                ctx.reply("🔗 حالت لینک فعال شد.");
                return;
            }

            

        }
    );

}




module.exports={
    buttonSettings,
    setButtonType
};