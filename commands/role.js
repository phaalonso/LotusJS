module.exports = {
    name: 'role',
    description: 'Give a user a role',
    args: true,
    usage: '<user> <role>',
    execute(message,args) {
        if (args[0] === 'teste') {
            return message.channel.send('Teste!');
        }

        message.channel.send(`Argument: ${args}\nArguments length: ${args.length}`);
    },
};