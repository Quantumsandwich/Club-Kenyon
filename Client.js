// MODIFIED JavaScript FOR Art SQL Database (from Phone Application Demo Program)
// MODIFIED BY: THEO PRENTICE, FOR ART DATABASE ASSIGNMENT  source: Jim Skon, Kenyon College, 2017-2018   
// THis code using Socket.io to talk to a Node.js programm running on the server.
// The port used for this MUST match the port used on the server side, and must note be a port
// used by anyone else.
var port='9669' // Must match port used on server, port>8000
var operation;	// operation
var selectid;
var recIndex
var socket = io.connect('http://cslab.kenyon.edu:'+port);
var rows;

//some things for controls
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;

var userID = 1;

// Set up events when page is ready
$(document).ready(function () {

    setInterval(sendPushed,100);
    
    // this is an event handler for a message on socket.io from the server side.
    // For this program is will be a reponse to a request from this page for an action
    socket.on('message', function(message) {
	// 'rows' message contains a set of matching rows from the database to be displayed
	// This is a response to a query
  	if (message.operation == 'rows') {
	    processResults(message.rows);
  	}
	// The Add message is call back after a request to add a new row to the phone directory
	// It creates a modal with the first and last name, and the status (success, failure) from the server.
	//It also clears out the data entered into the add fields
  	if (message.operation == 'Add') {
  	    $('#modalMessage').text($('#addfirst').val()+" "+$('#addlast').val()+ ": "+message.Status);
  	    $('#modalTitle').text("Record Add");
  	    $('#addchangemodal').modal('show');
  	    $('#addfirst').val("");
  	    $('#addlast').val("");
  	    $('#addphone').val("");
  	    $('#addtype').val("");
  	}
	// The update message is a response after asking the server to update a row.
	// Dispays the status message from the server in a modal
  	if (message.operation == 'update') {
  	    $('#modalMessage').text($('#editfirst').val()+" "+$('#editlast').val()+ ": "+message.Status);
  	    $('#modalTitle').text("Record Change");
  	    $('#addchangemodal').modal('show');
  	}
	// Displays a message after a record is delected
  	if (message.operation == 'delete') {
  	    $('#searchresults').text("Deleted: "+rows[recIndex].First+" "+rows[recIndex].Last);
  	}

    });


    
    
    operation = "Author"; // Default operation

    // Clear everything on startup
    $('.editdata').hide();
    $("#search-btn").click(getMatches);  // Search button click
    // do a search on every keystroke.
    /*$("#search").keyup(function(e){
	getMatches();
    });    */
    $("#add-btn").click(addEntry);    
    $("#clear").click(clearResults);

    //Handle pulldown menu
    $(".dropdown-menu li a").click(function(){
	$(this).parents(".btn-group").find('.selection').text($(this).text());
	operation=$(this).text().split(" ").pop();  // Get last word (Last, First, Type, New)
	//console.log("pick!"+operation);
	changeOperation(operation);
    });


    
});

$(document).keydown(function(e) {
    keyDownHandler(e);
    //e.preventDefault();
    console.log("keydown");
});
$(document).keyup(function(e) {
    keyUpHandler(e);
    //e.preventDefault();
    console.log("keyup");
});


function sendPushed(){

    if(leftPressed){
	socket.emit('message', {
	    operation: "keypress",
	    userID: userID,
	    button: "left"
	});
    }
    if(rightPressed){
	socket.emit('message', {
	    operation: "keypress",
	    userID: userID,
	    button: "right"
	});
    }
    if(upPressed){
	socket.emit('message', {
	    operation: "keypress",
	    userID: userID,
	    button: "up"
	});
    }
    if(downPressed){
	socket.emit('message', {
	    operation: "keypress",
	    userID: userID,
	    button: "down"
	});}
    
    
   
    
}
    
    function keyDownHandler(e){
	if(e.keyCode == 39){
	    rightPressed = true;
	}
	else if(e.keyCode == 37){
	    leftPressed = true;
	}
	else if(e.keyCode == 38){
	    upPressed = true;
	}
	else if(e.keyCode == 40){
	    downPressed = true;
	}
    }

    function keyUpHandler(e){
	if(e.keyCode == 39){
	    rightPressed = false;
	}
	else if(e.keyCode == 37){
	    leftPressed = false;
	}
	else if(e.keyCode == 38){
	    upPressed = false;
	}
	else if(e.keyCode == 40){
	    downPressed = false;
	}
    }



// This processes the results from the server after we have sent it a lookup request.
// This clears any previous work, and then calls buildTable to create a nice
// Table of the results, and pushes it to the screen.
// The rows are all saved in "rows" so we can later edit the data if the user hits "Edit"
function processResults(results) {
    $('#editmessage').empty();
    $('#addmessage').empty();
    //console.log("Results:"+results);
    $('#searchresults').empty();
    $('#searchresults').append(buildTable(results));
    rows=results;  // Save everything for delete
 
    
}
changeOperation(operation);

// This function is called when an option is selected in the pull down menu
// If the option is "Add New" the shows the add form, and hides the others
// Otherwise it shows the results div
function changeOperation(operation){
    if(operation=="New"){
	$('#addmessage').val("");
	$('.inputdata').show();
	$('.searchbox').hide();
	$('.results').hide();
	$('.editdata').hide();}
    else{
	$('.editdata').hide();
	$('.inputdata').hide();
	$('.results').show();
	$('.searchbox').show();
    }	 
}

// Build output table from comma delimited data list from the server (a list of phone entries)
function buildTable(rows) {
    //if (rows.length < 1) {
	//return "<h3>Nothing Found</h3>";
    //} else {
	//var result = '<table class="w3-table-all w3-hoverable" border="2"><tr><th>Author</th><th>Title</th><th>Technique</th><th>School</th><th>Action</th><tr>';
	
	
	//please pardon this horrendous list, I had no time to do it another way
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#FFFFFF';
	ctx.fillRect(0,0,1000,563);
	//really, I'm sorry about the furniture
	
	//blackboard
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#000000';
	ctx.fillRect(30,20,930,50);
	
	
	//The tables (THIS ONE'S A LONG ONE)
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#A9A9A9';
	ctx.fillRect(50,300,150,30);
	
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#A9A9A9';
	ctx.fillRect(50,360,150,30);
	
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#A9A9A9';
	ctx.fillRect(50,420,150,30);
	
	
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#A9A9A9';
	ctx.fillRect(300,300,150,30);
	
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#A9A9A9';
	ctx.fillRect(300,360,150,30);
	
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#A9A9A9';
	ctx.fillRect(300,420,150,30);
	
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#A9A9A9';
	ctx.fillRect(550,300,150,30);
	
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#A9A9A9';
	ctx.fillRect(550,360,150,30);
	
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#A9A9A9';
	ctx.fillRect(550,420,150,30);
	
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#A9A9A9';
	ctx.fillRect(800,300,150,30);
	
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#A9A9A9';
	ctx.fillRect(800,360,150,30);
	
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#A9A9A9';
	ctx.fillRect(800,420,150,30);
	
	//The windows
	//ome set
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#ADD8E6';
	ctx.fillRect(980,380,7,50);
	
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#ADD8E6';
	ctx.fillRect(980,320,7,50);
	
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#ADD8E6';
	ctx.fillRect(980,260,7,50);
	//another set
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#ADD8E6';
	ctx.fillRect(980,180,7,50);
	
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#ADD8E6';
	ctx.fillRect(980,120,7,50);
	
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#ADD8E6';
	ctx.fillRect(980,60,7,50);
	
	
	//the door
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = '#FFE4B5';
	ctx.fillRect(0,150,10,40);
	
	
	
	//this is the part that determines the characters themselves
	for (var i=0;i<rows.length;i++) {
	    console.log("row:"+JSON.stringify(rows[i]));
		
		//console.log("the thing is: "+rows[i].posX);
		//GETS THE MESSAGE
		getMessage();
		
		var canvas = document.getElementById('myCanvas');
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = '#000000';
		ctx.fillRect(rows[i].posX,rows[i].posY,20,20);
		
		//console.log("before printing: "+rows[i].lastMessage);
		
		getMessage;
		
		//console.log("before printing: "+rows[i].displayed);
		
		//rows[i].displayed = 1;
		
		//if (rows[i].displayed == 1) {
			var canvas = document.getElementById("myCanvas");
			var ctx = canvas.getContext("2d");
			ctx.font = "10px Arial";
			ctx.fillText(rows[i].lastMessage,rows[i].posX,rows[i].posY-10);
			//console.log("after printing: "+rows[i].lastMessage);
			
		//}
		
		/*
	    result += "<tr><td class='Author'>"+rows[i].Author+"</td><td class='Title'>"+rows[i].Title+"</td><td class='Technique'>"+rows[i].Technique+"</td><td class='School'>"+rows[i].School+"</td><td class='School'>"+rows[i].URL+"</td>";
	    result += "<td><button type='button' ID='"+rows[i].RecNum+"' class='btn btn-primary btn-sm edit'>notes</button> ";
	    result += "<button type='button' ID='"+rows[i].RecNum+"' Index='"+i+"' class='btn btn-primary btn-sm delete'>display</button></td></tr>";	
		*/
	}
	//CLEAR THE CANVAS
	
	
	
	//result += "</table>";
	
	// was "result"return 1; 
    }

// Called when the user clicks on the Edit button on the results list from a search
// This clears the search  results and shows the edit form, filling it in with the data from the associated record.
// We get the "row" node for $(this) so we have the tight record to edit
// Since this is a result of a button click, we look up the 'ID' of '$(this)' to get the ID of the record to edit
// The record ID is then saved in selectID so we know which record to update with the save button is pushed
// We fill in the edit form with the data from the record from this row.
function processEdit(){
    $('#searchresults').empty();
    $('.editdata').show();
    $("#edit-btn").click(updateEntry);
    //console.log("Edit Record: " + $(this).attr('ID'));
    var row=$(this).parents("tr");
    //console.log("First name of record: "+ $(row).find('.first').text());
    selectid=$(this).attr('ID');
    
    $('#editfirst').val( $(row).find('.first').text());
    /*$('#editlast').val( $(row).find('.last').text());
    $('#editphone').val( $(row).find('.phone').text());
    $('#edittype').val( $(row).find('.type').text());*/
}
// This is called when the "Save" button in the edit form is pressed.
// It takes the updated data, and the saves "selectid", and sends the record to the server
// ot update the database.
function updateEntry(){
    //console.log("Edit: Firstname:" + $('#editfirst').val() + "ID:" + selectid);
    $('#searchresults').empty();
    socket.emit('message', {
    	operation: "Update",
    	First: $('#editfirst').val(),
    	Last: $('#editlast').val(),
    	Phone: $('#editphone').val(),
    	Type: $('#edittype').val(),
    	RecNum: selectid
    });	
}

// This is called when the user hits the "Add button" in the add screen.
// It calls the server with the fields they entered.
function addEntry(){
    $('#searchresults').empty();
    //console.log("Add:"+$('#addlast').val());
    socket.emit('message', {
    	operation: "New",
    	First: $('#addfirst').val(),
    	Last: $('#addlast').val(),
    	Phone: $('#addphone').val(),
    	Type: $('#addtype').val()
    });	
}

function sendKeypress(userID, e){
    socket.emit('message', {
	operation: "keypress",
	userID: userID,
	button: e.keyCode
    });
    console.log("sent message about move");
}
	
	
// This is called when the user clicks on a "Delete" button on a row matches from a search.
// It puts up a modal asking the user to confirm if they really want to delete this record.  If they
// hit "Delete record", the processDelete function is called to do the delete.


// Calls the server with a recordID of a row to delete
function processDelete(){
    var id=$(this).attr('ID');
    socket.emit('message', {
    	operation: "Delete",
    	RecNum: selectid
    });	
}

// Clears the search results area on the screen
function clearResults() {
    $('#searchresults').empty();
}

// Called when the user hits the "Search" button.
// It sends a request to the server (operation,search string),
// Where operation is one of (Last, First, Type) 
function getMatches(){
    $('.editdata').hide();
    userID = $('#search').val();
   
  
}

function getMessage(){
    $('.editdata').hide();
    var userMessage = $('#myMessage').val();
	console.log("this is the first test: "+userMessage+" cool    ");
    sendMessage(userMessage)
  
}


//call this function to send a message to the server
//argument is the content of the message
function sendMessage(theMessage){
    socket.emit('message', {
	operation: "keypress",
	userID: userID,
	button: "send",
	text: theMessage
    });
    console.log("User with ID: "+userID+" sent message: "+theMessage+" to the server.");
}


	



	
