/**
 * Created by dac098 on 1/13/17.
 */
const npath = require('path');

const chokidar = require('chokidar');

const config = require('../config.json');

const csoc = require('./socket.js');

const watcher = chokidar.watch('file, dir, glob');

const reg = {
	html: [/\.ihtml/,/\.html/],
	js: /\.js/,
	css: /\.css/,
	php: [/\.php/,/\.inc/]
};

var list = [];

for(let path of config.watch)
	list.push(npath.join(config.root,path));

function getFileType(ext) {
	for(let key in reg) {
		if(getType(reg[key]) == 'array') {
			for(let item of reg[key]) {
				if(item.test(ext))
					return key;
			}
		} else {
			if(reg[key].test(ext))
				return key;
		}
	}
	return null;
}

watcher.add(list);

watcher.on('add',path => {
	let info = npath.parse(path);
	log('file added:',info.base);
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

module.export = watcher;