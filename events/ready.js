const { ActivityType } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`🚀 ${client.user.tag} is now online!`);
        console.log(`📊 Serving ${client.guilds.cache.size} servers`);
        
        // Define an array of activity statuses for the bot to cycle through.
        // This makes the bot's presence more dynamic and engaging.
        const activities = [
            { name: `${config.prefix}help | MLVS.me`, type: ActivityType.Watching },
            { name: 'your music requests', type: ActivityType.Listening },
            { name: `${client.guilds.cache.size} servers`, type: ActivityType.Watching },
            { name: 'the queue', type: ActivityType.Watching }
        ];
        let currentActivityIndex = 0;

        // Function to set the bot's presence
        const setBotPresence = () => {
            const activity = activities[currentActivityIndex];
            client.user.setPresence({
                activities: [activity],
                status: 'online'
            });
            // Move to the next activity in the array, or loop back to the start.
            currentActivityIndex = (currentActivityIndex + 1) % activities.length;
        };

        // Set the initial presence when the bot first starts.
        setBotPresence();

        // Change the bot's presence every 15 seconds.
        // You can adjust the interval (in milliseconds) as needed.
        setInterval(setBotPresence, 15000);
    },
};
