const { Alpha, lang, mode, badWordDetect, weather,truecaller, TRT } = require('../lib');
const gis = require('g-i-s');


Alpha({
    pattern: "img",
    usage: 'send google image result for given text',
    react: "🖼",
    fromMe: mode,
    type: "search",
    desc : lang.IMG.IMG_DESC
}, async (message, match) => {
    if (!match) {
        return await message.reply(lang.BASE.TEXT)
    }
    if(badWordDetect(match.toLowerCase()) && message.isCreator) return await message.reply("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    else {
    return await message.sendReply(`https://api.guruapi.tech/api/googleimage?text=${encodeURIComponent(match)}`, {
            caption: "*result for* ```" + match + "```"
    }, "image");
}
});

Alpha({
    pattern: 'weather',
    fromMe: mode,
    desc: lang.SCRAP.WEATHER_DESC,
    react : "🔥",
    type: "search"
}, async (message, match) => {
    if(!match) return await m.send(lang.SCRAP.NEED_PLACE)
        return await weather(message);
});

Alpha(
	{
		pattern: 'trt ?(.*)',
		fromMe: mode,
		desc: lang.TRT.DESC,
		type: 'search',
	},
	async (message, match) => {
		if (!message.reply_message.text)
			return await message.send(
				lang.TRT.NEED
			)
                if(!match) return await message.send(lang.TRT.NEED_LANG);
                const {text} = await TRT(message.reply_message.text, match)
		return await message.send(text);
	}
);


Alpha({
	pattern: 'true ?(.*)',
	desc: 'search number on truecaller',
	type: "search",
	fromMe: true
}, async (message, match) => {
	if (match.match(/login/gi)) {
		match = match.replace(/login/gi, '');
		if (!match) return await message.send('_give me a number to send otp_');
		const msg = await truecaller.set(match);
		if (msg === true) return await message.send(`_successfully send otp to this ${match} number_\n_use *true otp* <key> to login_`);
		return await message.send(`*message:* _use *true logout* as first_\n*resone*: ${msg}`);
	} else if (match.match(/logout/gi)) {
		await truecaller.logout(match);
		return await message.send(`_successfull_`);
	} else if (match.match(/otp/gi)) {
		match = match.replace(/otp/gi, '');
		if (!match) return await message.send('_please provide an otp_');
		const msg = await truecaller.otp(match);
		if (msg === true) return await message.send(`_successfully Logined to Truecaller!!_`);
		return await message.send(`*message:* _use *true logout* as first_\n*resone*: ${msg}`);
	}
	let user = (message.mention.jid?.[0] || message.reply_message.mention.jid?.[0] || message.reply_message.sender || match).replace(/[^0-9]/g, '');
	if (!user) return await message.send(`_reply to a user_`)
	const res = await truecaller.search(user);
	if (!res.status) return await message.send(res.message);
	let msg = `╭─❮ truecaller ❯ ❏\n`//buntline n eromd edi
	delete res.status;
	for (const key in res) {
		msg += `│ ${key.toLowerCase()}: ${res[key]}\n`;
	}
	msg += `╰─❏`;
	return await message.send('```' + msg + '```', {quoted: message.data})
});



Alpha({
    pattern: 'google',
    fromMe: mode,
    desc: lang.SCRAP.GOOGLE_DESC,
    react: "🙃",
    type: "search"
}, async (message, match) => {
	const text = match || message.reply_message.text;
   if (!text) return message.send(lang.BASE.TEXT);
      let google = require('google-it');
        google({ 'query': text}).then(res => {
            let msg= `_*Google Top Search Resuts For Query : ${text}*_\n\n`;
            for (let g of res) {
                msg+= `*➣ Title :* ${g.title}\n`;
                msg+= `*➣ Description :* ${g.snippet}\n`;
                msg+= `*➣ Link :* ${g.link}\n\n────────────────────────\n\n`;
            }
         
            return message.reply(msg);
        })
    }
);

Alpha({
    pattern: 'gis',
    desc: 'generate image with ai',
    react: "🤩",
    type: "search",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate ai image!_*');
    if (badWordDetect(match.toLowerCase())) return await message.reply("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_");
    gis(match, async (error, images) => {
        if (error) {
            console.error(error);
            return await message.reply("An error occurred while searching for images.");
        }
        if (images && images.length > 0) {
            const imageUrl = images[0].url;
            return await message.sendReply(imageUrl, {
                caption: "*result for* ```" + match + "```"
            }, "image");
        } else {
            return await message.reply("No images found for the given search query.");
        }
    });
});
