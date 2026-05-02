module.exports = async (message) => {
    if (message.member.permissions.has('ManageMessages')) return;

    const scamRegex = /(free bitcoin|crypto airdrop|bitcoin generator|investasi crypto jamin)/i;
    if (scamRegex.test(message.content)) {
        message.delete().catch(() => {});
        if (message.member.manageable) {
            await message.member.timeout(3600 * 1000, 'Mengirim pesan scam/bitcoin').catch(console.error);
            message.channel.send(`🚨 **${message.author.tag}** telah di-Timeout selama 1 Jam karena mengirim pesan Scam.`);
        }
        return;
    }

    if (message.mentions.users.size > 4) {
        message.delete().catch(() => {});
        if (message.member.manageable) {
            await message.member.timeout(15 * 60 * 1000, 'Spam Mention').catch(console.error);
            message.channel.send(`🛑 **${message.author.tag}** di-Timeout 15 menit karena Spam Tag.`);
        }
    }
};