console.log("Respirá conectado correctamente");
/* ==========================================
   RESPIRÁ v1.0
   Motor de respiración consciente
========================================== */


/* ---------- ELEMENTOS ---------- */

const breathingCircle = document.getElementById(
    "breathingCircle"
);

const instruction = document.getElementById(
    "instruction"
);

const phase = document.getElementById(
    "phase"
);

const startButton = document.getElementById(
    "startButton"
);



/* ---------- CONFIGURACIÓN ---------- */


const breathingCycle = [

    {
        name: "Inhalá",
        text: "Llená tus pulmones suavemente",
        duration: 4000,
        scale: 1.35
    },

    {
        name: "Sostené",
        text: "Sentí la pausa",
        duration: 4000,
        scale: 1.35
    },

    {
        name: "Exhalá",
        text: "Soltá lentamente",
        duration: 6000,
        scale: 1
    }

];



let currentPhase = 0;

let breathingActive = false;

let timer;



/* ---------- INICIO ---------- */


startButton.addEventListener(
    "click",
    startBreathing
);



function startBreathing(){

    if(breathingActive){

        stopBreathing();

        return;

    }


    breathingActive = true;

    startButton.textContent =
        "Detener";


    runPhase();

}



/* ---------- CICLO ---------- */


function runPhase(){


    if(!breathingActive){

        return;

    }


    const current =
        breathingCycle[currentPhase];


    instruction.textContent =
        current.name;


    phase.textContent =
        current.text;



    breathingCircle.style.transition =
        `transform ${current.duration / 1000}s ease`;



  document.querySelector(".inner-circle").style.transform =
    `scale(${current.scale})`;



    timer = setTimeout(()=>{


        currentPhase++;


        if(currentPhase >= breathingCycle.length){

            currentPhase = 0;

        }


        runPhase();


    }, current.duration);


}



/* ---------- DETENER ---------- */


function stopBreathing(){


    breathingActive = false;


    clearTimeout(timer);


    currentPhase = 0;


    breathingCircle.style.transform =
        "scale(1)";


    instruction.textContent =
        "Presioná comenzar";


    phase.textContent =
        "Tu práctica empieza cuando vos decidís.";


    startButton.textContent =
        "Comenzar";


}
