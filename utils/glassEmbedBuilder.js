const { EmbedBuilder } = require('discord.js');

/**
 * Enhanced Glassmorphism Embed Builder
 * Creates modern, glass-effect styled embeds with enhanced visual appeal
 */

// Predefined glassmorphism color schemes
const glassThemes = {
    // Primary themes
    default: { primary: '#2F3136', accent: '#7289DA', gradient: ['#7289DA', '#5865F2'] },
    success: { primary: '#2F3136', accent: '#00FF87', gradient: ['#00FF87', '#00D4AA'] },
    error: { primary: '#2F3136', accent: '#FF6B6B', gradient: ['#FF6B6B', '#FF5252'] },
    warning: { primary: '#2F3136', accent: '#FFA500', gradient: ['#FFA500', '#FF8C00'] },
    info: { primary: '#2F3136', accent: '#00D4FF', gradient: ['#00D4FF', '#0099CC'] },
    
    // Special themes
    music: { primary: '#1A0B33', accent: '#FF6B9D', gradient: ['#FF6B9D', '#C44EB5'] },
    gaming: { primary: '#0D1B2A', accent: '#00F5FF', gradient: ['#00F5FF', '#1E90FF'] },
    premium: { primary: '#1C1C1E', accent: '#FFD700', gradient: ['#FFD700', '#FFA500'] },
    nature: { primary: '#0F2027', accent: '#2ECC71', gradient: ['#2ECC71', '#27AE60'] },
    sunset: { primary: '#2C1810', accent: '#FF7F50', gradient: ['#FF7F50', '#FF6347'] },
    ocean: { primary: '#001122', accent: '#20B2AA', gradient: ['#20B2AA', '#008B8B'] },
    neon: { primary: '#0D0D0D', accent: '#00FF41', gradient: ['#00FF41', '#00CC33'] }
};

/**
 * Create a glassmorphism-styled embed
 * @param {Object} options - Embed configuration options
 * @param {string} options.title - Embed title
 * @param {string} options.description - Embed description
 * @param {string} options.color - Custom color (hex) or theme name
 * @param {string} options.theme - Predefined theme name
 * @param {string} options.thumbnail - Thumbnail URL
 * @param {string} options.image - Image URL
 * @param {Object} options.author - Author object {name, iconURL, url}
 * @param {Array} options.fields - Array of field objects
 * @param {string} options.footerText - Custom footer text
 * @param {string} options.footerIcon - Custom footer icon URL
 * @param {Object} options.client - Discord client for default footer
 * @param {boolean} options.timestamp - Whether to include timestamp
 * @param {string} options.url - Embed URL
 * @param {boolean} options.glass - Enable glass effect styling (default: true)
 * @returns {EmbedBuilder} Configured embed
 */
function createGlassEmbed(options = {}) {
    const embed = new EmbedBuilder();
    
    // Determine color scheme
    let colorScheme;
    if (options.theme && glassThemes[options.theme]) {
        colorScheme = glassThemes[options.theme];
        embed.setColor(options.color || colorScheme.accent);
    } else {
        embed.setColor(options.color || glassThemes.default.accent);
        colorScheme = glassThemes.default;
    }
    
    // Title with glass styling
    if (options.title) {
        const glassTitle = options.glass !== false ? 
            `${options.title}` : options.title;
        embed.setTitle(glassTitle);
    }
    
    // Description with enhanced formatting
    if (options.description) {
        embed.setDescription(options.description);
    }
    
    // Author configuration
    if (options.author) {
        embed.setAuthor({
            name: options.author.name,
            iconURL: options.author.iconURL,
            url: options.author.url
        });
    }
    
    // Media attachments
    if (options.thumbnail) embed.setThumbnail(options.thumbnail);
    if (options.image) embed.setImage(options.image);
    if (options.url) embed.setURL(options.url);
    
    // Add fields if provided
    if (options.fields && Array.isArray(options.fields)) {
        options.fields.forEach(field => {
            embed.addFields({
                name: field.name,
                value: field.value,
                inline: field.inline || false
            });
        });
    }
    
    // Footer configuration
    const footerText = options.footerText || 'MLVS.me • Advanced Bot System';
    const footerIcon = options.footerIcon || options.client?.user?.displayAvatarURL({ dynamic: true });
    
    embed.setFooter({
        text: footerText,
        iconURL: footerIcon
    });
    
    // Timestamp
    if (options.timestamp !== false) {
        embed.setTimestamp();
    }
    
    return embed;
}

/**
 * Create a success-themed glass embed
 */
function createSuccessEmbed(options = {}) {
    return createGlassEmbed({
        ...options,
        theme: 'success',
        title: options.title || '✅ Success',
        color: options.color || '#00FF87'
    });
}

/**
 * Create an error-themed glass embed
 */
function createErrorEmbed(options = {}) {
    return createGlassEmbed({
        ...options,
        theme: 'error',
        title: options.title || '❌ Error',
        color: options.color || '#FF6B6B'
    });
}

/**
 * Create a warning-themed glass embed
 */
function createWarningEmbed(options = {}) {
    return createGlassEmbed({
        ...options,
        theme: 'warning',
        title: options.title || '⚠️ Warning',
        color: options.color || '#FFA500'
    });
}

/**
 * Create an info-themed glass embed
 */
function createInfoEmbed(options = {}) {
    return createGlassEmbed({
        ...options,
        theme: 'info',
        title: options.title || 'ℹ️ Information',
        color: options.color || '#00D4FF'
    });
}

/**
 * Create a music-themed glass embed
 */
function createMusicEmbed(options = {}) {
    return createGlassEmbed({
        ...options,
        theme: 'music',
        color: options.color || '#FF6B9D',
        footerText: options.footerText || 'MLVS.me Music System'
    });
}

/**
 * Create a premium-themed glass embed
 */
function createPremiumEmbed(options = {}) {
    return createGlassEmbed({
        ...options,
        theme: 'premium',
        color: options.color || '#FFD700',
        footerText: options.footerText || 'MLVS.me Premium Features'
    });
}

/**
 * Create a loading/progress embed with animated elements
 */
function createLoadingEmbed(options = {}) {
    const loadingBars = [
        '▓░░░░░░░░░',
        '▓▓░░░░░░░░',
        '▓▓▓░░░░░░░',
        '▓▓▓▓░░░░░░',
        '▓▓▓▓▓░░░░░',
        '▓▓▓▓▓▓░░░░',
        '▓▓▓▓▓▓▓░░░',
        '▓▓▓▓▓▓▓▓░░',
        '▓▓▓▓▓▓▓▓▓░',
        '▓▓▓▓▓▓▓▓▓▓'
    ];
    
    const randomBar = loadingBars[Math.floor(Math.random() * loadingBars.length)];
    
    return createGlassEmbed({
        ...options,
        title: options.title || '🔄 Loading...',
        description: options.description || `\`\`\`\n${randomBar}\n\`\`\``,
        color: options.color || '#FFA500',
        footerText: options.footerText || 'Please wait...'
    });
}

/**
 * Get available glass themes
 */
function getGlassThemes() {
    return Object.keys(glassThemes);
}

/**
 * Get a specific theme configuration
 */
function getTheme(themeName) {
    return glassThemes[themeName] || glassThemes.default;
}

module.exports = {
    createGlassEmbed,
    createSuccessEmbed,
    createErrorEmbed,
    createWarningEmbed,
    createInfoEmbed,
    createMusicEmbed,
    createPremiumEmbed,
    createLoadingEmbed,
    getGlassThemes,
    getTheme,
    
    // Legacy compatibility
    createEmbed: createGlassEmbed,
    
    // Theme constants
    themes: glassThemes
};