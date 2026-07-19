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

// ---------- SONIDO TIC TIC ----------

let audioContext;


function playTick(){

if(!audioContext){

    audioContext = new AudioContext();

}


if(audioContext.state === "suspended"){

    audioContext.resume();

}


    const oscillator =
        audioContext.createOscillator();


    const gain =
        audioContext.createGain();


    oscillator.type = "sine";

    oscillator.frequency.value = 500;


    gain.gain.value = 0.04;


    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );


    oscillator.start();


    oscillator.stop(
        audioContext.currentTime + 0.05
    );

}

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

let tickInterval =
setInterval(
    playTick,
    1000
);

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
clearInterval(tickInterval);

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
