const db = require("../database/database");

function getRealButtonMode(buttonId, callback){

    db.get(
        "SELECT mode, types FROM buttons WHERE id=?",
        [buttonId],
        (err, button)=>{

            if(err || !button){
                callback({
                    mode: "none",
                    types: []
                });
                return;
            }


            db.get(
                "SELECT COUNT(*) AS count FROM buttons WHERE parent_id=? AND deleted=0",
                [buttonId],
                (err, subs)=>{

                    db.get(
                        "SELECT COUNT(*) AS count FROM files WHERE button_id=? AND deleted=0",
                        [buttonId],
                        (err, files)=>{


                            const hasSub = subs && subs.count > 0;
                            const hasFile = files && files.count > 0;


                            

                            console.log("REAL MODE CHECK");
                            console.log("BUTTON:", buttonId);
                            console.log("SUB:", subs);
                            console.log("FILES:", files);
                            console.log("MODE:", button.mode);


                            // اگر نوع‌های ذخیره شده وجود دارد
                            if(button.types && button.types.trim() !== ""){
    const savedTypes = button.types
        .split(",")
        .filter(x=>x);

        console.log("SAVED TYPES:", savedTypes);


    if(savedTypes.length === 1){

        callback({
            mode:savedTypes[0],
            types:savedTypes
        });

    }
    else if(savedTypes.length > 1){

        callback({
            mode:"mixed",
            types:savedTypes
        });

    }

    return;

}


          const types = [];


                           if(button.mode && button.mode !== "none"){
                               types.push(button.mode);
                           }
                           
                           if(types.length === 0){
                               callback({
                                   mode:"none",
                                   types:[]
                               });
                           }
                           else{
                               callback({
                                   mode:types[0],
                                   types:types
                               });
                           }

                        }
                    );

                }
            );

        }
    );

}


module.exports = getRealButtonMode;