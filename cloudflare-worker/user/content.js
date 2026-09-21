import { getButtonFiles } from "../db/buttons.js";
import { telegram } from "../telegram/send.js";

export async function sendButtonContent(
  env,
  chatId,
  buttonId,
  contentOrder
) {
  const files = await getButtonFiles(
    env,
    buttonId,
    contentOrder
  );

  if (files.length === 0) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "📭 مطلبی برای این بخش وجود ندارد."
    });

    return;
  }

  for (const file of files) {
    const caption = file.caption || undefined;

    if (file.file_type === "document") {
      await telegram(env, "sendDocument", {
        chat_id: chatId,
        document: file.file_id,
        ...(caption ? { caption } : {})
      });
    }

    else if (file.file_type === "photo") {
      await telegram(env, "sendPhoto", {
        chat_id: chatId,
        photo: file.file_id,
        ...(caption ? { caption } : {})
      });
    }

    else if (file.file_type === "video") {
      await telegram(env, "sendVideo", {
        chat_id: chatId,
        video: file.file_id,
        ...(caption ? { caption } : {})
      });
    }

    else if (file.file_type === "audio") {
      await telegram(env, "sendAudio", {
        chat_id: chatId,
        audio: file.file_id,
        ...(caption ? { caption } : {})
      });
    }

    else if (file.file_type === "text") {
      await telegram(env, "sendMessage", {
        chat_id: chatId,
        text: file.caption || ""
      });
    }

    else if (caption) {
      await telegram(env, "sendMessage", {
        chat_id: chatId,
        text: caption
      });
    }
  }
}