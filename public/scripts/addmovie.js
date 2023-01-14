document.getElementById("addmovie").addEventListener('click', addmovie);

function addmovie(){
    let movieID = window.location.href.slice(29);
    let request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(this.readyState == 4){
            if(this.status == 200){
                alert(this.responseText)
            }
            else{
                alert(this.responseText)
            }
        }
    }

    let movieobj = {}
    movieobj.id = movieID

    request.open("POST", "/users/watchlist");
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify(movieobj));
}