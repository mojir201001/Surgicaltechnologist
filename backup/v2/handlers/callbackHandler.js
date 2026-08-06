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





module.exports = (bot) => {


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





};




