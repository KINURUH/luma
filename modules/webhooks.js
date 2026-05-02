const { EmbedBuilder } = require('discord.js');

module.exports = (client, app) => {
    const channelId = process.env.DONATION_CHANNEL_ID;

    const sendDonationEmbed = async (data, platform, color, logoUrl) => {
        try {
            const channel = await client.channels.fetch(channelId);
            if (!channel) return;

            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(`🎉 Ada Donasi Baru di ${platform}!`)
                .setDescription(`**${data.donator_name || data.donatorName}** baru saja mendonasikan **Rp ${data.amount_raw || data.amount}**`)
                .addFields({ name: 'Pesan:', value: data.message || 'Tidak ada pesan' })
                .setThumbnail(logoUrl)
                .setTimestamp();

            channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(`❌ Gagal mengirim notifikasi ${platform}:`, error);
        }
    };

    app.post('/webhook/saweria', (req, res) => {
        sendDonationEmbed(req.body, 'Saweria', '#FF9900', 'https://saweria.co/assets/img/logo.png');
        res.sendStatus(200);
    });

    app.post('/webhook/tako', (req, res) => {
        sendDonationEmbed(req.body, 'Tako', '#FF5C8A', 'https://tako.id/images/logo.png');
        res.sendStatus(200);
    });
};