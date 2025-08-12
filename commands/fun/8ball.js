const { createEmbed } = require('../../utils/embedBuilder');
const config = require('../../config.json');

module.exports = {
    name: '8ball',
    description: 'Ask the magic 8-ball a question',
    category: 'fun',
    execute: async (message, args, client) => {
        if (!args.length) {
            return message.reply({
                embeds: [createEmbed({
                    title: '❓ No Question Asked',
                    description: `Please ask a question!\n**Usage:** \`${config.prefix}8ball <question>\``,
                    color: config.colors.warning,
                    client: client
                })]
            });
        }

        const responses = [
            { text: 'It is certain', color: config.colors.success },
            { text: 'Without a doubt', color: config.colors.success },
            { text: 'Yes definitely', color: config.colors.success },
            { text: 'Most likely', color: config.colors.info },
            { text: 'Outlook good', color: config.colors.info },
            { text: 'Signs point to yes', color: config.colors.info },
            { text: 'Reply hazy, try again', color: config.colors.warning },
            { text: 'Ask again later', color: config.colors.warning },
            { text: 'Better not tell you now', color: config.colors.warning },
            { text: 'Cannot predict now', color: config.colors.warning },
            { text: "Don't count on it", color: config.colors.error },
            { text: 'My reply is no', color: config.colors.error },
            { text: 'Very doubtful', color: config.colors.error }
        ];

        const response = responses[Math.floor(Math.random() * responses.length)];
        const question = args.join(' ');

        const embed = createEmbed({
            title: '🎱 Magic 8-Ball',
            description: `**Question:** ${question}\n\n**Answer:** *${response.text}*`,
            color: response.color,
            client: client
        });

        await message.reply({ embeds: [embed] });
    }
};