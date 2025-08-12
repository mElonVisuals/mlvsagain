const config = require('../config.json');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`🚀 ${client.user.tag} is now online!`);
        console.log(`📊 Serving ${client.guilds.cache.size} servers and ${client.users.cache.size} users`);
        
        // Set bot activity
        client.user.setActivity(`${config.prefix}help | MLVS.me`, { type: 'WATCHING' });
    },
};