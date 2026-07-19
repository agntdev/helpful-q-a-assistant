import { Composer } from "grammy";
import type { Ctx } from "../bot.js";

const composer = new Composer<Ctx>();

composer.callbackQuery("feedback:useful", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(
    "✅ Thanks for your feedback! Glad I could help.",
    { reply_markup: { inline_keyboard: [] } },
  );
});

export default composer;
