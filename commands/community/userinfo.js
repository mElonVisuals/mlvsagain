const { ActionRowBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embedBuilder');
const { createButton } = require('../../utils/buttonBuilder');
const config = require('../../config.json');

module.exports = {
    name: 'userinfo',
    description: 'Display detailed user information with premium styling',
    category: 'community',
    execute: async (message, args, client) => {
        const user = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(user.id);

        const badges = {
            'Staff': '👑',
            'Partner': '🤝',
            'Hypesquad': '⚡',
            'BugHunterLevel1': '🐛',
            'PremiumEarlySupporter': '💎',
            'VerifiedDeveloper': '⚙️'
        };

        const userBadges = user.flags?.toArray().map(flag => badges[flag]).filter(Boolean) || [];

        const embed = createEmbed({
            title: `👤 ${user.tag}`,
            thumbnail: user.displayAvatarURL({ dynamic: true, size: 512 }),
            color: member?.displayHexColor || config.colors.primary,
            fields: [
                {
                    name: '📋 Basic Info',
                    value: `**ID:** \`${user.id}\`\n**Created:** <t:${Math.floor(user.createdTimestamp / 1000)}:R>\n**Bot:** ${user.bot ? '✅' : '❌'}`,
                    inline: true
                },
                {
                    name: '🏠 Server Info',
                    value: member ? 
                        `**Joined:** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>\n**Roles:** ${member.roles.cache.size - 1}\n**Nickname:** ${member.nickname || 'None'}` :
                        `*User not in server*`,
                    inline: true
                },
                {
                    name: '🎖️ Badges',
                    value: userBadges.length > 0 ? userBadges.join(' ') : 'None',
                    inline: false
                }
            ],
            client: client
        });

        if (member && member.roles.cache.size > 1) {
            const roles = member.roles.cache
                .filter(role => role.id !== message.guild.id)
                .sort((a, b) => b.position - a.position)
                .first(5)
                .map(role => role.toString())
                .join(' ');
            
            embed.addFields({ name: '🏷️ Top Roles', value: roles, inline: false });
        }

        const row = new ActionRowBuilder().addComponents(
            createButton('avatar_view', 'View Avatar', 'Secondary', '🖼️'),
            createButton('profile_stats', 'More Stats', 'Primary', '📊')
        );

        await message.reply({ embeds: [embed], components: [row] });
    }
};