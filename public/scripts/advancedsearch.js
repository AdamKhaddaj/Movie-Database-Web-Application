document.getElementById("search").addEventListener('click', getSearch);

function getSearch(){

    let movieSearch = document.getElementById("movieBar").value;
    let actorSearch = document.getElementById("actorBar").value;
    let directorSearch = document.getElementById("directorBar").value;
    let writerSearch = document.getElementById("writerBar").value;
    let genreSearch = document.getElementById("genreBar").value;

    let finalurl = "/movies/";


    if(movieSearch.trim() == "" && actorSearch.trim() == "" && directorSearch.trim() == "" && writerSearch.trim() == "" && genreSearch.trim() == ""){
        alert("Please input something in the search bars");
        return;
    }

    finalurl += "?title=" + movieSearch + "&actor=" + actorSearch + "&director=" + directorSearch + "&writer=" + writerSearch + "&genre=" + genreSearch + "&pagenum=0";

    window.location.href = finalurl;

}