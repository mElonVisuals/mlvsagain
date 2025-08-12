const { ActionRowBuilder } = require('discord.js'); 
const { createGlassEmbed } = require('../../utils/glassEmbedBuilder');
const { createButton } = require('../../utils/buttonBuilder'); 
const config = require('../../config.json');

module.exports = {
    name: 'help',
    description: 'Display all available commands with sleek glassmorphism design',
    category: 'utility',
    execute: async (message, args, client) => {
        const commandCategories = {
            ':tools: **Utility**': [
                '`help` - Show this command list',
                '`ping` - Check bot latency',
                '`stats` - View bot statistics', 
                '`botinfo` - Bot information'
            ],
            ':busts_in_silhouette: **Community**': [
                '`userinfo` - User information',
                '`serverinfo` - Server statistics',
                '`avatar` - Get user avatar'
            ],
            ':video_game: **Fun**': [
                '`8ball` - Ask the magic 8-ball',
                '`roll` - Roll dice',
                '`flip` - Flip a coin'
            ],
            ':musical_note: **Music System**': [
                '`play <song>` - Play music from YouTube/Spotify',
                '`queue` - View current music queue',
                '`skip` - Skip current song',
                '`stop` - Stop music and disconnect',
                '`volume <1-100>` - Adjust music volume',
                '`nowplaying` - Show current track info'
            ],
            ':gear: **Admin & Settings**': [
                '`settings` - Server configuration dashboard',
                '`settings general` - Basic server settings',
                '`settings music` - Music system config',
                '`settings moderation` - Auto-mod settings',
                '`purge <amount>` - Delete messages',
                '`kick <user>` - Kick member',
                '`ban <user>` - Ban member'
            ]
        };

        const totalCommands = Object.values(commandCategories)
            .flat()
            .filter(cmd => cmd.includes('`'))
            .length;

        const embed = createGlassEmbed({
            title: ':books: MLVS.me Bot Commands',
            description: `**Server Prefix:** \`${config.prefix}\`\n` +
                        `**Total Commands:** \`${totalCommands}\`\n` +
                        `**Bot Version:** \`v2.1.0 - Glass Edition\`\n` +
                        '```yaml\nNew Features:\n' +
                        '• Advanced Music System with Queue\n' +
                        '• Custom Server Settings Dashboard\n' +
                        '• Glassmorphism Design Elements\n' +
                        '• Interactive Button Controls\n```',
            theme: 'default',
            thumbnail: client.user.displayAvatarURL({ dynamic: true, size: 256 }),
            client: client,
            footerText: `Requested by ${message.author.username} • MLVS.me Advanced Bot`
        });

        // Add command categories
        Object.entries(commandCategories).forEach(([category, cmds]) => {
            const commandList = cmds.join('\n');
            embed.addFields({ 
                name: category, 
                value: commandList, 
                inline: false 
            });
        });

// Enhanced interactive buttons
const mainControls = new ActionRowBuilder().addComponents(
    createButton('help_refresh', 'Refresh Commands', 'Primary', '🔄'),
    createButton('help_music', 'Music Help', 'Secondary', '🎵'),
    createButton('help_settings', 'Settings Help', 'Secondary', '⚙️'),
    createButton('help_support', 'Support Server', 'Secondary', '❓')
);

const linkButtons = new ActionRowBuilder().addComponents(
    createButton('https://mlvs.me', 'Visit MLVS.me', 'Link', '🌐'),
    createButton('https://mlvs.me/invite', 'Invite Bot', 'Link', '🤖'),
    createButton('https://mlvs.me/premium', 'Get Premium', 'Link', '✨'),
    createButton('https://mlvs.me/docs', 'Documentation', 'Link', '📚')
);

        await message.reply({ 
            embeds: [embed], 
            components: [mainControls, linkButtons] 
        });
    }
};