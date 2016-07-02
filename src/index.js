let http = require('http');
let request = require('request');

let port = process.env.PORT || 8080;
var sizeLimit = process.env.SIZE_LIMIT || 2e6; // 2MB

let server = http.createServer(corsRequest);

server.listen(port);

function corsRequest(req, res) {
	console.log(`Sending request to: ${req.url.substring(1)}`);

	res.setTimeout(25000);
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', false);
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader('Expires', new Date(Date.now() + 86400000).toUTCString());

	let size = 0;

	try {
		request.get({
			url: req.url.substring(1),
			encoding: null,
			rejectUnauthorized: false,
			headers: {
				'accept-encoding': 'gzip'
			}
		})
		.on('data', chunk => {
			size += chunk.length;
			if(sizeLimit && size > sizeLimit) {
				res.writeHead(413);
				res.end();
			}
		})
		.on('end', () => {
			console.log(`Request for ${req.url}, size: ${size} bytes`);
		})
		.on('error', error => {
			res.writeHead(500);
			res.write(error.toString());
			res.end();
		})
		.pipe(res);
	} catch(error) {
		res.writeHead(500);
		res.write(error.toString());
		res.end();
	}
}
