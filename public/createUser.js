let submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", async (event)=>{


    event.preventDefault();

    //Next Time Get all the input values
    let ipName = document.getElementById("inputName").value;
    let ipCC = document.getElementById("inputCC").value;
    let ipExp = document.getElementById("inputExp").value;
    let ipCVC = document.getElementById("inputCVC").value;

    const rawResponse = await fetch('/createUser', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            playerName: ipName,
            momsCC: ipCC,
            momsExp: ipExp,
            momsCVC: ipCVC
        })
    });
    const content = await rawResponse.json()
    
    if(rawResponse.status == 200)
    {
        console.log("response status 200");
        console.log(content);
        sessionStorage.userID = content.id;
    }

});

let backToLobbyBtn = document.getElementById("lobbyBack");

backToLobbyBtn.addEventListener("click", ()=>{
    location.href = "/lobby";
})