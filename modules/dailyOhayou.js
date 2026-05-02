const cron = require('node-cron');

module.exports = (client) => {
    const channelId = process.env.GENERAL_CHANNEL_ID;

    cron.schedule('0 6 * * *', async () => {
        try {
            const channel = await client.channels.fetch(channelId);
            if (!channel) return;

            const imageUrl = 'https://media1.tenor.com/m/YwW1Wd1Tj5EAAAAd/bocchi-the-rock-hitori-gotou.gif';

            await channel.send({
                content: '☀️ **Ohayou Gozaimasu!** Selamat pagi semuanya, semangat jalani hari ini!',
                files: [imageUrl]
            });
            console.log("⏰ Pesan Ohayou berhasil dikirim!");
        } catch (error) {
            console.error("❌ Gagal mengirim pesan Ohayou:", error);
        }
    }, {
        timezone: "Asia/Jakarta"
    });
};