import { getButton, getButtons } from "../db/buttons.js";
import { telegram } from "../telegram/send.js";

function getTypeText(button) {
  if (button.mode === "none") return "🔘 بدون تنظیم";
  if (button.mode === "folder") return "📂 ایجاد زیرشاخه";
  if (button.mode === "content") return "📖 نمایش مطلب";
  if (button.mode === "input") return "📥 دریافت مطلب";
  if (button.mode === "link") return "🔗 لینک";
  if (button.mode === "mixed") return "🔀 ترکیبی";

  return "🔘 بدون تنظیم";
}

export async function showButtonSettings(
  env,
  chatId,
  buttonId,
  messageId = null
) {
  const button = await getButton(
    env,
    buttonId
  );

  if (!button) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "❌ دکمه پیدا نشد."
    });

    return;
  }

  const children = await getButtons(
    env,
    buttonId
  );

  const fileResult = await env.DB
    .prepare(`
      SELECT COUNT(*) AS count
      FROM files
      WHERE button_id = ?
        AND deleted = 0
    `)
    .bind(buttonId)
    .first();

  const keyboard = [];

  if (
    button.mode === "none" ||
    button.mode === "folder" ||
    button.mode === "mixed"
  ) {
    keyboard.push([
      {
        text: "📂 مدیریت زیرشاخه‌ها",
        callback_data: `submenu_${buttonId}`
      }
    ]);
  }

  if (
    button.mode === "content" ||
    button.mode === "mixed"
  ) {
    keyboard.push([
      {
        text: "📖 مدیریت مطالب",
        callback_data: `set_content_${buttonId}`
      }
    ]);
  }

  if (
    button.mode === "input" ||
    button.mode === "mixed"
  ) {
    keyboard.push([
      {
        text: "📥 مدیریت فایل‌ها",
        callback_data: `set_input_${buttonId}`
      }
    ]);
  }

  keyboard.push(
    [
      {
        text: "⚙️ تنظیم نوع دکمه",
        callback_data: `button_type_${buttonId}`
      }
    ],
    [
      {
        text: "✏️ تغییر نام",
        callback_data: `rename_${buttonId}`
      }
    ],
    [
      {
        text: "🎨 تغییر ظاهر",
        callback_data: `style_${buttonId}`
      }
    ],
    [
      {
        text: "🔗 لینک دکمه",
        callback_data: `link_${buttonId}`
      }
    ],
    [
      {
        text: "/ ایجاد دستور",
        callback_data: `command_${buttonId}`
      }
    ],
    [
      {
        text: "🔒 قفل دکمه",
        callback_data: `lock_${buttonId}`
      }
    ],
    [
      {
        text: "👁 مخفی / نمایش",
        callback_data: `hide_${buttonId}`
      }
    ],
    [
      {
        text: "↕️ انتقال جایگاه",
        callback_data: `move_${buttonId}`
      }
    ],
    [
      {
        text: "🗑 حذف دکمه",
        callback_data: `delete_${buttonId}`
      }
    ],
    [
      {
        text: "⬅️ بازگشت",
        callback_data: "buttons"
      },
      {
        text: "🏠 صفحه اصلی",
        callback_data: "admin_panel"
      }
    ]
  );

  const text =
`⚙️ مدیریت دکمه

📌 نام:
${button.title}

📌 نوع:
${getTypeText(button)}

📊 آمار:
📂 زیرشاخه‌ها: ${children.length}
📄 مطالب: ${fileResult?.count || 0}

انتخاب کنید:`;

  const data = {
    chat_id: chatId,
    text,
    reply_markup: {
      inline_keyboard: keyboard
    }
  };

  if (messageId) {
    data.message_id = messageId;

    await telegram(
      env,
      "editMessageText",
      data
    );

    return;
  }

  await telegram(
    env,
    "sendMessage",
    data
  );
}