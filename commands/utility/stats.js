const { createEmbed } = require('../../utils/embedBuilder');
const config = require('../../config.json');

module.exports = {
    name: 'stats',
    description: 'Display detailed bot statistics',
    category: 'utility',
    execute: async (message, args, client) => {
        const uptime = client.uptime;
        const days = Math.floor(uptime / 86400000);
        const hours = Math.floor(uptime / 3600000) % 24;
        const minutes = Math.floor(uptime / 60000) % 60;
        const seconds = Math.floor(uptime / 1000) % 60;

        const embed = createEmbed({
            title: '📊 Bot Statistics',
            thumbnail: client.user.displayAvatarURL({ dynamic: true }),
            color: config.colors.info,
            fields: [
                {
                    name: '⏱️ Uptime',
                    value: `${days}d ${hours}h ${minutes}m ${seconds}s`,
                    inline: true
                },
                {
                    name: '🏠 Servers',
                    value: client.guilds.cache.size.toString(),
                    inline: true
                },
                {
                    name: '👥 Users',
                    value: client.users.cache.size.toString(),
                    inline: true
                },
                {
                    name: '💾 Memory Usage',
                    value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
                    inline: true
                },
                {
                    name: '🖥️ Platform',
                    value: process.platform,
                    inline: true
                },
                {
                    name: '📦 Node.js',
                    value: process.version,
                    inline: true
                }
            ],
            client: client
        });

        await message.reply({ embeds: [embed] });
    }
};