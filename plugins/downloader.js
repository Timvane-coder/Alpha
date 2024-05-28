const { Alpha, mode, extractUrlsFromString, tiktokdl, fbdown, twdl, igdl } = require('../lib');
const { download, search } = require('aptoide-scraper');

Alpha({
	pattern: 'dapk ?(.*)',
	type: "downloader",
	desc: "download applications from aptoid",
    dontAddCommandList: false,
	fromMe: mode
}, async (message, match) => {
	match = match || message.reply_message.text;
	if (!match) return await message.reply("*please give me an application name*");
	if (match) {
		match = match
		const res = await download(match);
		await new Promise(resolve => setTimeout(resolve, 1000));
		await message.sendReply(res.icon, { caption: `*Name*: \`${res.name}\`\n*Updated*: ${res.lastup}\n*Package*: ${res.package}\n*Size*: ${res.size}` }, 'image');
		await new Promise(resolve => setTimeout(resolve, 1000));
		return await message.send({
			url: res.dllink
		}, {
			mimetype: `application/vnd.android.package-archive`,
			fileName: res.name + '.apk'
		}, 'document')
	}
});

Alpha({
    pattern: 'apk ?(.*)',
    type: 'downloader',
    desc: 'search and download apk files',
    fromMe: mode
}, async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply('*please provide a search query*');
    const res = await search(match);
    if (res.length === 0) return await message.reply('No results found.');
    const values = res.splice(0, 10).map((app) => ({
        name: app.name,
        id: `dapk ${app.name}`
    }));
    return await message.send({
        name: '*APK DOWNLOADER*',
        values: values,
        withPrefix: true,
        onlyOnce: false,
        participates: [message.sender],
        selectableCount: true
    }, {}, 'poll');
});

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
            if (!urls[0]) return await message.reply('*_Give me a valid url_*');
            let { status, video  } = await tiktokdl(urls[0]);
            if (!status) return await message.reply('*Not Found*');
            await message.reply('*Downloading... ⏳*');
            await new Promise(resolve => setTimeout(resolve, 1000));
            await message.sendReply(video, { caption: "*Success✅*" }, 'video');
        } catch (e) {
            return message.reply(e);
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
            if (!urls[0]) return await message.reply('*_Give me a valid url_*');
            let { status, HD  } = await fbdown(urls[0]);
            if (!status) return await message.reply('*Not Found*');
            await message.reply('*Downloading... ⏳*');
            await new Promise(resolve => setTimeout(resolve, 1000));
            await message.sendReply(HD, { caption: "*Success✅*" }, 'video');
        } catch (e) {
            return message.reply(e);
        }
    }
);

Alpha(
    {
        pattern: 'twitter ? (.*)',
        fromMe: mode,
        desc: 'download video from twitter url',
        react: '⬇️',
        type: 'downloader'
    },
    async (message, match) => {
        try {
            match = match || message.quoted.text;
            if (!match) return await message.reply('*_give me a url_*');
            const urls = extractUrlsFromString(match);
            if (!urls[0]) return await message.reply('*_Give me a valid url_*');
            let { status, video  } = await twdl(urls[0]);
            if (!status) return await message.reply('*Not Found*');
            await message.reply('*Downloading... ⏳*');
            await new Promise(resolve => setTimeout(resolve, 1000));
            await message.sendReply(video, { caption: "*Success✅*" }, 'video');
        } catch (e) {
            return message.reply(e);
        }
    }
);

Alpha(
    {
        pattern: 'insta ? (.*)',
        fromMe: mode,
        desc: 'download video from instagram url',
        react: '⬇️',
        type: 'downloader'
    },
    async (message, match) => {
        try {
            match = match || message.quoted.text;
            if (!match) return await message.reply('*_give me a url_*');
            const urls = extractUrlsFromString(match);
            if (!urls[0]) return await message.reply('*_Give me a valid url_*');
            const result = await igdl(urls[0]);
            if (!result.status) return await message.reply('*Not Found*');
            await message.reply('*Downloading... ⏳*');
            await new Promise(resolve => setTimeout(resolve, 1000));
            await message.sendReply(result.data, { caption: "*Success✅*" }, 'video');
        } catch (e) {
            return message.reply(e);
        }
    }
);
