const db = require("../database/database");
const { Markup } = require("telegraf");
const getRealButtonMode = require("../utils/getRealButtonMode");





function buttonTypeMenu(ctx, buttonId){


    db.get(
        "SELECT * FROM buttons WHERE id=?",
        [buttonId],
        (err, button)=>{


            if(err || !button){

                return ctx.reply("❌ دکمه پیدا نشد.");

            }


            getRealButtonMode(buttonId, function(result){

                const realMode = result.mode;
                const types = result.types;
            
                let currentType = "";
            
                if(realMode === "none"){
                    currentType = "🔘 بدون تنظیم";
                }
                else if(realMode === "folder"){
                    currentType = "📂 ایجاد زیرشاخه";
                }
                else if(realMode === "content"){
                    currentType = "📖 نمایش مطلب";
                }
                else if(realMode === "input"){
                    currentType = "📥 دریافت مطلب";
                }
                else if(realMode === "link"){
                    currentType = "🔗 لینک";
                }
                else if(realMode==="mixed"){

                    currentType = "🔀 ترکیبی\n\n";}
                else{
                    currentType="🔘 بدون تنظیم";
                
                    const names = [];
            
                    if(types.includes("folder"))
                        names.push("📂 ایجاد زیرشاخه");
            
                    if(types.includes("content"))
                        names.push("📖 نمایش مطلب");
            
                    if(types.includes("input"))
                        names.push("📥 دریافت مطلب");
            
                    if(types.includes("link"))
                        names.push("🔗 لینک");
            
                    currentType += names.join("\n+\n");
                }





                let keyboard = [];



                keyboard.push([
                    {
                        text:"➕ اضافه کردن قابلیت",
                        callback_data:"add_capability_" + buttonId
                    }
                ]);
                
                keyboard.push([
                    {
                        text:"➖ حذف قابلیت",
                        callback_data:"remove_capability_" + buttonId
                    }
                ]);


                
                keyboard.push([
                    {
                        text:"⬅️ بازگشت",
                        callback_data:"back_button_" + buttonId
                    },
                    {
                        text:"🏠 صفحه اصلی",
                        callback_data:"home"
                    }
                ]);


                   
                   
                   
                   ctx.reply(

`⚙️ تنظیم نوع دکمه

📌 نام دکمه:
${button.title}


🔹 نوع فعلی:
${currentType}


نوع جدید را انتخاب کنید:`,

Markup.inlineKeyboard(keyboard)

);

});     
        }
)};








function addCapabilityMenu(ctx,id){

    db.get(
        "SELECT * FROM buttons WHERE id=?",
        [id],
        (err,button)=>{

            if(err || !button)
                return ctx.reply("❌ دکمه پیدا نشد.");

            let types=[];

            if(button.types){
                types=button.types.split(",");
            }
            else if(button.mode && button.mode!=="none"){
                types=[button.mode];
            }


           // هیچ کاری نکن


            if(
                types.includes("folder") &&
                types.includes("content") &&
                types.includes("input") &&
                types.includes("link")
            ){

                return ctx.reply(
                    "⚠️ تمام قابلیت‌ها قبلاً فعال شده‌اند."
                );

            }


            let keyboard=[];


            if(!types.includes("folder")){
                keyboard.push([
                    {
                        text:"📂 ایجاد زیرشاخه",
                        callback_data:`change_type_folder_${id}`
                    }
                ]);
            }


            if(!types.includes("content")){
                keyboard.push([
                    {
                        text:"📖 نمایش مطلب",
                        callback_data:`change_type_content_${id}`
                    }
                ]);
            }


            if(!types.includes("input")){
                keyboard.push([
                    {
                        text:"📥 دریافت مطلب",
                        callback_data:`change_type_input_${id}`
                    }
                ]);
            }


            if(!types.includes("link")){
                keyboard.push([
                    {
                        text:"🔗 لینک",
                        callback_data:`change_type_link_${id}`
                    }
                ]);
            }


            ctx.reply(
                "➕ انتخاب قابلیت جدید:",
                Markup.inlineKeyboard(keyboard)
            );

        }
    );

}


function removeCapabilityMenu(ctx,id){

    db.get(
        "SELECT * FROM buttons WHERE id=?",
        [id],
        (err,button)=>{

            if(err || !button){
                return ctx.reply("❌ دکمه پیدا نشد.");
            }


            let types=[];


            if(button.types){

                types = button.types
                .split(",")
                .filter(x=>x);

            }
            else if(button.mode && button.mode!=="none"){

                types.push(button.mode);

            }



            if(types.length===0){

                return ctx.reply(
                    "⚠️ این دکمه هیچ قابلیتی ندارد که حذف شود."
                );

            }



            let keyboard=[];



            if(types.includes("folder")){

                keyboard.push([
                    {
                        text:"📂 حذف ایجاد زیرشاخه",
                        callback_data:`remove_type_folder_${id}`
                    }
                ]);

            }



            if(types.includes("content")){

                keyboard.push([
                    {
                        text:"📖 حذف نمایش مطلب",
                        callback_data:`remove_type_content_${id}`
                    }
                ]);

            }



            if(types.includes("input")){

                keyboard.push([
                    {
                        text:"📥 حذف دریافت مطلب",
                        callback_data:`remove_type_input_${id}`
                    }
                ]);

            }



            if(types.includes("link")){

                keyboard.push([
                    {
                        text:"🔗 حذف لینک",
                        callback_data:`remove_type_link_${id}`
                    }
                ]);

            }



            keyboard.push([
                {
                    text:"⬅️ بازگشت",
                    callback_data:`button_type_${id}`
                },
                {
                    text:"🏠 صفحه اصلی",
                    callback_data:"home"
                }
            ]);



            ctx.reply(
                "➖ انتخاب کنید کدام قابلیت حذف شود:",
                Markup.inlineKeyboard(keyboard)
            );

        }
    );

}




function changeButtonType(ctx, buttonId, type){


db.get(
"SELECT * FROM buttons WHERE id=?",
[buttonId],
(err,button)=>{


if(err || !button)
return ctx.reply("❌ دکمه پیدا نشد");


db.get(
"SELECT COUNT(*) AS count FROM files WHERE button_id=?",
[buttonId],
(err,files)=>{


db.get(
"SELECT COUNT(*) AS count FROM buttons WHERE parent_id=?",
[buttonId],
(err,subs)=>{


    let hasOldType = false;

    if(button.mode && button.mode !== "none"){
        hasOldType = true;
    }
    
    if(button.types && button.types.trim() !== ""){
        hasOldType = true;
    }
    
    
    if(files.count > 0 || subs.count > 0 || hasOldType){

        return ctx.reply(
        `⚠️ این دکمه دارای اطلاعات است:
    
    📎 فایل:
    ${files.count}
    
    📂 زیرشاخه:
    ${subs.count}
    
    نوع تغییر چگونه انجام شود؟`,
    
        Markup.inlineKeyboard([
            [
                {
                    text:"🔄 تغییر کلی (انتقال اطلاعات به سطل زباله)",
                    callback_data:`full_change_${buttonId}_${type}`
                }
            ],
            [
                {
                    text:"➕ اضافه شدن نوع جدید (ترکیبی)",
                    callback_data:`add_type_${buttonId}_${type}`
                }
            ],
            [
                {
                    text:"❌ لغو",
                    callback_data:"cancel_operation"
                }
            ]
        ])
    
    );

    }
    else{
    
        updateType(ctx,buttonId,type);
    
    }
    
    
    }); // subs
    
    }); // files
    
    }); // button

}

function updateType(ctx,id,type){

    console.log("UPDATE TYPE");
    console.log("ID:",id);
    console.log("TYPE:",type);
    
    
    db.run(
        "UPDATE buttons SET mode=?, types=NULL WHERE id=?",
        [type,id],
    function(err){
    
        if(err){

            console.log("UPDATE ERROR:");
            console.log(err);
            
            return ctx.reply(
            "❌ خطا در تغییر نوع"
            );
            
            }
    
    
    ctx.reply(
    "✅ نوع دکمه تغییر کرد."
    );
    
    
    });
    
    
    }




    function fullChangeType(ctx,id,type){

        const now = new Date().toISOString();
    
        db.run(
            
            `UPDATE files
            SET 
            deleted=1,
            deleted_at=?,
            deleted_by=?
            WHERE button_id=?`
            ,
            [
                now,
                ctx.from.id,
                id
            ]
        );
    
    
        db.run(
            
            `UPDATE buttons
            SET
            deleted=1,
            deleted_at=?,
            deleted_by=?
            WHERE parent_id=?`
            ,
            [
                now,
                ctx.from.id,
                id
            ]
        );
    
    
        updateType(ctx,id,type);
    
    }
    
    
    
    
    function addMixedType(ctx,id,type){

        db.get(
            "SELECT mode,types FROM buttons WHERE id=?",
            [id],
            (err,row)=>{
    
                if(err || !row){
    
                    return ctx.reply("❌ دکمه پیدا نشد.");
    
                }
    
                let list = [];
    
                if(row.types){
    
                    list = row.types
                    .split(",")
                    .filter(x=>x && x !== "mixed");
                }
                else if(row.mode && row.mode!=="none"){
    
                    list.push(row.mode);
    
                }
    
                if(!list.includes(type)){
    
                    list.push(type);
    
                }
    
                db.run(
    
                    `UPDATE buttons
                     SET mode='mixed',
                         types=?
                     WHERE id=?`,
    
                    [
                        list.join(","),
                        id
                    ],
    
                    function(err){
    
                        if(err){
    
                            console.log(err);
    
                            return ctx.reply("❌ خطا در ثبت نوع.");
    
                        }
    
                        ctx.reply(
                            "✅ نوع جدید اضافه شد."
                        );
    
                    }
    
                );
    
            }
    
        );
    
    }


    function removeType(ctx,id,type){

        db.get(
            "SELECT mode,types FROM buttons WHERE id=?",
            [id],
            (err,row)=>{
    
                if(err || !row){
    
                    return ctx.reply(
                        "❌ دکمه پیدا نشد."
                    );
    
                }
    
    
                let list=[];
    
    
                if(row.types){
    
                    list=row.types
                    .split(",")
                    .filter(x=>x);
    
                }
                else if(row.mode && row.mode!=="none"){
    
                    list.push(row.mode);
    
                }
    
    
    
                if(!list.includes(type)){
    
                    return ctx.reply(
                        "⚠️ این قابلیت وجود ندارد."
                    );
    
                }
    
    
    
                // حذف قابلیت انتخاب شده
    
                list=list.filter(
                    x=>x!==type
                );
    
    
    
                let newMode="none";
                let newTypes=null;
    
    
    
                if(list.length===0){

                    newMode="none";
                    newTypes=null;
                
                }
                else if(list.length===1){
                
                    newMode=list[0];
                    newTypes=null;
                
                }
                else{
                
                    newMode="mixed";
                    newTypes=list.join(",");
                
                }
    
    
                db.run(
                    
                    `UPDATE buttons
                    SET mode=?,
                        types=?
                    WHERE id=?`
                    ,
                    [
                        newMode,
                        newTypes,
                        id
                    ],
                    function(err){
    
                        if(err){
    
                            console.log(err);
    
                            return ctx.reply(
                                "❌ خطا در حذف قابلیت."
                            );
    
                        }
    
    
                        ctx.reply(
                            "✅ قابلیت حذف شد."
                        );
    
                        console.log("REMOVE RESULT");
                        console.log("MODE:",newMode);
                        console.log("TYPES:",newTypes);

                    }
                );
    
    
            }
        );
    
    }


    module.exports={
        buttonTypeMenu,
        changeButtonType,
        updateType,
        fullChangeType,
        addMixedType,
        addCapabilityMenu,
        removeCapabilityMenu,
        removeType
        };