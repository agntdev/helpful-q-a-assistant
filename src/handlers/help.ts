import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

const composer = new Composer<Ctx>();

const HELP =
  "ℹ️ How to use this bot:\n\n" +
  "Just type your question in the chat — I'll answer it right away!\n\n" +
  "Example prompts:\n" +
  "• What's the capital of France?\n" +
  "• How do I reset my password?\n" +
  "• Explain quantum computing simply\n\n" +
  "Use the buttons to:\n" +
  "• Mark answers as helpful or not\n" +
  "• Report issues for admin review\n" +
  "• Adjust your answer preferences\n\n" +
  "Commands:\n" +
  "• /start — Open the main menu\n" +
  "• /help — Show this message";

const backToMenu = inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]);

composer.command("help", async (ctx) => {
  await ctx.reply(HELP);
});

composer.callbackQuery("menu:help", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(HELP, { reply_markup: backToMenu });
});

export default composer;
