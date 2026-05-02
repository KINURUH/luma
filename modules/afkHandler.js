const { EmbedBuilder } = require('discord.js');

module.exports = async (message, client) => {
    // 1. Hapus status AFK jika kembali mengirim pesan
    if (client.afk.has(message.author.id)) {
        client.afk.delete(message.author.id);
        const welcomeBack = await message.channel.send(`👋 Selamat datang kembali, ${message.author}! Status AFK kamu telah dihapus.`);
        setTimeout(() => welcomeBack.delete().catch(() => {}), 5000);
    }

    // 2. Deteksi mention ke orang AFK
    if (message.mentions.users.size > 0) {
        message.mentions.users.forEach(user => {
            if (client.afk.has(user.id)) {
                const afkData = client.afk.get(user.id);
                const timestamp = Math.floor(afkData.time / 1000);

                const afkEmbed = new EmbedBuilder()
                    .setColor('#2b2d31')
                    .setAuthor({ name: `${user.username} sedang AFK`, iconURL: user.displayAvatarURL() })
                    .setDescription(`**Alasan:** ${afkData.reason}\n*Sejak: <t:${timestamp}:R>*`);
                
                message.reply({ embeds: [afkEmbed] });
            }
        });
    }
};