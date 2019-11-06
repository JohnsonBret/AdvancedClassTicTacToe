var express = require('express');

var app = express();
var path = require('path');

app.use(express.static(__dirname + "/public"));

let gameBoard = {
    c1r1:"",
    c2r1:"",
    c3r1:"",
    c1r2:"",
    c2r2:"",
    c3r2:"",
    c1r3:"",
    c2r3:"",
    c3r3:"",
}

  
const port = 3000;

let playerOneWantsToPlayAgain = false;
let playerTwoWantsToPlayAgain = false;

const resetServerGameBoard = ()=>{

        gameBoard.c1r1 = "";        
        gameBoard.c2r1 = "";
        gameBoard.c3r1 = "";
        gameBoard.c1r2 = "";
        gameBoard.c2r2 = "";
        gameBoard.c3r2 = "";
        gameBoard.c1r3 = "";
        gameBoard.c2r3 = "";
        gameBoard.c3r3 = "";
}

const checkThreeInARow = (cell1, cell2, cell3)=>{

    if(cell1 === "X" && cell2 === "X" && cell3 === "X"){
        return true;
    }
    else if(cell1 === "O" && cell2 === "O" && cell3 === "O")
    {
        return true;
    }

    return false;
}

const checkWinner = ()=>{

    //HORIZONTAL
    if(checkThreeInARow(gameBoard.c1r1, gameBoard.c2r1, gameBoard.c3r1))
    {
        return true;
    }
    if(checkThreeInARow(gameBoard.c1r2, gameBoard.c2r2, gameBoard.c3r2))
    {
        return true;
    }
    if(checkThreeInARow(gameBoard.c1r3, gameBoard.c2r3, gameBoard.c3r3))
    {
        return true;
    }
    //VERTICAL
    if(checkThreeInARow(gameBoard.c1r1, gameBoard.c1r2, gameBoard.c1r3))
    {
        return true;
    }
    if(checkThreeInARow(gameBoard.c2r1, gameBoard.c2r2, gameBoard.c2r3))
    {
        return true;
    }
    if(checkThreeInARow(gameBoard.c3r1, gameBoard.c3r2, gameBoard.c3r3))
    {
        return true;
    }
    //DIAGONAL
    if(checkThreeInARow(gameBoard.c1r1, gameBoard.c2r2, gameBoard.c3r3))
    {
        return true;
    }
    if(checkThreeInARow(gameBoard.c3r1, gameBoard.c2r2, gameBoard.c1r3))
    {
        return true;
    }
    return false;
}

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

const resetWantsToPlayAgain = ()=>{
    playerOneWantsToPlayAgain = false;
    playerTwoWantsToPlayAgain = false;
}

const bothPlayersWantToPlayAgain = ()=>{
    if(playerOneWantsToPlayAgain == true && playerTwoWantsToPlayAgain == true)
    {
        return true;
    }
    else
    {
        return false;
    }
}
  
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
        resetWantsToPlayAgain();
        
    }
    else{``
        console.log("Too many players Joining!");
        socket.disconnect(true);
        numberOfPlayers--;
    }

    socket.on('playerMove', (message, playerNum)=>{
        console.log(`Player ${playerNum} Moved to ${message}`);

        if(playerNum === "PlayerOne")
        {
            gameBoard[message] = "X";
        }
        else{
            gameBoard[message] = "O";
        }
        console.log(JSON.stringify(gameBoard, undefined,2));

        if(checkWinner())
        {
            console.log(`${playerNum} has won the Game!`)
            io.emit('gameWon', playerNum);
        }


        io.emit('updateBoard', playerNum, message);
    });

    socket.on('playAgainRequest', (playerNum)=>{
        console.log(`Player ${playerNum} wants to play Again!`);

        if(playerNum === "PlayerOne")
        {
            playerOneWantsToPlayAgain = true;
        }
        else if(playerNum === "PlayerTwo")
        {
            playerTwoWantsToPlayAgain = true;
        }

        if(bothPlayersWantToPlayAgain())
        {
            io.emit('resetBoard');
            resetServerGameBoard();
        }
    });

    socket.on('quitRequest', (playerNum)=>{
        console.log(`Player ${playerNum} wants to Quit he is a quitter`);
    })
});

