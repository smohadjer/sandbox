var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

const server = http.createServer((req, res) => {
    const form = formidable({ 
        multiples: true,
        maxFileSize: 30 * 1204 * 1024,
        keepExtensions: true
    });

    form.on('file', function(field, file) {
        fs.rename(file.path, "./upload/" + file.name, function(error) {
            console.log(error);
        });
    });
 
    form.parse(req, (err, fields, files) => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ fields, files }, null, 2));
    });
});

server.listen(3001, () => {
    console.log('Server listening on http://localhost:3001/ ...');
  });