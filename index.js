const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');
// Assuming you have this utility function in ./utils/glassEmbedBuilder.js
const { createGlassEmbed } = require('./utils/glassEmbedBuilder');
const { handleInteraction } = require('./handlers/interactionHandler');
require('dotenv').config();

// --- Music Library Imports ---
// We need to import the core DisTube class and the plugins you'll use.
const { DisTube } = require('distube');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { SpotifyPlugin } = require('@distube/spotify');
const { YtDlpPlugin } = require('@distube/yt-dlp');

// We are no longer using ffmpeg-static or yt-dlp-exec.
// The Dockerfile now installs these directly on the system path.
// const ffmpegPath = require('ffmpeg-static');
// const ytdl_bin = require('yt-dlp-exec').executablePath;

// Initialize Discord Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// --- Music Library Initialization (DisTube) ---
// This is the crucial part. It creates the DisTube client and attaches it
// to your main bot client, so it can be accessed from any command file.
client.distube = new DisTube(client, {
    // We now use the simple string 'ffmpeg' to tell DisTube to find the executable
    // in the container's system PATH, where our Dockerfile installs it.
    ffmpeg: 'ffmpeg',
    
    emitNewSongOnly: false,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    // Add plugins for other music sources like Spotify and SoundCloud.
    plugins: [
        new SoundCloudPlugin(),
        new SpotifyPlugin(),
        // We no longer need to specify an executable path for YtDlpPlugin.
        // It will now find the system-installed yt-dlp.
        new YtDlpPlugin(),
    ],
});

// --- DisTube Event Listeners ---
// These listeners provide real-time feedback for music playback.
// They use your existing 'createGlassEmbed' utility for a consistent look.
client.distube
    .on('playSong', (queue, song) => {
        const nowPlayingEmbed = createGlassEmbed({
            title: '🎵 Now Playing',
            description: `**[${song.name}](${song.url})**`,
            color: '#00FF87',
            thumbnail: song.thumbnail,
            client: client,
            footerText: `Playing in ${queue.voiceChannel.name}`
        });

        nowPlayingEmbed.addFields(
            { name: 'Requested by', value: `${song.user}`, inline: true },
            { name: 'Duration', value: song.formattedDuration, inline: true }
        );

        queue.textChannel.send({ embeds: [nowPlayingEmbed] });
    })
    .on('addSong', (queue, song) => {
        const addSongEmbed = createGlassEmbed({
            title: '🎶 Added to Queue',
            description: `**[${song.name}](${song.url})** has been added to the queue!`,
            color: '#7289DA',
            client: client,
            footerText: `Current queue size: ${queue.songs.length}`
        });
        queue.textChannel.send({ embeds: [addSongEmbed] });
    })
    .on('error', (channel, e) => {
        // This listener is useful for debugging and catching unexpected errors.
        if (channel) {
            const errorEmbed = createGlassEmbed({
                title: '⚠️ Music Playback Error',
                description: `\`\`\`diff\n- An error occurred: ${e.toString().slice(0, 500)}\n\`\`\``,
                color: '#FF6B6B',
                client: client,
                footerText: 'DisTube Error'
            });
            channel.send({ embeds: [errorEmbed] });
        } else {
            console.error('DisTube Error:', e);
        }
    })
    // Add a new debug listener to help pinpoint the issue.
    // It will log detailed information about what DisTube is doing behind the scenes.
    .on('debug', (text) => {
        console.log(`[DEBUG] ${text}`);
    });

// --- Welcome and Goodbye Messages ---
// Listen for a new member joining the server.
client.on('guildMemberAdd', member => {
    // This finds a channel named 'welcome' or 'general' to send the message to.
    // You can change 'welcome' to the name of your desired channel.
    const channel = member.guild.channels.cache.find(ch => ch.name === '・﹕welcome');
    if (!channel) return;

    // A more personalized welcome embed
    const welcomeEmbed = createGlassEmbed({
        title: `👋 Welcome to the server, ${member.user.username}!`,
        description: `We're happy to have you here! Feel free to say hello in the chat and check out the rules.`,
        color: '#00BFFF',
        client: client,
        thumbnail: member.user.displayAvatarURL({ dynamic: true }),
        footerText: `Member #${member.guild.memberCount}`
    });

    channel.send({ embeds: [welcomeEmbed] });
});

// Listen for a member leaving the server.
client.on('guildMemberRemove', member => {
    // This finds a channel named 'welcome' or 'general' to send the message to.
    // You can change 'general' to the name of your desired channel.
    const channel = member.guild.channels.cache.find(ch => ch.name === '・﹕goodbye');
    if (!channel) return;

    // A more heartfelt goodbye embed
    const goodbyeEmbed = createGlassEmbed({
        title: `🚪 Goodbye, ${member.user.username}`,
        description: `We're sad to see you go! We hope to see you again soon.`,
        color: '#FF4500',
        client: client,
        thumbnail: member.user.displayAvatarURL({ dynamic: true }),
        footerText: `Total members: ${member.guild.memberCount}`
    });

    channel.send({ embeds: [goodbyeEmbed] });
});


// Command Collection
client.commands = new Collection();

// Load Commands
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

// Load Events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        // We added the status presence code here, inside the 'ready' event.
        // It runs once when the bot successfully logs in.
        client.once(event.name, (...args) => {
            if (event.name === 'ready') {
                console.log(`Bot is ready and logged in as ${client.user.tag}!`);
                client.user.setPresence({
                    activities: [{
                        name: 'music commands',
                        type: ActivityType.Listening
                    }],
                    status: 'online'
                });
            }
            event.execute(...args, client);
        });
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Global Error Handling
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Login Bot
client.login(process.env.DISCORD_TOKEN);

module.exports = client;
