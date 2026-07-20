// =====================================================
// Respirá v1.1
// Motor principal de respiración
// Inhalar 4s - Sostener 4s - Exhalar 6s
// Audio:
//   • Inhalar  -> bowl-warm.ogg al 100%
//   • Sostener -> silencio
//   • Exhalar  -> bowl-warm.ogg al 50%
// =====================================================

(() => {
    "use strict";

    // -------------------------------------------------
    // Configuración
    // -------------------------------------------------

    const PHASES = [
        { name: "Inhalá", duration: 4 },
        { name: "Sostené", duration: 4 },
        { name: "Exhalá", duration: 6 }
    ];

    const AUDIO_FILE = "audio/bowl-warm.ogg";

    // -------------------------------------------------
    // Elementos
    // -------------------------------------------------

    const circle =
        document.getElementById("circle") ||
        document.querySelector(".circle");

    const phaseText =
        document.getElementById("phase") ||
        document.getElementById("instruction") ||
        document.querySelector(".phase");

    const counter =
        document.getElementById("counter") ||
        document.querySelector(".counter");

    const startButton =
        document.getElementById("startButton") ||
        document.getElementById("start") ||
        document.querySelector(".start-button");

    // -------------------------------------------------
    // Estado
    // -------------------------------------------------

    let running = false;
    let timer = null;

    let phaseIndex = 0;
    let secondsLeft = PHASES[0].duration;

    // -------------------------------------------------
    // Audio
    // -------------------------------------------------

    const bowl = new Audio(AUDIO_FILE);
    bowl.preload = "auto";

    function playBowl(volume) {
        bowl.pause();
        bowl.currentTime = 0;
        bowl.volume = volume;

        bowl.play().catch(() => {
            // Algunos navegadores bloquean el audio
            // hasta una interacción del usuario.
        });
    }

    function stopBowl() {
        bowl.pause();
        bowl.currentTime = 0;
    }

    // -------------------------------------------------
    // UI
    // -------------------------------------------------

    function updateCounter() {
        if (counter) {
            counter.textContent = secondsLeft;
        }
    }

    function animateCircle() {
        if (!circle) return;

        circle.style.transition = "transform 1s ease";

        switch (PHASES[phaseIndex].name) {
            case "Inhalá":
                circle.style.transform = "scale(1.28)";
                break;

            case "Sostené":
                circle.style.transform = "scale(1.28)";
                break;

            case "Exhalá":
                circle.style.transform = "scale(0.82)";
                break;
        }
    }

    function updatePhase() {
        const phase = PHASES[phaseIndex];

        if (phaseText) {
            phaseText.textContent = phase.name;
        }

        animateCircle();

        switch (phase.name) {
            case "Inhalá":
                playBowl(1.0);
                break;

            case "Sostené":
                stopBowl();
                break;

            case "Exhalá":
                playBowl(0.5);
                break;
        }

        updateCounter();
    }

    // -------------------------------------------------
    // Ciclo principal
    // -------------------------------------------------

    function nextPhase() {
        phaseIndex = (phaseIndex + 1) % PHASES.length;
        secondsLeft = PHASES[phaseIndex].duration;
        updatePhase();
    }

    function tick() {
        if (!running) return;

        secondsLeft--;

        if (secondsLeft <= 0) {
            nextPhase();
        } else {
            updateCounter();
        }
    }

    // -------------------------------------------------
    // Inicio / Fin
    // -------------------------------------------------

    function startPractice() {
        if (running) return;

        running = true;

        phaseIndex = 0;
        secondsLeft = PHASES[0].duration;

        updatePhase();

        clearInterval(timer);
        timer = setInterval(tick, 1000);

        if (startButton) {
            startButton.textContent = "Finalizar práctica";
        }
    }

    function stopPractice() {
        running = false;

        clearInterval(timer);
        timer = null;

        stopBowl();

        if (circle) {
            circle.style.transform = "scale(1)";
        }

        if (phaseText) {
            phaseText.textContent = "Respirá";
        }

        if (counter) {
            counter.textContent = "";
        }

        if (startButton) {
            startButton.textContent = "Comenzar práctica";
        }
    }

    // -------------------------------------------------
    // Eventos
    // -------------------------------------------------

    if (startButton) {
        startButton.addEventListener("click", () => {
            if (running) {
                stopPractice();
            } else {
                startPractice();
            }
        });
    }

    // Estado inicial
    stopPractice();
})();
