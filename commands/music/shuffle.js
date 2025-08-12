// C:\Users\hopsi\Desktop\mlvsagain\commands\music\shuffle.js

const { createGlassEmbed } = require('../../utils/glassEmbedBuilder');

module.exports = {
    name: 'shuffle',
    description: 'Shuffles the queue.',
    category: 'music',
    async execute(message, args, client) {
        const queue = client.distube.getQueue(message);
        if (!queue) {
            return message.reply('There is nothing to shuffle.');
        }

        try {
            // Use the built-in queue.shuffle() method
            await queue.shuffle();
            const shuffleEmbed = createGlassEmbed({
                title: '🔀 Queue Shuffled',
                description: 'The queue has been shuffled!',
                color: '#7289DA',
                client: client
            });
            message.reply({ embeds: [shuffleEmbed] });
        } catch (e) {
            console.error(e);
            message.reply('An error occurred while trying to shuffle the queue.');
        }
    },
};
