var mysql = require('mysql');
var http = require('http');
var fs = require('fs');


//Everyone must use own port > 8000
// Must Match client side port setting
var port = 9669; //Ben changed the port to 9669 for CK server

// Login to MySQL
var con = mysql.createConnection({
    host: "localhost",	//Ben edited the user, password, and database fields.
    user: "gross3",
    password: "thisPasswordIsNotSecure",
    database: "gross3"
});
con.connect(function(err) {
    	if (err) throw err;
});

// Set up the node.js Web server
var server = http.createServer(function(req, res) {
  var url = req.url;
  // If no path, get the index.html
  if (url == "/") url = "/clubKenyon.html";
  // get the file extension (needed for Content-Type)
  var ext = url.split('.').pop();
  console.log(url + "  :  " + ext);
  // convert file type to correct Content-Type
  var mimeType = 'text/html'; // default
  switch (ext) {
    case 'css':
      mimeType = 'text/css';
      break;
    case 'png':
      mimeType = 'text/png';
      break;
    case 'jpg':
      mimeType = 'text/jpeg';
      break;
    case 'js':
      mimeType = 'application/javascript';
      break;
  }
  // Send the requested file
  fs.readFile('.' + url, 'utf-8', function(error, content) {
  res.setHeader("Content-Type", mimeType);
  res.end(content);
  });
});

// Set up socket.io communication
var io = require('socket.io').listen(server);


io.sockets.on('connection', function(socket){
	console.log('userconnection');
	socket.on('message', function(message) {
		if(message.operation == 'xmove') {
			socket.emit('userXmove', {
				operation: 'xmove',
				name: message.'
		}
		if(message.operation == 'ymove') {
		}
		if(message.operation == 'speech') {
		}
		if(message.operation == 'fullRequest') {
		}
	});
});