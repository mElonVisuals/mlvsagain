// C:\Users\hopsi\Desktop\mlvsagain\commands\music\stop.js

const { createGlassEmbed } = require('../../utils/glassEmbedBuilder');

module.exports = {
    name: 'stop',
    description: 'Stops the music, clears the queue, and leaves the voice channel.',
    category: 'music',
    async execute(message, args, client) {
        // Get the queue for the guild
        const queue = client.distube.getQueue(message);

        // Check if there is an active queue
        if (!queue) {
            return message.reply('There is nothing to stop!');
        }

        try {
            // Use the distube.stop() method to stop playback and disconnect
            client.distube.stop(message);
            
            const stopEmbed = createGlassEmbed({
                title: '⏹️ Stopped',
                description: 'Playback has been stopped and the queue has been cleared.',
                color: '#FF6B6B',
                client: client
            });
            message.reply({ embeds: [stopEmbed] });
        } catch (e) {
            // Handle any potential errors
            console.error(e);
            message.reply('Error stopping the music: ' + e);
        }
    },
};
