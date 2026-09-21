import { handleUpdate } from "./telegram/update.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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
            "content-type":
              "application/json; charset=UTF-8"
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

        await handleUpdate(
          env,
          update
        );

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