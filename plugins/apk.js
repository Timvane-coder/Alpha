const { Alpha, mode} = require('../lib');
const { download, search } = require('aptoide-scraper');

Alpha({
	pattern: 'dapk ?(.*)',
	type: "downloader",
	desc: "download applications from aptoid",
    dontAddCommandList: true,
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
console.log(values)
    return await message.send({
        name: '*APK DOWNLOADER*',
        values: values,
        withPrefix: true,
        onlyOnce: false,
        participates: [message.sender],
        selectableCount: true
    }, {}, 'poll');
});
