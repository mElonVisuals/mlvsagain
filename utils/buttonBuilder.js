const { ButtonBuilder, ButtonStyle } = require('discord.js');

const createButton = (customId, label, style = ButtonStyle.Primary, emoji = null) => {
    const button = new ButtonBuilder()
        .setLabel(label);
    
    // Handle different button styles
    if (style === ButtonStyle.Link || style === 'Link') {
        button.setStyle(ButtonStyle.Link);
        // For link buttons, customId is actually the URL
        button.setURL(customId);
    } else {
        button.setCustomId(customId);
        // Convert string style to ButtonStyle enum
        switch(style) {
            case 'Primary':
                button.setStyle(ButtonStyle.Primary);
                break;
            case 'Secondary':
                button.setStyle(ButtonStyle.Secondary);
                break;
            case 'Success':
                button.setStyle(ButtonStyle.Success);
                break;
            case 'Danger':
                button.setStyle(ButtonStyle.Danger);
                break;
            default:
                button.setStyle(style);
        }
    }
    
    if (emoji) button.setEmoji(emoji);
    return button;
};

module.exports = { createButton };