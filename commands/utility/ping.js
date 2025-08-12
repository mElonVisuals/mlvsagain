const { createEmbed } = require('../../utils/embedBuilder');
const config = require('../../config.json');

module.exports = {
    name: 'ping',
    description: 'Check bot latency with animated response',
    category: 'utility',
    execute: async (message, args, client) => {
        const start = Date.now();
        const msg = await message.reply({
            embeds: [createEmbed({
                title: '🏓 Pinging...',
                description: '```\n⚡ Calculating latency...\n```',
                color: config.colors.warning,
                client: client
            })]
        });

        const latency = Date.now() - start;
        const apiLatency = Math.round(client.ws.ping);

        const getLatencyStatus = (ping) => {
            if (ping < 100) return { status: 'Excellent', emoji: '🟢', color: config.colors.success };
            if (ping < 200) return { status: 'Good', emoji: '🟡', color: config.colors.warning };
            return { status: 'Poor', emoji: '🔴', color: config.colors.error };
        };

        const botStatus = getLatencyStatus(latency);
        const apiStatus = getLatencyStatus(apiLatency);

        const embed = createEmbed({
            title: '🏓 Pong! Latency Results',
            color: botStatus.color,
            fields: [
                {
                    name: '🤖 Bot Latency',
                    value: `\`${latency}ms\` ${botStatus.emoji} *${botStatus.status}*`,
                    inline: true
                },
                {
                    name: '🌐 API Latency',
                    value: `\`${apiLatency}ms\` ${apiStatus.emoji} *${apiStatus.status}*`,
                    inline: true
                },
                {
                    name: '📊 Performance',
                    value: '```yaml\nStatus: Online\nUptime: ' + Math.floor(client.uptime / 1000) + 's\n```',
                    inline: false
                }
            ],
            client: client
        });

        await msg.edit({ embeds: [embed] });
    }
};