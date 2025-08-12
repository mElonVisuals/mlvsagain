// C:\Users\hopsi\Desktop\mlvsagain\commands\music\volume.js

const { createGlassEmbed } = require('../../utils/glassEmbedBuilder');

module.exports = {
    name: 'volume',
    description: 'Sets the playback volume (1-100).',
    category: 'music',
    async execute(message, args, client) {
        // Get the queue for the guild
        const queue = client.distube.getQueue(message);

        // Check if there is an active queue
        if (!queue) {
            const errorEmbed = createGlassEmbed({
                title: '❌ No Music Playing',
                description: 'There is nothing playing.',
                color: '#FF6B6B',
                client: client,
            });
            return message.reply({ embeds: [errorEmbed] });
        }

        // Get the desired volume from the arguments and convert to a number
        const newVolume = parseInt(args[0]);

        // Validate the new volume is a number and within a safe range
        if (isNaN(newVolume) || newVolume < 0 || newVolume > 100) {
            const errorEmbed = createGlassEmbed({
                title: '⚠️ Invalid Volume',
                description: 'Please enter a valid number between 0 and 100.',
                color: '#FF6B6B',
                client: client,
            });
            return message.reply({ embeds: [errorEmbed] });
        }

        try {
            // Use the queue.setVolume() method
            await queue.setVolume(newVolume);
            
            const volumeEmbed = createGlassEmbed({
                title: '🔊 Volume Changed',
                description: `Volume has been set to **${newVolume}%**.`,
                color: '#7289DA',
                client: client
            });
            message.reply({ embeds: [volumeEmbed] });
        } catch (e) {
            // Handle any potential errors
            console.error(e);
            const errorEmbed = createGlassEmbed({
                title: '⚠️ Error',
                description: 'An error occurred while trying to set the volume.',
                color: '#FF6B6B',
                client: client,
            });
            message.reply({ embeds: [errorEmbed] });
        }
    },
};
