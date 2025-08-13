// C:\Users\hopsi\Desktop\mlvsagain\commands\music\play.js

// Import necessary classes from discord.js and the voice package
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { createGlassEmbed } = require('../../utils/glassEmbedBuilder');
const config = require('../../config.json');

// This is the core function to connect to a voice channel
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');
// We will also import the DisTubeError class to check for specific errors.
const { DisTubeError } = require('distube');

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
            await client.distube.play(voiceChannel, query, {
                textChannel: message.channel,
                member: message.member,
            });

            // If the play command is successful, the loading message will be deleted by the DisTube 'playSong' event.
            // We'll add a check here just in case.
            if (loadingMsg) {
                await loadingMsg.delete().catch(err => console.error('Failed to delete loading message:', err));
            }
        } catch (error) {
            console.error('Error playing music with DisTube:', error);

            let errorEmbed;
            // Now, we specifically check for the NOT_SUPPORTED_URL error.
            if (error instanceof DisTubeError && error.errorCode === 'NOT_SUPPORTED_URL') {
                errorEmbed = createGlassEmbed({
                    title: '⚠️ Music Playback Error',
                    description: '```diff\n- The provided URL or search query is not supported.\nPlease try a different link or search term.\n```',
                    color: '#FF6B6B',
                    client: client,
                    footerText: 'DisTube Error'
                });
            } else {
                // This handles all other potential errors.
                errorEmbed = createGlassEmbed({
                    title: '⚠️ Music Playback Error',
                    description: '```diff\n- An unexpected error occurred while trying to play the music.\n```',
                    color: '#FF6B6B',
                    client: client,
                    footerText: `DisTube Error: ${error.message}`
                });
            }

            // Edit the loading message with the error embed
            if (loadingMsg) {
                await loadingMsg.edit({ embeds: [errorEmbed] }).catch(err => {
                    console.error('Failed to edit loading message with error:', err);
                    // As a fallback, send the error embed as a new message if editing fails
                    message.channel.send({ embeds: [errorEmbed] });
                });
            } else {
                // If the loading message was never sent, just send a new message with the error
                message.channel.send({ embeds: [errorEmbed] });
            }
        }
    }
};
