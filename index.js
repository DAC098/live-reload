const start = process.hrtime();

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
    let now = process.hrtime(start);
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

global.log = log;

global.getType = getType;

require('./server/svr.js');
