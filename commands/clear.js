module.exports = {
    name: 'clear',
    description: 'Clear messages of the given channel',
    args: true,
    usage: '<amount>',
    async execute(message, args) {
        amount = args[0];
        if (isNaN(amount)) return message.reply('The amount parameter is not a number!');
        message.channel.bulkDelete(amount, true)
            .catch( err => {
                console.error(err);
            });
        console.log(`Deleted ${amount} messages in the channel ${message.channel.name}`);
        message.reply(`Deleted ${amount} messages successfully`);
    },
};