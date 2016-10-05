const net = require('net')
const minimist = require('minimist')
const debug = require('debug')('socket');

const argv = minimist(process.argv.slice(2))
const PORT = Number(argv.port) || 7777
const REMOTE = Number(argv.remote)

const PAN = 'PAN'
const CLIC = 'CLIC'

const BULLETS = 1
const CHAMBERS = 6

function getShot () {
	return Math.random() < BULLETS / CHAMBERS ? PAN : CLIC
}

function shoot (c) {
	const shot = getShot()
	debug('↑', shot)
	c.write(shot + '\n')
}

function createServer () {
	const server = net.createServer(onConnection)

	server.on('error', (err) => {
		console.error('server error', err)
	})

	server.listen(PORT, () => {
		debug('Ready on port', PORT)
	})

	return server
}

function onConnection (c) {
	c.on('data', (chunk) => {
		const data = String(chunk).trim()
		debug('↓', data)
		switch (data) {
			case PAN:
				console.log('Arrrggg…')
				if (server) {
					server.close()
				}
				process.exit(0)
				break;

			case CLIC:
				shoot(c)
				break;
		}
	})
}

function createClient () {
	const client = net.connect(REMOTE, () => {
		onConnection(client)
		shoot(client)
	})

	client.on('error', (err) => {
		console.error('client', err)
	})

	return client
}

let server, client
if (REMOTE) {
	client = createClient()
} else {
	server = createServer()
}