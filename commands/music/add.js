// C:\Users\hopsi\Desktop\mlvsagain\commands\music\add.js

const { createGlassEmbed } = require('../../utils/glassEmbedBuilder');

module.exports = {
    name: 'add',
    description: 'Adds a song to the end of the queue. If no music is playing, it will start a new queue.',
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

        // The distube.play() method automatically handles adding a song to a queue
        // or starting a new queue if none exists.
        // This removes the need for a separate !add and !play command in most cases,
        // making the bot more user-friendly.
        try {
            await client.distube.play(voiceChannel, query, {
                textChannel: message.channel,
                member: message.member
            });

            // The 'addSong' or 'playSong' event listeners in index.js will handle
            // sending the confirmation message to the user, so we don't need to
            // send a message here. This avoids duplicate messages.
            message.react('✅');
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
