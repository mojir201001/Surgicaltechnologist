const { Markup } = require("telegraf");
const db = require("../database/database");


function subMenuList(ctx, parentId){


    db.get(
        "SELECT * FROM buttons WHERE id=?",
        [parentId],
        (err, parent)=>{


            if(err){
                return ctx.reply("❌ خطا در دریافت اطلاعات");
            }


            db.all(
                "SELECT * FROM buttons WHERE parent_id=? AND deleted=0 ORDER BY position ASC",
                [parentId],
                (err, rows)=>{


                    if(err){
                        return ctx.reply("❌ خطا در دریافت زیرشاخه‌ها");
                    }


                    let keyboard=[];


                    rows.forEach(button=>{


                        let icon="📄";


                        if(button.mode==="folder"){
                            icon="📂";
                        }


                        keyboard.push([
                            {
                                text: icon+" "+button.title,
                                callback_data:"button_"+button.id
                            }
                        ]);


                    });



                    keyboard.push([
                        {
                            text:"➕ ایجاد زیرشاخه",
                            callback_data:"add_sub_"+parentId
                        }
                    ]);



                    keyboard.push([
                        {
                            text:"⬅️ برگشت به دکمه مادر",
                            callback_data:"button_"+parent.parent_id
                        }
                    ]);



                    keyboard.push([
                        {
                            text:"🏠 صفحه اصلی",
                            callback_data:"home"
                        }
                    ]);




                    ctx.reply(

`📂 زیرشاخه‌های:

${parent.title}

تعداد:
${rows.length}`,

Markup.inlineKeyboard(keyboard)

);


                }
            );

        }
    );


}



module.exports=subMenuList;