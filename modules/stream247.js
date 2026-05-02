const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState, NoSubscriberBehavior } = require('@discordjs/voice');

module.exports = async (client) => {
    const channelId = process.env.VOICE_CHANNEL_ID;
    
    // Menggunakan fallback url yang biasanya lebih lancar untuk bot
    const streamUrl = 'https://listen.moe/fallback'; 
    
    // Setting behavior agar audio terus mengalir
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
                // Matikan inlineVolume untuk live stream agar pemrosesan CPU lebih ringan dan tidak lag/bisu
                const resource = createAudioResource(streamUrl, {
                    inlineVolume: false
                });
                player.play(resource);
            };

            playStream();
            connection.subscribe(player);

            // Tambahkan log ini agar kita tahu bot benar-benar memutar audionya
            player.on(AudioPlayerStatus.Playing, () => {
                console.log('🎶 Audio Player Status: Sedang memutar lagu dari Listen.moe!');
            });

            player.on('error', (error) => {
                console.error('Audio Player Error:', error.message);
                // Restart stream kalau error
                setTimeout(playStream, 3000); 
            });

            player.on(AudioPlayerStatus.Idle, () => playStream());

            connection.on(VoiceConnectionStatus.Disconnected, async () => {
                console.log("⚠️ Bot terputus dari Voice Channel, mencoba reconnect...");
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

            console.log("📻 Modul Radio 24/7 diaktifkan!");
        } catch (error) {
            console.error("❌ Gagal memulai radio:", error);
        }
    };

    connectAndPlay();
};