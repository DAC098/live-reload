const http = require('http');
const https = require('https');
const fs = require('fs');
const npath = require('path');
const url = require('url');

const express = require('express');
const chokidar = require('chokidar');
const sio = require('socket.io');

const html = require('./html.js');

const config = require('../config.json');

// variables-------------------------------------------------------------------

const svr_start = process.hrtime();

const watcher = chokidar.watch('file, dir, glob');

const app = express();

const csoc = new sio();

const sis_path = '/mnt/sis';

const ports = {
	http: 3000,
	https: 3001
};

const tls = {
	cert: fs.readFileSync('./tls/svr.cert'),
	key: fs.readFileSync('./tls/svr.key'),
	passphrase: 'tds601st'
};

// methods---------------------------------------------------------------------

function getType(variable) {
	return Object.prototype.toString.call(variable).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

function padStart(modify,length,fill = ' ') {
	modify = getType(modify) != 'string' ? String(modify) : modify;
	let mod_len = modify.length,
		fill_len = fill.length,
		fill_count = 0;
	let pad_count = length - mod_len;
	for(let c = 0; c < pad_count; ++c) {
		if(fill_count = fill_len - 1) fill_count = 0;
		modify =`${fill[fill_count]}${modify}`;
		++fill_count;
	}
	return modify;
}

function pTime() {
	let now = process.hrtime(svr_start);
	let ms = Math.floor(now[1]/1000000);
	let sec = now[0] % 60;
	let min = Math.floor(now[0] / 60 % 60);
	let hr = Math.floor(now[0] / 60 /60 % 60);
	return `${padStart(hr,2,'0')}:${padStart(min,2,'0')}:${padStart(sec,2,'0')}.${padStart(ms,3,'0')}`;
}

function log(...args) {
	args.unshift(`[${pTime()}]:`);
	console.log.apply(null,args);
}

// express app-----------------------------------------------------------------

app.use('/assets',express.static(npath.join(process.cwd(),'assets')));

app.get('/',function(req,res) {
	log('new client request');
	res.send(html());
});

// socket----------------------------------------------------------------------

csoc.on('connection',(socket) => {
	log('client socket connected');
	// let client_info = url.parse(socket.handshake.headers.referer);
	// let file_domain = client_info.hostname.split('.')[0];
	// console.log('socket info:',client_info);

	socket.on('disconnect',() => {
		log('client socket disconnected');
	});
});

// watcher---------------------------------------------------------------------

var reg = {
	html: [/\.ihtml/,/\.html/],
	js: /\.js/,
	css: /\.css/,
	php: [/\.php/,/\.inc/]
};
var list = [];

for(let path of config.watch) {
	list.push(npath.join(config.root,path));
}

function getFileType(ext) {
	for(let key in reg) {
		if(getType(reg[key]) == 'array') {
			for(let item of reg[key]) {
				if(item.test(ext)) {
					return key
				}
			}
		} else {
			if(reg[key].test(ext)) {
				return key;
			}
		}
	}
	return;
}

watcher.add(list);

watcher.on('add',path => {
	log('file added:',path);
});

watcher.on('change',path => {
	let info = npath.parse(path);
	log('file changed:',npath.basename(path));
	let type = getFileType(info.ext);
	if(type) {
		csoc.emit('update',{
			type,
			base: info.base,
			time: String(Date.now())
		});
	} else {
		log('unknown file type changed, ext:',info.ext);
	}
});

watcher.on('ready',() => {
	log('watcher ready');
});

// servers---------------------------------------------------------------------

const svr = http.createServer(app).listen(ports.http,() => {
	log('server listening on port:',ports.http);
});

const tlssvr = https.createServer(tls,app).listen(ports.https,() => {
	log('tls server listening on port:',ports.https);
});

csoc.attach(svr);
csoc.attach(tlssvr);
