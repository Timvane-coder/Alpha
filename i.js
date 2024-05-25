// main.js
const { getLyrics } = require('./lib/lyrics');

async function fetchLyrics(songName) {
    try {
        const result = await getLyrics(songName);
        if (result.status === 200) {
            console.log('Lyrics fetched successfully!');
            console.log(`URL: ${result.url}`);
            console.log(`Album: ${result.album}`);
            console.log(`Artist: ${result.artist}`);
            console.log(`Release Date: ${result.release_date}`);
            console.log(`Thumbnail: ${result.thumbnail}`);
            console.log('Lyrics:', result.lyrics);
        } else {
            console.log('Error fetching lyrics:', result.message);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Call the async function
fetchLyrics('nf why');
