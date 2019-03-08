//Invoked when  the script finish loading the SSO. It is always after onIdentification
function onLoad(){

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('jwt');

    if(token) {
        sslssso.login(token);
        var url = [location.protocol, '//', location.host, location.pathname].join('');
        window.location.replace(url);
    }
}
 
//Invoked when user logs out
function onLogout(){
    console.log('logout');
    document.getElementById("nav-login").innerText = "Login";
    document.getElementById("nav-login").href = "/login";

    document.getElementById("login-box").style.display = "block";
    document.getElementById("comment-form-modal").style.display = "none";

    localStorage.removeItem('aMZr1grXqFXbiRzmOGRM');
}

// Invoked after page load if you have a valid token or after new JWT correct identification (if page is still loaded)
// If you do not have identification token, this function is not executed
function onIdentification(operation){
    const username = operation.payload.data.username;

    console.log(operation.payload.data.scope);  //Your user unique identifier (for example the username)
    console.log(username); //User full name

    document.getElementById("nav-login").innerText = "Logout, @" + username;
    document.getElementById("nav-login").href = "javascript:sslssso.logout();";

    document.getElementById("login-box").style.display = "none";
    document.getElementById("comment-form-modal").style.display = "block";
    
    console.log(operation.jwt);  //The token itself

    localStorage.setItem('aMZr1grXqFXbiRzmOGRM', operation.jwt);
}