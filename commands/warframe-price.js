const api = require('./services/api');

module.exports = {
    name: 'price',
    description: 'Give the price of the item',
    args: true,
    usage: '<item>',
    async execute(message, args) {
        const itemName = args.join('_').toLowerCase();
        console.log('Price', itemName);

        await api.get(`/items/${itemName}/orders`)
            .then((response) => {
                const { orders } = response.data.payload;
                const newArray = orders.filter(({ order_type }) => {return order_type === 'sell'})
                    .sort((it1, it2) => {
                        if (it1.platinum < it2.platinum)
                            return -1;
                        else if (it1.platinum > it2.platinum)
                            return 1;
                        else
                            return 0;
                    });
                const minPrice = newArray[0].platinum;
                const maxPrice = newArray.pop().platinum;
                console.log('Min price:', minPrice);
                console.log('Max price:', maxPrice);
                let reply = `Item name: ${args.join('_').toLowerCase()}\n   Min Price: ${minPrice}`;
                for(i = 0; (i < newArray.length && i < 5); i ++) {
                    reply += `\n   Item[${i + 1}]: ${newArray[i].platinum} platinum | Quantity: ${newArray[i].quantity}`;
                }

                reply += `\n   Max Price: ${maxPrice}`;
                return message.channel.send(reply);
            })
            .catch((error) => {
                console.error(error.data);
                return message.channel.send(`Sorry, i can't find the item: ${itemName}`);
            });
    },
};