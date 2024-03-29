// Función para asignar el evento de clic de manera segura
function asignarEventoApiRest() {
    $("a[href='api.html']").off('click').on('click', function(e) {
        e.preventDefault(); 
    });
}


// Inicializa la carga del header y asigna eventos una vez cargado
$(function() {
    $("#header").load("header.html", function() {
        asignarEventoApiRest();
        mostrarBienvenida();
    });
});



var preguntas; // Almacena las preguntas obtenidas de la API
var preguntaActual = 0; // Índice de la pregunta actual
var respuestasCorrectas = 0; // Nuevo: Contador de respuestas correctas

// Nueva función para mostrar mensaje de bienvenida y botón de inicio
function mostrarBienvenida() {
    var contenidoBienvenida = `<div id="bienvenida">
        <p>Bienvenido, si desea jugar pulse continuar</p>
        <button onclick="iniciarJuego()">Continuar</button>
    </div>`;
    $("#contenedor-preguntas").html(contenidoBienvenida);
}

// Prepara el juego para empezar, cargando las preguntas
function iniciarJuego() {
    $("#bienvenida").remove(); // Eliminar mensaje de bienvenida
    cargarPreguntas(); // Iniciar carga de preguntas
}

// Carga preguntas de la API y las muestra
function cargarPreguntas() {
    $.get("https://opentdb.com/api.php?amount=10&category=27&difficulty=easy", function(data) {
        preguntas = data.results;
        preguntaActual = 0;
        respuestasCorrectas = 0; // Restablecer contador al iniciar
        mostrarPregunta(preguntaActual);
    });
}

// Muestra la pregunta actual con sus respuestas
function mostrarPregunta(index) {
    const pregunta = preguntas[index];
    let contenidoHtml = `<div class='pregunta'><h3>Pregunta ${index + 1}: ${pregunta.question}</h3><ul>`;
    const respuestas = pregunta.incorrect_answers.slice(); // Copia las respuestas incorrectas
    const correcta = pregunta.correct_answer;
    respuestas.splice(Math.floor(Math.random() * (respuestas.length + 1)), 0, correcta); // Mezcla la correcta al azar
    
    respuestas.forEach((respuesta) => {
        contenidoHtml += `<li onclick="seleccionarRespuesta('${respuesta.replace("'", "&#39;")}', '${correcta.replace("'", "&#39;")}', this)">${respuesta}</li>`;
    });
    
    contenidoHtml += `</ul></div>`;
    $("#contenedor-preguntas").html(contenidoHtml);
}

// Evalúa la respuesta seleccionada y muestra feedback visual (verde o roja)
function seleccionarRespuesta(seleccionada, correcta, elemento) {
    $("li").off("click");
    if (seleccionada === correcta) {
        $(elemento).css('color', 'green');
        respuestasCorrectas++; // Incrementar contador si es correcta
        setTimeout(() => alert("Correcto!"), 100);
    } else {
        $(elemento).css('color', 'red');
        $(`li:contains('${correcta}')`).css('color', 'green');
        setTimeout(() => alert("Incorrecto! La respuesta correcta era: " + correcta), 100);
    }
    
    preguntaActual++;
    // Si quedan preguntas, muestra la siguiente; si no, muestra el resumen final
    if (preguntaActual < preguntas.length) {
        setTimeout(() => mostrarPregunta(preguntaActual), 2000);
    } else {
        //Mostrar resumen de respuestas correctas al final (EXTRA)
        setTimeout(() => {
            $("#contenedor-preguntas").html(`<h2>Has completado todas las preguntas!</h2><p>Has obtenido ${respuestasCorrectas} /10 preguntas bien.</p>`);
        }, 2000);
    }
}