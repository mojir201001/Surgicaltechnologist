import { getButtons } from "../db/buttons.js";

export async function buildUserKeyboard(env, parentId = 0) {
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