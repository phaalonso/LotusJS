const fs = require('fs');
const Discord = require('discord.js');

const { prefix, token } = require('./info.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`Logado como ${client.user.id}`);
});

client.on('message', async msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).split(/ +/);
    console.log('Args', args);

    const commandName = args.shift().toLowerCase();
    console.log('Command', commandName);

    const command = client.commands.get(commandName);

    try {
        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${msg.author}`;
        
            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }
    
            return msg.channel.send(reply);
        }
    } catch (TypeError) {
        return msg.reply(`Can't found the command:  \`${prefix}${commandName}\`!`);
    }

    try {
        command.execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('There is a error trying to execute this command!');
    }

});

client.login(token);