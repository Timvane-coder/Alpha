const axios = require('axios');
const fs = require('fs-extra');
const Crypto = require("crypto");
const path = require("path");
const cheerio = require("cheerio")
const { spawn } = require('child_process')
const ff = require('fluent-ffmpeg')
const tmpFileOut = path.join('./media',`${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.`);
const tmpFileIn = path.join('./media',`${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.`);
function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
	return new Promise(async (resolve, reject) => {
		try {
			let tmp = tmpFileIn + ext
			let out = tmpFileOut + ext2
			console.log(tmp,out)
			await fs.promises.writeFile(tmp, buffer)
			spawn('ffmpeg', ['-y', '-i', tmp, ...args,
				out
			]).on('error', reject).on('close', async (code) => {
				try {
					//await fs.promises.unlink(tmp)
					if (code !== 0) return reject(code)
					resolve(await fs.promises.readFile(out))
					await fs.promises.unlink(out)
				} catch (e) {
					reject(e)
				}
			})
		} catch (e) {
			reject(e)
		}
	})
}
function cutAudio(buff,start,end){
	let buf;
const media = fs.writeFileSync('./media/cut.mp3',buff)
	ff(media)
  .setStartTime('00:'+start)
  .setDuration(end)
  .output('./media/ouputcut.mp3')
  .on('end', function(err) {
    if(!err) {
	buf = fs.readFileSync('./media/ouputcut.mp3')
	}
  })
  .on('error', err => buf = false)
  return buf
}

function cutVideo(buff,start,end){
	let buf;
const media = fs.writeFileSync('./media/cut.mp4',buff)
	ff(media)
  .setStartTime('00:'+start)
  .setDuration(end)
  .output('./media/ouputcut.mp4')
  .on('end', function(err) {
    if(!err) {
	buf = fs.readFileSync('./media/ouputcut.mp4')
	}
  })
  .on('error', err => buf = false)
  return buf
}
function toAudio(buffer, ext) {
	return ffmpeg(buffer, ['-vn', '-ac', '2', '-b:a', '128k', '-ar', '44100', '-f', 'mp3'], ext || 'mp3', 'mp3')
}

function toPTT(buffer, ext) {
	return ffmpeg(buffer, ['-vn', '-c:a', 'libopus', '-b:a', '128k', '-vbr', 'on', '-compression_level', '10'], ext || 'mp3', 'opus')
}


async function getJson(url, options) {
	try {
		options ? options : {};
		const res = await axios({
			method: "GET",
			url: url,
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
			},
			...options,
		});
		return res.data;
	} catch (err) {
		return err;
	}
}
const isIgUrl = (url) => {
	/(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/gim.test(
		url
	);
}
const isUrl = (url) => {
	return new RegExp(
		/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
		"gi"
	).test(url);
}
const getUrl = (url) => {
	return url.match(
		new RegExp(
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
			"gi"
		)
	);
}

function isNumber(num) {
	const int = parseInt(num);
	return typeof int === "number" && !isNaN(int);
}

const tiktokdl = async url => {
    let host = 'https://www.tikwm.com/';
    let res = await axios.post(host+'api/', {}, {
        headers: {
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'sec-ch-ua': '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
        },
        params: {
            url: url,
            count: 12,
            cursor: 0,
            web: 1,
            hd: 1
        }
    })

    return {
        status: true,
        wm: host+res.data.data.wmplay,
        music: host+res.data.data.music,
        video: host+res.data.data.play
    }
}
module.exports = {
	tiktokdl,
	ffmpeg,
	toAudio,
	toPTT,
	getJson,
	isIgUrl,
	isUrl,
	getUrl,
	isNumber,
	cutVideo,
	cutAudio
};
