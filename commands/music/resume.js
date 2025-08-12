// C:\Users\hopsi\Desktop\mlvsagain\commands\music\resume.js

const { createGlassEmbed } = require('../../utils/glassEmbedBuilder');

module.exports = {
    name: 'resume',
    description: 'Resumes the currently paused song.',
    category: 'music',
    usage: '!resume',
    cooldown: 3,

    execute: async (message, args, client) => {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            const errorEmbed = createGlassEmbed({
                title: '🔊 Voice Channel Required',
                description: '```diff\n- You need to be in a voice channel to resume music!\n```',
                color: '#FF6B6B',
                client: client
            });
            return message.reply({ embeds: [errorEmbed] });
        }

        const queue = client.distube.getQueue(message);
        if (!queue) {
            const errorEmbed = createGlassEmbed({
                title: '❌ No Music Playing',
                description: '```diff\n- There is nothing to resume!\n```',
                color: '#FF6B6B',
                client: client
            });
            return message.reply({ embeds: [errorEmbed] });
        }
        
        // Check if the bot is already playing or paused
        if (!queue.paused) {
            const errorEmbed = createGlassEmbed({
                title: 'ℹ️ Already Playing',
                description: '```yaml\n- The music is not paused.\n```',
                color: '#7289DA',
                client: client
            });
            return message.reply({ embeds: [errorEmbed] });
        }

        try {
            await client.distube.resume(message);
            const successEmbed = createGlassEmbed({
                title: '▶️ Resumed',
                description: '```yaml\nThe music has been resumed.\n```',
                color: '#00FF87',
                client: client
            });
            message.reply({ embeds: [successEmbed] });
        } catch (e) {
            console.error('Error resuming music:', e);
            const errorEmbed = createGlassEmbed({
                title: '⚠️ Playback Error',
                description: `\`\`\`diff\n- An error occurred while trying to resume: ${e.message}\n\`\`\``,
                color: '#FF6B6B',
                client: client
            });
            message.reply({ embeds: [errorEmbed] });
        }
    }
};
