const db = require("../database/database");


function saveUserPhone(userId, phone, callback){

    db.get(
        
        `SELECT id FROM user_phones
        WHERE user_id=? AND phone=?`
        ,
        [
            userId,
            phone
        ],
        (err,row)=>{

            if(row){
                return callback();
            }


            db.run(
                
                `INSERT INTO user_phones
                (user_id,phone)
                VALUES (?,?)`
                ,
                [
                    userId,
                    phone
                ],
                callback
            );

        }
    );

}



function getUserPhones(userId, callback){

    db.all(
        
        `SELECT phone,created_at
        FROM user_phones
        WHERE user_id=?
        ORDER BY id ASC`
        ,
        [
            userId
        ],
        (err,rows)=>{

            callback(rows || []);

        }
    );

}



module.exports={
    saveUserPhone,
    getUserPhones
};