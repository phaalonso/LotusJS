const { WarframeMarket } = require('./services/api');
const filter_order = require('./utils/filter_order');

module.exports = {
    name: 'price',
    description: 'Give the price of the item',
    args: true,
    usage: '<item>',
    async execute(message, args) {
        const itemName = args.join('_').toLowerCase();
        console.log('Price', itemName);

        await WarframeMarket.get(`/items/${itemName}/orders`)
            .then((response) => {
                const { orders } = response.data.payload;
                console.log(orders);
                const newArray = filter_order(orders);

                // Get the min and max price of the items in the array
                const minPrice = newArray[0].platinum;
                const maxPrice = newArray[newArray.length - 1].platinum;

                const reply = []
                reply.push(`Item name: ${itemName}\n\tMin Price: ${minPrice}`);
                for(i = 0; (i < newArray.length && i < 5); i ++) {
                    reply.push(`\n\tSell Order[${i + 1}]: ${newArray[i].platinum} platinum | Quantity: ${newArray[i].quantity}`);
                }

                reply.push(`\n\tMax Price: ${maxPrice}`);
                return message.channel.send(''.concat(reply));
            })
            .catch((error) => {
                console.error(error);
                return message.channel.send(`Sorry, i can't find the item: ${itemName}`);
            });
    },
};