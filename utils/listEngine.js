const { Markup } = require("telegraf");


function createPagination(items, page = 1, perPage = 10, callbackPrefix){

    const totalPages = Math.ceil(items.length / perPage) || 1;


    if(page < 1){
        page = 1;
    }


    if(page > totalPages){
        page = totalPages;
    }



    const start = (page - 1) * perPage;

    const end = start + perPage;


    const currentItems = items.slice(start,end);



    let keyboard = [];


    currentItems.forEach(item=>{

        keyboard.push([
            {
                text:item.text,
                callback_data:item.callback_data
            }
        ]);

    });



    let navigation = [];



    if(page > 1){

        navigation.push({

            text:"⬅️ قبلی",

            callback_data:
            `${callbackPrefix}_page_${page-1}`

        });

    }



    navigation.push({

        text:`📄 ${page} از ${totalPages}`,

        callback_data:"no_action"

    });



    if(page < totalPages){

        navigation.push({

            text:"بعدی ➡️",

            callback_data:
            `${callbackPrefix}_page_${page+1}`

        });

    }



    if(navigation.length){

        keyboard.push(navigation);

    }



    return Markup.inlineKeyboard(keyboard);

}



module.exports=createPagination;