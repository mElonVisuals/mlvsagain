const { createEmbed } = require('../../utils/embedBuilder');
const { PermissionFlagsBits } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'ban',
    description: 'Ban a user from the server',
    category: 'admin',
    usage: '!ban @user [reason]',
    execute: async (message, args, client) => {
        // Check permissions
        if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply({
                embeds: [createEmbed({
                    title: '❌ Permission Denied',
                    description: 'You need the **Ban Members** permission to use this command.',
                    color: config.colors.error,
                    client: client
                })]
            });
        }

        // Check if bot has permissions
        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply({
                embeds: [createEmbed({
                    title: '❌ Bot Missing Permissions',
                    description: 'I need the **Ban Members** permission to execute this command.',
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
                    description: `Please mention a user to ban.\n**Usage:** \`${config.prefix}ban @user [reason]\``,
                    color: config.colors.warning,
                    client: client
                })]
            });
        }

        // Check if target is bannable
        if (!target.bannable) {
            return message.reply({
                embeds: [createEmbed({
                    title: '❌ Cannot Ban User',
                    description: 'I cannot ban this user. They may have higher permissions than me.',
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
                    description: 'You cannot ban someone with equal or higher roles than you.',
                    color: config.colors.error,
                    client: client
                })]
            });
        }

        const reason = args.slice(1).join(' ') || 'No reason provided';

        try {
            // Try to DM the user before banning
            try {
                await target.send({
                    embeds: [createEmbed({
                        title: '🔨 You have been banned',
                        description: `**Server:** ${message.guild.name}\n**Reason:** ${reason}\n**Moderator:** ${message.author.tag}`,
                        color: config.colors.error,
                        client: client
                    })]
                });
            } catch (dmError) {
                // User has DMs disabled, continue with ban
            }

            await target.ban({ 
                reason: reason,
                deleteMessageDays: 1 // Delete messages from the last day
            });

            const embed = createEmbed({
                title: '🔨 User Banned',
                description: `**User:** ${target.user.tag} (${target.id})\n**Reason:** ${reason}\n**Moderator:** ${message.author.tag}`,
                color: config.colors.error,
                thumbnail: target.user.displayAvatarURL({ dynamic: true }),
                client: client
            });

            await message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Ban command error:', error);
            message.reply({
                embeds: [createEmbed({
                    title: '❌ Ban Failed',
                    description: 'An error occurred while trying to ban the user.',
                    color: config.colors.error,
                    client: client
                })]
            });
        }
    }
};