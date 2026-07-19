import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { mainMenuKeyboard, registerMainMenuItem } from "../toolkit/index.js";

// Register settings as a main menu item
registerMainMenuItem({ label: "⚙️ Settings", data: "settings:show", order: 30 });

const composer = new Composer<Ctx>();

const WELCOME =
  "👋 Welcome! I'm your Q&A assistant — ask me anything and I'll do my best to help.\n\n" +
  "Tap a button below to get started, or just type your question in the chat.";

const PRIVACY =
  "\n\nYour questions are processed to provide answers. Conversation context " +
  "is kept for follow-ups and expires after 7 days. No sensitive data is stored.";

composer.command("start", async (ctx) => {
  await ctx.reply(WELCOME + PRIVACY, { reply_markup: mainMenuKeyboard() });
});

composer.callbackQuery("menu:main", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(WELCOME, { reply_markup: mainMenuKeyboard() });
});

export default composer;
