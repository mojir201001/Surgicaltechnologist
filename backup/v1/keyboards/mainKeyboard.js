const { Markup } = require("telegraf");
const config = require("../config/config");

function getMainKeyboard(userId) {

    if (userId == config.ADMIN_ID) {

        return Markup.keyboard([
            ["🛠 پنل مدیریت", "👤 نمای کاربر"]
        ]).resize();

    }

    return Markup.removeKeyboard();

}

module.exports = getMainKeyboard;