const { createEmbed } = require('../../utils/embedBuilder');
const config = require('../../config.json');

module.exports = {
    name: 'serverinfo',
    description: 'Display comprehensive server information',
    category: 'community',
    execute: async (message, args, client) => {
        const guild = message.guild;
        const owner = await guild.fetchOwner();

        const verificationLevels = {
            0: 'None',
            1: 'Low',
            2: 'Medium',
            3: 'High',
            4: 'Very High'
        };

        const embed = createEmbed({
            title: `🏰 ${guild.name}`,
            thumbnail: guild.iconURL({ dynamic: true, size: 512 }),
            image: guild.bannerURL({ size: 1024 }),
            color: config.colors.accent,
            fields: [
                {
                    name: '📊 Statistics',
                    value: `**Members:** ${guild.memberCount}\n**Channels:** ${guild.channels.cache.size}\n**Roles:** ${guild.roles.cache.size}\n**Emojis:** ${guild.emojis.cache.size}`,
                    inline: true
                },
                {
                    name: '👑 Server Details',
                    value: `**Owner:** ${owner.user.tag}\n**Created:** <t:${Math.floor(guild.createdTimestamp / 1000)}:R>\n**ID:** \`${guild.id}\``,
                    inline: true
                },
                {
                    name: '🔒 Security',
                    value: `**Verification:** ${verificationLevels[guild.verificationLevel]}\n**Boost Level:** ${guild.premiumTier}\n**Boosts:** ${guild.premiumSubscriptionCount}`,
                    inline: true
                },
                {
                    name: '📝 Description',
                    value: guild.description || 'No description set',
                    inline: false
                }
            ],
            client: client
        });

        if (guild.features.length > 0) {
            const features = guild.features.map(feature => 
                feature.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
            ).join(', ');
            embed.addFields({ name: '✨ Features', value: features, inline: false });
        }

        await message.reply({ embeds: [embed] });
    }
};