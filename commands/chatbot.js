const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.API_GEMINI);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const contextMap = new Map();

function formatPromptManja(previousResponse, userAddition) {
  return `Kita sedang ngobrol soal ini:\n"${previousResponse}"\n\nSekarang user menambahkan:\n"${userAddition}"\n\nJawab dengan gaya manja, singkat tapi jelas. Gunakan nada lembut dan sedikit genit.`;
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!chat')) {
    const prompt = message.content.replace('!chat', '').trim();
    if (!prompt) return message.reply('Ajak aku ngobrol ya sayang ~. Gunakan: `!chat pesanmu`');

    try {
      const styledPrompt = `Jawab singkat dan gunakan nada lembut dan sedikit genit.\n\nPertanyaan: ${prompt}`;
      const result = await model.generateContent(styledPrompt);
      const response = await result.response.text();
      const botReply = await message.reply(response);

      contextMap.set(botReply.id, response);
    } catch (err) {
      console.error('⚠️ Error:', err);
      message.reply('⚠️ Aku lagi ngambek nih... coba lagi nanti ya~');
    }
    return;
  }

  if (message.reference?.messageId) {
    const repliedToId = message.reference.messageId;
    const previousResponse = contextMap.get(repliedToId);

    if (previousResponse) {
      const userAddition = message.content.trim();
      const fullPrompt = formatPromptManja(previousResponse, userAddition);

      try {
        const result = await model.generateContent(fullPrompt);
        const response = await result.response.text();
        const botReply = await message.reply(response);

        contextMap.set(botReply.id, response);
      } catch (err) {
        console.error('⚠️ Error:', err);
        message.reply('Aku bingung nih... bisa ulangi dengan kata lain nggak~?');
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
