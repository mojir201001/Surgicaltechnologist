const db = require("./database/database");


db.all("PRAGMA table_info(files)", [], (err, rows)=>{

    if(err){
        console.log(err);
        return;
    }

    console.log("FILES TABLE:");
    console.log(rows);

});



db.all("PRAGMA table_info(buttons)", [], (err, rows)=>{

    if(err){
        console.log(err);
        return;
    }

    console.log("BUTTONS TABLE:");
    console.log(rows);

});