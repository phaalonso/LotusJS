const sort_platinum = (a, b) => {
    /* Use this function in the method .sort() to make the orders get in the crescent order */
    if (a.platinum < b.platinum)
        return -1;
    else if (a.platinum > b.platinum)
        return 1;
    else
        return 0;
}

const filter_order = (orders) => {
    /* This funcion is reponsible to organize the list of ordens, and filter them to remove the orders of offnline players */
    return orders.filter(({ order_type, user }) => {
        return order_type === 'sell' && (user.status === 'ingame' || user.status === 'online');
    })
    .sort(sort_platinum);
}

module.exports = filter_order;