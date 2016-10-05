const sio = require('socket.io');

module.exports = (server) => {
	const io = sio(server);

	io.on('connection', (socket) => {
		console.log("New socket connection");

		socket.on('message', ([a, b]) => {
			socket.emit('message', `Ca fait ${a + b}`)
		})
	});

	return server;
}