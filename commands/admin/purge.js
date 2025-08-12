const { createEmbed } = require('../../utils/embedBuilder');
const { PermissionFlagsBits } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'purge',
    description: 'Delete multiple messages at once (Admin only)',
    category: 'admin',
    execute: async (message, args, client) => {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply({
                embeds: [createEmbed({
                    title: '❌ Permission Denied',
                    description: 'You need the **Manage Messages** permission to use this command.',
                    color: config.colors.error,
                    client: client
                })]
            });
        }

        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount < 1 || amount > 100) {
            return message.reply({
                embeds: [createEmbed({
                    title: '⚠️ Invalid Amount',
                    description: 'Please provide a number between 1 and 100.',
                    color: config.colors.warning,
                    client: client
                })]
            });
        }

        try {
            const deleted = await message.channel.bulkDelete(amount + 1, true);
            
            const embed = createEmbed({
                title: '🗑️ Messages Purged',
                description: `Successfully deleted **${deleted.size - 1}** messages.`,
                color: config.colors.success,
                client: client
            });

            const confirmMsg = await message.channel.send({ embeds: [embed] });
            setTimeout(() => confirmMsg.delete().catch(() => {}), 5000);
        } catch (error) {
            message.reply({
                embeds: [createEmbed({
                    title: '❌ Error',
                    description: 'Failed to delete messages. They might be older than 14 days.',
                    color: config.colors.error,
                    client: client
                })]
            });
        }
    }
};