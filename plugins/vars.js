const { Alpha, config } = require('../lib');
const { SUDO, HEROKU, VPS, KOYEB_API_KEY, KOYEB_APP_NAME, KOYEB } = require("../config");
const Heroku = require('heroku-client');
const heroku = new Heroku({ token: process.env.HEROKU_API_KEY });
const baseURI = "/apps/" + HEROKU.APP_NAME;
const fs = require('fs');
const axios = require('axios');

Alpha({
    pattern: 'setvar ?(.*)',
    fromMe: true,
    desc: 'Set config var',
    type: 'config'
}, async (message, match) => {
    if (!match) return await message.reply('```Either Key or Value is missing```');
    const [key, value] = match.split(':');
    if (!key || !value) return await message.reply('use setvar STICKER_DATA: c-iph3r;alpha-md');

    if (VPS) {
        updateEnvFile(key, value.trim());
        await message.reply('Successfully set ' + '```' + key + '➜' + value.trim() + '```');
    } else if (KOYEB) {
        try {
            const response = await axios.patch(
                `https://app.koyeb.com/v1/apps/${KOYEB_APP_NAME}/env`,
                { [key.toUpperCase()]: value.trim() },
                { headers: { 'Authorization': `Bearer ${KOYEB_API_KEY}` } }
            );
            if (response.status === 200) {
                await message.reply('Successfully set ' + '```' + key + '➜' + value.trim() + '```');
            } else {
                await message.reply('Error setting Koyeb variable');
            }
        } catch (error) {
            await message.reply('Error setting Koyeb variable');
        }
    } else {
        try {
            await heroku.patch(baseURI + '/config-vars', {
                body: {
                    [key.trim().toUpperCase()]: value.trim()
                }
            });
            await message.reply('Successfully set ' + '```' + key + '➜' + value.trim() + '```');
        } catch (error) {
            await message.reply(`HEROKU: ${error.body.message}`);
        }
    }
});

Alpha({
    pattern: 'delvar ?(.*)',
    fromMe: true,
    desc: 'Delete config var',
    type: 'config'
}, async (message, match) => {
    if (!match) return await message.reply('```Either Key or Value is missing```');

    if (VPS) {
        deleteFromEnvFile(match);
        await message.reply('Successfully deleted ' + '```' + match.toUpperCase() + '```');
    } else if (KOYEB) {
        try {
            const response = await axios.delete(
                `https://app.koyeb.com/v1/apps/${KOYEB_APP_NAME}/env/${match.toUpperCase()}`,
                { headers: { 'Authorization': `Bearer ${KOYEB_API_KEY}` } }
            );
            if (response.status === 200) {
                await message.reply('Successfully deleted ' + '```' + match.toUpperCase() + '```');
            } else {
                await message.reply('Error deleting Koyeb variable');
            }
        } catch (error) {
            await message.reply('Error deleting Koyeb variable');
        }
    } else {
        try {
            const vars = await heroku.get(baseURI + '/config-vars');
            if (vars[match.toUpperCase()]) {
                await heroku.patch(baseURI + '/config-vars', {
                    body: {
                        [match.toUpperCase()]: null
                    }
                });
                await message.reply('```' + match.toUpperCase() + ' successfully deleted```');
            } else {
                await message.reply('```No results found for this key```');
            }
        } catch (error) {
            await message.reply(`HEROKU: ${error.body.message}`);
        }
    }
});

Alpha({
    pattern: 'getvar ?(.*)',
    fromMe: true,
    desc: 'Show all config vars',
    type: 'config'
}, async (message, match) => {
    let msg = "*_All config vars_*\n\n",
        got = false;

    if (VPS) {
        const envConfig = fs.readFileSync('.env', 'utf-8').split('\n');
        for (const line of envConfig) {
            if (line) {
                const [key, value] = line.split('=');
                if (!match || match.toUpperCase() === key) {
                    msg += `_*${key}* : ${value}_\n`;
                    got = true;
                }
            }
        }
        if (match && !got) return await message.reply('_The requested key was not found_\n_Try *getvar* to get all variables_');
        return await message.reply(msg);
    } else if (KOYEB) {
        try {
            const response = await axios.get(
                `https://app.koyeb.com/v1/apps/${KOYEB_APP_NAME}/env`,
                { headers: { 'Authorization': `Bearer ${KOYEB_API_KEY}` } }
            );
            const vars = response.data;
            for (const key in vars) {
                if (!match || match.toUpperCase() === key) {
                    msg += `_*${key}* : ${vars[key]}_\n`;
                    got = true;
                }
            }
            if (match && !got) return await message.reply('_The requested key was not found_\n_Try *getvar* to get all variables_');
            return await message.reply(msg);
        } catch (error) {
            await message.reply('Error retrieving Koyeb variables');
        }
    } else {
        for (const key in config) {
            if (key !== 'DATABASE' && key !== 'BASE_URL' && key !== 'HEROKU' && key !== 'SESSION_ID') {
                if (!match) {
                    msg += `_*${key}* : ${config[key]}_\n`;
                } else if (match.toUpperCase() === key) {
                    await message.reply(`_*${match.toUpperCase()}* : ${config[key]}_`);
                    got = true;
                    break;
                }
            }
        }
        if (match && !got) return await message.reply('_The requested key was not found_\n_Try *getvar* to get all variables_');
        return await message.reply(msg);
    }
});

Alpha(
    {
      pattern: "setsudo ?(.*)",
      fromMe: true,
      desc: "Add a number to the list of sudo numbers",
      type: "config"
    },
    async (message) => {
      const newSudo = message.reply_message ? message.reply_message.sender.split('@')[0] : '';
      if (!newSudo) {
        return await message.reply("*Please reply to a user to set as sudo*");
      }
        try {
        let setSudo = (SUDO + "," + newSudo).replace(/,,/g, ",");
        setSudo = setSudo.startsWith(",") ? setSudo.replace(",", "") : setSudo;
  
        if (VPS) {
          updateEnvFile("SUDO", setSudo);
        } else if (KOYEB) {
          const response = await axios.patch(
            `https://app.koyeb.com/v1/apps/${KOYEB_APP_NAME}/env`,
            { SUDO: setSudo },
            { headers: { 'Authorization': `Bearer ${KOYEB_API_KEY}` } }
          );
          if (response.status !== 200) {
            throw new Error('Error setting Koyeb variable');
          }
        } else {
          await heroku.patch(baseURI + "/config-vars", { body: { SUDO: setSudo } });
        }
        await sendUpdatedSudoList(message);
      } catch (error) {
        await message.reply('Error setting sudo: ' + error.message);
      }
    }
  );


  
Alpha(
    {
      pattern: "getsudo ?(.*)",
      fromMe: true,
      desc: "Show current list of sudo numbers",
      type: "config"
    },
    async (message) => {
      let sudoNumbers = null;
  
      if (VPS) {
        const envConfig = fs.readFileSync('.env', 'utf-8').split('\n');
        for (const line of envConfig) {
          if (line.startsWith("SUDO=")) {
            sudoNumbers = line.split('=')[1];
            break;
          }
        }
      } else if (KOYEB) {
        try {
          const response = await axios.get(
            `https://app.koyeb.com/v1/apps/${KOYEB_APP_NAME}/env`,
            { headers: { 'Authorization': `Bearer ${KOYEB_API_KEY}` } }
          );
          const vars = response.data;
          sudoNumbers = vars.SUDO;
        } catch (error) {
          await message.reply('Error retrieving Koyeb variables');
          return;
        }
      } else {
        try {
          const vars = await heroku.get(baseURI + "/config-vars");
          sudoNumbers = vars.SUDO;
        } catch (error) {
          await message.reply("HEROKU: " + error.body.message);
          return;
        }
      }  
      if (!sudoNumbers) {
        await message.reply("There are no sudo numbers available.");
        return;
      }
      await message.reply("```" + `Sudo numbers are : ${sudoNumbers}` + "```");
    }
  );


function updateEnvFile(key, value) {
    let envConfig = fs.readFileSync('.env', 'utf-8').split('\n');
    let found = false;
    envConfig = envConfig.map(line => {
        if (line.startsWith(key.toUpperCase())) {
            found = true;
            const existingValue = line.split('=')[1];
            const updatedValue = existingValue ? `${existingValue},${value}` : value;
            return `${key.toUpperCase()}=${updatedValue}`;
        }
        return line;
    });
    if (!found) envConfig.push(`${key.toUpperCase()}=${value}`);
    fs.writeFileSync('.env', envConfig.join('\n'));
}

function deleteFromEnvFile(key, value) {
    let envConfig = fs.readFileSync('.env', 'utf-8').split('\n');
    envConfig = envConfig.map(line => {
        if (line.startsWith(key.toUpperCase())) {
            if (value) {
                const existingValues = line.split('=')[1].split(',');
                const updatedValues = existingValues.filter(v => v !== value);
                return `${key.toUpperCase()}=${updatedValues.join(',')}`;
            }
            return '';
        }
        return line;
    }).filter(Boolean);
    fs.writeFileSync('.env', envConfig.join('\n'));
}

async function sendUpdatedSudoList(message) {
    try {
        let sudoNumbers;
        if (VPS) {
            const envConfig = fs.readFileSync('.env', 'utf-8').split('\n');
            for (const line of envConfig) {
                if (line.startsWith("SUDO=")) {
                    sudoNumbers = line.split('=')[1];
                    break;
                }
            }
        } else if (KOYEB) {
            const response = await axios.get(
                `https://app.koyeb.com/v1/apps/${KOYEB_APP_NAME}/env`,
                { headers: { 'Authorization': `Bearer ${KOYEB_API_KEY}` } }
            );
            sudoNumbers = response.data.SUDO;
        } else {
            const vars = await heroku.get(baseURI + "/config-vars");
            sudoNumbers = vars.SUDO;
        }
        await message.reply("```Updated sudo numbers are: " + sudoNumbers + "```");
    } catch (error) {
        await message.reply('Error retrieving sudo list: ' + error.message);
    }
} 