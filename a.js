const { igdl } = require('./lib');

(async () => {
  const url = "https://www.instagram.com/p/ByxKbUSnubS/?utm_source=ig_web_copy_link"; // Replace with your URL
  const result = await igdl(url);
  console.log(result);
})();
