require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const express = require('express');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Setup Collection untuk memori AFK
client.afk = new Collection();

const app = express();
app.use(express.json());

client.once('ready', () => {
    console.log(`✅ Bot online sebagai: ${client.user.tag}`);
    
    // Load background modules
    require('./modules/stream247')(client);
    require('./modules/dailyOhayou')(client);
    require('./modules/webhooks')(client, app);
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;

    // Load Handlers & Automod
    require('./modules/afkHandler')(message, client);
    require('./modules/automod')(message);
    
    // Load Commands
    require('./commands/admin')(message, client);
    require('./commands/afk')(message, client);
});

app.listen(process.env.PORT, () => console.log(`🌐 Server Webhook berjalan di port ${process.env.PORT}`));
client.login(process.env.TOKEN);