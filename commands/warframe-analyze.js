const { WarframeMarket } = require('./services/WarframeMarketApi');
const axios = require('axios');

const filter_order = require('./utils/filter_order');

const baseURL = 'https://api.warframe.market/v1';

module.exports = {
    name: 'analyze',
    description: 'Give the price of the item',
    args: true,
    usage: '<item>',
    async execute(message, args) {
        if (args[args.length - 1] === 'set') {
            const setInfo = await WarframeMarket.get(`/items/${args.join('_')}`);
            // console.log(setInfo);
            if (setInfo.status = 200) {
                /*
                    Getting the items of the set!
                */
                const itemList = []
                setInfo.data.payload.item.items_in_set.map((item) => {
                    if (!item.de.item_name.endsWith('Set')) {
                        itemList.push(
                            item.de.item_name.toLowerCase()
                                .split(/ +/)
                                .join('_')
                        );
                    }
                });
                /*
                    Getting the analyzed price
                */
                console.log('Item list', itemList);
                let price = 0;
                const links = [];
                itemList.map(item => links.push(axios.get(`${baseURL}/items/${item}/orders`)));
                const responses = await axios.all(links)

                for (const rep of responses) {
                    if ( rep.status = 200 ) {
                        price += filter_order(rep.data.payload.orders)[0].platinum;
                    }
                }

                let setPrice = -1;
                const response = await WarframeMarket.get(`/items/${args.join('_')}/orders`);
                if ( response.status = 200 ) {
                    const { orders } = response.data.payload;
                    const filter = filter_order(orders);
                    setPrice = filter[0].platinum;
                }

                return message.channel.send(`The price of the buying the pieces separately is: ${price}, while the actual set price is: ${setPrice}`);
            } else {
                message.channel.send('Sorry we have a error!');
            }
        } else {
            return message.channel.send('Sorry this only work for set!');
        }
    },
};