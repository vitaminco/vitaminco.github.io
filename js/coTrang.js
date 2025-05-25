document.addEventListener("DOMContentLoaded", function () {
    const leftSection = document.getElementById("leftSection");
    const drawerContainer = document.getElementById("drawerContainer");
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const closeSystemBtn = document.getElementById("closeSystemBtn");

    // Create particle layer
    const particleLayer = document.createElement("div");
    particleLayer.className = "particle-layer";
    leftSection.appendChild(particleLayer);

    // Audio for thunder and dragon roar
    const thunderSound = new Audio('../audio/thunder-rumble.mp3');
    thunderSound.loop = false;
    thunderSound.volume = 0.5;
    const dragonRoarSound = new Audio('../audio/dragon-roar.mp3');
    dragonRoarSound.loop = false;
    dragonRoarSound.volume = 0.4;

    // Multi-type particle system (sparks, embers, orbs, raindrops)
    function createParticle(type = "spark") {
        const particle = document.createElement("div");
        particle.className = type;
        const size = type === "spark" ? Math.random() * 7 + 5 :
            type === "ember" ? Math.random() * 12 + 7 :
                type === "orb" ? Math.random() * 14 + 9 :
                    Math.random() * 4 + 3; // Raindrops are smaller
        particle.style.position = "absolute";
        particle.style.width = `${size}px`;
        particle.style.height = type === "raindrop" ? `${size * 2}px` : `${size}px`;
        particle.style.background = type === "spark"
            ? `radial-gradient(circle, rgba(255, 255, 255, 0.9), transparent)`
            : type === "ember"
                ? `radial-gradient(circle, rgba(255, 69, 0, 0.8), transparent)`
                : type === "orb"
                    ? `radial-gradient(circle, rgba(255, 215, 0, 0.7), transparent)`
                    : `linear-gradient(to bottom, rgba(135, 206, 235, 0.9), transparent)`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = type === "raindrop" ? `-10%` : `${Math.random() * 100}%`;
        particle.style.opacity = Math.random() * 0.5 + 0.5;
        particleLayer.appendChild(particle);

        const duration = type === "raindrop" ? Math.random() * 0.4 + 0.2 : Math.random() * 2.5 + 1.5;
        const translateY = type === "raindrop" ? window.innerHeight + 100 : Math.random() * 200 + 100;
        particle.animate([
            { transform: `translateY(0) scale(1)`, opacity: 0.9 },
            { transform: `translateY(${translateY}px) scale(${type === "raindrop" ? 1 : 0.5})`, opacity: 0 }
        ], {
            duration: duration * 1000,
            easing: type === "raindrop" ? "linear" : "ease-out",
            iterations: 1
        }).onfinish = () => particle.remove();
    }

    // Generate particles continuously
    setInterval(() => {
        createParticle("spark");
        if (Math.random() < 0.5) createParticle("ember");
        if (Math.random() < 0.4) createParticle("orb");
        if (Math.random() < 0.7) createParticle("raindrop");
    }, 80);

    // Mouse-triggered lightning sparks
    leftSection.addEventListener("mousemove", function (e) {
        const spark = document.createElement("div");
        spark.className = "spark";
        spark.style.position = "absolute";
        spark.style.width = "18px";
        spark.style.height = "18px";
        spark.style.background = `radial-gradient(circle, rgba(255, 255, 255, 0.9), rgba(255, 215, 0, 0.5))`;
        spark.style.left = `${e.offsetX}px`;
        spark.style.top = `${e.offsetY}px`;
        particleLayer.appendChild(spark);

        spark.animate([
            { transform: "scale(1)", opacity: 1 },
            { transform: "scale(5)", opacity: 0 }
        ], {
            duration: 800,
            easing: "ease-out",
            iterations: 1
        }).onfinish = () => spark.remove();

        // Randomly play thunder sound on mouse move
        if (Math.random() < 0.1) {
            thunderSound.currentTime = 0;
            thunderSound.play();
        }
    });

    // Epic storm transition effects on drawer open/close
    function triggerStormTransition(isOpening) {
        // Storm burst effect
        const burst = document.createElement("div");
        burst.className = "storm-burst";
        burst.style.position = "absolute";
        burst.style.width = "100%";
        burst.style.height = "100%";
        burst.style.top = "0";
        burst.style.left = "0";
        burst.style.background = `radial-gradient(circle, rgba(255, 215, 0, 1), transparent 60%)`;
        burst.style.opacity = "0";
        particleLayer.appendChild(burst);

        burst.animate([
            { opacity: 0, transform: "scale(0.5)" },
            { opacity: 0.9, transform: "scale(2.5)" },
            { opacity: 0, transform: "scale(3.5)" }
        ], {
            duration: 1200,
            easing: "ease-in-out",
            iterations: 1
        }).onfinish = () => burst.remove();

        // Dragon roar effect
        const roar = document.createElement("div");
        roar.className = "dragon-roar";
        roar.style.position = "absolute";
        roar.style.width = "100%";
        roar.style.height = "100%";
        roar.style.top = "0";
        roar.style.left = "0";
        roar.style.background = `url('../image/dragon-roar-storm.png') center/170% no-repeat`;
        roar.style.opacity = "0";
        particleLayer.appendChild(roar);

        roar.animate([
            { opacity: 0, transform: "scale(0.6)" },
            { opacity: 0.7, transform: "scale(1.4)" },
            { opacity: 0, transform: "scale(1.8)" }
        ], {
            duration: 1400,
            easing: "ease-out",
            iterations: 1
        }).onfinish = () => roar.remove();

        // Lightning flash
        const lightning = document.createElement("div");
        lightning.className = "lightning-flash";
        lightning.style.position = "absolute";
        lightning.style.width = "100%";
        lightning.style.height = "100%";
        lightning.style.top = "0";
        lightning.style.left = "0";
        lightning.style.background = `url('../image/lightning-burst.png') center/220% no-repeat`;
        lightning.style.opacity = "0";
        particleLayer.appendChild(lightning);

        lightning.animate([
            { opacity: 0 },
            { opacity: 1 },
            { opacity: 0 }
        ], {
            duration: 600,
            easing: "ease-in-out",
            iterations: 3
        }).onfinish = () => lightning.remove();

        // Play dragon roar sound on transition
        dragonRoarSound.currentTime = 0;
        dragonRoarSound.play();
    }

    // Trigger animations on drawer open/close
    hamburgerBtn.addEventListener("click", () => {
        triggerStormTransition(!drawerContainer.classList.contains("closed"));
    });

    closeSystemBtn.addEventListener("click", () => {
        triggerStormTransition(false);
    });

    // Initial storm eruption with thunder sound
    leftSection.animate([
        { opacity: 0, transform: "scale(0.7)" },
        { opacity: 1, transform: "scale(1)" }
    ], {
        duration: 2500,
        easing: "ease-out",
        iterations: 1
    });
    thunderSound.currentTime = 0;
    thunderSound.play();

    // Periodic thunder sound
    setInterval(() => {
        if (Math.random() < 0.2) {
            thunderSound.currentTime = 0;
            thunderSound.play();
        }
    }, 5000);

    // Add CSS for particles and effects
    const style = document.createElement("style");
    style.textContent = `
        .particle, .spark, .ember, .orb, .raindrop {
            position: absolute;
            pointer-events: none;
        }
        .storm-burst, .dragon-roar, .lightning-flash {
            position: absolute;
            pointer-events: none;
        }
        .raindrop {
            border-radius: 50% 50% 0 0;
        }
    `;
    document.head.appendChild(style);
});

// Chặn zoom bằng cuộn chuột (trackpad) trên Chrome:
document.addEventListener('wheel', function (event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}, { passive: false });