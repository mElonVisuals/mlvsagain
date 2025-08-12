const { createEmbed } = require('../../utils/embedBuilder');
const { PermissionFlagsBits } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'kick',
    description: 'Kick a user from the server',
    category: 'admin',
    usage: '!kick @user [reason]',
    execute: async (message, args, client) => {
        // Check permissions
        if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return message.reply({
                embeds: [createEmbed({
                    title: '❌ Permission Denied',
                    description: 'You need the **Kick Members** permission to use this command.',
                    color: config.colors.error,
                    client: client
                })]
            });
        }

        // Check if bot has permissions
        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
            return message.reply({
                embeds: [createEmbed({
                    title: '❌ Bot Missing Permissions',
                    description: 'I need the **Kick Members** permission to execute this command.',
                    color: config.colors.error,
                    client: client
                })]
            });
        }

        const target = message.mentions.members.first();
        if (!target) {
            return message.reply({
                embeds: [createEmbed({
                    title: '⚠️ No User Mentioned',
                    description: `Please mention a user to kick.\n**Usage:** \`${config.prefix}kick @user [reason]\``,
                    color: config.colors.warning,
                    client: client
                })]
            });
        }

        // Check if target is kickable
        if (!target.kickable) {
            return message.reply({
                embeds: [createEmbed({
                    title: '❌ Cannot Kick User',
                    description: 'I cannot kick this user. They may have higher permissions than me.',
                    color: config.colors.error,
                    client: client
                })]
            });
        }

        // Check role hierarchy
        if (target.roles.highest.position >= message.member.roles.highest.position) {
            return message.reply({
                embeds: [createEmbed({
                    title: '❌ Insufficient Role Position',
                    description: 'You cannot kick someone with equal or higher roles than you.',
                    color: config.colors.error,
                    client: client
                })]
            });
        }

        const reason = args.slice(1).join(' ') || 'No reason provided';

        try {
            // Try to DM the user before kicking
            try {
                await target.send({
                    embeds: [createEmbed({
                        title: '👢 You have been kicked',
                        description: `**Server:** ${message.guild.name}\n**Reason:** ${reason}\n**Moderator:** ${message.author.tag}`,
                        color: config.colors.warning,
                        client: client
                    })]
                });
            } catch (dmError) {
                // User has DMs disabled, continue with kick
            }

            await target.kick(reason);

            const embed = createEmbed({
                title: '👢 User Kicked',
                description: `**User:** ${target.user.tag} (${target.id})\n**Reason:** ${reason}\n**Moderator:** ${message.author.tag}`,
                color: config.colors.warning,
                thumbnail: target.user.displayAvatarURL({ dynamic: true }),
                client: client
            });

            await message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Kick command error:', error);
            message.reply({
                embeds: [createEmbed({
                    title: '❌ Kick Failed',
                    description: 'An error occurred while trying to kick the user.',
                    color: config.colors.error,
                    client: client
                })]
            });
        }
    }
};