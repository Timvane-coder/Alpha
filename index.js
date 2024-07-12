const path = require("path");
const config = require("./config");
const bot = require("./lib/bot");
const fs = require('fs').promises;
const fetchSession = require("./lib/session");

const express = require('express');
const http = require('http');

const app = new express();
let PORT = process.env.PORT || 3000

app.get('/', function (req, res) {
  res.send('online');
});

global.__basedir = __dirname;

async function startBot() {
  console.log("🤖 Initializing..");
  try {
    console.log("Syncing Database 💾");
    await config.DATABASE.sync();
    const sessionPath = path.join(__dirname, "session");
 /*   try {
      await fs.rm(sessionPath, { recursive: true, force: true });
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }
    await fs.mkdir(sessionPath);
    await fetchSession(config.SESSION_ID);*/
    return await bot();
  } catch (error) {
    console.error("Initialization error:", error);
    process.exit(1); // Exit with error status
  }
}

startBot();
app.listen(PORT, () => {
  console.log('App listened on port:', PORT)
})

setInterval(function() {
  http.get("http://liniadeploy-1622d9568914.herokuapp.com");
}, 300000);
