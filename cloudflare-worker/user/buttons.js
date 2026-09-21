import { buildUserKeyboard } from "./navigation.js";
import { telegram } from "../telegram/send.js";

export async function showUserButtons(
  env,
  chatId,
  parentId = 0,
  messageId = null
) {
  const keyboard = await buildUserKeyboard(
    env,
    parentId
  );

  const data = {
    chat_id: chatId,
    text: "📚 انتخاب کنید:",
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