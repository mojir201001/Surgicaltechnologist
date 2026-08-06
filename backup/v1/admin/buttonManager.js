const { Markup } = require("telegraf");

function buttonManager(ctx) {

    return ctx.reply(
`📂 مدیریت دکمه‌ها

یکی از گزینه‌ها را انتخاب کنید:`,
        
        Markup.inlineKeyboard([
            [
                {
                    text: "➕ ایجاد دکمه",
                    callback_data: "create_button"
                }
            ],
            [
                {
                    text: "📋 لیست دکمه‌ها",
                    callback_data: "list_buttons"
                }
            ],
            [
                {
                    text: "⬅️ بازگشت",
                    callback_data: "admin_back"
                },
                {
                    text: "🏠 صفحه اصلی",
                    callback_data: "home"
                }
            ]
        ])
    );
}


module.exports = buttonManager;