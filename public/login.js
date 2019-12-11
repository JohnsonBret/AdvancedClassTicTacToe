async function login() {

    var playerName = document.getElementById("inputName").value;
        
    const rawResponse = await fetch('/login', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({playerName: playerName})
    });
    const content = await rawResponse.json()
    
    if(rawResponse.status == 200)
    {
        console.log("response status 200");
        console.log(content.result);
        sessionStorage.setItem("playerID", content.result[0]._id);
        sessionStorage.setItem("playerName", content.result[0].name);
        window.location = '/lobby';
    }
    else
    {
        window.location = '/login';
    }
};

let submitButton = document.getElementById("submitBtn");
submitButton.addEventListener("click", ()=>{
    console.log("Login - Clicked");
    login();
})