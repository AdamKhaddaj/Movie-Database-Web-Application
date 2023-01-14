document.getElementById("contributingOn").addEventListener('click', contributingOn);
document.getElementById("contributingOff").addEventListener('click', contributingOff);

function removePerson(obj){

    let request = new XMLHttpRequest();
    request.open("DELETE", "/users/unfollow/"+obj.id);
    request.setRequestHeader("Content-type", "application/json");
    request.send();

}

function removeMovie(obj){
    window.location.href = "/removemovie/"+obj.id;
}

function contributingOn(){
    let request = new XMLHttpRequest();

    request.onreadystatechange = function(){
        if(this.readyState == 4){
            if(this.status == 200){
                alert("Mode changed!")
            }
            else{
                alert("Error")
            }
        }
    }

    let obj = {};
    obj.contributing = true

    request.open("PUT", "/users/contributing");
    request.setRequestHeader("Content-type", "application/json");
    request.send(JSON.stringify(obj));
}

function contributingOff(){
    
}
