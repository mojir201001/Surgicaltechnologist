const db = require("./database");


db.serialize(()=>{


    db.run(
        "UPDATE buttons SET mode='none' WHERE mode IS NULL"
    );


});


console.log("به‌روزرسانی حالت دکمه‌ها انجام شد.");