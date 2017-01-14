/**
 * Created by dac098 on 1/13/17.
 */
const sio = require('socket.io');

const csoc = new sio();

csoc.on('connection',(socket) => {
	log('client socket connected');

	socket.on('disconnect',() => {
	   log('client disconnected');
	});

});

module.exports = csoc;