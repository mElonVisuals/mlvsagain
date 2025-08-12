// C:\Users\hopsi\Desktop\mlvsagain\commands\music\add.js

const { createGlassEmbed } = require('../../utils/glassEmbedBuilder');

module.exports = {
    name: 'add',
    description: 'Adds a song to the end of the queue without playing it immediately.',
    category: 'music',
    usage: '!add <song name/URL>',
    cooldown: 3,

    execute: async (message, args, client) => {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            const errorEmbed = createGlassEmbed({
                title: '🔊 Voice Channel Required',
                description: '```diff\n- You need to be in a voice channel to add music!\n```',
                color: '#FF6B6B',
                client: client
            });
            return message.reply({ embeds: [errorEmbed] });
        }

        const query = args.join(' ');
        if (!query) {
            const usageEmbed = createGlassEmbed({
                title: '🎵 Add Command Usage',
                description: '```yaml\nUsage: !add <song name/URL>\n```',
                color: '#7289DA',
                client: client
            });
            return message.reply({ embeds: [usageEmbed] });
        }

        const queue = client.distube.getQueue(message);
        if (!queue) {
            const errorEmbed = createGlassEmbed({
                title: '❌ No Music Playing',
                description: '```diff\n- There is no active queue. Please use the !play command instead!\n```',
                color: '#FF6B6B',
                client: client
            });
            return message.reply({ embeds: [errorEmbed] });
        }

        try {
            await client.distube.add(message, query);
            const successEmbed = createGlassEmbed({
                title: '➕ Added to Queue',
                description: `**[${query}]** has been added to the queue!`,
                color: '#00FF87',
                client: client
            });
            message.reply({ embeds: [successEmbed] });
        } catch (e) {
            console.error('Error adding music:', e);
            const errorEmbed = createGlassEmbed({
                title: '⚠️ Playback Error',
                description: `\`\`\`diff\n- An error occurred while trying to add the song: ${e.message}\n\`\`\``,
                color: '#FF6B6B',
                client: client
            });
            message.reply({ embeds: [errorEmbed] });
        }
    }
};
