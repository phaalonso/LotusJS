const axios = require('axios');

const api = axios.create({
    baseURL: 'https://api.warframe.market/v1'
});

module.exports = api;