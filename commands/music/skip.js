// C:\Users\hopsi\Desktop\mlvsagain\commands\music\skip.js

const { createGlassEmbed } = require('../../utils/glassEmbedBuilder');

module.exports = {
    name: 'skip',
    description: 'Skips the current song.',
    category: 'music',
    async execute(message, args, client) {
        // Get the queue for the guild
        const queue = client.distube.getQueue(message);

        // Check if there is an active queue to skip from
        if (!queue) {
            const errorEmbed = createGlassEmbed({
                title: '❌ No Music Playing',
                description: 'There is nothing to skip!',
                color: '#FF6B6B',
                client: client,
            });
            return message.reply({ embeds: [errorEmbed] });
        }

        try {
            // Use the distube.skip() method to skip the current song
            const newSong = await queue.skip();
            
            const skipEmbed = createGlassEmbed({
                title: '⏭️ Song Skipped',
                description: `Skipped to the next song in the queue.`,
                color: '#7289DA',
                client: client,
            });
            message.reply({ embeds: [skipEmbed] });
        } catch (e) {
            // Handle cases where there are no more songs to skip to
            const errorEmbed = createGlassEmbed({
                title: '⚠️ End of Queue',
                description: 'There are no more songs in the queue to skip to.',
                color: '#FF6B6B',
                client: client,
            });
            message.reply({ embeds: [errorEmbed] });
        }
    },
};
