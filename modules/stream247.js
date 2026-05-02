// Paksa Pterodactyl menggunakan ffmpeg dari node_modules
process.env.FFMPEG_PATH = require('ffmpeg-static');

const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState, NoSubscriberBehavior } = require('@discordjs/voice');

module.exports = async (client) => {
    const channelId = process.env.VOICE_CHANNEL_ID;
    const streamUrl = 'https://listen.moe/fallback'; 
    
    let player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Play,
        },
    });

    const connectAndPlay = async () => {
        try {
            const channel = await client.channels.fetch(channelId);
            if (!channel) return console.error("❌ Voice channel radio tidak ditemukan!");

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });

            const playStream = () => {
                const resource = createAudioResource(streamUrl, {
                    inlineVolume: false // Wajib false untuk stream Pterodactyl biar enteng
                });
                player.play(resource);
            };

            playStream();
            connection.subscribe(player);

            player.on(AudioPlayerStatus.Playing, () => {
                console.log('🎶 Audio Player Status: Sedang memutar lagu!');
            });

            player.on('error', (error) => {
                console.error('Audio Player Error:', error.message);
                setTimeout(playStream, 3000); 
            });

            player.on(AudioPlayerStatus.Idle, () => playStream());

            connection.on(VoiceConnectionStatus.Disconnected, async () => {
                console.log("⚠️ Bot terputus, mencoba reconnect...");
                try {
                    await Promise.race([
                        entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                        entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                    ]);
                } catch (error) {
                    connection.destroy();
                    setTimeout(connectAndPlay, 5000);
                }
            });

        } catch (error) {
            console.error("❌ Gagal memulai radio:", error);
        }
    };

    connectAndPlay();
};