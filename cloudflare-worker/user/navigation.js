import { getButtons } from "../db/buttons.js";

function iconFor(mode) {
  if (mode === "folder") return "📂";
  if (mode === "content") return "📖";
  if (mode === "input") return "📥";
  if (mode === "mixed") return "🔀";
  if (mode === "link") return "🔗";

  return "🔘";
}

export async function buildUserKeyboard(env, parentId = 0) {
  const buttons = await getButtons(env, parentId);

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