// C:\Users\hopsi\Desktop\mlvsagain\commands\music\nowplaying.js

const { createGlassEmbed } = require('../../utils/glassEmbedBuilder');

module.exports = {
    name: 'nowplaying',
    description: 'Displays the song currently playing.',
    category: 'music',
    async execute(message, args, client) {
        // Get the queue for the guild
        const queue = client.distube.getQueue(message);

        // Check if there is an active queue
        if (!queue || !queue.songs || queue.songs.length === 0) {
            const errorEmbed = createGlassEmbed({
                title: '❌ No Music Playing',
                description: 'There is nothing currently playing!',
                color: '#FF6B6B',
                client: client,
            });
            return message.reply({ embeds: [errorEmbed] });
        }

        // The current song is always the first song in the queue array
        const song = queue.songs[0];

        const nowPlayingEmbed = createGlassEmbed({
            title: '🎵 Now Playing',
            description: `**[${song.name}](${song.url})**`,
            color: '#00FF87',
            thumbnail: song.thumbnail,
            client: client,
            footerText: `Playing in ${queue.voiceChannel.name}`
        });

        // Add detailed fields about the song
        nowPlayingEmbed.addFields(
            { name: 'Requested by', value: `${song.user}`, inline: true },
            { name: 'Duration', value: song.formattedDuration, inline: true }
        );

        message.reply({ embeds: [nowPlayingEmbed] });
    },
};
