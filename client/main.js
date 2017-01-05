(function() {

	var io = require('socket.io-client');

	var ui = require('./interface.js')();

	var is_local = window.location.origin.includes('localhost');

	var is_secure = window.location.protocol == 'https:';

	var non_local_url = window.location.protocol + '//localhost:' + (is_secure ? '3001' : '3000');

	var soc = io(is_local ? window.location.origin : non_local_url);

	//-----------------------------------------------------------------------------

	var doc_head = document.getElementsByTagName('head')[0];

	var doc_body = document.getElementsByTagName('body')[0];

	var doc_scripts = document.getElementsByTagName('script');

	var doc_links = document.getElementsByTagName('link');

	var page_ref = window.location.pathname.match(/\/mod\.php\/(\w+\/\w+\.)/);

	var snackbar_stylesheet = document.createElement('link');
	snackbar_stylesheet.rel = 'stylesheet';
	snackbar_stylesheet.type = 'text/css';
	snackbar_stylesheet.href = is_local ? '/assets/style/main.css' : non_local_url + '/assets/style/main.css';

	doc_head.appendChild(snackbar_stylesheet);

	var snackbar = document.createElement('div');
	snackbar.id = 'live-reload';
	snackbar.className = 'md-snackbar';

	doc_body.appendChild(snackbar);

	function log(...args) {
		args.unshift('live-reload:');
		console.log.apply(null,args);
	}

	function getNewUrl(original,new_hash) {
		var hash_reg = /[0-9]{10,}/;
		let base_url = original.replace(window.location.origin,'');
		let known_hash = base_url.substring(base_url.search(hash_reg));
		return base_url.replace(known_hash,new_hash.substring(0,10));
	}

	function sendNotification(text) {
		snackbar.textContent = text;
		snackbar.className = 'md-snackbar anim-forward';
		t1 = setTimeout(function() {
			snackbar.className = 'md-snackbar anim-reverse';
			clearTimeout(t1);
			t2 = setTimeout(function() {
				snackbar.className = 'md-snackbar';
				clearTimeout(t2);
			},200);
		},1750);
	}

	soc.on('update',res => {
		log('update from server',res);
		switch (res.type) {
			case 'php':
				log('reloading page');
				window.location.reload();
				break;
			case 'js':
				log('looking for script');
				var found_url = null;
				var script_ref = null;
				for(let item of doc_scripts) {
					if(item.src.includes(res.base)) {
						found_url = item.src;
						script_ref = item;
					}
				}
				if(found_url) {
					log('refreshing script');
					sendNotification('refreshing script '+res.base);
					let new_script = document.createElement('script');
					new_script.src = getNewUrl(found_url,res.time);
					new_script.async = true;
					new_script.id = Date.now();
					new_script.type = 'text/javascript';
					doc_head.appendChild(new_script);
					doc_head.removeChild(script_ref);
				}
				break;
			case 'css':
				log('looking for link');
				for(let item of doc_links) {
					if(item.href.includes(res.base)) {
						log('refreshing link');
						sendNotification('refreshing link '+res.base);
						item.href = getNewUrl(item.href,res.time);
					}
				}
				break;
			case 'html':
				log('reloading page');
				window.location.reload();
				break;
			default:

		}
	});

	// log('window top:',window.location);

	// log('window scripts:',window.parent.document.getElementsByTagName('script'));

})();
