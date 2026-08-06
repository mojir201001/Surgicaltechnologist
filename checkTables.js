const db = require("./database/database");

db.all(
"SELECT name FROM sqlite_master WHERE type='table'",
[],
(err,rows)=>{
    if(err){
        console.log(err);
        return;
    }

    console.log(rows);
});