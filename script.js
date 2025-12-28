document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const TARGET_DOB = "24122000"; // Example: DDMMYYYY - Can be changed by user

    // DOM Elements
    const steps = {
        1: document.getElementById('step-1'),
        2: document.getElementById('step-2'),
        3: document.getElementById('step-3'),
        4: document.getElementById('step-4'),
        5: document.getElementById('step-5'),
        6: document.getElementById('step-6')
    };

    // Step 1: Puzzle
    const passwordInput = document.getElementById('password-input');
    const unlockBtn = document.getElementById('unlock-btn');
    const errorMsg = document.getElementById('error-msg');

    // Step 2: Celebration
    const countdownEl = document.getElementById('countdown');
    const celebrationScene = document.getElementById('celebration-scene');

    // Step 4: Gift
    const giftBox = document.getElementById('gift-box');

    // Step 5: Msg
    const nextToSlideBtn = document.getElementById('next-to-slideshow-btn');

    // Step 6: Slideshow
    const replayBtn = document.getElementById('replay-btn');

    // Audio
    const bgMusic = document.getElementById('bg-music');
    const muteBtn = document.getElementById('mute-btn');

    // Helper: Transition Step
    function goToStep(stepNumber) {
        // Hide all steps
        Object.values(steps).forEach(el => {
            el.classList.remove('active');
            setTimeout(() => {
                if (!el.classList.contains('active')) el.classList.add('hidden');
            }, 1000); // Match CSS transition
        });

        // Show target step
        const target = steps[stepNumber];
        target.classList.remove('hidden');
        // Small delay to allow display:block to apply before opacity transition
        setTimeout(() => {
            target.classList.add('active');
        }, 50);
    }

    // --- Step 1 Login Logic ---
    unlockBtn.addEventListener('click', () => {
        const val = passwordInput.value.trim();
        if (val === TARGET_DOB) {
            // Success
            startCelebrationSequence();
        } else {
            // Error
            passwordInput.parentElement.classList.add('shake');
            errorMsg.classList.remove('hidden');
            setTimeout(() => {
                passwordInput.parentElement.classList.remove('shake');
            }, 500);
        }
    });

    function startCelebrationSequence() {
        goToStep(2);
        // Play Audio (Interaction happened)
        // bgMusic.play().catch(e => console.log("Audio play failed", e));

        const countValues = [5, 4, 3, 2, 1];
        let delay = 0;

        countdownEl.classList.remove('hidden');

        countValues.forEach((num, index) => {
            setTimeout(() => {
                countdownEl.innerText = num;
                // Simple pop animation reset could go here
            }, delay);
            delay += 1000;
        });

        setTimeout(() => {
            countdownEl.classList.add('hidden');
            celebrationScene.classList.remove('hidden');
            triggerConfetti();
            bgMusic.play(); // Play music at celebration start

            // Wait a bit then go to Wish
            setTimeout(() => {
                goToStep(3);
                // Wish logic auto-advance
                setTimeout(() => {
                    goToStep(4);
                }, 4000); // 4 seconds for wish
            }, 5000); // 5 seconds for celebration

        }, delay);
    }

    // --- Step 4 Gift Logic ---
    giftBox.addEventListener('click', () => {
        // Run open animation
        giftBox.classList.add('open');
        triggerConfetti(); // Little burst for the gift too

        setTimeout(() => {
            goToStep(5);
        }, 1500); // Wait for animation
    });

    // --- Step 5 Logic ---
    nextToSlideBtn.addEventListener('click', () => {
        goToStep(6);
        startSlideshow();
    });

    // --- Audio Control ---
    let isMuted = true; // Start muted/passive

    muteBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                muteBtn.innerText = "🔊";
                isMuted = false;
            }).catch(e => console.log("Audio play error", e));
        } else {
            bgMusic.pause();
            muteBtn.innerText = "🔇";
            isMuted = true;
        }
    });

    const volumeSlider = document.getElementById('volume-slider');
    volumeSlider.addEventListener('input', (e) => {
        bgMusic.volume = e.target.value;
    });

    // Helper to ensure music tries to play on first interaction if acceptable
    function tryPlayMusic() {
        if (isMuted) return;
        bgMusic.play().catch(() => { });
    }

    // --- Step 6 Slideshow ---
    let slideIndex = 0;
    let slideInterval;
    function startSlideshow() {
        const slides = document.querySelectorAll('.slide');
        if (slides.length === 0) return;

        // Show first slide immediately
        slides[0].classList.add('active-slide');

        slideInterval = setInterval(() => {
            slides[slideIndex].classList.remove('active-slide');
            slideIndex = (slideIndex + 1) % slides.length;
            slides[slideIndex].classList.add('active-slide');
        }, 3000);
    }

    // --- Replay ---
    replayBtn.addEventListener('click', () => {
        location.reload(); // Simplest way to reset everything cleanly
    });

    // Confetti Helper using canvas-confetti
    function triggerConfetti() {
        if (window.confetti) {
            window.confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#ff9a9e', '#fad0c4', '#ff6b6b']
            });
        }
    }
});
