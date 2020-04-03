let board = document.getElementById("board");
let boardWidth = 20;
let boardHeight = 20;

let numberOfMines = 1;
let numberOfFoundMines = 0;

const checkIfAllMinesFound = ()=>{
    if(numberOfFoundMines == numberOfMines)
    {
        alert("You Found all the Mines!  You Win!");
    }
}


const randomlyPlaceMines = ()=>{
    for(let i = 0; i < numberOfMines; i++)
    {
        let row = Math.floor(Math.random() * boardWidth) + 1;
        let column = Math.floor(Math.random() * boardHeight) + 1;
        console.log(`Placing Mine on ->Row: ${row} Column: ${column} i is: ${i}`);

        let mineCell = document.getElementById(`x${column}y${row}`);

        //Contains a hidden mine? redo the random numbers and try and place mine again
        if(!mineCell.classList.contains("hiddenMine"))
        {
            mineCell.classList.add("hiddenMine");
        }
        else{
            i = i - 1;
            console.log("Double Mine - Go Again", i);
        }
        
    }
}

const colorCellNumberBasedOnDanger = (cellNum, paragraph)=>{

    let color = "";

    if(cellNum == 1)
    {
        color = "blue";
    }
    else if(cellNum == 2)
    {
        color = "purple";
    }
    else if(cellNum == 3)
    {
        color = "orange";
    }
    else if(cellNum >= 4)
    {
        color = "red"
    }
    paragraph.style.color = color;
}

const countAdjacentMines = ()=>{
    for(let i = 1; i <= boardWidth; i++)
    {
        for(let j = 1; j <= boardHeight; j++)
        {
            let minesAdjacentToCurrentCell = 0;

            for(let x = -1; x <= 1; x++)
            {
                for(let y = -1; y <= 1; y++)
                {
                    let cellX = i + x;
                    let cellY = j + y;

                    if(cellX < 1 || cellX > boardWidth)
                    {
                        continue;
                    }
                    if(cellY < 1 || cellY > boardHeight)
                    {
                        continue;
                    }

                    let checkedAdjacentCell = document.getElementById(`x${cellX}y${cellY}`);
                    if(checkedAdjacentCell.classList.contains("hiddenMine"))
                    {
                        minesAdjacentToCurrentCell++;
                    }
                }
            }

            let currentCell = document.getElementById(`x${i}y${j}`);

            let paragraphMineCount = document.createElement("p");
            //Comment this line out to see all the numbers and mines
            paragraphMineCount.style.display = "none";

            if(currentCell.classList.contains("hiddenMine"))
            {
                paragraphMineCount.innerHTML = "M";
            }
            else
            {
                paragraphMineCount.innerHTML = minesAdjacentToCurrentCell;
                colorCellNumberBasedOnDanger(minesAdjacentToCurrentCell, paragraphMineCount)
            }
            // paragraphMineCount.style.visibility = "hidden";
            currentCell.appendChild(paragraphMineCount);
        }
    }
}

const changeToRevealColorScheme = (clickedSquare)=>{
    if(clickedSquare.classList.contains("lightgreen"))
    {
        clickedSquare.classList.remove("lightgreen");
        clickedSquare.classList.add("lightskin");
    }
    else{
        clickedSquare.classList.remove("mediumgreen");
        clickedSquare.classList.add("darkskin");
    }
}

const checkAdjacentSquaresForZeroes = async (zeroCell)=>{
    let cellId = zeroCell.getAttribute("id");
    
    let c = parseInt(cellId.substring(cellId.lastIndexOf("x") + 1,cellId.lastIndexOf("y")));
    let r = parseInt(cellId.substring(cellId.lastIndexOf("y") + 1, cellId.length));
    
    console.log(`Checking cell at x${c} y${r}`);

    for(let x = -1; x <= 1; x++)
    {
        for(let y = -1; y <= 1; y++)
        {
            if(x == 0 && y == 0)
            {
                continue;
            }

            let cellx = c + x;
            let celly = r + y;
            if(cellx < 1 || cellx > 20)
            {
                continue;
            }
            if(celly < 1 || celly > 20)
            {
                continue;
            }
            
            let checkedAdjacentCell = document.getElementById(`x${cellx}y${celly}`);
            console.log(`Zero Checking cell at ${cellx} : ${celly}`);
            if(checkedAdjacentCell.children[0].innerHTML == "0")
            {
                console.log("It is Zero!")
                if(checkedAdjacentCell.children[0].style.display == "none")
                {
                    if(checkedAdjacentCell.classList.contains("flag"))
                    {
                        checkedAdjacentCell.classList.remove("flag");
                    }

                    checkedAdjacentCell.children[0].style.display = "block";
                    checkedAdjacentCell.children[0].style.visibility = "hidden";
                    changeToRevealColorScheme(checkedAdjacentCell);
                    checkAdjacentSquaresForZeroes(checkedAdjacentCell);
                }
                else{
                    console.log(`I am already not display none X${cellx} Y${celly}`);
                }
            }
            else if(checkedAdjacentCell.children[0].innerHTML == "M")
            {

            }
            else{

                if(checkedAdjacentCell.classList.contains("flag"))
                {
                    checkedAdjacentCell.classList.remove("flag");
                }

                checkedAdjacentCell.children[0].style.display = "block";
                changeToRevealColorScheme(checkedAdjacentCell);
            }
        }
    }
}

const revealSquare = async(clickedSquare)=>{
    console.log(`Revealed Square ${clickedSquare.getAttribute("id")}`);

    if(clickedSquare.children[0])
    {
        clickedSquare.children[0].style.display = "block";
        console.log(clickedSquare.children[0].innerHTML);

        changeToRevealColorScheme(clickedSquare);


        if(clickedSquare.children[0].innerHTML == "0")
        {
            console.log("Its Zero!")
            clickedSquare.children[0].style.visibility = "hidden";
            checkAdjacentSquaresForZeroes(clickedSquare);
        }
    }
}

const setupBoard = ()=>{
    
    for(let x = 1; x < boardWidth + 1; x++)
    {
        for(let y = 1; y < boardHeight + 1; y++)
        {
            let cellDiv = document.createElement("div");

            cellDiv.style.gridColumn = `${x}/${x+1}`;
            cellDiv.style.gridRow = `${y}/${y+1}`;
            
            cellDiv.setAttribute("id", `x${x}y${y}`);

            if(y % 2 == 0)
            {
                if(x % 2 == 0)
                {
                    cellDiv.classList.add("lightgreen");
                }
                else{
                    cellDiv.classList.add("mediumgreen");
                }
            }
            else{
                if(x % 2 == 0)
                {
                    cellDiv.classList.add("mediumgreen");
                }
                else{
                    cellDiv.classList.add("lightgreen");
                }
            }

            cellDiv.addEventListener("click", (event)=>{
                console.log(`Clicked cell X${x} Y${y}`);

                if(event.shiftKey)
                {
                    if(event.target.classList.contains("flag"))
                    {
                        event.target.classList.remove("flag");
                        if(event.target.classList.contains("hiddenMine"))
                        {
                            numberOfFoundMines--;
                        }
                    }
                    else{
                        if(event.target.children[0]== undefined)
                        {
                            return;
                        }
                       
                        if(event.target.children[0].style.display == "none")
                        {
                            event.target.classList.add("flag");
    
                            if(event.target.classList.contains("hiddenMine"))
                            {
                                numberOfFoundMines++;
                                console.log("Marked Mine", numberOfFoundMines);
                                checkIfAllMinesFound();
                            }
                        }   
                    }
                }//Digging for mines
                else{
                    if(event.target.classList.contains("flag"))
                    {
                        console.log("You clicked a flag - nothing happens...");
                    }
                    else if(event.target.classList.contains("hiddenMine"))
                    {
                        event.target.classList.add("showMine");
                        setTimeout(()=>{
                            alert("GAME OVER - You Blew up!");
                            location.reload();
                        }, 1000);
                        
                    }
                    else{
                        revealSquare(event.target);
                    }
                }
            });
            board.appendChild(cellDiv);
        }
    }
}

setupBoard();
randomlyPlaceMines();
countAdjacentMines();