const http = require('http');
const hostname = '127.0.0.1';
const port = 3001;
const server = http.createServer((request, response) => {
    request.statusCode = 200;
    //request.setHeader('Content-Type', 'text/plain');

    //console.log(req.body);
    //res.end(req.body);
    if (request.method == 'POST') {
    var body = '';

    request.on('data', function (data) {
        body += data;
    });

    request.on('end', function () {
        console.log(body);
        // use post['blah'], etc.
    });
    }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});