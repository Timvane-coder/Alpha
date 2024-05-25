const { Alpha, commands, send_alive, send_menu, lang, personalDB, mode, config } = require('../lib')
const axios = require('axios')
const { runtime } = require("../lib/main/func");
const info = config.BOT_INFO
const parts = info.split(';')

Alpha({
    pattern: 'list',
    desc: lang.LIST.DESC,
    react: "💯",
    type: 'info',
    fromMe: mode
}, async (message) => {
    let count = 1;
    let list = "";
    commands.forEach((cmd) => {
        if (cmd.pattern && !cmd.dontAddCommandList) {
            list += `${count++} *${cmd.pattern.replace(/[^a-zA-Z0-9,-]/g, "")}*\n`;
            if (cmd.desc) {
                list += `_${cmd.desc}_\n\n`;
            }
        }
    });
    return await message.reply(list.trim());
});

Alpha({
    pattern: "menu",
    desc: lang.MENU.DESC,
    react: "📰",
    type: 'info',
    fromMe: mode
}, async (message, match) => {
    return await send_menu(message, 'non button');
});

Alpha({
    pattern: "alive",
    desc: lang.ALIVE.DESC,
    react: "🥰",
    type: 'info',
    usage:lang.ALIVE.HELP,
    fromMe: mode
}, async (message, match) => {
    if(match == "get" && message.isCreator){
	    const {alive} = await personalDB(['alive'], {content:{}},'get');
	    return await message.send(alive);
    } else if(match && message.isCreator){
	    await personalDB(['alive'], {content: match},'set');
	    return await message.send('*success*');
    }
    const {alive} = await personalDB(['alive'], {content:{}},'get');
    return await send_alive(message, alive);
});

Alpha({
	pattern: "repo",
	desc: 'bot source script',
	type: "info",
	fromMe: mode
}, async (message) => {   
	try {
		const response = await axios.get(`https://api.github.com/repos/${config.REPO}`);
		if (response.status === 200) {
		  const repoData = response.data;
		  const info = `📁 *Repository Name:*  ${repoData.name}\n✏️ *Description:* ${repoData.description}\n👥 *Owner:* ${repoData.owner.login}\n⭐ *Stars:* ${repoData.stargazers_count}\n🍽️ *Forks:* ${repoData.forks_count}\n🔗 *URL:* ${repoData.html_url}
		  `.trim();
		  await message.reply(info);
		} else {
		  await message.reply('Unable to fetch repository information.');
		}
	  } catch (error) {
		console.error(error);
		await message.reply('An error occurred while fetching repository information.');
	  }
});

Alpha({
    pattern: 'ping ?(.*)',
    desc: lang.PING_DESC,
    react: "💯",
    fromMe: mode,
    type: 'info'
}, async (message, match) => {
    const start = new Date().getTime()
    const msg = await message.send('Ping!')
    const end = new Date().getTime()
    return await msg.edit('*⚡PONG!* ' + (end - start) + ' ms');
});

Alpha({
	pattern: 'whois ?(.*)',
	fromMe: mode,
	type: 'info',
	desc: 'get user bio and image'
}, async (message, match) => {
			let user = (message.reply_message.sender || match).replace(/[^0-9]/g, '');
			if (!user) return message.send('_Need a User!_')
			user += '@s.whatsapp.net';
			try {
					pp = await message.client.profilePictureUrl(user, 'image')
			} catch {
					pp = 'https://i.imgur.com/nXqqjPL.jpg'
			}
			let status = await message.client.fetchStatus(user)
			const date = new Date(status.setAt);
			const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
			const setAt = date.toLocaleString('en-US', options);
			await message.send({ url: pp }, { caption: `*Name :* ${await message.getName(user)}\n*About :* ${status.status}\n*About Set Date :* ${setAt}`, quoted: message.data }, 'image')
});

Alpha(
    {
      pattern: "uptime",
      type: "info",
      desc: "shows bot uptime.",
      fromMe: mode,
    },
    async (message, match) => {
      const upt = runtime(process.uptime());
      const uptt = `Beep boop... System status: Fully operational!\n*Current uptime: ${upt}*`;
  
      let fileType = 'unknown';
  
      if (parts[2].endsWith('.jpg') || parts[2].endsWith('.png')) {
        fileType = 'image';
      } else if (parts[2].endsWith('.mp4')) {
        fileType = 'video';
      } 
  
      if (fileType === 'image') {
        await message.send({ url: parts[2] }, { caption: uptt }, "image");
      } else if (fileType === 'video') {
        await message.sendReply(parts[2], { caption: uptt }, 'video');
      }
    },
  );
  