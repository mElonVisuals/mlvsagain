const config = require('../config.json');
const { createEmbed } = require('../utils/embedBuilder');

module.exports = {
    name: 'messageCreate',
    execute: async (message, client) => {
        // Ignore bots and messages without prefix
        if (message.author.bot || !message.content.startsWith(config.prefix)) return;

        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);
        if (!command) return;

        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            
            const errorEmbed = createEmbed({
                title: '❌ Command Error',
                description: 'There was an error executing this command!',
                color: config.colors.error,
                client: client
            });

            message.reply({ embeds: [errorEmbed] }).catch(console.error);
        }
    },
};