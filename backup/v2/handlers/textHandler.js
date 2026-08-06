const createButton = require("../admin/createButton");
const subMenuManager = require("../admin/subMenuManager");
const stateManager = require("./stateManager");
const addContent = require("../admin/addContent");



module.exports = (bot) => {


    bot.on("message", (ctx) => {




        if(ctx.message.text && ctx.message.text === "/cancel"){

            stateManager.clearState(ctx.from.id);
        
            ctx.reply("❌ عملیات لغو شد.");
        
            return;
        
        }




        const state = stateManager.getState(
            ctx.from.id
        );


        if (!state) {

            return;

        }


        if (state.state === "createButton") {


            createButton.handleCreateButton(ctx);

            return;

        }



        if (state.state === "createSub") {


            subMenuManager.saveSubMenu(ctx);

            return;


        }



        if(state.state === "renameButton"){

            const renameButton = require("../admin/renameButton");
        
            renameButton(ctx);
        
            return;
        
        }




        if(state.state === "addContent"){

            addContent.saveContent(ctx);
            return;
        
        }

    });


};