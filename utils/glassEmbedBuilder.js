/**
 * C:\Users\hopsi\Desktop\mlvsagain\utils\glassEmbedBuilder.js
 *
 * This module provides a highly advanced, class-based embed builder designed for a modern,
 * unique "glassmorphism" aesthetic. It replaces a simple function with a robust
 * object-oriented design, offering extensive customization, theme presets, and built-in
 * validation to create visually stunning and consistent embeds.
 *
 * @author Gemini
 * @version 2.0.0
 */

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
    system: { color: '#008CFF', title: '🤖 System Message' },
    alert: { color: '#E83E8C', title: '🔔 Alert' },
    event: { color: '#7D00B3', title: '🎉 Event' },
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
 * A class to build embeds with a consistent "glassmorphism" theme.
 * This class provides a powerful and unique interface for creating visually appealing
 * embeds with pre-defined themes, dynamic footers, and built-in error handling.
 */
class GlassEmbedBuilder {
    /**
     * Constructs a new GlassEmbedBuilder instance.
     * @param {EmbedOptions} options - The options for the embed.
     */
    constructor(options = {}) {
        this.client = options.client;

        // Private properties for internal state
        this._embed = new EmbedBuilder();
        this._options = options;

        this._applyOptions(options);
        this.validate();
    }

    /**
     * Internal method to apply all options from the constructor.
     * @private
     * @param {EmbedOptions} options - The options object to apply.
     */
    _applyOptions(options) {
        const {
            title, description, color, theme, thumbnail, image, author, fields,
            footerText, footerIcon, timestamp = true, url,
        } = options;

        // Dynamically apply theme properties if a valid theme is provided
        const selectedTheme = theme && embedThemes[theme] ? embedThemes[theme] : embedThemes.default;
        const finalColor = color || selectedTheme.color;
        const finalTitle = title || selectedTheme.title;

        this.setColor(finalColor);
        if (finalTitle) this.setTitle(finalTitle);
        if (description) this.setDescription(description);
        if (url) this.setURL(url);
        if (thumbnail) this.setThumbnail(thumbnail);
        if (image) this.setImage(image);
        if (author) this.setAuthor(author);
        if (fields) this.addFields(fields);
        this.setFooter(footerText, footerIcon);
        if (timestamp) this.setTimestamp();
    }

    /**
     * Sets the embed's title.
     * @param {string} title - The title of the embed.
     * @returns {GlassEmbedBuilder} The current instance for method chaining.
     */
    setTitle(title) {
        this._embed.setTitle(title);
        return this;
    }

    /**
     * Sets the embed's description.
     * @param {string} description - The description of the embed.
     * @returns {GlassEmbedBuilder} The current instance for method chaining.
     */
    setDescription(description) {
        this._embed.setDescription(description);
        return this;
    }

    /**
     * Sets the embed's color.
     * @param {string|number} color - A valid color hex code or number.
     * @returns {GlassEmbedBuilder} The current instance for method chaining.
     */
    setColor(color) {
        this._embed.setColor(color);
        return this;
    }

    /**
     * Sets the embed's URL.
     * @param {string} url - The URL for the embed's title.
     * @returns {GlassEmbedBuilder} The current instance for method chaining.
     */
    setURL(url) {
        this._embed.setURL(url);
        return this;
    }

    /**
     * Sets the embed's thumbnail image.
     * @param {string} url - The URL for the thumbnail image.
     * @returns {GlassEmbedBuilder} The current instance for method chaining.
     */
    setThumbnail(url) {
        this._embed.setThumbnail(url);
        return this;
    }

    /**
     * Sets the embed's main image.
     * @param {string} url - The URL for the main image.
     * @returns {GlassEmbedBuilder} The current instance for method chaining.
     */
    setImage(url) {
        this._embed.setImage(url);
        return this;
    }

    /**
     * Sets the embed's author.
     * @param {AuthorOptions} author - An object containing author information.
     * @returns {GlassEmbedBuilder} The current instance for method chaining.
     */
    setAuthor(author) {
        this._embed.setAuthor(author);
        return this;
    }

    /**
     * Adds a single field to the embed.
     * @param {string} name - The name of the field.
     * @param {string} value - The value of the field.
     * @param {boolean} [inline=false] - Whether the field should be displayed inline.
     * @returns {GlassEmbedBuilder} The current instance for method chaining.
     */
    addField(name, value, inline = false) {
        this._embed.addFields({ name, value, inline });
        return this;
    }

    /**
     * Adds multiple fields to the embed at once.
     * @param {Array<object>} fields - An array of field objects with `name`, `value`, and `inline` properties.
     * @returns {GlassEmbedBuilder} The current instance for method chaining.
     */
    addFields(fields) {
        if (fields && Array.isArray(fields)) {
            fields.forEach(field => {
                if (field.name && field.value) {
                    this._embed.addFields({
                        name: field.name,
                        value: field.value,
                        inline: field.inline || false
                    });
                }
            });
        }
        return this;
    }

    /**
     * Sets the footer text and icon.
     * If no icon is provided, it defaults to the bot's avatar.
     * @param {string} text - The footer text.
     * @param {string} [iconURL] - The URL of the footer icon.
     * @returns {GlassEmbedBuilder} The current instance for method chaining.
     */
    setFooter(text, iconURL) {
        if (text) {
            const finalIcon = iconURL || this.client?.user?.displayAvatarURL({ dynamic: true });
            this._embed.setFooter({ text: text, iconURL: finalIcon || undefined });
        }
        return this;
    }

    /**
     * Sets the timestamp for the embed.
     * @returns {GlassEmbedBuilder} The current instance for method chaining.
     */
    setTimestamp() {
        this._embed.setTimestamp();
        return this;
    }

    /**
     * Internal method to validate the embed against Discord's limits.
     * Logs warnings if any limits are exceeded.
     */
    validate() {
        const titleLength = this._embed.data.title?.length || 0;
        if (titleLength > 256) {
            console.warn(`[GlassEmbedBuilder] Warning: Title length exceeds 256 characters (${titleLength})`);
        }

        const descriptionLength = this._embed.data.description?.length || 0;
        if (descriptionLength > 4096) {
            console.warn(`[GlassEmbedBuilder] Warning: Description length exceeds 4096 characters (${descriptionLength})`);
        }

        const fieldCount = this._embed.data.fields?.length || 0;
        if (fieldCount > 25) {
            console.warn(`[GlassEmbedBuilder] Warning: Embed has more than 25 fields (${fieldCount})`);
        }
    }

    /**
     * Returns the final built EmbedBuilder object.
     * This is the object that should be passed to a Discord message.
     * @returns {EmbedBuilder} The final Discord.js EmbedBuilder instance.
     */
    getEmbed() {
        return this._embed;
    }
}

/**
 * Creates a modern, clean, and powerful embed with a glass-like feel.
 * This is the central, highly-configurable factory function for building all embeds.
 * It is a wrapper for the new GlassEmbedBuilder class, providing a clean API.
 * @param {EmbedOptions} options - The configuration object for the embed.
 * @returns {EmbedBuilder} A fully configured Discord EmbedBuilder instance.
 */
function createGlassEmbed(options = {}) {
    const builder = new GlassEmbedBuilder(options);
    return builder.getEmbed();
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
    GlassEmbedBuilder, // Exporting the class for advanced usage
    embedThemes,      // Exporting the themes for external access
};
