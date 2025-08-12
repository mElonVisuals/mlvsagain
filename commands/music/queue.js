// C:\Users\hopsi\Desktop\mlvsagain\commands\music\queue.js

const { createGlassEmbed } = require('../../utils/glassEmbedBuilder');

module.exports = {
    name: 'queue',
    description: 'Displays the current music queue.',
    category: 'music',
    async execute(message, args, client) {
        // Get the queue for the guild
        const queue = client.distube.getQueue(message);

        // Check if there is an active queue
        if (!queue || !queue.songs || queue.songs.length === 0) {
            const errorEmbed = createGlassEmbed({
                title: '❌ Queue is Empty',
                description: 'The queue is currently empty!',
                color: '#FF6B6B',
                client: client,
            });
            return message.reply({ embeds: [errorEmbed] });
        }

        // Format the queue to be displayed in a clean, readable list
        const formattedQueue = queue.songs
            .slice(0, 10) // Display the first 10 songs to keep the message from getting too long
            .map((song, index) => {
                // Use a different format for the current song (index 0)
                if (index === 0) {
                    return `**Currently playing:** \`${song.name}\` - \`${song.formattedDuration}\``;
                }
                // Format the rest of the songs with their position in the queue
                return `**${index}.** \`${song.name}\` - \`${song.formattedDuration}\``;
            })
            .join('\n');

        const queueEmbed = createGlassEmbed({
            title: '🎶 Current Queue',
            description: formattedQueue,
            color: '#7289DA',
            client: client,
            footerText: `Total songs in queue: ${queue.songs.length}`
        });

        // Reply with the formatted queue list
        message.reply({ embeds: [queueEmbed] });
    },
};
