async function login() {

    console.log("Login Function")

    var playerID = sessionStorage.getItem("playerID")
        
    const rawResponse = await fetch('/auth', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({playerID: playerID})
    });
    // const content = await rawResponse.json()
    
    if(rawResponse.status == 200)
    {
        console.log("response status 200");
        console.log(content.result);

    }
    else
    {
        window.location = '/login';
    }
};

window.onload = ()=>{
    console.log("Window Loaded")
    login();
}