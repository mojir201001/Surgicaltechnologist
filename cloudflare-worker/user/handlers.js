import { getButton } from "../db/buttons.js";
import { telegram } from "../telegram/send.js";
import { showUserButtons } from "./buttons.js";
import { sendButtonContent } from "./content.js";

export async function handleUserButton(
  env,
  chatId,
  buttonId,
  messageId
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

  if (button.mode === "folder") {
    await showUserButtons(
      env,
      chatId,
      button.id,
      messageId
    );
    return;
  }

  if (button.mode === "content") {
    await sendButtonContent(
      env,
      chatId,
      button.id,
      button.content_order
    );
    return;
  }

  if (button.mode === "mixed") {
    await sendButtonContent(
      env,
      chatId,
      button.id,
      button.content_order
    );

    await showUserButtons(
      env,
      chatId,
      button.id,
      messageId
    );
    return;
  }

  if (button.mode === "input") {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "📥 لطفاً اطلاعات مورد نیاز را ارسال کنید."
    });
    return;
  }

  if (button.mode === "link") {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "🔗 این بخش در مرحله بعد تکمیل می‌شود."
    });
    return;
  }

  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: "⚠️ این دکمه هنوز تنظیم نشده است."
  });
}