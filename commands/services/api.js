const axios = require('axios');
const fs = require('fs');
const WarframeDropData = axios.create({
    baseURL: 'http://drops.warframestat.us/data'
});

const writeDropData = async (newHash) => {
    // Write the data in the storage
    const response = await WarframeDropData.get('/all.json');
    // console.log(response);
    fs.writeFileSync('hash.json', JSON.stringify(newHash),'utf8');
    fs.writeFileSync('data.json', JSON.stringify(response.data), 'utf8');
}

exports.WarframeDrop = async function () {
    //Initialize the WarframeDropData System by storing the data in disk
    const hash = await WarframeDropData.get('/info.json')
        .then((response) => {
            console.log('OI');
            fs.readFileSync('hash.json', 'utf8', (err, data) => {
                console.log(err);
                if (err) {
                    //Hash file with the time stamp of the data don't exist
                    console.log('Hash file doesnt exist!');
                    writeDropData(response.data);
                } else {
                    console.log('Hash file exists!');
                    console.log(data);
                    obj = JSON.parse(data);
                    console.log(obj);
                }
            });
        })
        .catch(err => {
            console.error(err);
        });
}

exports.WarframeMarket = axios.create({
    baseURL: 'https://api.warframe.market/v1'
});