const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { checkBackupStatus } = require('./commands/backup/check');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const commands = new Map();

// Load semua file command di folder 'commands'
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        if (command.name && typeof command.execute === 'function') {
            commands.set(command.name, command);
        }
    }
}

client.once('ready', () => {
    console.log(`Selamat datang, Kinuru! Bot Login sebagai ${client.user.tag}.`);
});

client.on('ready', () => {
  client.user.setPresence({
    activities: [{
      name: 'Non P2W Minecraft Server',
      type: ActivityType.Playing,
    }],
    status: 'online',
  });
});


client.on('messageCreate', message => {
    if (message.author.bot) return;

    const prefix = '!';
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (commands.has(commandName)) {
        try {
            commands.get(commandName).execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('Terjadi error saat menjalankan command.');
        }
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Terjadi error saat menjalankan command.', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);