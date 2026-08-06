const db = require("./database");

db.serialize(() => {

    db.run(
        "ALTER TABLE files ADD COLUMN message_id INTEGER",
        (err) => {
            if (!err) {
                console.log("ستون message_id اضافه شد.");
            }
        }
    );

    db.run(
        "ALTER TABLE files ADD COLUMN chat_id TEXT",
        (err) => {
            if (!err) {
                console.log("ستون chat_id اضافه شد.");
            }
        }
    );

});

console.log("بروزرسانی جدول files تمام شد.");