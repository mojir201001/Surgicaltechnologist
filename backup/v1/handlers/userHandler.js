const db = require("../database/database");

function registerUser(ctx) {

    const user = ctx.from;

    db.run(
        "INSERT OR IGNORE INTO users (telegram_id, username, first_name) VALUES (?, ?, ?)",
        [
            user.id,
            user.username || "",
            user.first_name || ""
        ],
        function(error) {
            if (error) {
                console.log("خطا در ذخیره کاربر:", error.message);
            }
        }
    );

}

module.exports = registerUser;