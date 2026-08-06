const { Markup } = require("telegraf");

function adminPanel(ctx) {

    return ctx.reply(
`🛠 پنل مدیریت

یکی از بخش‌های زیر را انتخاب کنید.`,

        Markup.inlineKeyboard([
            [{ text: "📂 مدیریت دکمه‌ها", callback_data: "buttons" }],
            [{ text: "📁 مدیریت فایل‌ها", callback_data: "files" }],
            [{ text: "👥 مدیریت کاربران", callback_data: "users" }],
            [{ text: "📢 پیام همگانی", callback_data: "broadcast" }],
            [{ text: "⚡ پاسخ سریع", callback_data: "reply" }],
            [{ text: "🤖 دستیار گروه", callback_data: "group" }],
            [{ text: "📢 دستیار کانال", callback_data: "channel" }],
            [{ text: "👨‍💼 مدیریت مدیران", callback_data: "admins" }],
            [{ text: "💾 بکاپ", callback_data: "backup" }],
            [{ text: "🗑 سطل زباله", callback_data: "trash" }],
            [{ text: "⚙️ تنظیمات", callback_data: "settings" }],
            [
                { text: "⬅️ بازگشت", callback_data: "back" },
                { text: "🏠 صفحه اصلی", callback_data: "home" }
            ]
        ])
    );

}

module.exports = adminPanel;