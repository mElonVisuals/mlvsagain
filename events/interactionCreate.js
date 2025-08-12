const { handleInteraction } = require('../handlers/interactionHandler');

module.exports = {
    name: 'interactionCreate',
    execute: async (interaction, client) => {
        if (!interaction.isButton()) return;

        try {
            await handleInteraction(interaction, client);
        } catch (error) {
            console.error('Button interaction error:', error);
            if (!interaction.replied && !interaction.deferred) {
                interaction.reply({ content: 'Something went wrong!', ephemeral: true });
            }
        }
    },
};