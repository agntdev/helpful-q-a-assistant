import { Composer } from "grammy";
import type { Ctx } from "../bot.js";

const composer = new Composer<Ctx>();

composer.callbackQuery("feedback:report", async (ctx) => {
  await ctx.answerCallbackQuery();
  const userId = ctx.from?.id ?? "unknown";
  const timestamp = new Date().toISOString();

  // Log the report (in production, this would send to admin group)
  console.log(`[REPORT] User: ${userId}, Time: ${timestamp}`);

  await ctx.editMessageText(
    "🚩 Thanks for reporting this. Our team will review it and improve the response.",
    { reply_markup: { inline_keyboard: [] } },
  );
});

export default composer;
