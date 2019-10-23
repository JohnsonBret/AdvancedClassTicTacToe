var express = require('express');

var app = express();
var path = require('path');

app.use(express.static(__dirname + "/public"));

  
const port = 3000;

app.get('/', (req, res)=>{

    res.status(200).sendFile(path.join(__dirname, 'index.html'));
});


var server = app.listen(port, ()=>{
    console.log(`App started on ${port}`);
});

var io = require('socket.io').listen(server); 

let numberOfPlayers = 0;

let playerOneID = "";
let playerTwoID = "";
  
io.on('connection', function(socket){
    console.log(`a user connected Socket ID: ${socket.id}`);

    numberOfPlayers++;

    if(numberOfPlayers == 1)
    {
        playerOneID = socket.id;
        io.emit('playerNumber', 'PlayerOne');
        
    }
    else if(numberOfPlayers == 2)
    {
        playerTwoID = socket.id;
        io.emit('playerNumber', 'PlayerTwo');
        io.emit('gameStart'); 
    }
    else{``
        console.log("Too many players Joining!");
        socket.disconnect(true);
        numberOfPlayers--;
    }

    socket.on('playerMove', (message, playerNum)=>{
        console.log(`Player ${playerNum} Moved to ${message}`);


        io.emit('updateBoard', playerNum, message);
    });
});

