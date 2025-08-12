const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');
// Assuming you have this utility function in ./utils/glassEmbedBuilder.js
const { createGlassEmbed } = require('./utils/glassEmbedBuilder'); 
const { handleInteraction } = require('./handlers/interactionHandler');
require('dotenv').config();

// --- Music Library Imports ---
const { DisTube } = require('distube');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { SpotifyPlugin } = require('@distube/spotify');
const { YtDlpPlugin } = require('@distube/yt-dlp');

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
client.distube = new DisTube(client, {
    ffmpeg: 'ffmpeg',
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: true,
    emitAddListWhenCreatingQueue: true,
    plugins: [
        new SoundCloudPlugin(),
        new SpotifyPlugin(),
        new YtDlpPlugin(),
    ],
});

// --- DisTube Event Listeners ---
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
        // This is the fix for the `channel.send` error.
        // We now check if the channel exists AND is a valid text channel.
        if (channel && channel.isTextBased()) {
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
    .on('debug', (text) => {
        console.log(`[DEBUG] ${text}`);
    });

    client.distube
    .on('finish', queue => {
        queue.textChannel.send('Queue finished! The bot is leaving the voice channel.');
    });

// --- Welcome and Goodbye Messages ---
client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === '・﹕welcome');
    if (!channel) return;

    const welcomeEmbed = createGlassEmbed({
        title: `👋 Welcome to the server, ${member.user.username}!`,
        description: `We're happy to have you here! Feel free to say hello in the chat and check out the rules.`,
        theme: 'default',
        client: client,
        thumbnail: member.user.displayAvatarURL({ dynamic: true }),
        footerText: `Member #${member.guild.memberCount}`
    });

    channel.send({ embeds: [welcomeEmbed] });
});

client.on('guildMemberRemove', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === '・﹕goodbye');
    if (!channel) return;

    const goodbyeEmbed = createGlassEmbed({
        title: `🚪 Goodbye, ${member.user.username}`,
        description: `We're sad to see you go! We hope to see you again soon.`,
        theme: 'warning',
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
        client.once(event.name, (...args) => event.execute(...args, client));
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
