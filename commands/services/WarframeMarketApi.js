const axios = require('axios');
const filter_order = require('../utils/filter_order');

const baseURL = 'https://api.warframe.market/v1';

exports.WarframeMarket = axios.create({
    baseURL
});