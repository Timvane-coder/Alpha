const { Alpha, lang, mode, badWordDetect } = require('../lib');


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
