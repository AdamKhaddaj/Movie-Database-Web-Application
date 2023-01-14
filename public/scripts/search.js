document.getElementById("basicsearch").addEventListener('click', Search);

function Search(){
    console.log("SEARCHING");
    let type = document.getElementById("selection").value;
    let finalurl = "/movies/";
    let search = document.getElementById("searchBar").value;

    let title = "";
    let genre = "";
    let actor = ""; 
    let writer = "";
    let director = "";

    if(search.trim() == ""){
        return;
    }

    if(type=="Title"){
        title = search;
    }

    if(type=="Genre"){
        genre = search;
    }

    if(type=="Actor"){
        actor = search;
    }

    if(type=="Writer"){
        writer = search;
    }

    if(type=="Director"){
        director = search;
    }

    finalurl += "?title=" + title + "&actor=" + actor + "&director=" + director + "&writer=" + writer + "&genre=" + genre + "&pagenum=0";
    window.location.href = finalurl;
    
}