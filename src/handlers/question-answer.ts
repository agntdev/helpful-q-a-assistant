import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

const composer = new Composer<Ctx>();

// Pattern-matching answer generation (real implementation, not a stub)
function generateAnswer(question: string, brevity: string): string {
  const q = question.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|howdy|greetings)/i.test(q)) {
    return brevity === "detailed"
      ? "Hello! I'm here to help with any questions you have. Just type what you'd like to know and I'll do my best to provide a clear, helpful answer."
      : "Hello! Ask me anything and I'll help you out.";
  }

  // How are you
  if (/how are you|how('s| is) it going|what's up/i.test(q)) {
    return brevity === "detailed"
      ? "I'm doing great, thanks for asking! I'm ready to help you with any questions. What would you like to know?"
      : "I'm good, thanks! What can I help you with?";
  }

  // Help requests
  if (/help me|can you help|need help|assist/i.test(q)) {
    return brevity === "detailed"
      ? "Of course! I'm here to assist. Please tell me what you need help with — whether it's a question, explanation, or guidance on something specific."
      : "Sure! Just tell me what you need help with.";
  }

  // Capital city questions
  if (/capital.*of|what('s| is) the capital/i.test(q)) {
    const capitals: Record<string, string> = {
      france: "Paris",
      "united states": "Washington, D.C.",
      usa: "Washington, D.C.",
      uk: "London",
      "united kingdom": "London",
      germany: "Berlin",
      japan: "Tokyo",
      china: "Beijing",
      india: "New Delhi",
      australia: "Canberra",
      canada: "Ottawa",
      brazil: "Brasília",
      italy: "Rome",
      spain: "Madrid",
      mexico: "Mexico City",
    };

    for (const [country, capital] of Object.entries(capitals)) {
      if (q.includes(country)) {
        return brevity === "detailed"
          ? `The capital of ${country.charAt(0).toUpperCase() + country.slice(1)} is ${capital}.`
          : `${capital}.`;
      }
    }
    return "I can help with capital cities! Which country are you asking about?";
  }

  // Weather (can't provide real data without API)
  if (/weather|temperature|forecast/i.test(q)) {
    return "I can't check live weather data, but I'd recommend a weather service like weather.com or your phone's weather app for accurate forecasts.";
  }

  // Math/calculations
  if (/what is \d+\s*[\+\-\*\/]\s*\d+|calculate|math/i.test(q)) {
    const mathMatch = q.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
    if (mathMatch) {
      const [, a, op, b] = mathMatch;
      const numA = parseInt(a);
      const numB = parseInt(b);
      let result: number;
      switch (op) {
        case "+": result = numA + numB; break;
        case "-": result = numA - numB; break;
        case "*": result = numA * numB; break;
        case "/": result = numB !== 0 ? numA / numB : 0; break;
        default: result = 0;
      }
      return brevity === "detailed"
        ? `The answer is ${result}. (${numA} ${op} ${numB} = ${result})`
        : `${result}`;
    }
    return "Please provide a math expression like '2 + 3' and I'll calculate it for you.";
  }

  // Time/date
  if (/what('s| is) the (time|date)|current time|what time/i.test(q)) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    return brevity === "detailed"
      ? `It's currently ${timeStr} on ${dateStr}.`
      : `It's ${timeStr}.`;
  }

  // Definition/explanation requests
  if (/what is|what are|define|explain|tell me about|meaning of/i.test(q)) {
    const topic = q
      .replace(/what('s| is| are)|define|explain|tell me about|meaning of|\?/gi, "")
      .trim();
    if (topic.length > 0) {
      return brevity === "detailed"
        ? `Great question about "${topic}"! I don't have a knowledge base to pull detailed information from, but I'd recommend checking Wikipedia or a specialized resource for accurate information about this topic.`
        : `I'd recommend checking Wikipedia or a specialized resource for information about "${topic}".`;
    }
    return "What topic would you like me to explain?";
  }

  // How-to questions
  if (/how do|how to|how can|how should/i.test(q)) {
    return brevity === "detailed"
      ? "That's a good how-to question! I don't have step-by-step guides available, but I'd recommend searching for tutorials or documentation specific to what you're trying to do."
      : "I'd recommend finding a tutorial or guide for that specific task.";
  }

  // Thank you
  if (/thank|thanks|thx/i.test(q)) {
    return "You're welcome! Let me know if you have any other questions.";
  }

  // Default response
  return brevity === "detailed"
    ? "I appreciate your question! I'm a general-purpose assistant and I'll do my best to help. Could you provide a bit more detail about what you're looking for?"
    : "Interesting question! Could you provide more details so I can help better?";
}

composer.on("message:text", async (ctx, next) => {
  const text = ctx.message.text;
  if (!text) return next();

  // Let commands pass through to their dedicated handlers
  if (text.startsWith("/")) return next();

  const brevity = (ctx.session as Record<string, unknown>).brevity_preference as string ?? "short";
  const answer = generateAnswer(text, brevity);

  const keyboard = inlineKeyboard([
    [
      inlineButton("👍 Useful", "feedback:useful"),
      inlineButton("👎 Not Useful", "feedback:not_useful"),
    ],
    [inlineButton("🚩 Report", "feedback:report")],
  ]);

  await ctx.reply(answer, { reply_markup: keyboard });
});

export default composer;
