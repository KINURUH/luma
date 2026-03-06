require('dotenv').config();
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'sinfo',
  description: 'Menampilkan status server LunaCraft',
  async execute(message) {
    const BEDROCK_IP = process.env.BEDROCK_IP;
    const BEDROCK_PORT = process.env.BEDROCK_PORT;
    const JAVA_IP = process.env.JAVA_IP;
    const API_BEDROCK = `https://api.mcstatus.io/v2/status/bedrock/${BEDROCK_IP}:${BEDROCK_PORT}`;
    const API_JAVA = `https://api.mcstatus.io/v2/status/java/${JAVA_IP}`
    const BANNER_ONLEN = 'https://cdn.discordapp.com/attachments/1221711125356220466/1444660140962877540/online.gif?ex=6939619a&is=6938101a&hm=80bde15f1f5921f8b6de271915395f6f2e0fb79dee384a094a001f888483b631&';
    const BANNER_OPLEN = 'https://cdn.discordapp.com/attachments/1221711125356220466/1444660141243891832/offline.gif?ex=6939619a&is=6938101a&hm=8fadaeb50be87f238e5d03b9539edb20b22b07ce07e60ef30450a938618293ae&';

    if (message.content.includes('!sinfo')) {
      try {
        await message.delete();
      } catch (err) {
        console.error('Gagal menghapus pesan:', err);
      }
    }

    function buildEmbed(data) {
      const isOnline = data.online === true;
      const color = isOnline ? 0x00ff00 : 0xff0000;
      const status = isOnline ? '<a:online:1416511620175368273> Online' : '<a:offline:1416511599362965524> Maintenance';
      const banner = isOnline ? BANNER_ONLEN : BANNER_OPLEN;
      const versionbe = '<a:info:1452118046608068801> 1.26.0.2 - latest'
      const versionje = '<a:info:1452118046608068801> 1.21.11 - latest'

      const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle('Luneth')
        .setDescription('Pesan ini berisi informasi server <:luneth:1451871198450548797> **Luneth**.')
        .addFields(
          { name: '**IP Java**', value: `\`\`\`${JAVA_IP}\`\`\``, inline: false },
          { name: '**IP & Port Bedrock**', value: `\`\`\`${BEDROCK_IP}:${BEDROCK_PORT}\`\`\``, inline: false },
          { name: '**Versi Java**', value: versionje, inline: true },
          { name: '**Versi Bedrock**', value: versionbe, inline: true },
          { name: '**Status**', value: status, inline: true },
        )
        .setImage(banner)
        .setTimestamp(new Date())
        .setFooter({ text: 'Data diperbarui setiap 10 detik' });

      const button = new ButtonBuilder()
        .setLabel('Dukung Server')
        .setEmoji('<a:hotaomoney:1426360161097875526>')
        .setStyle(ButtonStyle.Link)
        .setURL('https://lunacraft.icu/donate');

      const row = new ActionRowBuilder().addComponents(button);

      return {
        embeds: [embed],
        components: [row]
      };
    }

    async function getServerStatus() {
      try {
        const res = await fetch(API_JAVA);
        const data = await res.json();
        return buildEmbed(data);
      } catch (err) {
        console.error('Gagal mengambil data dari API: Server offline?', err);
        return buildEmbed({ online: false });
      }
    }

    const statusEmbed = await getServerStatus();
    const sentMessage = await message.channel.send(statusEmbed);

    setInterval(async () => {
      try {
        const updated = await getServerStatus();
        await sentMessage.edit(updated);
      } catch (err) {
        console.error('Gagal memperbarui status:', err);
      }
    }, 10000);
  }
};
