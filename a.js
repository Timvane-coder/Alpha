const { youtube } = require('btch-downloader');

const url = 'https://youtube.com/watch?v=C8mJ8943X80';

async function fetchData() {
  const data = await youtube(url);
  console.log(data);
}


fetchData();