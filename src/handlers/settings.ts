import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

const composer = new Composer<Ctx>();

const SETTINGS_TEXT =
  "⚙️ Answer preferences\n\n" +
  "Choose how detailed you'd like my answers to be:";

function getCurrentPreference(ctx: Ctx): string {
  return (ctx.session as Record<string, unknown>).brevity_preference as string ?? "short";
}

function buildKeyboard(current: string) {
  return inlineKeyboard([
    [
      inlineButton(current === "short" ? "✅ Short" : "Short", "settings:short"),
      inlineButton(current === "detailed" ? "✅ Detailed" : "Detailed", "settings:detailed"),
    ],
    [inlineButton("⬅️ Back to menu", "menu:main")],
  ]);
}

composer.command("settings", async (ctx) => {
  const current = getCurrentPreference(ctx);
  await ctx.reply(SETTINGS_TEXT, { reply_markup: buildKeyboard(current) });
});

composer.callbackQuery("settings:show", async (ctx) => {
  await ctx.answerCallbackQuery();
  const current = getCurrentPreference(ctx);
  await ctx.editMessageText(SETTINGS_TEXT, { reply_markup: buildKeyboard(current) });
});

composer.callbackQuery("settings:short", async (ctx) => {
  await ctx.answerCallbackQuery();
  (ctx.session as Record<string, unknown>).brevity_preference = "short";
  await ctx.editMessageText(SETTINGS_TEXT, { reply_markup: buildKeyboard("short") });
});

composer.callbackQuery("settings:detailed", async (ctx) => {
  await ctx.answerCallbackQuery();
  (ctx.session as Record<string, unknown>).brevity_preference = "detailed";
  await ctx.editMessageText(SETTINGS_TEXT, { reply_markup: buildKeyboard("detailed") });
});

export default composer;
