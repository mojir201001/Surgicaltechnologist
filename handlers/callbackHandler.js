const listButtons = require("../admin/listButtons");
const createButton = require("../admin/createButton");
const buttonSettings = require("../admin/buttonSettings");
const subMenuManager = require("../admin/subMenuManager");
const buttonOptions = require("../admin/buttonOptions");
const subMenuList = require("../admin/subMenuList");
const stateManager = require("./stateManager");
const contentManager = require("../content/contentManager");
const addContent = require("../content/addContent");
const listContent = require("../content/listContent");
const deleteContent = require("../content/deleteContent");
const deleteAllContent = require("../content/deleteAllContent");
const contentOrder = require("../content/contentOrder");
const buttonType = require("../admin/buttonType");
const showUserButtons = require("./userButtons");
const db = require("../database/database");
const sendUserContent = require("./userContent");
const {trashManager, showTrashItem} = require("../admin/trashManager");
const restoreButton = require("../admin/restoreButton");
const adminPanel = require("../admin/adminPanel");
const { Markup } = require("telegraf");




module.exports = (bot) => {




    bot.action("admin_panel",(ctx)=>{

        adminPanel(ctx);
    
    });






    bot.action("buttons", (ctx) => {

        listButtons(ctx);

    });



    bot.action("create_button", (ctx) => {

        createButton.createButton(ctx);

    });



    bot.action("set_folder", (ctx) => {

        buttonSettings.setButtonType(ctx,"folder");

    });



    bot.action(/^set_content_(.+)$/, (ctx)=>{

        buttonSettings.setButtonType(
            ctx,
            "content",
            ctx.match[1]
        );
    
    });



    bot.action(/^set_input_(.+)$/, (ctx)=>{

    buttonSettings.setButtonType(
        ctx,
        "input",
        ctx.match[1]
    );

});

   

    bot.action(/^submenu_(.+)$/, (ctx)=>{

        subMenuList(
            ctx,
            ctx.match[1]
        );

    });



    bot.action(/^add_sub_(.+)$/, (ctx)=>{


        const parentId = ctx.match[1];


        stateManager.setState(
            ctx.from.id,
            "createSub",
            {
                parentId
            }
        );


        ctx.reply(
            "✏️ نام زیرشاخه را ارسال کنید."
        );


    });



    bot.action("cancel_operation",(ctx)=>{


        stateManager.clearState(
            ctx.from.id
        );


        ctx.reply(
            "❌ عملیات لغو شد."
        );


    });






    bot.action(/^add_content_(.+)$/, (ctx)=>{

        addContent(
            ctx,
            ctx.match[1]
        );
    
    });




    bot.action(/^list_content_(.+)$/, (ctx)=>{

        listContent(
            ctx,
            ctx.match[1]
        );
    
    });




    bot.action(/^delete_content_(.+)$/, (ctx)=>{

        deleteContent(
            ctx,
            ctx.match[1]
        );
    
    });



    bot.action(/^delete_all_content_(.+)$/, (ctx)=>{

        deleteAllContent(ctx);
    
    });



    bot.action(/^sort_random_(.+)$/, (ctx)=>{

        contentOrder(
            ctx,
            "random"
        );
    
    });



    bot.action(/^sort_old_(.+)$/, (ctx)=>{

        contentOrder(
            ctx,
            "old"
        );
    
    });




    bot.action(/^sort_new_(.+)$/, (ctx)=>{

        contentOrder(
            ctx,
            "new"
        );
    
    });




    bot.action(/^change_type_(.+)_(.+)$/, (ctx)=>{

        buttonType.changeButtonType(
            ctx,
            ctx.match[2],
            ctx.match[1]
        );
    
    });





    bot.action(/^confirm_type_(.+)_(.+)$/, (ctx)=>{


        buttonType.updateType(
            ctx,
            ctx.match[1],
            ctx.match[2]
        );
    
    
    });




   bot.action(/^full_change_(.+)_(.+)$/, (ctx)=>{

    buttonType.fullChangeType(
        ctx,
        ctx.match[1],
        ctx.match[2]
    );

});


bot.action(/^add_type_(.+)_(.+)$/, (ctx)=>{

    buttonType.addMixedType(
        ctx,
        ctx.match[1],
        ctx.match[2]
    );

});
        
        

bot.action(/^add_capability_(.+)$/, (ctx)=>{

    buttonType.addCapabilityMenu(
        ctx,
        ctx.match[1]
    );

});



bot.action(/^remove_capability_(.+)$/, (ctx)=>{

    buttonType.removeCapabilityMenu(
        ctx,
        ctx.match[1]
    );

});



bot.action(/^remove_type_(.+)_(.+)$/, (ctx)=>{

    buttonType.removeType(
        ctx,
        ctx.match[2],
        ctx.match[1]
    );

});


    bot.action(/^button_type_(.+)$/, (ctx)=>{

        buttonType.buttonTypeMenu(
            ctx,
            ctx.match[1]
        );
    
    });

    bot.action(/^button_(.+)$/, (ctx)=>{

        buttonSettings.buttonSettings(
            ctx,
            ctx.match[1]
        );
    
    });





    bot.action(/^user_button_(.+)$/, (ctx)=>{

        const id = ctx.match[1];
    

        

        db.get(
            "SELECT * FROM buttons WHERE id=?",
            [id],
            (err,button)=>{
    
    
                if(err || !button){
    
                    return ctx.reply("❌ دکمه پیدا نشد.");
    
                }
    
    
    
                // اگر دکمه پوشه است
    
                if(button.mode === "folder"){
    
                    showUserButtons(ctx,id);
    
                    return;
    
                }
    
    
    
                // اگر دکمه فایل دارد
    
                if(button.mode === "content"){
    
                    sendUserContent(
                        ctx,
                        id
                    );
    
                    return;
    
                }
    
    
    
                // اگر دریافت مطلب است
    
                if(button.mode === "input"){
    
    
                    ctx.reply(
                        "📥 لطفاً اطلاعات مورد نیاز را ارسال کنید."
                    );
    
    
                    return;
    
                }



                // اگر دکمه ترکیبی است

if(button.mode === "mixed"){

    showUserButtons(ctx,id);

    sendUserContent(ctx,id);

    return;

}




// اگر دکمه لینک است

if(button.mode === "link"){

    ctx.reply(
        "🔗 این بخش در مرحله بعد تکمیل می‌شود."
    );

    return;

}
    
    
    
                ctx.reply(
                    "⚠️ این دکمه هنوز تنظیم نشده است."
                );
    
    
            }
        );
    
    
    });


   
    bot.action(/^delete_(.+)$/, (ctx)=>{

        const deleteButton = require("../admin/deleteButton");
    
        deleteButton(
            ctx,
            ctx.match[1]
        );
    
    });




   


    bot.action(/^rename_(.+)$/, (ctx)=>{

        const stateManager = require("./stateManager");
    
        stateManager.setState(
            ctx.from.id,
            "renameButton",
            {
                buttonId:ctx.match[1]
            }
        );
    
        ctx.reply(
            "✏️ نام جدید دکمه را ارسال کنید."
        );
    
    });





    bot.action(/^confirm_delete_(.+)$/, (ctx)=>{

        console.log("CONFIRM DELETE:", ctx.match[1]);
    
        const confirmDelete = require("../admin/confirmDelete");
    
        confirmDelete(
            ctx,
            ctx.match[1]
        );
    
    });
    
    
    bot.action("cancel_delete",(ctx)=>{
    
        console.log("DELETE CANCEL");
    
        ctx.reply("❌ حذف لغو شد.");
    
    });





    bot.action("trash",(ctx)=>{

        trashManager(ctx);
    
    });





   bot.action("trash_buttons",(ctx)=>{

        const {showDeletedButtons}=require("../admin/trashManager");
    
        showDeletedButtons(ctx);
    
    });





    bot.action(/^trash_button_(.+)$/, (ctx)=>{

        showTrashItem(
            ctx,
            ctx.match[1]
        );
    
    });






    bot.action(/^trash_buttons_page_(.+)$/, (ctx)=>{


        const page = Number(ctx.match[1]);
    
    
        const listCache = require("../utils/listCache");
        const listEngine = require("../utils/listEngine");
    
    
        const items = listCache.getList(
            "trash_buttons"
        );
    
    
        if(!items){
    
            return ctx.reply(
                "❌ اطلاعات صفحه منقضی شده است."
            );
    
        }
    
    
    
        ctx.editMessageReplyMarkup(
    
            listEngine(
                items,
                page,
                20,
                "trash_buttons"
            ).reply_markup
    
        );
    
    
    });







    bot.action(/^restore_only_(.+)$/, (ctx)=>{
    
        restoreButton.restoreOnly(
            ctx.match[1],
            (err)=>{
    
                if(err){
    
                    return ctx.reply("❌ خطا در بازیابی.");
    
                }
    
    
                ctx.reply(
                    "✅ مورد انتخاب شده و والدهای لازم بازیابی شدند."
                );
    
            }
        );
    
    });
    
    
    
    bot.action(/^restore_full_(.+)$/, (ctx)=>{
    
        restoreButton.restoreFull(
            ctx.match[1],
            (err)=>{
    
                if(err){
    
                    return ctx.reply("❌ خطا در بازیابی.");
    
                }
    
    
                ctx.reply(
                    "✅ شاخه کامل بازیابی شد."
                );
    
            }
        );
    
    });





    
};




