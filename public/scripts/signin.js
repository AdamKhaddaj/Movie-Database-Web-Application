document.getElementById("signin").addEventListener('click', signin);

function signin(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    
    //check validity of fields
    if(username.trim().length == 0 || password.trim().length == 0){
        alert("Please enter both a Username and Password");
    }
    else{
        let request = new XMLHttpRequest();
        request.onreadystatechange = function(){
            if(this.readyState == 4){
                if(this.status == 200){
                    alert("Signed In!");
                    window.location.href = "/";
                }
                else{
                    alert(this.responseText);
                    //set back to emtpy
                    document.getElementById("username").value = "";
                    document.getElementById("password").value = "";
                }
            }
        }
        //now make json obj thats gonna be sent in the post request to make a new user
        let newuserobj = {};

        newuserobj.username = username;
        newuserobj.password = password;

        request.open("POST", "/users/signin");
        request.setRequestHeader('Content-type', 'application/json');
        request.send(JSON.stringify(newuserobj));
    }
}