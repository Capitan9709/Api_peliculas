window.onload = () => {
    document.getElementsByTagName("button")[0].addEventListener("click", prepararPagina, reset());

    // Si se pulsa enter se hace la busqueda
    document.getElementById("titulo-input").addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementsByTagName("button")[0].click();
            reset();
        }
    });

    //  Cada vez que se haga una busqueda se resetea la pagina
    function reset(){
        document.getElementById("contenedor").innerHTML = "";
    }
}

var httpRequest;
var page = 0;
var peticionEnCurso = false;

// cada vez que se haga scroll se ejecuta la función y saca nuevas películas
window.addEventListener("scroll", () => {
    if (window.scrollY + window.innerHeight >= 
        document.documentElement.scrollHeight - 10) {
        lanzarPeticion();
    }
});

// prepara la pagina para la busqueda
function prepararPagina(){
    document.getElementById("contenedor").innerHTML = "";
    page = 0;
    lanzarPeticion();
    
}

// lanza peticion de peliculas
function lanzarPeticion() {

    if(peticionEnCurso == false){
        if(page == 0){
            page = 1;
        }
        peticionEnCurso = true;

        httpRequest = new XMLHttpRequest();
    
        httpRequest.open("GET", `https://www.omdbapi.com/?apikey=61f9227e&s=${document.getElementById("titulo-input").value}&page=${page}`);
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
                div.innerHTML += "<h3> Año de publicacion: "+respuesta.Search[i].Year+"</h3>";
                contenedor.appendChild(div);
                div.addEventListener("click", () => {
                    let id = respuesta.Search[i].imdbID;
                    console.log(id);
                    httpRequest = new XMLHttpRequest();
                    httpRequest.onreadystatechange = trataDatos;
                    httpRequest.open("GET", `https://www.omdbapi.com/?apikey=61f9227e&i=${id}`);
                    httpRequest.send();


                    // let descripcion = document.createElement("div");
                    // div.appendChild(descripcion);

                    // descripcion.innerHTML = "";
                    // descripcion.classList.add("activado");
                });

                peticionEnCurso = false;
            }
            } else {
            alert("Hubo un problema con la petición.");
        }
    }
}

// trata los datos de la pelicula seleccionada
function trataDatos() {
    let div = document.getElementById("peliculas");
    
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            let datos = JSON.parse(httpRequest.responseText);
            console.log(datos);
            div.innerHTML = "";
            
            div.innerHTML = "<h5> Titulo: "+datos.Title+"</h5>"+"<br>";
            div.innerHTML += "<h5> Año: "+datos.Year+"</h5>"+"<br>";
            div.innerHTML += "<h5> Fecha de salida: "+datos.Released+"</h5>"+"<br>";
            div.innerHTML += "<h5> Duracion: "+datos.Runtime+"</h5>"+"<br>";
            div.innerHTML += "<h5> Director: "+datos.Director+"</h5>"+"<br>";
            div.innerHTML += "<h5> Actores: "+datos.Actors+"</h5>"+"<br>";
            } else {
            alert("Hubo un problema con la petición.");
        }
    }
}