var mysql = require('mysql');
var http = require('http');
var fs = require('fs');



//Some gameplay related variables
var deltaX = 5;
var deltaY = 5;

var canvasHeight = 563;
var canvasWidth = 1000;

var charHalfWidth = 5;
var charHalfHeight = 10;
var leftEdge = 0 + charHalfWidth;
var rightEdge = canvasWidth - charHalfWidth;
var topEdge = 0 + charHalfHeight;
var bottomEdge = canvasHeight - charHalfHeight;



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
  //console.log(url + "  :  " + ext);
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


    function daLoop(){
    query = "SELECT * FROM clubKenyon WHERE changed=0";
    console.log("looped query is working");
    sendQueryResults(query, socket);
    }

    setInterval(daLoop,1000);

//this variable will be used to pull things out of a function
var output;
    
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
	if (message.operation == 'keypress'){
	
	//query = "SELECT * FROM clubKenyon WHERE changed=0";
	//console.log("query is: "+query);
	//sendQueryResults(query, socket);

	    query = "SELECT posX, posY FROM clubKenyon WHERE ID='"+message.userID+"'";

	    con.query(query, function (err, result, fields) {
		//if (err) throw err;
		if (err) console.log("error on line 126");
		var results = [];
		Object.keys(result).forEach(function(key) {
		    var row = result[key];
		    results.push(row);
		});
		console.log(results);
		console.log("posX: "+results[0].posX);

		if (message.button == 'left'){
		    var potentialX =  results[0].posX * 1 - deltaX;
		    if (potentialX < leftEdge){
			io.to(socket.id).emit('message', {
			    userID: message.userID,
			    result: 'failure'
			});
		    }
		    else {
			query = "UPDATE clubKenyon SET posX = '"+potentialX+"' WHERE ID='"+message.userID+"'";
			con.query(query, function (err, result, fields) {
			    if (err) throw err;
			    console.log("new x is: "+potentialX);
			});
		    }
				  
		}
		else if (message.button == 'right'){
		    var potentialX =  results[0].posX * 1 + deltaX;
		    if (potentialX > rightEdge){
			io.to(socket.id).emit('message', {
			    userID: message.userID,
			    result: 'failure'
			});
		    }
		    else {
			query = "UPDATE clubKenyon SET posX = '"+potentialX+"' WHERE ID='"+message.userID+"'";
			con.query(query, function (err, result, fields) {
			    if (err) throw err;
			    console.log("new x is: "+potentialX);
			});
		    }
				  
		}
		else if (message.button == 'up'){
		    var potentialY =  results[0].posY * 1 - deltaY;
		    if (potentialY < topEdge){
			io.to(socket.id).emit('message', {
			    userID: message.userID,
			    result: 'failure'
			});
		    }
		    else {
			query = "UPDATE clubKenyon SET posY = '"+potentialY+"' WHERE ID='"+message.userID+"'";
			con.query(query, function (err, result, fields) {
			    if (err) throw err;
			    console.log("new y is: "+potentialY);
			});
		    }
				  
		}
		else if (message.button == 'down'){
		    var potentialY =  results[0].posY * 1 + deltaY;
		    if (potentialY > bottomEdge){
			io.to(socket.id).emit('message', {
			    userID: message.userID,
			    result: 'failure'
			});
		    }
		    else {
			query = "UPDATE clubKenyon SET posY = '"+potentialY+"' WHERE ID='"+message.userID+"'";
			con.query(query, function (err, result, fields) {
			    if (err) throw err;
			    console.log("new y is: "+potentialY);
			});
		    }
				  
		}
	    });


	    /*
	    console.log(output);
	    process.nextTick( () => {
		console.log(output.posX);
	    });
	    
	    */

	    
	    console.log("userID is: "+message.userID+" and button pressed is: "+message.button);

	}

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
			console.log(row.ID+" "+row.sprite+" "+row.posX+" "+row.posY+" ");	    	
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
