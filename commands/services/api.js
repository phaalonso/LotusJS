const axios = require('axios');
const fs = require('fs');
const WarframeDropData = axios.create({
    baseURL: 'http://drops.warframestat.us/data'
});

const writeDropData = async ({ data }) => {
    // Write the data in the storage
    const allData = await WarframeDropData.get('/all.json');

    fs.writeFileSync('./data/hash.json', JSON.stringify(data), 'utf8');
    fs.writeFileSync('./data/data.json', JSON.stringify(allData.data), 'utf8');
    console.log('Creating files');
}

exports.WarframeDrop = async function () {
    //Initialize the WarframeDropData System by storing the data in disk
    const hash = await WarframeDropData.get('/info.json')
    fs.readFile('./data/hash.json', 'utf8', (err, dataFile) => {
        if (err) {
            if (err.errno == -4058) {
                //Hash file with the time stamp of the data don't exist
                console.log('Hash file doesnt exist!');
                writeDropData(hash);
            }
            /* Another error ocurred! */
            console.error('Error', err);
        } else {
            // console.log(err);
            console.log('Hash file exists!');
            DataFile = JSON.parse(dataFile);
            console.log(`Internet ->`, hash.data);
            console.log('Data File->', DataFile);
            if (hash.data.timestamp != DataFile.timestamp) {
                console.log('New data found...\nDownloading the new data!');
                writeDropData(hash);
            } else {
                console.log('The file is actualized!');
            }
        }
    });
}

exports.WarframeMarket = axios.create({
    baseURL: 'https://api.warframe.market/v1'
});