const http = require('http');

const fibo = (n) => {
	if (n === 0) return 0;
	if (n === 1) return 1;

	return fibo(n - 1) + fibo(n - 2);
}

const server = http.createServer((req, res) => {
	if (req.url === "/fibo") {
		res.write(String(fibo(40)));
		res.end();
	} if (req.url === "/echo") {
		res.setHeader("Content-Type", req.headers["content-type"]);
		req.pipe(res);

		/*if (req.method == 'POST') {
			var body = '';
	        req.on('data', function (data) {
	            body = body.concat(data);
	        });
	        req.on('end', function () {
	            console.log("Body: " + body);
	        });
	        res.writeHead(200, {'Content-Type': 'text/html'});
        	res.end('post received');
        }*/
	} else {
		res.write('salut');
		res.end();
	}
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(8000);