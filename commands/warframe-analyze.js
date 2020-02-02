const { WarframeMarket } = require('./services/api');
const filter_order = require('./utils/filter_order');

module.exports = {
    name: 'analyze',
    description: 'Give the price of the item',
    args: true,
    usage: '<item>',
    async execute(message, args) {
        if (args[args.length -1] === 'set'){
            const setInfo = await WarframeMarket.get(`/items/${args.join('_')}`);
            // console.log(setInfo);
            if (setInfo.status = 200) {
                /*
                    Getting the items of the set!
                */
                const itemSet = [] 
                setInfo.data.payload.item.items_in_set.map((item) => {
                    if ( !item.de.item_name.endsWith('Set') ) {
                        itemSet.push(
                            item.de.item_name.toLowerCase()
                                .split(/ +/)
                                .join('_')
                        );   
                    }
                });
                /*
                    Getting the analyzed price
                */
                console.log(itemSet);
                let price = 0;
                for(const item of itemSet) {
                    const response = await WarframeMarket.get(`/items/${item}/orders`);
                    if ( response.status = 200 ) {
                        const { orders } = response.data.payload;
                        const filter = filter_order(orders);
                        // console.log(item ,filter[0], filter[0].platinum);
                        price += filter[0].platinum;
                        console.log(item, price);
                    } else {
                        console.error('Erro in getting the order of the item: ', item);
                    }
                }

                let setPrice = -1;
                const response = await WarframeMarket.get(`/items/${args.join('_')}/orders?include=statistics`);
                if ( response.status = 200 ) {
                    const { orders } = response.data.payload;
                    const filter = filter_order(orders);
                    setPrice = filter[0].platinum;
                }

                return message.channel.send(`The price analyzed is: ${price}, while the actual set price is: ${setPrice}`);
            } else {
                message.channel.send('Sorry we have a error!');
            }
        } else { 
            return message.channel.send('Sorry this only work for set!');
        }
    },
};