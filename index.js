// --- File 1: index.js (Combined Discord Bot, Express Server, and Events) ---

// This line is crucial for loading your bot token from the .env file.
require('dotenv').config();

// --- Core Discord.js and DisTube Imports ---
const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder, ActivityType } = require('discord.js');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const config = require('./config.json');
const fs = require('fs');
const path = require('path');

// --- Express and EJS Dashboard Imports ---
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel, Partials.Message, Partials.GuildMember]
});

// Create DisTube instance
client.distube = new DisTube(client, {
    ffmpeg: 'ffmpeg', // Use system-installed FFmpeg
    emitNewSongOnly: false,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [new SpotifyPlugin(), new SoundCloudPlugin(), new YtDlpPlugin()]
});

// --- Shared Bot Data Object ---
// This object will be the bridge between the bot and the dashboard
let botData = {
    name: 'DisTubeBot',
    avatarUrl: 'https://placehold.co/128x128/000000/FFFFFF?text=BOT',
    guilds: 0,
    users: 0,
    uptime: '0s',
    currentSong: null,
    queue: []
};

// --- Dashboard Server Setup ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Function to update the bot stats
function updateBotStats() {
    botData.guilds = client.guilds.cache.size;
    botData.users = client.users.cache.size;
    
    // Calculate uptime
    const uptimeInSeconds = Math.floor(process.uptime());
    const days = Math.floor(uptimeInSeconds / 86400);
    const hours = Math.floor((uptimeInSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
    const seconds = uptimeInSeconds % 60;
    botData.uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Update botData with live stats every 60 seconds
setInterval(updateBotStats, 60000);

// Route for the main dashboard page
app.get('/', (req, res) => {
    res.render('dashboard', { bot: botData });
});


// --- DisTube Event Listeners to Update Dashboard Data ---
client.distube.on('playSong', (queue, song) => {
    botData.currentSong = {
        title: song.name,
        url: song.url,
        thumbnail: song.thumbnail,
        artist: song.uploader.name,
        duration: song.formattedDuration,
        requester: song.user.username,
        progress: 0 
    };
    botData.queue = queue.songs.slice(1).map(s => ({
        title: s.name,
        duration: s.formattedDuration
    }));
}).on('addSong', (queue, song) => {
    botData.queue = queue.songs.slice(1).map(s => ({
        title: s.name,
        duration: s.formattedDuration
    }));
}).on('finish', queue => {
    botData.currentSong = null;
    botData.queue = [];
}).on('empty', queue => {
    botData.currentSong = null;
    botData.queue = [];
}).on('disconnect', queue => {
    botData.currentSong = null;
    botData.queue = [];
}).on('error', (channel, e) => {
    // This listener is useful for debugging and catching unexpected errors.
    if (channel) {
        const errorEmbed = new EmbedBuilder()
            .setColor('#FF6B6B')
            .setTitle('⚠️ Music Playback Error')
            .setDescription(`\`\`\`diff\n- An error occurred: ${e.toString().slice(0, 500)}\n\`\`\``);
        channel.send({ embeds: [errorEmbed] });
    } else {
        console.error('DisTube Error:', e);
    }
}).on('debug', (text) => {
    console.log(`[DEBUG] ${text}`);
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
        client.once(event.name, (...args) => {
            if (event.name === 'ready') {
                // Call the stats update function immediately when the bot is ready
                updateBotStats();
                // Start the Express server *after* the bot is ready.
                app.listen(PORT, '0.0.0.0', () => {
                    console.log(`Dashboard server listening on http://0.0.0.0:${PORT}`);
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

// --- Login to Discord ---
client.login(process.env.DISCORD_TOKEN);
