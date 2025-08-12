// C:\Users\hopsi\Desktop\mlvsagain\commands\music\jump.js

const { createGlassEmbed } = require('../../utils/glassEmbedBuilder');

module.exports = {
    name: 'jump',
    description: 'Jumps to a specific song in the queue.',
    async execute(message, args, client) {
        const queue = client.distube.getQueue(message);
        if (!queue) {
            return message.reply('There is no queue to jump in.');
        }

        // Get the target song number from the arguments
        const songNumber = parseInt(args[0]);

        // Validate the input
        if (isNaN(songNumber) || songNumber <= 0 || songNumber > queue.songs.length) {
            return message.reply('Please enter a valid song number from the queue.');
        }

        try {
            // Use the queue.jump() method to go to the specified song
            const newSong = await queue.jump(songNumber - 1); // DisTube uses a 0-based index
            const jumpEmbed = createGlassEmbed({
                title: '🚀 Jumped to Song',
                description: `Jumped to **[${newSong.name}](${newSong.url})**!`,
                color: '#7289DA',
                client: client,
            });
            message.reply({ embeds: [jumpEmbed] });
        } catch (e) {
            console.error(e);
            message.reply('An error occurred while jumping to that song.');
        }
    },
};
