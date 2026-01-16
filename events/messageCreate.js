import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const cooldown = new Map();

export default {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot) return;

    const botId = client.user.id;
    const botName = client.user.username.toLowerCase();
    const content = message.content.toLowerCase();

    const mentioned =
      message.mentions.has(botId) ||
      content.includes(botName);

    if (!mentioned) return;

    const now = Date.now();
    if (cooldown.has(message.author.id)) {
      const last = cooldown.get(message.author.id);
      if (now - last < 10000) return;
    }
    cooldown.set(message.author.id, now);

    const cleanText = message.content
      .replace(new RegExp(`<@!?${botId}>`, "g"), "")
      .trim();

    if (!cleanText) return message.reply("Мяу? 😺 Напиши щось.");

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a friendly Ukrainian Discord bot called 'Твій кіт України'. Speak Ukrainian, be cute, helpful, and cat-like."
          },
          {
            role: "user",
            content: cleanText
          }
        ]
      });

      await message.reply(response.choices[0].message.content);
    } catch (err) {
      console.error(err);
      await message.reply("😿 Щось пішло не так, спробуй ще раз.");
    }
  }
};
