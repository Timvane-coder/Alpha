const { Alpha,  lang, mode, config } = require("../lib");
Alpha(
  {
    pattern: "ttp",
    type: "maker",
    fromMe: mode,
    desc: lang.TTP.DESC,
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.send(lang.BASE.TEXT);
    const res = `${config.BASE_URL}api/maker/ttp?text=${encodeURIComponent(match)}&apikey=${config.ALPHA_KEY}`;
    if (!res) return await message.send(`Please enter a new apikey, as the given apikey limit has been exceeded. Visit ${config.BASE_URL}signup for gettig a new apikey. setvar alpha_key: your apikey`);
    return await message.send({ url: res }, {}, "image");
  },
);
Alpha(
  {
    pattern: "attp",
    type: "maker",
    fromMe: mode,
    desc: lang.TTP.DESC,
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.send(lang.BASE.TEXT);
    const res = `${config.BASE_URL}api/maker/attp?text=${encodeURIComponent(match)}&apikey=${config.ALPHA_KEY}`;
    return await message.send(res, {}, "sticker");
  },
);