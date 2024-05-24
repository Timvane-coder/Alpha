const { Alpha, mode, badWordDetect, config, GPT } = require('../lib/');

Alpha({
    pattern: 'dalle',
    desc: 'generate image with ai',
    react: "🤩",
    type: "ai",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*_give me a text to generate ai image!_*');
    if (badWordDetect(match.toLowerCase())) return await message.send("_*Your request cannot be fulfilled due to the presence of obscene content in your message*_")
    return await message.sendReply(`https://api.gurusensei.workers.dev/dream?prompt=${encodeURIComponent(match)}`, {
            caption: "*result for* ```" + match + "```"
    }, "image");
});


Alpha({
    pattern: "gpt",
    desc: 'get open ai chatgpt response',
    type: "ai",
    fromMe: mode
}, async (message, match) => {
    if(match && match == 'clear') {
        await GPT.clear();
        return await message.reply('_successfully cleard_');
    }
    match = match || message.reply_message.text;
        if (!match) return await message.reply('_please can you provide me a task_');
        if(!config.OPEN_AI) {
         return await message.reply('*please set openai apikey in config*\n*${PREFIX}setvar OPEN_AI: sk........rbfb*');
        } 
        return await message.reply(await GPT.prompt(match));
});
