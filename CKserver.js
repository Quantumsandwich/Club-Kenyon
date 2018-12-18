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
  if (url == "/") url = "/Project5Prototype.html";
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

// When a client connects, we note it in the console
io.sockets.on('connection', function(socket) {
  // watch for message from client (JSON)
    socket.on('message', function(message) {

	//I removed the old content from here via comment

	/*
	
      //console.log('Client Command:'+message.operation);
    if (message.operation == 'Author') {
      query = "SELECT * FROM art WHERE Author like '%"+message.searchText+"%' AND Form like '"+message.formText+"' AND Type like '"+message.typeText+"'";
      sendQueryResults(query, socket);
    } else if (message.operation == 'Title') {
      query = "SELECT * FROM art WHERE Title like '%"+message.searchText+"%' AND Form like '"+message.formText+"' AND Type like '"+message.typeText+"'";
      sendQueryResults(query, socket);
    } else if (message.operation == 'Technique') {
      query = "SELECT * FROM art WHERE Technique like '%"+message.searchText+"%' AND Form like '"+message.formText+"' AND Type like '"+message.typeText+"'";
      sendQueryResults(query, socket);
    } else if (message.operation == 'School') {
      query = "SELECT * FROM art WHERE School like '%"+message.searchText+"%' AND Form like '"+message.formText+"' AND Type like '"+message.typeText+"'";
      sendQueryResults(query, socket);
    } else if (message.operation == 'Notes') {
      query = "UPDATE art SET Notes='"+message.Notes+"' WHERE URL='"+message.URL+"'";
      UpdateRow(query, socket);
    }
     // console.log("query is: "+query);

     */
	
	query = "SELECT * FROM clubKenyon WHERE changed=0";
	console.log("query is: "+query);
	sendQueryResults(query, socket);

  });
});

// Perform search, send results to caller
function sendQueryResults(query,socket) {
	console.log(query);
    con.query(query, function (err, result, fields) {
		if (err) throw err;
		var results = [];
		Object.keys(result).forEach(function(key) {
			var row = result[key];
			results.push(row);
			//console.log(row.First+" "+row.Last+", Phone:"+row.Phone+"  ["+row.Type+"]");	    	
		});
		socket.emit('message', {
    		operation: 'rows',
    		rows: results
    	});
	});
}

// Add record
function AddRow(query,socket) {
	//console.log(query);
    con.query(query, function (err, result, fields) {
		if (err) throw err;
		socket.emit('message', {
    		operation: 'Add',
    		Status: "Row Added"
    	});
	});
}
// Delete record
function DeleteRow(query,socket) {
	//console.log(query);
    con.query(query, function (err, result, fields) {
		if (err) throw err;
		socket.emit('message', {
    		operation: 'delete',
    		Status: "Row Deleted"
    	});
	});
}

// update record
function UpdateRow(query,socket) {
	//console.log(query);
    con.query(query, function (err, result, fields) {
		if (err) throw err;
		socket.emit('message', {
    		operation: 'update',
    		Status: "Record Updated"
    	});
	});
}
server.listen(port);
console.log("Listening on port: "+port);
