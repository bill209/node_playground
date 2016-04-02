// required module for web server
var http = require('http');
var fs = require('fs');
const PORT=8081;

console.log("server is starting up");

// instantiate the server
var server = http.createServer(function(req, res){
	displayForm(res);
});

// start the server
server.listen(PORT, function(){
	// success callback
	console.log("Server listening on: http://localhost:%s", PORT);
});

// handles http requests and responses
function handleRequest(request, response){
	response.end("don't get too excited. this was really simple. : P");
}

function displayForm(res) {
    fs.readFile('index.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}