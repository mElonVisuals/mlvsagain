// C:\Users\hopsi\Desktop\mlvsagain\commands\music\play.js

// Import necessary classes from discord.js and the voice package
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
// We are no longer using the createButton utility function to avoid potential emoji issues.
// Instead, we will build all buttons directly using ButtonBuilder for consistency and reliability.
const { createGlassEmbed } = require('../../utils/glassEmbedBuilder');
const config = require('../../config.json');

// This is the core function to connect to a voice channel
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');
// You will need a library to handle music playback, like discord-player or distube.
// This example assumes you will integrate one of them.

module.exports = {
    name: 'play',
    description: 'Play music from YouTube, Spotify, or SoundCloud with advanced controls',
    category: 'music',
    usage: '!play <song name/URL>',
    cooldown: 3,
    
    // The main execution function for the command
    execute: async (message, args, client) => {
        // --- STEP 1: INITIAL CHECKS ---
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            const errorEmbed = createGlassEmbed({
                title: '🔊 Voice Channel Required',
                description: '```diff\n- You need to be in a voice channel to play music!\n```',
                color: '#FF6B6B',
                client: client,
                footerText: 'Music System Error'
            });
            return message.reply({ embeds: [errorEmbed] });
        }

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has(['Connect', 'Speak'])) {
            const permissionEmbed = createGlassEmbed({
                title: '❌ Insufficient Permissions',
                description: '```diff\n- I need Connect and Speak permissions in that voice channel!\n```',
                color: '#FF6B6B',
                client: client
            });
            return message.reply({ embeds: [permissionEmbed] });
        }

        if (!args.length) {
            const usageEmbed = createGlassEmbed({
                title: '🎵 Music Player Usage',
                description: '**How to use the music system:**\n\n' +
                                        '```yaml\nBasic Commands:\n' +
                                        '!play <song name>      # Search and play\n' +
                                        '!play <YouTube URL>    # Play from URL\n' +
                                        '!queue                 # View current queue\n' +
                                        '!skip                  # Skip current song\n' +
                                        '!stop                  # Stop and disconnect\n' +
                                        '!volume <1-100>        # Adjust volume\n```',
                color: '#7289DA',
                thumbnail: 'https://cdn.discordapp.com/attachments/123/456/music_icon.gif',
                client: client,
                footerText: 'Advanced Music System'
            });

            const controlRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('music_queue')
                    .setLabel('View Queue')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('📋'),
                new ButtonBuilder()
                    .setCustomId('music_help')
                    .setLabel('More Help')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('❓'),
                new ButtonBuilder()
                    .setLabel('Music Guide')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://mlvs.me/music')
                    .setEmoji('🎶')
            );

            return message.reply({ embeds: [usageEmbed], components: [controlRow] });
        }

        // --- STEP 2: USE DISTUBE TO PLAY MUSIC ---
        const query = args.join(' ');
        
        // Before running this command, you must initialize DisTube in your main bot file (e.g., index.js).
        // It should be attached to the client object like: `client.distube = new DisTube(client, { ... });`
        // We will assume `client.distube` is a valid DisTube instance here.
        if (!client.distube) {
            return message.reply({ content: 'DisTube has not been initialized. Please check your bot\'s main file.' });
        }
        
        const loadingEmbed = createGlassEmbed({
            title: '🔍 Searching Music...',
            description: `\`\`\`yaml\nQuery: ${query}\nSearching: YouTube, Spotify, SoundCloud\nStatus: Loading...\n\`\`\``,
            color: '#FFA500',
            client: client
        });
        const loadingMsg = await message.reply({ embeds: [loadingEmbed] });
        
        try {
            // Use the distube.play() method to start playback.
            // It automatically handles joining the channel, searching for the song, and playing it.
            // The `textChannel` and `member` options are crucial for DisTube to know where to send messages and who requested the song.
            await client.distube.play(voiceChannel, query, {
                textChannel: message.channel,
                member: message.member,
            });

            // We will now handle the "now playing" message and buttons via a DisTube event listener
            // in the main bot file. This command will just handle the initial request.
            await loadingMsg.delete();
        } catch (error) {
            console.error('Error playing music with DisTube:', error);
            const errorEmbed = createGlassEmbed({
                title: '⚠️ Music Playback Error',
                description: '```diff\n- There was an error while trying to play the music.\n```',
                color: '#FF6B6B',
                client: client,
                footerText: 'DisTube Error'
            });
            await loadingMsg.edit({ embeds: [errorEmbed] }).catch(err => {
                // If editing fails, send a new message
                message.channel.send({ embeds: [errorEmbed] });
            });
        }
    }
};
