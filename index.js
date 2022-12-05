window.onload = () => {
    document.getElementsByTagName("button")[0].addEventListener("click", prepararPagina);
    
    document.getElementById("titulo-input").addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementsByTagName("button")[0].click();
        }
    });
}

// cada vez que se haga scroll se ejecuta la función y saca nuevas películas
window.addEventListener("scroll", () => {
    if (window.scrollY + window.innerHeight >= 
        document.documentElement.scrollHeight - 5) {
        lanzarPeticion();
    }
});

// sacar datos de la pelicula seleccionada
let peliculas = document.getElementsByTagName("div");

for (let i = 0; i < peliculas.length; i++) {
    peliculas[i].addEventListener("click", () => {
        let id = peliculas[i].imdbID;
        httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = trataDatos;
        httpRequest.open("GET", `http://www.omdbapi.com/?apikey=61f9227e&i=${id}`);
        httpRequest.send();
    });
}


var httpRequest;
var page = 1;
var peticionEnCurso = false;

function prepararPagina(){
    document.getElementById("contenedor").innerHTML = "";
    // var page = 1;
    lanzarPeticion();
    
}

// lanza peticion de peliculas
function lanzarPeticion() {

    if(peticionEnCurso == false){

        peticionEnCurso = true;

        httpRequest = new XMLHttpRequest();
    
        httpRequest.open("GET", `http://www.omdbapi.com/?apikey=61f9227e&s=${document.getElementById("titulo-input").value}&page=${page}`);
        httpRequest.onreadystatechange = trataRespuesta;
        httpRequest.send();

        page ++;
    }
}
 
// trata la respesta de la busqueda de peliculas
function trataRespuesta() {
    let contenedor = document.getElementById("contenedor");
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            let respuesta = JSON.parse(httpRequest.responseText);
            console.log(respuesta);
            for (let i = 0; i < respuesta.Search.length; i++) {
                let div = document.createElement("div");
                div.innerHTML = "<h2>"+respuesta.Search[i].Title+"</h2>"+"<br>";
                div.innerHTML += `<img src="${respuesta.Search[i].Poster}">`;
                contenedor.appendChild(div);
                peticionEnCurso = false;
            }
            } else {
            alert("Hubo un problema con la petición.");
        }
    }
}

// trata los datos de la pelicula seleccionada
function trataDatos() {
    let contenedor = document.getElementById("peliculas");
    contenedor.innerHTML = "";
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            let datos = JSON.parse(httpRequest.responseText);
            console.log(datos);
            for (let i = 0; i < datos.Search.length; i++) {
                contenedor.innerHTML = "<h5>"+datos.Search[i].Year+"</h5>"+"<br>";
                contenedor.innerHTML = "<h5>"+datos.Search[i].Released+"</h5>"+"<br>";
                contenedor.innerHTML = "<h5>"+datos.Search[i].Runtime+"</h5>"+"<br>";
                contenedor.innerHTML = "<h5>"+datos.Search[i].Director+"</h5>"+"<br>";
            }
            } else {
            alert("Hubo un problema con la petición.");
        }
    }
}