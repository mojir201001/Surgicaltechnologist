const db = require("./database/database");


db.all(
    
    `SELECT 
    id,
    telegram_id,
    username,
    first_name,
    last_name,
    phone
    FROM users`
    ,
    [],
    (err,rows)=>{

        if(err){
            console.log(err);
            return;
        }

        console.log(rows);

    }
);