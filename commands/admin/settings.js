const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
const { createButton } = require('../../utils/buttonBuilder');
const config = require('../../config.json');
const fs = require('fs').promises;
const path = require('path');

// Enhanced Glassmorphism Embed Builder
function createGlassEmbed(options) {
    const embed = new EmbedBuilder()
        .setColor(options.color || '#2F3136')
        .setTimestamp()
        .setFooter({ 
            text: `MLVS.me Settings • ${options.footerText || 'Server Configuration'}`,
            iconURL: options.client?.user?.displayAvatarURL({ dynamic: true })
        });

    if (options.title) embed.setTitle(options.title);
    if (options.description) embed.setDescription(options.description);
    if (options.thumbnail) embed.setThumbnail(options.thumbnail);
    if (options.image) embed.setImage(options.image);
    if (options.author) embed.setAuthor(options.author);

    return embed;
}

// Server settings file path
const getSettingsPath = (guildId) => path.join(__dirname, '../../data/settings', `${guildId}.json`);

// Default server settings
const defaultSettings = {
    prefix: '!',
    welcomeChannel: null,
    welcomeMessage: 'Welcome to {server}, {user}! 🎉',
    leaveMessage: 'Goodbye {user}! 👋',
    autoRole: null,
    modLogChannel: null,
    musicVolume: 50,
    musicChannel: null,
    antiSpam: false,
    slowMode: 0,
    levelSystem: true,
    economySystem: false,
    customCommands: {},
    autoMod: {
        enabled: false,
        deleteLinks: false,
        deleteCaps: false,
        deleteSpam: false
    },
    permissions: {
        djRole: null,
        modRole: null,
        adminRole: null
    }
};

// Load server settings
async function loadSettings(guildId) {
    try {
        const settingsPath = getSettingsPath(guildId);
        const data = await fs.readFile(settingsPath, 'utf8');
        return { ...defaultSettings, ...JSON.parse(data) };
    } catch (error) {
        return defaultSettings;
    }
}

// Save server settings
async function saveSettings(guildId, settings) {
    try {
        const settingsPath = getSettingsPath(guildId);
        const dir = path.dirname(settingsPath);
        
        // Ensure directory exists
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        return false;
    }
}

module.exports = {
    name: 'settings',
    description: 'Configure custom server settings with an advanced control panel',
    category: 'admin',
    usage: '!settings [category]',
    permissions: ['ManageGuild'],
    execute: async (message, args, client) => {
        // Check permissions
        if (!message.member.permissions.has('ManageGuild')) {
            const noPermEmbed = createGlassEmbed({
                title: '🔒 Access Denied',
                description: '```diff\n- You need "Manage Guild" permission to use this command!\n```',
                color: '#FF6B6B',
                client: client,
                footerText: 'Permission Error'
            });
            return message.reply({ embeds: [noPermEmbed] });
        }

        const guildSettings = await loadSettings(message.guild.id);
        const category = args[0]?.toLowerCase();

        if (!category) {
            // Main settings overview
            const settingsEmbed = createGlassEmbed({
                title: '⚙️ Server Settings Dashboard',
                description: `**${message.guild.name} Configuration Panel**\n` +
                            '```yaml\nSelect a category below to configure:\n```',
                color: '#7289DA',
                thumbnail: message.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL({ dynamic: true }),
                client: client,
                footerText: `Settings for ${message.guild.name}`
            });

            // Current key settings preview
            settingsEmbed.addFields(
                {
                    name: '🎯 Current Settings',
                    value: `**Prefix:** \`${guildSettings.prefix}\`\n` +
                           `**Welcome Channel:** ${guildSettings.welcomeChannel ? `<#${guildSettings.welcomeChannel}>` : '`Not Set`'}\n` +
                           `**Music Volume:** \`${guildSettings.musicVolume}%\`\n` +
                           `**Level System:** ${guildSettings.levelSystem ? '✅ Enabled' : '❌ Disabled'}`,
                    inline: true
                },
                {
                    name: '🛡️ Moderation',
                    value: `**Auto Mod:** ${guildSettings.autoMod.enabled ? '✅ Active' : '❌ Inactive'}\n` +
                           `**Mod Log:** ${guildSettings.modLogChannel ? `<#${guildSettings.modLogChannel}>` : '`Not Set`'}\n` +
                           `**Anti-Spam:** ${guildSettings.antiSpam ? '✅ On' : '❌ Off'}\n` +
                           `**Slow Mode:** \`${guildSettings.slowMode}s\``,
                    inline: true
                },
                {
                    name: '🎵 Music & Fun',
                    value: `**Music Channel:** ${guildSettings.musicChannel ? `<#${guildSettings.musicChannel}>` : '`Any Channel`'}\n` +
                           `**DJ Role:** ${guildSettings.permissions.djRole ? `<@&${guildSettings.permissions.djRole}>` : '`Not Set`'}\n` +
                           `**Economy:** ${guildSettings.economySystem ? '✅ Active' : '❌ Inactive'}\n` +
                           `**Custom Commands:** \`${Object.keys(guildSettings.customCommands).length}\``,
                    inline: true
                }
            );

            // Category selection menu
            const categorySelect = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('settings_category')
                    .setPlaceholder('🎛️ Choose a settings category...')
                    .addOptions([
                        {
                            label: 'General Settings',
                            description: 'Prefix, welcome messages, basic config',
                            value: 'general',
                            emoji: '⚙️'
                        },
                        {
                            label: 'Moderation',
                            description: 'Auto-mod, logging, anti-spam settings',
                            value: 'moderation', 
                            emoji: '🛡️'
                        },
                        {
                            label: 'Music System',
                            description: 'Music channels, volume, DJ permissions',
                            value: 'music',
                            emoji: '🎵'
                        },
                        {
                            label: 'Economy & Levels',
                            description: 'XP system, currency, rewards',
                            value: 'economy',
                            emoji: '💰'
                        },
                        {
                            label: 'Custom Commands',
                            description: 'Create and manage custom commands',
                            value: 'custom',
                            emoji: '🎯'
                        }
                    ])
            );

            const actionButtons = new ActionRowBuilder().addComponents(
                createButton('settings_reset', 'Reset All', 'Danger', '🔄'),
                createButton('settings_export', 'Export Config', 'Secondary', '📤'),
                createButton('settings_import', 'Import Config', 'Secondary', '📥'),
                createButton('https://mlvs.me/settings-guide', 'Settings Guide', 'Link', '📚')
            );

            return message.reply({ 
                embeds: [settingsEmbed], 
                components: [categorySelect, actionButtons] 
            });
        }

        // Handle specific category settings
        switch (category) {
            case 'general':
            case 'g':
                const generalEmbed = createGlassEmbed({
                    title: '⚙️ General Server Settings',
                    description: '**Configure basic server functionality**\n```yaml\nAdjust core bot behavior and welcome system\n```',
                    color: '#00D4AA',
                    client: client
                });

                generalEmbed.addFields(
                    {
                        name: '🎯 Bot Configuration', 
                        value: `**Current Prefix:** \`${guildSettings.prefix}\`\n` +
                               `**Auto Role:** ${guildSettings.autoRole ? `<@&${guildSettings.autoRole}>` : '`None`'}\n` +
                               `**Slow Mode:** \`${guildSettings.slowMode} seconds\``,
                        inline: true
                    },
                    {
                        name: '👋 Welcome System',
                        value: `**Welcome Channel:** ${guildSettings.welcomeChannel ? `<#${guildSettings.welcomeChannel}>` : '`Disabled`'}\n` +
                               `**Welcome Message:** \`${guildSettings.welcomeMessage.substring(0, 50)}...\`\n` +
                               `**Leave Message:** \`${guildSettings.leaveMessage.substring(0, 50)}...\``,
                        inline: true
                    }
                );

                const generalButtons = new ActionRowBuilder().addComponents(
                    createButton('set_prefix', 'Change Prefix', 'Primary', '🏷️'),
                    createButton('set_welcome', 'Welcome Setup', 'Secondary', '👋'),
                    createButton('set_autorole', 'Auto Role', 'Secondary', '🎭'),
                    createButton('settings_back', 'Back to Menu', 'Secondary', '↩️')
                );

                return message.reply({ embeds: [generalEmbed], components: [generalButtons] });

            case 'music':
            case 'm':
                const musicEmbed = createGlassEmbed({
                    title: '🎵 Music System Settings',
                    description: '**Configure music bot behavior**\n```yaml\nControl music permissions and defaults\n```',
                    color: '#FF6B9D',
                    client: client
                });

                musicEmbed.addFields(
                    {
                        name: '🎛️ Music Controls',
                        value: `**Default Volume:** \`${guildSettings.musicVolume}%\`\n` +
                               `**Music Channel:** ${guildSettings.musicChannel ? `<#${guildSettings.musicChannel}>` : '`Any Channel`'}\n` +
                               `**DJ Role:** ${guildSettings.permissions.djRole ? `<@&${guildSettings.permissions.djRole}>` : '`Not Required`'}`,
                        inline: false
                    }
                );

                const musicButtons = new ActionRowBuilder().addComponents(
                    createButton('set_music_volume', 'Set Volume', 'Primary', '🔊'),
                    createButton('set_music_channel', 'Music Channel', 'Secondary', '🎵'),
                    createButton('set_dj_role', 'DJ Role', 'Secondary', '🎧'),
                    createButton('settings_back', 'Back to Menu', 'Secondary', '↩️')
                );

                return message.reply({ embeds: [musicEmbed], components: [musicButtons] });

            default:
                const unknownEmbed = createGlassEmbed({
                    title: '❓ Unknown Category',
                    description: '```diff\n- Invalid settings category!\n+ Use: general, moderation, music, economy, or custom\n```',
                    color: '#FFA500',
                    client: client
                });
                return message.reply({ embeds: [unknownEmbed] });
        }
    }
};