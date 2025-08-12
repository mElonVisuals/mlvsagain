// C:\Users\hopsi\Desktop\mlvsagain\commands\utility\help.js

const { createGlassEmbed } = require('../../utils/glassEmbedBuilder');
const config = require('../../config.json');

module.exports = {
    name: 'help',
    description: 'Lists all available commands.',
    category: 'utility',
    async execute(message, args, client) {
        // Group commands by category. The category is a field you've added to each command file.
        const commandsByCategory = {};
        for (const [name, command] of client.commands) {
            // Assign a default category if one is not specified
            const category = command.category || 'misc';
            if (!commandsByCategory[category]) {
                commandsByCategory[category] = [];
            }
            commandsByCategory[category].push(command);
        }

        const helpEmbed = createGlassEmbed({
            title: ':books: Bot Commands',
            description: `**Server Prefix:** \`${config.prefix}\`\n` +
                         `**Total Commands:** \`${client.commands.size}\`\n` +
                         'Here are all the available commands:',
            color: '#00BFFF',
            client: client,
            footerText: `Requested by ${message.author.username}`
        });

        // Add fields for each category of commands
        for (const category in commandsByCategory) {
            const commandList = commandsByCategory[category].map(command => {
                // Return a formatted string for each command
                return `\`${config.prefix}${command.name}\`: ${command.description || 'No description provided.'}`;
            }).join('\n');

            // Add the category as a field to the embed
            helpEmbed.addFields({
                name: `__${category.charAt(0).toUpperCase() + category.slice(1)}__`,
                value: commandList,
                inline: false
            });
        }

        message.reply({ embeds: [helpEmbed] });
    },
};
