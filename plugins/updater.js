const simpleGit = require("simple-git");
const git = simpleGit();
const Heroku = require("heroku-client");
const heroku = new Heroku({
  token: process.env.HEROKU_API_KEY,
});
const { Alpha, lang } = require("../lib");
const { VPS, KOYEB_API_KEY, KOYEB } = require("../config");
const axios = require('axios');

Alpha(
  {
    pattern: "update$",
    fromMe: true,
    desc: lang.HEROKU.DESC,
  },
  async (message) => {
    if (!message.text) {
      return await message.send(
        {
          name: "CLICK AN OPTION",
          values: [
            {
              name: "update now",
              id: "update now",
            },
            {
              name: "update check",
              id: "update check",
            },
          ],
          withPrefix: true,
          onlyOnce: true,
          participates: [message.sender],
          selectableCount: true,
        },
        {},
        "poll",
      );
    } else if (message.text.includes("now")) {
      await git.fetch();
      let commits = await git.log(["main" + "..origin/" + "main"]);
      if (commits.total === 0) {
        return await message.send(lang.HEROKU.ALLREDY);
      } else {
        await message.send("_*updating...*_");

        if (VPS) {
          await git.reset("hard", ["HEAD"]);
          await git.pull();
          await message.send("_Successfully updated. Please manually update npm modules if applicable!_");
          process.exit(0);
        } else if (KOYEB) {
          try {
            await git.reset("hard", ["HEAD"]);
            await git.pull();
            const response = await axios.post(
              `https://app.koyeb.com/v1/apps/${process.env.KOYEB_APP_NAME}/deployments`,
              {},
              { headers: { 'Authorization': `Bearer ${KOYEB_API_KEY}` } }
            );
            if (response.status === 201) {
              await message.send("Successfully updated and redeployed on Koyeb.");
            } else {
              await message.send("Error redeploying on Koyeb.");
            }
            process.exit(0);
          } catch (error) {
            await message.send("Error updating Koyeb deployment: " + error.message);
          }
        } else {
          let app;
          try {
            app = await heroku.get("/apps/" + process.env.HEROKU_APP_NAME);
          } catch (e) {
            await git.reset("hard", ["HEAD"]);
            await git.pull();
            await message.send(
              "_Successfully updated. Please manually update npm modules if applicable!_"
            );
            process.exit(0);
          }
          git.fetch("upstream", "main");
          git.reset("hard", ["FETCH_HEAD"]);
          const git_url = app.git_url.replace(
            "https://",
            "https://api:" + process.env.HEROKU_API_KEY + "@"
          );
          try {
            await git.addRemote("heroku", git_url);
          } catch (e) {
            console.log(e);
          }
          await git.push("heroku", "main");
          return await message.send("successfully updated");
        }
      }
    } else if (message.text.includes("check")) {
      await git.fetch();
      let commits = await git.log(["main" + "..origin/" + "main"]);
      if (commits.total === 0) {
        return await message.send(lang.HEROKU.ALLREDY);
      } else {
        let updateMessage = lang.HEROKU.LIST_UPDATE;
        commits.all.forEach((commit) => {
          updateMessage +=
            "```" +
            lang.HEROKU.COMMITS.format(
              commit.date.substring(0, 10),
              commit.message,
              commit.author_name
            ) +
            "```\n\n";
        });
        return await message.send(updateMessage);
      }
    }
  },
);