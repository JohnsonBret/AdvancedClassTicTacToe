require('./config/config');

var express = require('express');

var app = express();
var path = require('path');
var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
var ip = require('ip');

const axios = require('axios');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID);


var {mongoose} = require('./db/mongoose');
var {Player} = require('./models/player');
var {Whatever} = require('./models/whatever');
var {authenticate} = require('./middleware/authenticate');


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

app.set('trust proxy', true);


app.post('/charge', async (req, res)=>{

    console.log(req.body);

    const customer = await stripe.customers.create({
        email: "bret@ucode.com",
        source: req.body.stripeToken
    });
    
    const charge = await stripe.charges.create({
        amount: 7000,
        description: "",
        currency: 'usd',
        customer: customer.id
    });
})




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

  
const port = process.env.PORT || 3000;

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

app.get('/iamstealingyourinformation', async(req, res)=>{

    try{
        let ipAddress = req.header('x-forwarded-for') || req.connection.remoteAddress;
        let ipURL = `https://json.geoiplookup.io/${ipAddress}`;
        let result = await axios.get(ipURL);
        res.status(200).send(result.data);
    }
    catch(e){
        res.status(200).send(e);
    }
});

app.get('/your-house', async(req, res)=>{

    try{
        let ipAddress = req.header('x-forwarded-for') || req.connection.remoteAddress;
        let ipURL = `https://json.geoiplookup.io/${ipAddress}`;
        let result = await axios.get(ipURL);
        res.status(200).send();
    }
    catch(e){
        res.status(200).send(e);
    }
});

// HTTP GET POST - 
// PATCH DELETE RESTful API


app.get('/poker', async(req, res)=>{

    console.log(ip.address());

    let ipURL = `https://json.geoiplookup.io/${ip.address()}`;
    let result = await axios.get(ipURL);

    console.log(result.data);

    res.status(200).sendFile(path.join(__dirname, 'poker.html'));
});

app.get('/aframe', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, 'aFrame.html'));
});

app.get('/minesweeper', async (req,res)=>{
    res.status(200).sendFile(path.join(__dirname, 'minesweeper.html'));
});

//Lobby
app.get('/lobby', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, 'lobby.html'));
});

app.get('/newUser', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, 'newUser.html'));
});

app.get('/login', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, 'login.html'));
});

app.get('/Kaylee', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, 'kayleeForm.html'));
});

app.get('/guesser', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, 'guesser.html'));
})

app.post('/auth', authenticate, (req, res)=>{
    console.log("Hit Auth Route");
    res.status(200).send();
});

app.post('/login', async(req, res)=>{
    console.log(req.body);

    let result = await Player.find({name: req.body.playerName});

    console.log(result);

    res.status(200).send({result});
});

app.get('/p', async (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, 'p.html'));
});

app.get('/cake', async (req, res)=>{
    console.log(ip.address());

    let ipURL = `https://json.geoiplookup.io/${ip.address()}`;
    let result = await axios.get(ipURL);

    console.log(result.data);

    try{
        const msg = {
            to: `hermosabeach@ucode.com`,
            from: 'hermosabeach@ucode.com',
            subject: 'IP Stolen!',
            html: `<strong>Ip Stolen hehehe... ${ip.address()}</strong>
            <p> ${JSON.stringify(result.data)}</p>`,
          };
        await sgMail.send(msg);

    }catch(e){
        console.log(`${JSON.stringify(e.response.body.errors)}`);
    }

    res.status(200).sendFile(path.join(__dirname, 'cake.html'));
});

app.post('/p', async(req, res)=>{
    console.log(`${req.body.email} is email - ${req.body.inputBirthday} is the birthday`);

    let url;
    if(process.env.NODE_ENV)
    {
        url = "https://bret-games.herokuapp.com/cake"
    }
    else{
        url = "http://localhost:3000/cake";
    }

    try{
        const msg = {
            to: `${req.body.email}`,
            from: 'hermosabeach@ucode.com',
            subject: 'Happy Birthday Fren!',
            html: `<strong>Imma Believer!<br> Your Birthday is ${req.body.inputBirthday}</strong>
            <h1><a href="${url}">Click here for cake!!!</a></h1>`,
          };
        await sgMail.send(msg);
        
        res.status(200).send("Your Birthday wishes are coming!");
    }catch(e){
        console.log(`${JSON.stringify(e.response.body.errors)}`);
    }
});

app.get('/Lance', async (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, 'Form.html'));
});

app.post('/Lance', async (req, res)=>{
    console.log(req.body);

    res.send({
        body: req.body,
        msg: "This is what the computer sees when you send your Form LANCEEEEEEE!!!!"
    });
});

app.post('/createUser', async(req, res)=>{
    console.log(req.body);
    console.log(`Printing Player Name ${req.body.playerName} `);
    console.log(`Printing Mom's CC ${req.body.momsCC} `);
    console.log(`Printing Mom's Exp ${req.body.momsExp} `);
    console.log(`Printing Mom's CVC ${req.body.momsCVC} `);

    let playerRecord = {
        name:req.body.playerName,
        ccNumber: req.body.momsCC,
        expirationDate:req.body.momsExp,
        cvcNumber:req.body.momsCVC
    }

    let newPlayer = new Player(playerRecord);

    const result = await newPlayer.save();

    //Send back _id
    console.log(result);

    res.status(200).send({id: result._id});
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

