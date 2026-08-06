const db = require("../database/database");


function getUserIdentity(userId, callback){

    db.get(
        
        `SELECT 
        telegram_id,
        phone,
        username,
        first_name,
        last_name
        FROM users
        WHERE id=?`
        ,
        [userId],
        (err,user)=>{


            console.log("ERROR:",err);
            console.log("USER RESULT:",user);


            if(err || !user){

                callback(null);
                return;

            }


            let identity = "";


            if(user.phone){

                identity = "📱 " + user.phone;

            }
            else if(user.username){

                identity = "@" + user.username;

            }
            else{

                identity = "🆔 " + user.telegram_id;

            }


            callback({

                text: identity,
                phone:user.phone,
                username:user.username,
                telegram_id:user.telegram_id

            });


        }
    );

}


module.exports = getUserIdentity;