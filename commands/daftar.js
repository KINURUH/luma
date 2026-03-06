const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'reg',
    description: 'Mencatat ID dan nama pemain ke file daftar.txt',
    execute(message, args) {

        if (!args.length) {
            return message.reply('Format: !reg Nickname');
        }

        const playerName = args.join(' ');
        const userId = message.author.id;
        const filePath = path.join("./Daftar", 'snowball.txt');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (!err) {
                const isRegistered = data.split('\n').some(line => {
                    const [id, nick] = line.split('|').map(s => s && s.trim().toLowerCase());
                    return id === userId.toLowerCase();
                });
                if (isRegistered) {
                    return message.reply(`Kamu sudah terdaftar sebagai **${playerName}**!`);
                }
            }

            const entry = `${userId} | ${playerName}\n`;
            fs.appendFile(filePath, entry, (err) => {
                if (err) {
                    console.error(err);
                    return message.reply('Gagal mendaftar, coba lagi setelah beberapa saat.');
                }
                message.reply(`Berhasil mendaftar sebagai **${playerName}**!`);
            });
        });
    }
};