const YouTube = require("youtubei.js");
const youtube = new YouTube();

async function searchPlaylist(playlistName) {
  const results = await youtube.search(`${playlistName} playlist`);
  
  if (results.length === 0) {
    console.log("Playlist not found");
    return;
  }
  
  const topResult = results[0];
  const playlist = await youtube.getPlaylist(topResult.id);
  
  console.log(`Playlist Name: ${playlist.title}`);
  
  for (const video of playlist.videos) {
    const formats = await video.fetchFormats();
    
    const downloadLinks = formats.filter(format => format.qualityLabel).map(format => format.url);
    
    console.log(`Video Title: ${video.title}`);
    console.log(`Download Links: ${downloadLinks.join(", ")}`);
  }
}

searchPlaylist("nf why");