export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    async function telegram(method, body) {
      return fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );
    }

    function iconFor(mode) {
      if (mode === "folder") return "📂";
      if (mode === "content") return "📖";
      if (mode === "input") return "📥";
      if (mode === "mixed") return "🔀";
      if (mode === "link") return "🔗";
      return "🔘";
    }

    async function getButtons(parentId = 0) {
      const result = await env.DB
        .prepare(`
          SELECT id, title, mode, position
          FROM buttons
          WHERE parent_id = ?
            AND visible = 1
            AND deleted = 0
          ORDER BY position ASC, id ASC
        `)
        .bind(parentId)
        .all();

      return result.results || [];
    }

    async function buildUserKeyboard(parentId = 0) {
      const buttons = await getButtons(parentId);

      const keyboard = buttons.map((button) => [
        {
          text: `${iconFor(button.mode)} ${button.title}`,
          callback_data: `user_button_${button.id}`
        }
      ]);

      if (parentId !== 0) {
        keyboard.push([
          {
            text: "⬅️ بازگشت",
            callback_data: `user_back_${parentId}`
          }
        ]);
      }

      keyboard.push([
        {
          text: "🏠 صفحه اصلی",
          callback_data: "home"
        }
      ]);

      return keyboard;
    }

    async function showUserMenu(chatId, parentId = 0, messageId = null) {
      const keyboard = await buildUserKeyboard(parentId);

      if (messageId) {
        await telegram("editMessageText", {
          chat_id: chatId,
          message_id: messageId,
          text: "📚 انتخاب کنید:",
          reply_markup: {
            inline_keyboard: keyboard
          }
        });
      } else {
        await telegram("sendMessage", {
          chat_id: chatId,
          text: "📚 انتخاب کنید:",
          reply_markup: {
            inline_keyboard: keyboard
          }
        });
      }
    }

    async function sendButtonContent(chatId, buttonId, contentOrder) {
      let order = "ORDER BY id DESC";

      if (contentOrder === "old") {
        order = "ORDER BY id ASC";
      }

      if (contentOrder === "random") {
        order = "ORDER BY RANDOM()";
      }

      const result = await env.DB
        .prepare(`
          SELECT file_id, file_type, caption
          FROM files
          WHERE button_id = ?
            AND deleted = 0
          ${order}
        `)
        .bind(buttonId)
        .all();

      const files = result.results || [];

      if (files.length === 0) {
        await telegram("sendMessage", {
          chat_id: chatId,
          text: "📭 مطلبی برای این بخش وجود ندارد."
        });

        return;
      }

      for (const file of files) {
        const caption = file.caption || undefined;

        if (file.file_type === "document") {
          await telegram("sendDocument", {
            chat_id: chatId,
            document: file.file_id,
            ...(caption ? { caption } : {})
          });
        }

        else if (file.file_type === "photo") {
          await telegram("sendPhoto", {
            chat_id: chatId,
            photo: file.file_id,
            ...(caption ? { caption } : {})
          });
        }

        else if (file.file_type === "video") {
          await telegram("sendVideo", {
            chat_id: chatId,
            video: file.file_id,
            ...(caption ? { caption } : {})
          });
        }

        else if (file.file_type === "audio") {
          await telegram("sendAudio", {
            chat_id: chatId,
            audio: file.file_id,
            ...(caption ? { caption } : {})
          });
        }

        else if (file.file_type === "text") {
          await telegram("sendMessage", {
            chat_id: chatId,
            text: file.caption || ""
          });
        }

        else if (caption) {
          await telegram("sendMessage", {
            chat_id: chatId,
            text: caption
          });
        }
      }
    }

    // =========================
    // تست D1
    // =========================

    if (url.pathname === "/test-db") {
      const result = await env.DB
        .prepare("SELECT COUNT(*) AS count FROM buttons")
        .first();

      return new Response(
        JSON.stringify({
          ok: true,
          buttons: result.count
        }),
        {
          headers: {
            "content-type": "application/json; charset=UTF-8"
          }
        }
      );
    }

    // =========================
    // Telegram Webhook
    // =========================

    if (
      (url.pathname === "/webhook" ||
        url.pathname.startsWith("/webhook/")) &&
      request.method === "POST"
    ) {
      const secret = request.headers.get(
        "X-Telegram-Bot-Api-Secret-Token"
      );

      if (secret !== env.WEBHOOK_SECRET) {
        return new Response("Unauthorized", {
          status: 401
        });
      }

      try {
        const update = await request.json();

        const chatId =
          update.message?.chat?.id ||
          update.callback_query?.message?.chat?.id;

        const userId =
          update.message?.from?.id ||
          update.callback_query?.from?.id;

        // =========================
        // /start
        // =========================

        if (update.message?.text === "/start" && chatId) {
          const welcomeText =
`🌟 به ربات اختصاصی دانشجویان اتاق عمل کد 1️⃣ خوش آمدید.

از طریق این ربات می‌توانید:

📚 به جزوه‌ها و فایل‌های آموزشی دسترسی داشته باشید.
🎓 از محتوای اختصاصی بهره‌مند شوید.
💯 و از امکانات متنوع ربات برای یادگیری بهتر استفاده کنید.

لطفاً یکی از گزینه‌های زیر را انتخاب کنید.`;

          if (String(userId) === String(env.ADMIN_ID)) {
            await telegram("sendMessage", {
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
          }

          else {
            await telegram("sendMessage", {
              chat_id: chatId,
              text: welcomeText,
              reply_markup: {
                inline_keyboard:
                  await buildUserKeyboard(0)
              }
            });
          }

          return new Response("OK");
        }

        // =========================
        // خانه
        // =========================

        if (
          update.callback_query?.data === "home" &&
          chatId
        ) {
          await telegram("answerCallbackQuery", {
            callback_query_id:
              update.callback_query.id
          });

          await showUserMenu(
            chatId,
            0,
            update.callback_query.message.message_id
          );

          return new Response("OK");
        }

        // =========================
        // بازگشت
        // =========================

        if (
          update.callback_query?.data?.startsWith(
            "user_back_"
          ) &&
          chatId
        ) {
          const currentParentId = Number(
            update.callback_query.data.replace(
              "user_back_",
              ""
            )
          );

          const parent = await env.DB
            .prepare(
              "SELECT parent_id FROM buttons WHERE id = ?"
            )
            .bind(currentParentId)
            .first();

          const parentId =
            parent?.parent_id ?? 0;

          await telegram("answerCallbackQuery", {
            callback_query_id:
              update.callback_query.id
          });

          await showUserMenu(
            chatId,
            parentId,
            update.callback_query.message.message_id
          );

          return new Response("OK");
        }

        // =========================
        // دکمه کاربر
        // =========================

        if (
          update.callback_query?.data?.startsWith(
            "user_button_"
          ) &&
          chatId
        ) {
          const buttonId = Number(
            update.callback_query.data.replace(
              "user_button_",
              ""
            )
          );

          const button = await env.DB
            .prepare(`
              SELECT
                id,
                title,
                mode,
                parent_id,
                content_order
              FROM buttons
              WHERE id = ?
                AND visible = 1
                AND deleted = 0
            `)
            .bind(buttonId)
            .first();

          if (!button) {
            await telegram("answerCallbackQuery", {
              callback_query_id:
                update.callback_query.id,
              text: "❌ دکمه پیدا نشد.",
              show_alert: true
            });

            return new Response("OK");
          }

          await telegram("answerCallbackQuery", {
            callback_query_id:
              update.callback_query.id
          });

          // پوشه
          if (button.mode === "folder") {
            await showUserMenu(
              chatId,
              button.id,
              update.callback_query.message.message_id
            );

            return new Response("OK");
          }

          // محتوا
          if (button.mode === "content") {
            await sendButtonContent(
              chatId,
              button.id,
              button.content_order
            );

            return new Response("OK");
          }

          // ترکیبی
          if (button.mode === "mixed") {
            await sendButtonContent(
              chatId,
              button.id,
              button.content_order
            );

            await showUserMenu(
              chatId,
              button.id,
              update.callback_query.message.message_id
            );

            return new Response("OK");
          }

          // دریافت اطلاعات
          if (button.mode === "input") {
            await telegram("sendMessage", {
              chat_id: chatId,
              text:
                "📥 لطفاً اطلاعات مورد نیاز را ارسال کنید."
            });

            return new Response("OK");
          }

          // لینک
          if (button.mode === "link") {
            await telegram("sendMessage", {
              chat_id: chatId,
              text:
                "🔗 لینک این بخش هنوز در سیستم Cloudflare منتقل نشده است."
            });

            return new Response("OK");
          }

          await telegram("sendMessage", {
            chat_id: chatId,
            text:
              "⚠️ این دکمه هنوز تنظیم نشده است."
          });

          return new Response("OK");
        }

        return new Response("OK");
      }

      catch (error) {
        console.error(
          "WEBHOOK ERROR:",
          error
        );

        return new Response("OK");
      }
    }

    // =========================
    // تنظیم Webhook
    // =========================

    if (url.pathname === "/set-webhook") {
      const webhookUrl =
        "https://telegram-cloudflare-worker.mojirsoleimani.workers.dev/webhook";

      const response = await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/setWebhook`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            url: webhookUrl,
            secret_token: env.WEBHOOK_SECRET
          })
        }
      );

      return new Response(
        await response.text(),
        {
          headers: {
            "content-type":
              "application/json; charset=UTF-8"
          }
        }
      );
    }

    return new Response(
      "Surgicaltechnologist Worker OK"
    );
  }
};