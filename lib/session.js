const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { config , sleep } = require("../lib");

async function fetchSession(sessionId, folderPath) {
    try {
        const response = await axios.get(`https://zfvdwp-5000.csb.app/server/restore?id=${sessionId}`);
        const encodedData = response.data.content;
        const decodedData = Buffer.from(encodedData, 'base64').toString('utf-8');
        const filePath = path.join(__dirname, '..', folderPath, 'creds.json');
        fs.writeFileSync(filePath, decodedData);
        console.log(`Session fetched successfully.`);
        await sleep(5000);
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}


module.exports = fetchSession;