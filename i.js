const mumaker = require("mumaker")

async function fetchFacebookVideo() {
  try {
      const result = await mumaker.facebook("https://www.facebook.com/watch/?v=2018727118289093");
      console.log(result);
  } catch (error) {
      console.error(error);
  }
}

fetchFacebookVideo();
