const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { DISCORD_TOKEN } = require('./config');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.login(DISCORD_TOKEN);

async function sendBackupEmbed({ nodeName, status, completedAt }) {
  const { DISCORD_CHANNEL_ID } = require('./config');

  let embed;

  switch (status) {
    case 'start':
      embed = new EmbedBuilder()
        .setTitle('<a:buffering:1416761175504326799> Memulai Backup...')
        .setDescription(`Memulai backup untuk **LunaCraft**\nAnda akan diberi tahu setelah pencadangan selesai dan aman!`)
        .addFields({
          name: '**Detail**',
          value: `**• File Backup :** ${nodeName}\n**• Status :** Sedang dibackup!`
        })
        .setColor('#ffcc00')
        .setFooter({ text: 'LunaCraft Backup System' })
        .setTimestamp();
      break;

    case 'completed':
      embed = new EmbedBuilder()
        .setTitle('<a:success:1416761259076096160> Backup Selesai!')
        .setDescription(`Backup untuk **LunaCraft** sudah selesai.`)
        .addFields({
          name: '**Detail**',
          value: `**• File Backup :** ${nodeName}\n**• Waktu :** ${new Date(completedAt).toLocaleString()}\n**• Status :** Berhasil dibackup!`
        })
        .setColor('#00ff00')
        .setFooter({ text: 'LunaCraft Backup System' })
        .setTimestamp();
      break;

    case 'failed':
      embed = new EmbedBuilder()
        .setTitle('<a:fail:1416761193603006556> Backup Gagal!')
        .setDescription(`**Terjadi kesalahan** saat mencoba mem-backup **${nodeName}**.\nMohon periksa log atau jalankan ulang proses.`)
        .addFields({
          name: '**Detail**',
          value: `**• File Backup :** ${nodeName}\n**• Status :** Gagal dibackup!`
        })
        .setColor('#ff0000')
        .setFooter({ text: 'LunaCraft Backup System' })
        .setTimestamp();
      break;

    default:
      console.error('Status tidak valid:', status);
      return;
  }

  try {
    const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
    await channel.send({ embeds: [embed] });
    console.log(`Embed status "${status}" terkirim`);
  } catch (err) {
    console.error('Gagal kirim embed:', err.message);
  }
}

module.exports = { sendBackupEmbed };