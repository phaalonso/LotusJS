const api = require('./services/api');
const filter_order = require('./utils/filter_order');

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
                console.log(orders);
                const newArray = filter_order(orders);

                // Get the min and max price of the items in the array
                const minPrice = newArray[0].platinum;
                const maxPrice = newArray[newArray.length - 1].platinum;
                // console.log('Min price:', minPrice);
                // console.log('Max price:', maxPrice);

                let reply = `Item name: ${itemName}\n\tMin Price: ${minPrice}`;
                for(i = 0; (i < newArray.length && i < 5); i ++) {
                    reply += `\n\tItem[${i + 1}]: ${newArray[i].platinum} platinum | Quantity: ${newArray[i].quantity}`;
                }

                reply += `\n\tMax Price: ${maxPrice}`;
                return message.channel.send(reply);
            })
            .catch((error) => {
                console.error(error);
                return message.channel.send(`Sorry, i can't find the item: ${itemName}`);
            });
    },
};