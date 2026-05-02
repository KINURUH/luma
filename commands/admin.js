module.exports = async (message, client) => {
    const args = message.content.split(' ');
    const command = args[0].toLowerCase();

    if (!message.member.permissions.has('ManageMessages')) return;

    if (command === '!purge' || command === '!clear') {
        if (!message.guild.members.me.permissions.has('ManageMessages')) {
            return message.reply('❌ Bot tidak memiliki izin "Manage Messages".');
        }

        const amount = parseInt(args[1]);
        if (isNaN(amount) || amount < 1 || amount > 100) {
            return message.reply('❌ Masukkan angka 1 - 100. Contoh: `!purge 10`');
        }

        try {
            await message.channel.bulkDelete(amount, true);
            const reply = await message.channel.send(`🧹 Berhasil menghapus **${amount}** pesan!`);
            setTimeout(() => reply.delete().catch(() => {}), 3000);
        } catch (error) {
            console.error("Purge error:", error);
            message.reply('❌ Gagal menghapus pesan.');
        }
    }
};