import { Composer } from "grammy";
import type { Ctx } from "../bot.js";

const composer = new Composer<Ctx>();

composer.callbackQuery("feedback:not_useful", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(
    "Sorry I couldn't help. Feel free to rephrase your question or ask something else.",
    { reply_markup: { inline_keyboard: [] } },
  );
});

export default composer;
