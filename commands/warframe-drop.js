const api = require('./services/api');

module.exports = {
    name: 'drop',
    description: 'Give the drop location of the item',
    args: true,
    usage: '<item>',
    async execute(message, args) {
        const itemName = args.join('_').toLowerCase();
        console.log('Drops', itemName);

        await api.get(`/items/${itemName}`)
            .then((response) => {
                // console.log('Response', response.data.payload.item);
                const data = response.data
                console.log('Data', data);
                let reply = `Item searched: ${args.join(' ').toLowerCase()}\n`;
                reply += 'Parts Found:\n';

                data.payload.item.items_in_set.map( item => {
                    const info = item.en;
                    console.log(info);
                    if (!info.item_name.endsWith('Set')) {
                        if (info.drop.length) {
                            reply += `${info.item_name} dropped in: `;
                            const { drop } = item;
                            info.drop.map(drop => { reply += `\n    \`${drop.name}\``; });
                            reply += '\n';
                        } else {
                            reply += `Sorry we can't localize yet the drop location of relics`;
                        }
                    }
                });

                // console.log('Message', reply);
                return message.channel.send(reply);
            })
            .catch((error) => {
                console.error(error.data);
                return message.channel.send(`Sorry, i can't find the item: ${itemName}`);
            });
    },
};