const { Alpha, mode, extractUrlsFromString, tiktokdl, fbdown } = require('../lib');

Alpha(
    {
        pattern: 'ttv ? (.*)',
        fromMe: mode,
        desc: 'download video from tiktok url',
        react: '⬇️',
        type: 'downloader'
    },
    async (message, match) => {
        try {
            match = match || message.quoted.text;
            if (!match) return await message.reply('*_give me a url_*');
            const urls = extractUrlsFromString(match);
            if (!urls[0]) return await message.send('*_Give me a valid url_*');

            let { status, video  } = await tiktokdl(urls[0]);
            if (!status) return await message.reply('*Not Found*');
            await message.reply('*Downloading... ⏳*');
            await new Promise(resolve => setTimeout(resolve, 1000));
            await message.sendReply(video, { caption: "*Success✅*" }, 'video');
        } catch (e) {
            return message.send(e);
        }
    }
);

Alpha(
    {
        pattern: 'fb ? (.*)',
        fromMe: mode,
        desc: 'download video from fb url',
        react: '⬇️',
        type: 'downloader'
    },
    async (message, match) => {
        try {
            match = match || message.quoted.text;
            if (!match) return await message.reply('*_give me a url_*');
            const urls = extractUrlsFromString(match);
            if (!urls[0]) return await message.send('*_Give me a valid url_*');
            let { status, HD  } = await fbdown(urls[0]);
            if (!status) return await message.reply('*Not Found*');
            await message.reply('*Downloading... ⏳*');
            await new Promise(resolve => setTimeout(resolve, 1000));
            await message.sendReply(HD, { caption: "*Success✅*" }, 'video');
        } catch (e) {
            return message.send(e);
        }
    }
);
