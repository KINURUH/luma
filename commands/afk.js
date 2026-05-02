module.exports = async (message, client) => {
    const args = message.content.split(' ');
    const command = args[0].toLowerCase();

    if (command === '!afk') {
        if (!message.member.permissions.has('ManageMessages')) {
            return message.reply('❌ Fitur AFK ini hanya khusus untuk Admin.');
        }

        const reason = args.slice(1).join(' ') || 'Sedang sibuk atau tidak ada di tempat.';

        client.afk.set(message.author.id, {
            reason: reason,
            time: Date.now()
        });

        message.reply(`✅ Kamu sekarang AFK: **${reason}**`);
    }
};