const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

const createEmbed = (options = {}) => {
    const embed = new EmbedBuilder()
        .setColor(options.color || config.colors.primary)
        .setTimestamp()
        .setFooter({ 
            text: 'MLVS.me Bot • Powered by Discord.js', 
            iconURL: options.client?.user?.displayAvatarURL() 
        });

    if (options.title) embed.setTitle(options.title);
    if (options.description) embed.setDescription(options.description);
    if (options.thumbnail) embed.setThumbnail(options.thumbnail);
    if (options.image) embed.setImage(options.image);
    if (options.author) embed.setAuthor(options.author);
    if (options.fields) options.fields.forEach(field => embed.addFields(field));

    return embed;
};

module.exports = { createEmbed };