async function send_menu(m) {
  const info_vars = BOT_INFO.split(/[;,|]/);
  let date = new Date().toLocaleDateString("EN", {
      year: "numeric",
      month: "long",
      day: "numeric",
  });
  const prefix = PREFIX === "false" ? '' : PREFIX; 
  let cmnd = [];
  let cmd;
  let category = [],
      type;
  let menu = `╭━〔 ${(info_vars[0] || info_vars || '').replace(/[;,|]/g, '')} 〕━◉
┃╭━━━━━━━━━━━━━━◉
┃┃ *Plugins :-* ${commands.length.toString()}
┃┃ *User :-* @${m.number}
┃┃ *Owner :-* ${(info_vars[1] || '').replace(/[;,|]/g, '')}
┃┃ *Version:-* ${packageJson.version} 
┃┃ *Prefix:-* ${prefix}
┃┃ *Mode :-* ${WORKTYPE}
┃┃ *Date :-* ${date}
┃┃ *Ram :-* ${format(os.totalmem() - os.freemem())}
┃╰━━━━━━━━━━━━━◉`;
  commands.map((command) => {
      if (command.dontAddCommandList === false && command.pattern) {
          cmd = command.pattern;
          type = command.type.toLowerCase()
      }
      cmnd.push({
          cmd,
          type: type
      });

      if (!category.includes(type)) category.push(type);

  });
  category.forEach((cmmd) => {
      menu += `
┠┌─⭓『 ${addSpace("*"+cmmd.toUpperCase()+"*",14,"both")} 』`;
      let comad = cmnd.filter(({
          type
      }) => type == cmmd);
      comad.forEach(async ({
          cmd
      }, num) => {
          menu += `\n┃│◦ _${cmd.replace(/[^a-zA-Z0-9-+]/g,'')}_`;
      });
      menu += `\n┃└──────────⭓`;
  });
  menu += '\n╰━━━━━━━━━━━━━◉'
  if (theme === 'text') { 
      return await m.client.sendMessage(m.from, {
          text: menu,
          contextInfo: {
              mentionedJid: [m.sender]
          }
      });
  } else {
      return await m.client.sendMessage(m.from, {
          [theme]: {
              url: img_url[theme] 
          },
          caption: menu,
          contextInfo: {
              mentionedJid: [m.sender]
          }
      });
  }
}
