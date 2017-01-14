const http = require('http');
const https = require('https');
const fs = require('fs');
const npath = require('path');
const url = require('url');

const express = require('express');
const session = require('express-session');
const store = require('session-file-store')(session);

const html = require('./html.js');
const csoc = require('./socket.js');
const watcher = require('./watcher.js');

const config = require('../config.json');

// variables-------------------------------------------------------------------

const app = express();

const app_session = {
	secret: 'live-reload',
	name: 'lr.sid',
	store: new store({
		path: '../stored_configs'
	}),
	cookie: {
		secure: true
	}
}

const ports = {
	http: 3000,
	https: 3001
};

const tls = {
	cert: fs.readFileSync('./tls/livereload.crt'),
	key: fs.readFileSync('./tls/livereload.key')
};

// methods---------------------------------------------------------------------

// express app-----------------------------------------------------------------

app.use('/assets',express.static(npath.join(process.cwd(),'assets')));

app.use(session(app_session));

app.get('/',function(req,res) {
	log('new client request');
	res.send(html());
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
