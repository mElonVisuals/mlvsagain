// C:\Users\hopsi\Desktop\mlvsagain\commands\music\loop.js

const { createGlassEmbed } = require('../../utils/glassEmbedBuilder');

module.exports = {
    name: 'loop',
    description: 'Loops the current song, the queue, or turns looping off.',
    category: 'music',
    async execute(message, args, client) {
        // Get the queue for the guild
        const queue = client.distube.getQueue(message);

        // Check if there is an active queue
        if (!queue) {
            return message.reply('There is nothing playing.');
        }

        // Get the current repeat mode and define the next one
        const mode = queue.repeatMode;
        let newMode = 0; // 0 = off, 1 = song, 2 = queue

        // Determine the next repeat mode based on the current one
        if (mode === 0) {
            newMode = 1; // Change to loop song
        } else if (mode === 1) {
            newMode = 2; // Change to loop queue
        } else {
            newMode = 0; // Change to turn off loop
        }
        
        // Set the new repeat mode
        client.distube.setRepeatMode(message, newMode);

        const newModeText = newMode === 1 ? 'Song' : (newMode === 2 ? 'Queue' : 'Off');

        const loopEmbed = createGlassEmbed({
            title: '🔁 Loop Status',
            description: `The loop mode has been set to **${newModeText}**!`,
            color: '#7289DA',
            client: client
        });
        
        message.reply({ embeds: [loopEmbed] });
    },
};
