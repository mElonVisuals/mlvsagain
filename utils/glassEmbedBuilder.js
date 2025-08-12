// C:\Users\hopsi\Desktop\mlvsagain\utils\glassEmbedBuilder.js

const { EmbedBuilder } = require('discord.js');

/**
 * @typedef {object} EmbedTheme
 * @property {string} color - The primary color for the embed.
 * @property {string} [title] - A default title for the theme.
 */

/**
 * A collection of predefined, modern embed themes with consistent colors and emojis.
 * This is the single source of truth for all themed embeds, making them easy to manage.
 * @type {Object.<string, EmbedTheme>}
 */
const embedThemes = {
    // --- Core Themes ---
    default: { color: '#7289DA', title: 'ℹ️ Information' },
    success: { color: '#00FF87', title: '✅ Success' },
    error: { color: '#FF6B6B', title: '❌ Error' },
    warning: { color: '#FFA500', title: '⚠️ Warning' },
    
    // --- Specialized Themes ---
    music: { color: '#C44EB5', title: '🎵 Music' },
    gaming: { color: '#00F5FF', title: '🎮 Gaming' },
    premium: { color: '#FFD700', title: '✨ Premium' },
    loading: { color: '#FFA500', title: '🔄 Loading' },
    guide: { color: '#3A9ACD', title: '📚 Guide' },
};

/**
 * @typedef {object} AuthorOptions
 * @property {string} name - The name of the author.
 * @property {string} [iconURL] - The URL for the author's icon.
 * @property {string} [url] - A URL to link from the author's name.
 */

/**
 * @typedef {object} EmbedOptions
 * @property {string} [title] - The title of the embed.
 * @property {string} [description] - The main description of the embed.
 * @property {string} [color] - A custom hex color code. Overrides theme color.
 * @property {string} [theme] - The name of a predefined theme from `embedThemes`.
 * @property {string} [thumbnail] - A URL for a thumbnail image.
 * @property {string} [image] - A URL for the main image.
 * @property {AuthorOptions} [author] - An object containing author information.
 * @property {Array.<{name: string, value: string, inline?: boolean}>} [fields] - An array of embed fields.
 * @property {string} [footerText] - Custom text for the footer.
 * @property {string} [footerIcon] - A URL for a custom footer icon.
 * @property {object} [client] - The Discord client object, used to get the bot's avatar for the footer.
 * @property {boolean} [timestamp=true] - Whether to show the timestamp.
 * @property {string} [url] - A URL for the embed's title.
 */

/**
 * Creates a modern, clean, and powerful embed with a glass-like feel.
 * This is the central, highly-configurable function for building all embeds.
 * @param {EmbedOptions} options - The configuration object for the embed.
 * @returns {EmbedBuilder} A fully configured Discord EmbedBuilder instance.
 */
function createGlassEmbed(options = {}) {
    const {
        title,
        description,
        color,
        theme,
        thumbnail,
        image,
        author,
        fields,
        footerText,
        footerIcon,
        client,
        timestamp = true,
        url,
    } = options;

    const embed = new EmbedBuilder();

    // Dynamically apply theme properties if a valid theme is provided
    const selectedTheme = theme && embedThemes[theme] ? embedThemes[theme] : embedThemes.default;
    const finalColor = color || selectedTheme.color;
    const finalTitle = title || selectedTheme.title;

    embed.setColor(finalColor);
    if (finalTitle) embed.setTitle(finalTitle);
    if (description) embed.setDescription(description);
    if (url) embed.setURL(url);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (image) embed.setImage(image);

    if (author) {
        embed.setAuthor({
            name: author.name,
            iconURL: author.iconURL,
            url: author.url,
        });
    }

    if (fields && Array.isArray(fields)) {
        fields.forEach(field => {
            if (field.name && field.value) {
                embed.addFields({
                    name: field.name,
                    value: field.value,
                    inline: field.inline || false
                });
            }
        });
    }

    // Default footer if none is provided
    const finalFooterText = footerText || `MLVS.me Bot • Advanced System`;
    const finalFooterIcon = footerIcon || client?.user?.displayAvatarURL({ dynamic: true });

    embed.setFooter({
        text: finalFooterText,
        iconURL: finalFooterIcon || undefined
    });

    if (timestamp) {
        embed.setTimestamp();
    }

    return embed;
}

/**
 * Helper function to create a success-themed embed.
 * @param {EmbedOptions} options - Options for the embed, with a default success theme.
 * @returns {EmbedBuilder}
 */
function createSuccessEmbed(options = {}) {
    return createGlassEmbed({ ...options, theme: 'success' });
}

/**
 * Helper function to create an error-themed embed.
 * @param {EmbedOptions} options - Options for the embed, with a default error theme.
 * @returns {EmbedBuilder}
 */
function createErrorEmbed(options = {}) {
    return createGlassEmbed({ ...options, theme: 'error' });
}

/**
 * Helper function to create a warning-themed embed.
 * @param {EmbedOptions} options - Options for the embed, with a default warning theme.
 * @returns {EmbedBuilder}
 */
function createWarningEmbed(options = {}) {
    return createGlassEmbed({ ...options, theme: 'warning' });
}

/**
 * Helper function to create a music-themed embed.
 * @param {EmbedOptions} options - Options for the embed, with a default music theme.
 * @returns {EmbedBuilder}
 */
function createMusicEmbed(options = {}) {
    return createGlassEmbed({ ...options, theme: 'music', footerText: 'MLVS.me Music System' });
}

/**
 * Helper function to create a loading/progress embed with a simple progress bar.
 * This is a highly reusable utility for any loading status messages.
 * @param {string} [title='🔄 Loading...'] - The title of the loading embed.
 * @param {number} [progress=0] - The progress percentage (0-100).
 * @param {EmbedOptions} options - Additional embed options.
 * @returns {EmbedBuilder}
 */
function createLoadingEmbed(title = '🔄 Loading...', progress = 0, options = {}) {
    const progressBarLength = 10;
    const filledBlocks = Math.floor((progress / 100) * progressBarLength);
    const emptyBlocks = progressBarLength - filledBlocks;
    const progressBar = '▓'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

    return createGlassEmbed({
        ...options,
        theme: 'loading',
        title: title,
        description: `\`\`\`\n[${progressBar}] ${progress}%\n\`\`\``,
        footerText: 'Please wait...',
    });
}

/**
 * Retrieves the available theme names.
 * @returns {string[]} An array of all available theme keys.
 */
function getThemes() {
    return Object.keys(embedThemes);
}

module.exports = {
    createGlassEmbed,
    createSuccessEmbed,
    createErrorEmbed,
    createWarningEmbed,
    createMusicEmbed,
    createLoadingEmbed,
    getThemes,
};
