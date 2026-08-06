const stateManager = require("../handlers/stateManager");

function addContent(ctx, buttonId){

    stateManager.setState(
        ctx.from.id,
        "addContent",
        {
            buttonId: buttonId
        }
    );

    ctx.reply(
`📤 مطلب را ارسال کنید.

✅ متن
✅ عکس
✅ فیلم
✅ ویس
✅ فایل
✅ استیکر
✅ گیف

برای لغو:
/cancel`
    );

}

module.exports = addContent;