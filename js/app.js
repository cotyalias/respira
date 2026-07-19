/* ==========================================================
   RESPIRÁ v1.0
   Motor principal
   HTML + CSS + JavaScript puro
========================================================== */

"use strict";

/* ==========================================================
   CONFIGURACIÓN
========================================================== */

const BREATHING_CYCLE = [
    {
        title: "Inhalá",
        subtitle: "Recibí el aire. Volvé al presente.",
        seconds: 4,
        scale: 1.22
    },
    {
        title: "Sostené",
        subtitle: "Observá la pausa.",
        seconds: 4,
        scale: 1.22
    },
    {
        title: "Exhalá",
        subtitle: "Soltá lentamente.",
        seconds: 6,
        scale: 1
    }
];


/* ==========================================================
   REFERENCIAS DEL DOM
========================================================== */

const instruction = document.getElementById("instruction");
const phase = document.getElementById("phase");
const button = document.getElementById("startButton");
const innerCircle = document.querySelector(".inner-circle");


/* ==========================================================
   ESTADO
========================================================== */

let running = false;
let currentPhase = 0;

let phaseTimeout = null;
let countdownInterval = null;
let tickInterval = null;


/* ==========================================================
   AUDIO
   (Preparado para reemplazar por archivos reales)
========================================================== */

let audioContext = null;

function playTick() {

    if (!running) return;

    if (!audioContext) {
        audioContext =
            new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = "triangle";
    osc.frequency.value = 440;

    gain.gain.setValueAtTime(
        0.02,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.08
    );

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + 0.08);

}


/* ==========================================================
   UTILIDADES
========================================================== */

function clearTimers() {

    clearTimeout(phaseTimeout);
    clearInterval(countdownInterval);
    clearInterval(tickInterval);

    phaseTimeout = null;
    countdownInterval = null;
    tickInterval = null;

}


function animateCircle(scale) {

    innerCircle.style.transform =
        `scale(${scale})`;

}


function updateButton() {

    button.textContent =
        running
            ? "Finalizar práctica"
            : "Comenzar práctica";

}


/* ==========================================================
   FASE
========================================================== */

function runPhase(index) {

    if (!running) return;

    currentPhase = index;

    const step = BREATHING_CYCLE[index];

    instruction.textContent =
        step.title;

    animateCircle(step.scale);

    let remaining = step.seconds;

    phase.textContent =
        `${step.subtitle} (${remaining})`;

    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {

        if (!running) return;

        remaining--;

        if (remaining > 0) {

            phase.textContent =
                `${step.subtitle} (${remaining})`;

        }

    }, 1000);


    clearInterval(tickInterval);

    tickInterval = setInterval(() => {

        playTick();

    }, 1000);


    phaseTimeout = setTimeout(() => {

        if (!running) return;

        const next =
            (index + 1) %
            BREATHING_CYCLE.length;

        runPhase(next);

    }, step.seconds * 1000);

}


/* ==========================================================
   INICIAR
========================================================== */

function startPractice() {

    if (running) return;

    running = true;

    updateButton();

    runPhase(0);

}


/* ==========================================================
   FINALIZAR
========================================================== */

function stopPractice() {

    running = false;

    clearTimers();

    animateCircle(1);

    instruction.textContent =
        "La práctica terminó";

    phase.textContent =
        "Gracias por regalarte este momento.";

    updateButton();

}


/* ==========================================================
   BOTÓN
========================================================== */

button.addEventListener("click", () => {

    if (running) {

        stopPractice();

    } else {

        startPractice();

    }

});


/* ==========================================================
   ESTADO INICIAL
========================================================== */

animateCircle(1);

updateButton();
