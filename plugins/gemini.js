const { Alpha, GPT, mode, config,getJson} = require('../lib');

Alpha({
    pattern: "gemini",
    desc: 'get gemini ai response',
    type: "Ai",
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('_please can you provide me a task_');
    const geminiUrl = `${config.API_URL}api/gemini?prompt=${encodeURIComponent(match)}&api_key=${config.GEMINI_KEY}`;
    const res = await getJson(geminiUrl);
    if (res.error) {
        return await message.send(`*There was an issue processing your request. Please try again later or provide a different prompt.*`);
    } 
    const text = res.candidates[0].content.parts[0].text;
    return await message.reply(text);
});
