// --- File 1: index.js (Combined Discord Bot and Express Server) ---

// --- Core Discord.js and DisTube Imports ---
const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder } = require('discord.js');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const config = require('./config.json');
const fs = require('fs');
const path = require('path');

// --- Express and EJS Dashboard Imports ---
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.GuildMember]
});

// Create DisTube instance
client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    plugins: [new SpotifyPlugin(), new SoundCloudPlugin()]
});

// Load commands from the 'commands' folder
client.commands = new Collection();
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

// --- Shared Bot Data Object ---
// This object will be the bridge between the bot and the dashboard
let botData = {
    name: client.user?.username || 'DisTubeBot',
    avatarUrl: client.user?.displayAvatarURL() || 'https://placehold.co/128x128/000000/FFFFFF?text=BOT',
    guilds: client.guilds.cache.size,
    users: client.users.cache.size,
    uptime: '0s',
    currentSong: null,
    queue: []
};

// --- Dashboard Server Setup ---
// Set the view engine to EJS
app.set('view engine', 'ejs');
// Define the directory for EJS template files
app.set('views', path.join(__dirname, 'views'));
// Serve static files from the 'public' directory (for CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Update botData with live stats every 60 seconds
setInterval(() => {
    botData.guilds = client.guilds.cache.size;
    botData.users = client.users.cache.size;
    
    // Calculate uptime
    const uptimeInSeconds = Math.floor(process.uptime());
    const days = Math.floor(uptimeInSeconds / 86400);
    const hours = Math.floor((uptimeInSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
    const seconds = uptimeInSeconds % 60;
    botData.uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}, 60000);

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
        progress: 0 // We can't easily track live progress without a more complex solution
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
});

// --- Discord Bot Event Listeners ---
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`Dashboard server listening on http://localhost:${PORT}`);

    // Update initial botData after login
    botData.name = client.user.username;
    botData.avatarUrl = client.user.displayAvatarURL();
    botData.guilds = client.guilds.cache.size;
    botData.users = client.users.cache.size;
});

client.on('messageCreate', async message => {
    // Ignore messages from other bots and messages without the prefix
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) return;

    try {
        command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        const errorEmbed = new EmbedBuilder()
            .setColor('#FF6B6B')
            .setDescription('There was an error while executing that command!');
        message.reply({ embeds: [errorEmbed] });
    }
});

// --- Login to Discord and start the Express server ---
client.login(config.token);
app.listen(PORT);
