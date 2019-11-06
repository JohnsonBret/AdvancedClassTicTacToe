var socket = io('/');

let clientPlayerNumber = "";
let isGameStarted = false; 


const showWinOverlay = (winner)=>{
    let winOverlay = document.getElementById("winSection");
    winOverlay.style.display = "block";
    document.getElementById("winner").innerHTML = winner;
}
 
socket.on('playerNumber', function (data) {
    
    if(clientPlayerNumber === "")
    {
        clientPlayerNumber = data;
        console.log(`Player Number ${data}`);
  
    }
});

socket.on('gameStart', ()=>{
    isGameStarted = true;
    console.log(`Game Started is ${isGameStarted}`);
    updateTurnDisplay(); 
});

socket.on('gameWon', (playerNum)=>{
    isGameStarted = false;
    console.log(`${playerNum} has won the game!`)
    showWinOverlay(playerNum);
});

socket.on('resetBoard', ()=>{
    let boardCells = document.getElementsByClassName("cell");
    let boardCellsArray = Array.from(boardCells);

    for(let i = 0; i < boardCellsArray.length; i++)
    {
        boardCellsArray[i].innerHTML = "";
    }

    isGameStarted = true;
    // isPlayerOneTurn = true;
});

const updateTurnDisplay = ()=>{
    let turnDisp = document.getElementById("turnDisplay");
    let turnString = `It's ${isPlayerOneTurn ? "X's" : "O's"} turn.`;
    turnDisp.innerHTML = turnString;
}

socket.on('updateBoard', (playerNum, cell)=>{
    console.log(`Update Board Player ${playerNum} moved to ${cell}`);

    if(clientPlayerNumber === playerNum)
    {
        console.log("I'm not updating my own board! I already moved!");
        return;
    }

    isPlayerOneTurn = isPlayerOneTurn ? false : true;

    updateTurnDisplay();

    let cellToUpdate = document.getElementById(cell);

    if(playerNum == "PlayerOne")
    {
        cellToUpdate.innerHTML = "X";
    }
    else{
        cellToUpdate.innerHTML = "O";
    }

});

let isPlayerOneTurn = true; 

const onCellClicked = (cell)=>{

    if(!isGameStarted)
    {
        alert("The game isn't started!");
        return;
    }

    if(cell.innerHTML != "")
    {
        alert(`Hey Dummy ${cell.innerHTML} is already in that cell!`);
        return;
    }

    if(isPlayerOneTurn && clientPlayerNumber === "PlayerTwo")
    {
        alert(`It's not your turn ${clientPlayerNumber}`)
        return;
    }

    if(!isPlayerOneTurn && clientPlayerNumber === "PlayerOne")
    {
        alert(`It's not your turn ${clientPlayerNumber}`)
        return;
    }

    isPlayerOneTurn ? cell.innerHTML = "X" : cell.innerHTML = "O";
    isPlayerOneTurn = isPlayerOneTurn ? false : true;

    updateTurnDisplay();

    socket.emit('playerMove', cell.id, clientPlayerNumber, ()=>{
        console.log("Emitting Player Move Event")
        
    });

}


let cells = document.getElementsByClassName("cell");

let cellArray = Array.from(cells);

for(let i = 0; i < cellArray.length; i++)
{
    cellArray[i].addEventListener("click", (event)=>{
        console.log(`You Clicked me I am a Cell ${cellArray[i].id}`);
        onCellClicked(event.target);
    });
}

let playAgainBtn = document.getElementById("playAgain");

playAgainBtn.addEventListener("click", ()=>{
    console.log(`${clientPlayerNumber} wants to play Again`);

    socket.emit('playAgainRequest', clientPlayerNumber, ()=>{
        console.log("Emitting Play again event");
    });

    let winSect = document.getElementById("winSection");
    winSect.style.display = "none";

});

let quitBtn = document.getElementById("quit");

quitBtn.addEventListener("click", ()=>{
    console.log(`${clientPlayerNumber} wants to quit`);

    socket.emit('quitRequest', clientPlayerNumber, ()=>{
        console.log("Emitting quit event");
    });

    let winSect = document.getElementById("winSection");
    winSect.style.display = "none";
});
