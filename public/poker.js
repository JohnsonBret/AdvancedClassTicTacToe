// 1. each card has a suit - spades, clubs, diamonds, hearts
// 2. each suit has 13
// How do we represent this data?

const cards = [
"S 1", "S 2","S 3","S 4","S 5","S 6","S 7","S 8","S 9","S 10","S 11","S 12","S 13",
"C 1", "C 2","C 3","C 4","C 5","C 6","C 7","C 8","C 9","C 10","C 11","C 12","C 13",
"D 1", "D 2","D 3","D 4","D 5","D 6","D 7","D 8","D 9","D 10","D 11","D 12","D 13",
"H 1", "H 2","H 3","H 4","H 5","H 6","H 7","H 8","H 9","H 10","H 11","H 12","H 13",
];

let dealtCards = [];

let dealerHand = [];
let playerHand = [];

const clubs = "&#9827;";
const spades = "&#9824;";
const hearts = "&#9829;";
const diamonds = "&#9670;";

function cardSuitIsRed(suit){
    if(suit == "D" || suit =="H"){
        return true;
    }
    else{
        return false;
    }
}

function getSuitUnicode(suit)
{
    if(suit == "S")
    {
        return spades;
    }
    else if(suit == "C")
    {
        return clubs;
    }
    else if(suit == "H")
    {
        return hearts;
    }
    else{
        return diamonds;
    }
}

function createCardElement(selectedCard)
{
    let split = selectedCard.split(" ");

    let suit = getSuitUnicode(split[0]);
    let color = cardSuitIsRed(split[0]);

    let cardNumber = split[1];

    let cardContainer = document.createElement("div");
    let topSuitNumber = document.createElement("p");
    let middleSuitNumber = document.createElement("h2");
    let bottomSuitNumber = document.createElement("p");
    
    topSuitNumber.innerHTML = `${cardNumber} ${suit}`;    
    middleSuitNumber.innerHTML = `${cardNumber} ${suit}`;
    bottomSuitNumber.innerHTML = `${cardNumber} ${suit}`;

    topSuitNumber.classList.add("topSuit");
    middleSuitNumber.classList.add("middleSuit");
    bottomSuitNumber.classList.add("bottomSuit");
    cardContainer.classList.add("cardContainer");

    if(color == true)
    {
        cardContainer.classList.add("red");
    }

    cardContainer.appendChild(topSuitNumber);
    cardContainer.appendChild(middleSuitNumber);
    cardContainer.appendChild(bottomSuitNumber);

    return cardContainer;
}

function addCardToHand(cardElement, iCurrent)
{
    if(iCurrent < 5)
    {
        let dealerHandSection = document.getElementById("dealer");
        dealerHandSection.children[iCurrent].appendChild(cardElement);
    }
    else{
        let playerHandSection = document.getElementById("player");
        playerHandSection.children[iCurrent - 5].appendChild(cardElement);
    }
}

function dealHand()
{
    for(let i = 0; i < 10; i++)
    {
        //random card from cards?
        let selectedCard = cards[Math.floor(Math.random() * 52)];
        console.log(`Dealt card-> ${selectedCard}`);

        //What should happen if we randomly get a card that has already been dealt?
        let result = dealtCards.find((dealtCard)=>{
            if(dealtCard == selectedCard){
                console.log(`Selected Card ${selectedCard} is already dealt!`);
                return true;
            }
        });

        console.log(`is this the found card? ${result}`);
        if(result != undefined)
        {
            console.log("Find a new card -> Go to the next loop Cycle");
            i--;
            continue;
        }

        dealtCards.push(selectedCard);
        let cardElement = createCardElement(selectedCard);
        addCardToHand(cardElement, i);

        if(i < 5)
        {
            dealerHand.push(selectedCard);
        }
        else{
            playerHand.push(selectedCard);
        }
    }
}

function analyzeHand(hand){
    console.log(hand);

    let numbers = [];
    let suits = [];
    for(let i = 0; i < 5; i++)
    {
        console.log(`Current Card in hand ${hand[i]}`);
        console.log(`Current Card Spilit ${hand[i].split(" ")}`);
        suits.push(hand[i].split(" ")[0]);
        numbers.push(hand[i].split(" ")[1]);
    }

    console.log(`Numbers ${numbers} Suits ${suits}`);
}

dealHand();
analyzeHand(dealerHand);
analyzeHand(playerHand);