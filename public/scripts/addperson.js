document.getElementById("addperson").addEventListener('click', addperson);

function addperson(){
    let personID = window.location.href.slice(29);
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

    let personobj = {}
    personobj.id = personID

    request.open("POST", "/users/peoplefollowing");
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify(personobj));
    
}