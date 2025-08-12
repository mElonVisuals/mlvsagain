const { ActivityType } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`🚀 ${client.user.tag} is now online!`);
        console.log(`📊 Serving ${client.guilds.cache.size} servers`);
        
        // Use the setPresence method to correctly set bot activity.
        client.user.setPresence({
            activities: [{
                name: `${config.prefix}help | MLVS.me`,
                type: ActivityType.Watching
            }],
            status: 'online'
        });
    },
};
