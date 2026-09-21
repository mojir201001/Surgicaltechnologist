// worker.js
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/test-db") {
      const result = await env.DB.prepare("SELECT COUNT(*) AS count FROM buttons").first();
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
    if (url.pathname.startsWith("/webhook/") && request.method === "POST") {
      const secret = request.headers.get(
        "X-Telegram-Bot-Api-Secret-Token"
      );
      if (secret !== env.WEBHOOK_SECRET) {
        return new Response("Unauthorized", { status: 401 });
      }
      const update = await request.json();
      const chatId = update.message?.chat?.id || update.callback_query?.message?.chat?.id;
      const user = await env.DB.prepare("SELECT account_type FROM users WHERE CAST(telegram_id AS INTEGER) = ?").bind(String(chatId)).first();
      console.log("User account:", user);
      const userId = update.message?.from?.id || update.callback_query?.from?.id;
      if (update.message?.text === "/start" && chatId) {
        const welcomeText = `\u{1F31F} \u0628\u0647 \u0631\u0628\u0627\u062A \u0627\u062E\u062A\u0635\u0627\u0635\u06CC \u062F\u0627\u0646\u0634\u062C\u0648\u06CC\u0627\u0646 \u0627\u062A\u0627\u0642 \u0639\u0645\u0644 \u06A9\u062F 1\uFE0F\u20E3 \u062E\u0648\u0634 \u0622\u0645\u062F\u06CC\u062F.

\u0627\u0632 \u0637\u0631\u06CC\u0642 \u0627\u06CC\u0646 \u0631\u0628\u0627\u062A \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F:

\u{1F4DA} \u0628\u0647 \u062C\u0632\u0648\u0647\u200C\u0647\u0627 \u0648 \u0641\u0627\u06CC\u0644\u200C\u0647\u0627\u06CC \u0622\u0645\u0648\u0632\u0634\u06CC \u062F\u0633\u062A\u0631\u0633\u06CC \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u06CC\u062F.
\u{1F393} \u0627\u0632 \u0645\u062D\u062A\u0648\u0627\u06CC \u0627\u062E\u062A\u0635\u0627\u0635\u06CC \u0628\u0647\u0631\u0647\u200C\u0645\u0646\u062F \u0634\u0648\u06CC\u062F.
\u{1F4AF} \u0648 \u0627\u0632 \u0627\u0645\u06A9\u0627\u0646\u0627\u062A \u0645\u062A\u0646\u0648\u0639 \u0631\u0628\u0627\u062A \u0628\u0631\u0627\u06CC \u06CC\u0627\u062F\u06AF\u06CC\u0631\u06CC \u0628\u0647\u062A\u0631 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F.

\u0644\u0637\u0641\u0627\u064B \u06CC\u06A9\u06CC \u0627\u0632 \u06AF\u0632\u06CC\u0646\u0647\u200C\u0647\u0627\u06CC \u0632\u06CC\u0631 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F.`;
        if (String(userId) === String(env.ADMIN_ID)) {
          await fetch(
            `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
            {
              method: "POST",
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                chat_id: chatId,
                text: welcomeText,
                reply_markup: {
                  inline_keyboard: [
                    [
                      {
                        text: "\u{1F6E0} \u067E\u0646\u0644 \u0645\u062F\u06CC\u0631\u06CC\u062A",
                        callback_data: "admin_panel"
                      },
                      {
                        text: "\u{1F464} \u0646\u0645\u0627\u06CC \u06A9\u0627\u0631\u0628\u0631",
                        callback_data: "user_view"
                      }
                    ]
                  ]
                }
              })
            }
          );
          return new Response("OK");
        }
        const result = await env.DB.prepare(`
            SELECT id, title
            FROM buttons
            WHERE parent_id = 0
              AND visible = 1
              AND deleted = 0
            ORDER BY position ASC
          `).all();
        const keyboard = (result.results || []).map((button) => [
          {
            text: button.title,
            callback_data: "user_button_" + button.id
          }
        ]);
        await fetch(
          `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify({
              chat_id: chatId,
              text: welcomeText,
              reply_markup: {
                inline_keyboard: keyboard
              }
            })
          }
        );
        return new Response("OK");
      }
      return new Response("OK");
    }
    if (url.pathname === "/set-webhook") {
      const webhookUrl = "https://telegram-cloudflare-worker.mojirsoleimani.workers.dev/webhook";
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
      return new Response(await response.text(), {
        headers: {
          "content-type": "application/json; charset=UTF-8"
        }
      });
    }
    return new Response("Surgicaltechnologist Worker OK");
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
