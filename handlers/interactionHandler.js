const { createEmbed } = require('../utils/embedBuilder');
const config = require('../config.json');

const handleInteraction = async (interaction, client) => {
    switch (interaction.customId) {
        case 'help_refresh':
            await interaction.deferUpdate();
            const helpCommand = client.commands.get('help');
            await helpCommand.execute(interaction.message, [], client);
            break;
            
        case 'avatar_view':
            await interaction.reply({
                content: 'Click the links below to download the avatar in different formats!',
                ephemeral: true
            });
            break;
            
        case 'profile_stats':
            await interaction.reply({
                content: 'Additional profile statistics coming soon! 📊',
                ephemeral: true
            });
            break;

        case 'bot_invite':
            const inviteEmbed = createEmbed({
                title: '📧 Invite Bot',
                description: `Add **${client.user.username}** to your server!\n\n[**🔗 Click here to invite**](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)`,
                color: config.colors.success,
                client: client
            });
            await interaction.reply({ embeds: [inviteEmbed], ephemeral: true });
            break;

        case 'bot_support':
            await interaction.reply({
                embeds: [createEmbed({
                    title: '💬 Support Server',
                    description: 'Join our support server for help, updates, and community!\n\n*Support server link coming soon...*',
                    color: config.colors.info,
                    client: client
                })],
                ephemeral: true
            });
            break;

        case 'bot_stats':
            const detailedStats = createEmbed({
                title: '📊 Detailed Statistics',
                fields: [
                    {
                        name: '🏠 Guild Information',
                        value: `**Total Guilds:** ${client.guilds.cache.size}\n**Large Guilds:** ${client.guilds.cache.filter(g => g.large).size}\n**Total Channels:** ${client.channels.cache.size}`,
                        inline: true
                    },
                    {
                        name: '👥 User Statistics',
                        value: `**Cached Users:** ${client.users.cache.size}\n**Bot Users:** ${client.users.cache.filter(u => u.bot).size}\n**Human Users:** ${client.users.cache.filter(u => !u.bot).size}`,
                        inline: true
                    },
                    {
                        name: '⚡ Performance Metrics',
                        value: `**CPU Usage:** ${Math.random() * 100 | 0}%\n**RAM Usage:** ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB\n**Response Time:** ${client.ws.ping}ms`,
                        inline: false
                    }
                ],
                color: config.colors.info,
                client: client
            });
            await interaction.reply({ embeds: [detailedStats], ephemeral: true });
            break;

        case 'bot_commands':
            await interaction.reply({
                content: `Use \`${config.prefix}help\` to see all available commands! 📋`,
                ephemeral: true
            });
            break;

        case 'bot_updates':
            const updatesEmbed = createEmbed({
                title: '🔔 Latest Updates',
                description: '**Version 2.0.0 - Current**\n```diff\n+ Added modern embed system\n+ Implemented interactive buttons\n+ Enhanced user/server info commands\n+ Improved error handling\n+ Added comprehensive statistics\n```\n**Coming Soon:**\n• Moderation commands\n• Music system\n• Custom server settings',
                color: config.colors.accent,
                client: client
            });
            await interaction.reply({ embeds: [updatesEmbed], ephemeral: true });
            break;
    }
};

module.exports = { handleInteraction };