const db = require("./database/database");

db.all(
    "SELECT id,title,mode FROM buttons",
    [],
    (err,rows)=>{

        if(err){
            console.log(err);
            return;
        }

        console.log(rows);

    }
);