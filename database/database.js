const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/bot.db", (err) => {
    if (err) {
        console.log("خطا در اتصال به دیتابیس:", err.message);
    } else {
        console.log("دیتابیس با موفقیت متصل شد.");
    }
});

module.exports = db;