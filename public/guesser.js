let guessButton = document.getElementById("guessBtn");
let correctButton = document.getElementById("correct");
let wrongButton = document.getElementById("wrong");

let guessResultMessage = document.getElementById("guessResult");



const showResultDiv = ()=>{
    let resDiv = document.getElementById("resultDiv");
    resDiv.style.display = "block";
}

const showGuessDiv = ()=>{
    let guessDivider = document.getElementById("guessDiv");
    guessDivider.style.display = "flex";
}

const hideResultDiv = ()=>{
    let resDiv = document.getElementById("resultDiv");
    resDiv.style.display = "none";
}

const hideGuessDiv = ()=>{
    let guessDivider = document.getElementById("guessDiv");
    guessDivider.style.display = "none";
}

var computerGuessStr = '';

const guess = async (guessedNumber)=>{

    let computerGuess = Math.floor(Math.random() * 10) + 1;

    console.log(`${computerGuess} and ${guessedNumber}`);
    // console.log(computerGuessStr)

    if(computerGuess == guessedNumber)
    {
        
        computerGuessStr += `
        I know that ${computerGuess} was your number!`;

        let result = computerGuessStr;
        console.log ("Result string is " + result)
        return result;
    }
    else{
        computerGuessStr += `Was ${computerGuess} your Number? ...Wait JK<br>`;
        guess(guessedNumber);
    }
}

guessButton.addEventListener("click", async()=>{
    
    let guessImp = document.getElementById("inputGuess").value;
    console.log(guessImp);
    computerGuessStr = '';
    guess(guessImp);

    hideGuessDiv();
    showResultDiv();
    guessResultMessage.innerHTML = computerGuessStr;

})
correctButton.addEventListener("click", ()=>{

})
wrongButton.addEventListener("click", ()=>{
    showGuessDiv();
    hideResultDiv();
})
