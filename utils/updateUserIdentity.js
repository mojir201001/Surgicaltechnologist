const db = require("../database/database");


function updateUserIdentity(ctx, callback){

    const user = ctx.from;


    db.get(
        "SELECT id FROM users WHERE telegram_id=?",
        [
            user.id
        ],
        (err,row)=>{


            if(row){

                db.run(
                    
                    `UPDATE users
                    SET 
                    username=?,
                    first_name=?,
                    last_name=?
                    WHERE id=?`
                    ,
                    [
                        user.username || null,
                        user.first_name || null,
                        user.last_name || null,
                        row.id
                    ],
                    ()=>{

                        callback(row.id);

                    }
                );


            }
            else{


                db.run(
                    
                    `INSERT INTO users
                    (
                    telegram_id,
                    username,
                    first_name,
                    last_name
                    )
                    VALUES (?,?,?,?)`
                    ,
                    [
                        user.id,
                        user.username || null,
                        user.first_name || null,
                        user.last_name || null
                    ],
                    function(){

                        callback(this.lastID);

                    }
                );


            }


        }
    );

}


module.exports = updateUserIdentity;