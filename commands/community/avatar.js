const { ActionRowBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embedBuilder');
const { createButton } = require('../../utils/buttonBuilder');
const config = require('../../config.json');

module.exports = {
    name: 'avatar',
    description: 'Display user avatar in high quality',
    category: 'community',
    execute: async (message, args, client) => {
        const user = message.mentions.users.first() || message.author;
        
        const embed = createEmbed({
            title: `🖼️ ${user.tag}'s Avatar`,
            image: user.displayAvatarURL({ dynamic: true, size: 1024 }),
            color: config.colors.primary,
            client: client
        });

        const row = new ActionRowBuilder().addComponents(
            createButton('avatar_png', 'PNG', 'Secondary'),
            createButton('avatar_jpg', 'JPG', 'Secondary'),
            createButton('avatar_webp', 'WEBP', 'Secondary'),
            createButton('avatar_gif', 'GIF', 'Secondary')
        );

        await message.reply({ embeds: [embed], components: [row] });
    }
};