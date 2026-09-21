var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// telegram/send.js
async function telegram(env, method, body) {
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
var init_send = __esm({
  "telegram/send.js"() {
    __name(telegram, "telegram");
  }
});

// db/buttons.js
async function getButtons(env, parentId = 0) {
  const result = await env.DB.prepare(`
      SELECT id, title, mode, position
      FROM buttons
      WHERE parent_id = ?
        AND visible = 1
        AND deleted = 0
      ORDER BY position ASC, id ASC
    `).bind(parentId).all();
  return result.results || [];
}
async function getButton(env, buttonId) {
  return env.DB.prepare(`
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
    `).bind(buttonId).first();
}
async function getButtonFiles(env, buttonId, contentOrder) {
  let order = "ORDER BY id DESC";
  if (contentOrder === "old") {
    order = "ORDER BY id ASC";
  }
  if (contentOrder === "random") {
    order = "ORDER BY RANDOM()";
  }
  const result = await env.DB.prepare(`
      SELECT file_id, file_type, caption
      FROM files
      WHERE button_id = ?
        AND deleted = 0
      ${order}
    `).bind(buttonId).all();
  return result.results || [];
}
var init_buttons = __esm({
  "db/buttons.js"() {
    __name(getButtons, "getButtons");
    __name(getButton, "getButton");
    __name(getButtonFiles, "getButtonFiles");
  }
});

// admin/buttonSettings.js
var buttonSettings_exports = {};
__export(buttonSettings_exports, {
  showButtonSettings: () => showButtonSettings
});
function getTypeText(button) {
  if (button.mode === "none") return "\u{1F518} \u0628\u062F\u0648\u0646 \u062A\u0646\u0638\u06CC\u0645";
  if (button.mode === "folder") return "\u{1F4C2} \u0627\u06CC\u062C\u0627\u062F \u0632\u06CC\u0631\u0634\u0627\u062E\u0647";
  if (button.mode === "content") return "\u{1F4D6} \u0646\u0645\u0627\u06CC\u0634 \u0645\u0637\u0644\u0628";
  if (button.mode === "input") return "\u{1F4E5} \u062F\u0631\u06CC\u0627\u0641\u062A \u0645\u0637\u0644\u0628";
  if (button.mode === "link") return "\u{1F517} \u0644\u06CC\u0646\u06A9";
  if (button.mode === "mixed") return "\u{1F500} \u062A\u0631\u06A9\u06CC\u0628\u06CC";
  return "\u{1F518} \u0628\u062F\u0648\u0646 \u062A\u0646\u0638\u06CC\u0645";
}
async function showButtonSettings(env, chatId, buttonId, messageId = null) {
  const button = await getButton(
    env,
    buttonId
  );
  if (!button) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "\u274C \u062F\u06A9\u0645\u0647 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F."
    });
    return;
  }
  const children = await getButtons(
    env,
    buttonId
  );
  const fileResult = await env.DB.prepare(`
      SELECT COUNT(*) AS count
      FROM files
      WHERE button_id = ?
        AND deleted = 0
    `).bind(buttonId).first();
  const keyboard = [];
  if (button.mode === "none" || button.mode === "folder" || button.mode === "mixed") {
    keyboard.push([
      {
        text: "\u{1F4C2} \u0645\u062F\u06CC\u0631\u06CC\u062A \u0632\u06CC\u0631\u0634\u0627\u062E\u0647\u200C\u0647\u0627",
        callback_data: `submenu_${buttonId}`
      }
    ]);
  }
  if (button.mode === "content" || button.mode === "mixed") {
    keyboard.push([
      {
        text: "\u{1F4D6} \u0645\u062F\u06CC\u0631\u06CC\u062A \u0645\u0637\u0627\u0644\u0628",
        callback_data: `set_content_${buttonId}`
      }
    ]);
  }
  if (button.mode === "input" || button.mode === "mixed") {
    keyboard.push([
      {
        text: "\u{1F4E5} \u0645\u062F\u06CC\u0631\u06CC\u062A \u0641\u0627\u06CC\u0644\u200C\u0647\u0627",
        callback_data: `set_input_${buttonId}`
      }
    ]);
  }
  keyboard.push(
    [
      {
        text: "\u2699\uFE0F \u062A\u0646\u0638\u06CC\u0645 \u0646\u0648\u0639 \u062F\u06A9\u0645\u0647",
        callback_data: `button_type_${buttonId}`
      }
    ],
    [
      {
        text: "\u270F\uFE0F \u062A\u063A\u06CC\u06CC\u0631 \u0646\u0627\u0645",
        callback_data: `rename_${buttonId}`
      }
    ],
    [
      {
        text: "\u{1F3A8} \u062A\u063A\u06CC\u06CC\u0631 \u0638\u0627\u0647\u0631",
        callback_data: `style_${buttonId}`
      }
    ],
    [
      {
        text: "\u{1F517} \u0644\u06CC\u0646\u06A9 \u062F\u06A9\u0645\u0647",
        callback_data: `link_${buttonId}`
      }
    ],
    [
      {
        text: "/ \u0627\u06CC\u062C\u0627\u062F \u062F\u0633\u062A\u0648\u0631",
        callback_data: `command_${buttonId}`
      }
    ],
    [
      {
        text: "\u{1F512} \u0642\u0641\u0644 \u062F\u06A9\u0645\u0647",
        callback_data: `lock_${buttonId}`
      }
    ],
    [
      {
        text: "\u{1F441} \u0645\u062E\u0641\u06CC / \u0646\u0645\u0627\u06CC\u0634",
        callback_data: `hide_${buttonId}`
      }
    ],
    [
      {
        text: "\u2195\uFE0F \u0627\u0646\u062A\u0642\u0627\u0644 \u062C\u0627\u06CC\u06AF\u0627\u0647",
        callback_data: `move_${buttonId}`
      }
    ],
    [
      {
        text: "\u{1F5D1} \u062D\u0630\u0641 \u062F\u06A9\u0645\u0647",
        callback_data: `delete_${buttonId}`
      }
    ],
    [
      {
        text: "\u2B05\uFE0F \u0628\u0627\u0632\u06AF\u0634\u062A",
        callback_data: "buttons"
      },
      {
        text: "\u{1F3E0} \u0635\u0641\u062D\u0647 \u0627\u0635\u0644\u06CC",
        callback_data: "admin_panel"
      }
    ]
  );
  const text = `\u2699\uFE0F \u0645\u062F\u06CC\u0631\u06CC\u062A \u062F\u06A9\u0645\u0647

\u{1F4CC} \u0646\u0627\u0645:
${button.title}

\u{1F4CC} \u0646\u0648\u0639:
${getTypeText(button)}

\u{1F4CA} \u0622\u0645\u0627\u0631:
\u{1F4C2} \u0632\u06CC\u0631\u0634\u0627\u062E\u0647\u200C\u0647\u0627: ${children.length}
\u{1F4C4} \u0645\u0637\u0627\u0644\u0628: ${fileResult?.count || 0}

\u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F:`;
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
var init_buttonSettings = __esm({
  "admin/buttonSettings.js"() {
    init_buttons();
    init_send();
    __name(getTypeText, "getTypeText");
    __name(showButtonSettings, "showButtonSettings");
  }
});

// telegram/update.js
init_send();

// user/navigation.js
init_buttons();
async function buildUserKeyboard(env, parentId = 0) {
  const buttons = await getButtons(env, parentId);
  const keyboard = buttons.map((button) => [
    {
      text: button.title,
      callback_data: `user_button_${button.id}`
    }
  ]);
  if (parentId !== 0) {
    keyboard.push([
      {
        text: "\u2B05\uFE0F \u0628\u0627\u0632\u06AF\u0634\u062A",
        callback_data: `user_back_${parentId}`
      }
    ]);
  }
  keyboard.push([
    {
      text: "\u{1F3E0} \u0635\u0641\u062D\u0647 \u0627\u0635\u0644\u06CC",
      callback_data: "home"
    }
  ]);
  return keyboard;
}
__name(buildUserKeyboard, "buildUserKeyboard");

// user/buttons.js
init_send();
async function showUserButtons(env, chatId, parentId = 0, messageId = null) {
  const keyboard = await buildUserKeyboard(
    env,
    parentId
  );
  const data = {
    chat_id: chatId,
    text: "\u{1F4DA} \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F:",
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
__name(showUserButtons, "showUserButtons");

// user/handlers.js
init_buttons();
init_send();

// user/content.js
init_buttons();
init_send();
async function sendButtonContent(env, chatId, buttonId, contentOrder) {
  const files = await getButtonFiles(
    env,
    buttonId,
    contentOrder
  );
  if (files.length === 0) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "\u{1F4ED} \u0645\u0637\u0644\u0628\u06CC \u0628\u0631\u0627\u06CC \u0627\u06CC\u0646 \u0628\u062E\u0634 \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F."
    });
    return;
  }
  for (const file of files) {
    const caption = file.caption || void 0;
    if (file.file_type === "document") {
      await telegram(env, "sendDocument", {
        chat_id: chatId,
        document: file.file_id,
        ...caption ? { caption } : {}
      });
    } else if (file.file_type === "photo") {
      await telegram(env, "sendPhoto", {
        chat_id: chatId,
        photo: file.file_id,
        ...caption ? { caption } : {}
      });
    } else if (file.file_type === "video") {
      await telegram(env, "sendVideo", {
        chat_id: chatId,
        video: file.file_id,
        ...caption ? { caption } : {}
      });
    } else if (file.file_type === "audio") {
      await telegram(env, "sendAudio", {
        chat_id: chatId,
        audio: file.file_id,
        ...caption ? { caption } : {}
      });
    } else if (file.file_type === "text") {
      await telegram(env, "sendMessage", {
        chat_id: chatId,
        text: file.caption || ""
      });
    } else if (caption) {
      await telegram(env, "sendMessage", {
        chat_id: chatId,
        text: caption
      });
    }
  }
}
__name(sendButtonContent, "sendButtonContent");

// user/handlers.js
async function handleUserButton(env, chatId, buttonId, messageId) {
  const button = await getButton(
    env,
    buttonId
  );
  if (!button) {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "\u274C \u062F\u06A9\u0645\u0647 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F."
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
      text: "\u{1F4E5} \u0644\u0637\u0641\u0627\u064B \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0645\u0648\u0631\u062F \u0646\u06CC\u0627\u0632 \u0631\u0627 \u0627\u0631\u0633\u0627\u0644 \u06A9\u0646\u06CC\u062F."
    });
    return;
  }
  if (button.mode === "link") {
    await telegram(env, "sendMessage", {
      chat_id: chatId,
      text: "\u{1F517} \u0627\u06CC\u0646 \u0628\u062E\u0634 \u062F\u0631 \u0645\u0631\u062D\u0644\u0647 \u0628\u0639\u062F \u062A\u06A9\u0645\u06CC\u0644 \u0645\u06CC\u200C\u0634\u0648\u062F."
    });
    return;
  }
  await telegram(env, "sendMessage", {
    chat_id: chatId,
    text: "\u26A0\uFE0F \u0627\u06CC\u0646 \u062F\u06A9\u0645\u0647 \u0647\u0646\u0648\u0632 \u062A\u0646\u0638\u06CC\u0645 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A."
  });
}
__name(handleUserButton, "handleUserButton");

// admin/panel.js
init_send();
async function showAdminPanel(env, chatId, messageId = null) {
  const data = {
    chat_id: chatId,
    text: `\u{1F6E0} \u067E\u0646\u0644 \u0645\u062F\u06CC\u0631\u06CC\u062A

\u06CC\u06A9\u06CC \u0627\u0632 \u0628\u062E\u0634\u200C\u0647\u0627\u06CC \u0632\u06CC\u0631 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F.`,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "\u{1F4C2} \u0645\u062F\u06CC\u0631\u06CC\u062A \u062F\u06A9\u0645\u0647\u200C\u0647\u0627",
            callback_data: "buttons"
          }
        ],
        [
          {
            text: "\u{1F4C1} \u0645\u062F\u06CC\u0631\u06CC\u062A \u0641\u0627\u06CC\u0644\u200C\u0647\u0627",
            callback_data: "files"
          }
        ],
        [
          {
            text: "\u{1F465} \u0645\u062F\u06CC\u0631\u06CC\u062A \u06A9\u0627\u0631\u0628\u0631\u0627\u0646",
            callback_data: "users"
          }
        ],
        [
          {
            text: "\u{1F4E2} \u067E\u06CC\u0627\u0645 \u0647\u0645\u06AF\u0627\u0646\u06CC",
            callback_data: "broadcast"
          }
        ],
        [
          {
            text: "\u26A1 \u067E\u0627\u0633\u062E \u0633\u0631\u06CC\u0639",
            callback_data: "reply"
          }
        ],
        [
          {
            text: "\u{1F916} \u062F\u0633\u062A\u06CC\u0627\u0631 \u06AF\u0631\u0648\u0647",
            callback_data: "group"
          }
        ],
        [
          {
            text: "\u{1F4E2} \u062F\u0633\u062A\u06CC\u0627\u0631 \u06A9\u0627\u0646\u0627\u0644",
            callback_data: "channel"
          }
        ],
        [
          {
            text: "\u{1F468}\u200D\u{1F4BC} \u0645\u062F\u06CC\u0631\u06CC\u062A \u0645\u062F\u06CC\u0631\u0627\u0646",
            callback_data: "admins"
          }
        ],
        [
          {
            text: "\u{1F4BE} \u0628\u06A9\u0627\u067E",
            callback_data: "backup"
          }
        ],
        [
          {
            text: "\u{1F5D1} \u0633\u0637\u0644 \u0632\u0628\u0627\u0644\u0647",
            callback_data: "trash"
          }
        ],
        [
          {
            text: "\u2699\uFE0F \u062A\u0646\u0638\u06CC\u0645\u0627\u062A",
            callback_data: "settings"
          }
        ],
        [
          {
            text: "\u2B05\uFE0F \u0628\u0627\u0632\u06AF\u0634\u062A",
            callback_data: "back"
          },
          {
            text: "\u{1F3E0} \u0635\u0641\u062D\u0647 \u0627\u0635\u0644\u06CC",
            callback_data: "home"
          }
        ]
      ]
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
__name(showAdminPanel, "showAdminPanel");

// admin/buttons.js
init_buttons();
init_send();
async function showAdminButtons(env, chatId, messageId = null) {
  const buttons = await getButtons(env, 0);
  const keyboard = [];
  keyboard.push([
    {
      text: "\u2795 \u0627\u06CC\u062C\u0627\u062F \u062F\u06A9\u0645\u0647 \u062C\u062F\u06CC\u062F",
      callback_data: "create_button"
    }
  ]);
  for (const button of buttons) {
    keyboard.push([
      {
        text: "\u{1F4C2} " + button.title,
        callback_data: `button_${button.id}`
      }
    ]);
  }
  keyboard.push([
    {
      text: "\u2B05\uFE0F \u0628\u0627\u0632\u06AF\u0634\u062A",
      callback_data: "admin_panel"
    },
    {
      text: "\u{1F3E0} \u0635\u0641\u062D\u0647 \u0627\u0635\u0644\u06CC",
      callback_data: "home"
    }
  ]);
  const data = {
    chat_id: chatId,
    text: "\u{1F4C2} \u0645\u062F\u06CC\u0631\u06CC\u062A \u062F\u06A9\u0645\u0647\u200C\u0647\u0627",
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
__name(showAdminButtons, "showAdminButtons");

// telegram/update.js
var welcomeText = `\u{1F31F} \u0628\u0647 \u0631\u0628\u0627\u062A \u0627\u062E\u062A\u0635\u0627\u0635\u06CC \u062F\u0627\u0646\u0634\u062C\u0648\u06CC\u0627\u0646 \u0627\u062A\u0627\u0642 \u0639\u0645\u0644 \u06A9\u062F 1\uFE0F\u20E3 \u062E\u0648\u0634 \u0622\u0645\u062F\u06CC\u062F.

\u0627\u0632 \u0637\u0631\u06CC\u0642 \u0627\u06CC\u0646 \u0631\u0628\u0627\u062A \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F:

\u{1F4DA} \u0628\u0647 \u062C\u0632\u0648\u0647\u200C\u0647\u0627 \u0648 \u0641\u0627\u06CC\u0644\u200C\u0647\u0627\u06CC \u0622\u0645\u0648\u0632\u0634\u06CC \u062F\u0633\u062A\u0631\u0633\u06CC \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u06CC\u062F.
\u{1F393} \u0627\u0632 \u0645\u062D\u062A\u0648\u0627\u06CC \u0627\u062E\u062A\u0635\u0627\u0635\u06CC \u0628\u0647\u0631\u0647\u200C\u0645\u0646\u062F \u0634\u0648\u06CC\u062F.
\u{1F4AF} \u0648 \u0627\u0632 \u0627\u0645\u06A9\u0627\u0646\u0627\u062A \u0645\u062A\u0646\u0648\u0639 \u0631\u0628\u0627\u062A \u0628\u0631\u0627\u06CC \u06CC\u0627\u062F\u06AF\u06CC\u0631\u06CC \u0628\u0647\u062A\u0631 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F.

\u0644\u0637\u0641\u0627\u064B \u06CC\u06A9\u06CC \u0627\u0632 \u06AF\u0632\u06CC\u0646\u0647\u200C\u0647\u0627\u06CC \u0632\u06CC\u0631 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F.`;
async function handleUpdate(env, update) {
  const chatId = update.message?.chat?.id || update.callback_query?.message?.chat?.id;
  const userId = update.message?.from?.id || update.callback_query?.from?.id;
  if (!chatId) {
    return;
  }
  if (update.message?.text === "/start") {
    if (String(userId) === String(env.ADMIN_ID)) {
      await telegram(env, "sendMessage", {
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
  if (update.callback_query?.data === "admin_panel" && String(userId) === String(env.ADMIN_ID)) {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: update.callback_query.id
    });
    await showAdminPanel(
      env,
      chatId,
      update.callback_query.message.message_id
    );
    return;
  }
  if (update.callback_query?.data === "buttons" && String(userId) === String(env.ADMIN_ID)) {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: update.callback_query.id
    });
    await showAdminButtons(
      env,
      chatId,
      update.callback_query.message.message_id
    );
    return;
  }
  if (update.callback_query?.data === "user_view") {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: update.callback_query.id
    });
    await showUserButtons(
      env,
      chatId,
      0,
      update.callback_query.message.message_id
    );
    return;
  }
  if (update.callback_query?.data === "home") {
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: update.callback_query.id
    });
    await showUserButtons(
      env,
      chatId,
      0,
      update.callback_query.message.message_id
    );
    return;
  }
  if (update.callback_query?.data?.startsWith(
    "user_back_"
  )) {
    const currentButtonId = Number(
      update.callback_query.data.replace(
        "user_back_",
        ""
      )
    );
    const parent = await env.DB.prepare(
      "SELECT parent_id FROM buttons WHERE id = ?"
    ).bind(currentButtonId).first();
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: update.callback_query.id
    });
    await showUserButtons(
      env,
      chatId,
      parent?.parent_id || 0,
      update.callback_query.message.message_id
    );
    return;
  }
  if (update.callback_query?.data?.startsWith("button_") && String(userId) === String(env.ADMIN_ID)) {
    const { showButtonSettings: showButtonSettings2 } = await Promise.resolve().then(() => (init_buttonSettings(), buttonSettings_exports));
    const buttonId = Number(
      update.callback_query.data.replace("button_", "")
    );
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: update.callback_query.id
    });
    await showButtonSettings2(
      env,
      chatId,
      buttonId,
      update.callback_query.message.message_id
    );
    return;
  }
  if (update.callback_query?.data?.startsWith(
    "user_button_"
  )) {
    const buttonId = Number(
      update.callback_query.data.replace(
        "user_button_",
        ""
      )
    );
    await telegram(env, "answerCallbackQuery", {
      callback_query_id: update.callback_query.id
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
__name(handleUpdate, "handleUpdate");

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
    if ((url.pathname === "/webhook" || url.pathname.startsWith("/webhook/")) && request.method === "POST") {
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
      } catch (error) {
        console.error(
          "WEBHOOK ERROR:",
          error
        );
        return new Response("OK");
      }
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
      return new Response(
        await response.text(),
        {
          headers: {
            "content-type": "application/json; charset=UTF-8"
          }
        }
      );
    }
    return new Response(
      "Surgicaltechnologist Worker OK"
    );
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
