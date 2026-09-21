import { telegram } from "./send.js";
import { showUserButtons } from "../user/buttons.js";
import { handleUserButton } from "../user/handlers.js";
import { showAdminPanel } from "../admin/panel.js";
import { showAdminButtons } from "../admin/buttons.js";

const welcomeText =
`🌟 به ربات اختصاصی دانشجویان اتاق عمل کد 1️⃣ خوش آمدید.

از طریق این ربات می‌توانید:

📚 به جزوه‌ها و فایل‌های آموزشی دسترسی داشته باشید.
🎓 از محتوای اختصاصی بهره‌مند شوید.
💯 و از امکانات متنوع ربات برای یادگیری بهتر استفاده کنید.

لطفاً یکی از گزینه‌های زیر را انتخاب کنید.`;

export async function handleUpdate(env, update) {
  const chatId =
    update.message?.chat?.id ||
    update.callback_query?.message?.chat?.id;

  const userId =
    update.message?.from?.id ||
    update.callback_query?.from?.id;

  if (!chatId) {
    return;
  }

  // =========================
  // /start
  // =========================

  if (update.message?.text === "/start") {
    if (String(userId) === String(env.ADMIN_ID)) {
      await telegram(env, "sendMessage", {
        chat_id: chatId,
        text: welcomeText,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🛠 پنل مدیریت",
                callback_data: "admin_panel"
              },
              {
                text: "👤 نمای کاربر",
                callback_data: "user_view"
              }
            ]
          ]
        }
      });

      return;
    }

    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: welcomeText
    });

    await showUserButtons(
      env,
      chatId,
      0
    );

    return;
  }

  // =========================
  // پنل مدیریت
  // =========================

  if (
    update.callback_query?.data === "admin_panel" &&
    String(userId) === String(env.ADMIN_ID)
  ) {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id:
        update.callback_query.id
    });

    await showAdminPanel(
      env,
      chatId,
      update.callback_query.message.message_id
    );

    return;
  }

  // =========================
  // مدیریت دکمه‌ها
  // =========================

  if (
    update.callback_query?.data === "buttons" &&
    String(userId) === String(env.ADMIN_ID)
  ) {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id:
        update.callback_query.id
    });

    await showAdminButtons(
      env,
      chatId,
      update.callback_query.message.message_id
    );

    return;
  }

  // =========================
  // نمای کاربر
  // =========================

  if (
    update.callback_query?.data === "user_view"
  ) {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id:
        update.callback_query.id
    });

    await showUserButtons(
      env,
      chatId,
      0,
      update.callback_query.message.message_id
    );

    return;
  }

  // =========================
  // خانه
  // =========================

  if (
    update.callback_query?.data === "home"
  ) {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id:
        update.callback_query.id
    });

    await showUserButtons(
      env,
      chatId,
      0,
      update.callback_query.message.message_id
    );

    return;
  }

  // =========================
  // بازگشت کاربر
  // =========================

  if (
    update.callback_query?.data?.startsWith(
      "user_back_"
    )
  ) {
    const currentButtonId = Number(
      update.callback_query.data.replace(
        "user_back_",
        ""
      )
    );

    const parent = await env.DB
      .prepare(
        "SELECT parent_id FROM buttons WHERE id = ?"
      )
      .bind(currentButtonId)
      .first();

    await telegram(env, "answerCallbackQuery", {
      callback_query_id:
        update.callback_query.id
    });

    await showUserButtons(
      env,
      chatId,
      parent?.parent_id || 0,
      update.callback_query.message.message_id
    );

    return;
  }
  // =========================
  // تنظیمات دکمه مدیر
  // =========================

  if (
    update.callback_query?.data?.startsWith("button_") &&
    String(userId) === String(env.ADMIN_ID)
  ) {
    const { showButtonSettings } =
      await import("../admin/buttonSettings.js");

    const buttonId = Number(
      update.callback_query.data.replace("button_", "")
    );

    await telegram(env, "answerCallbackQuery", {
      callback_query_id:
        update.callback_query.id
    });

    await showButtonSettings(
      env,
      chatId,
      buttonId,
      update.callback_query.message.message_id
    );

    return;
  }
  // =========================
  // دکمه‌های کاربر
  // =========================

  if (
    update.callback_query?.data?.startsWith(
      "user_button_"
    )
  ) {
    const buttonId = Number(
      update.callback_query.data.replace(
        "user_button_",
        ""
      )
    );

    await telegram(env, "answerCallbackQuery", {
      callback_query_id:
        update.callback_query.id
    });

    await handleUserButton(
      env,
      chatId,
      buttonId,
      update.callback_query.message.message_id
    );

    return;
  }
}