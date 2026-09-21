import { getButtons } from "../db/buttons.js";
import { telegram } from "../telegram/send.js";

export async function showAdminButtons(
  env,
  chatId,
  messageId = null
) {
  const buttons = await getButtons(env, 0);

  const keyboard = [];

  keyboard.push([
    {
      text: "➕ ایجاد دکمه جدید",
      callback_data: "create_button"
    }
  ]);

  for (const button of buttons) {
    keyboard.push([
      {
        text: "📂 " + button.title,
        callback_data: `button_${button.id}`
      }
    ]);
  }

  keyboard.push([
    {
      text: "⬅️ بازگشت",
      callback_data: "admin_panel"
    },
    {
      text: "🏠 صفحه اصلی",
      callback_data: "home"
    }
  ]);

  const data = {
    chat_id: chatId,
    text: "📂 مدیریت دکمه‌ها",
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