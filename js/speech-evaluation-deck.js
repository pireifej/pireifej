(function () {
    'use strict';

    var initialHash = decodeURIComponent(window.location.hash.replace(/^#\/?/, ''));
    var deck = new Reveal({
        hash: true,
        controls: false,
        progress: true,
        center: false,
        transition: 'slide',
        width: 1280,
        height: 720,
        margin: 0,
        minScale: 0.1,
        maxScale: 1.5,
        scrollActivationWidth: 0,
        keyboard: false,
        touch: true
    });
    var controls = document.querySelector('.deck-controls');
    var count = controls.querySelector('.slide-count');
    var previous = controls.querySelector('[data-action="prev"]');
    var next = controls.querySelector('[data-action="next"]');
    var fullscreen = controls.querySelector('[data-action="fullscreen"]');
    var timerInterval = null;
    var timeLeft = 60;
    var audioContext = null;

    function updateControls() {
        var state = deck.getState();
        var total = deck.getTotalSlides();
        count.textContent = (state.indexh + 1) + ' / ' + total;
        previous.disabled = state.indexh === 0;
        next.disabled = state.indexh === total - 1;
    }

    function isInteractive(target) {
        return Boolean(target.closest('a, button, input, select, textarea, [contenteditable="true"]'));
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(function () {});
            }
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    function context() {
        if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
        return audioContext;
    }

    function tone(frequency, start, duration, type, volume) {
        try {
            var audio = context();
            var oscillator = audio.createOscillator();
            var gain = audio.createGain();
            oscillator.connect(gain);
            gain.connect(audio.destination);
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            gain.gain.setValueAtTime(volume, audio.currentTime + start);
            gain.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + start + duration);
            oscillator.start(audio.currentTime + start);
            oscillator.stop(audio.currentTime + start + duration);
        } catch (error) {}
    }

    function playWarningBeep() {
        tone(660, 0, 0.12, 'sine', 0.2);
    }

    function playAlarm() {
        [880, 880, 880, 1100, 1100].forEach(function (frequency, index) {
            tone(frequency, index * 0.3, 0.15, 'square', 0.3);
        });
    }

    function updateTimerDisplay() {
        var display = document.getElementById('timer-display');
        var circle = document.getElementById('timer-circle');
        var mins = Math.floor(timeLeft / 60);
        var secs = timeLeft % 60;
        display.textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
        circle.classList.remove('timer-green', 'timer-yellow', 'timer-red');
        if (timeLeft > 30) circle.classList.add('timer-green');
        else if (timeLeft > 15) circle.classList.add('timer-yellow');
        else circle.classList.add('timer-red');
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        timeLeft = 60;
        updateTimerDisplay();
        document.getElementById('timer-circle').classList.remove('times-up');
        document.getElementById('timer-start').disabled = false;
    }

    function startTimer() {
        if (timerInterval) return;
        document.getElementById('timer-start').disabled = true;
        try { context().resume(); } catch (error) {}
        timerInterval = window.setInterval(function () {
            timeLeft -= 1;
            updateTimerDisplay();
            if (timeLeft === 15 || timeLeft === 10 || timeLeft === 5) playWarningBeep();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                document.getElementById('timer-display').textContent = "TIME'S UP!";
                document.getElementById('timer-circle').classList.add('times-up');
                document.getElementById('timer-start').disabled = false;
                playAlarm();
            }
        }, 1000);
    }

    previous.addEventListener('click', function () { deck.prev(); });
    next.addEventListener('click', function () { deck.next(); });
    fullscreen.addEventListener('click', toggleFullscreen);
    document.getElementById('timer-start').addEventListener('click', startTimer);
    document.getElementById('timer-reset').addEventListener('click', resetTimer);

    document.addEventListener('keydown', function (event) {
        if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
        if (event.target.closest('input, select, textarea, [contenteditable="true"]')) return;
        if (isInteractive(event.target) && (event.key === ' ' || event.key === 'Enter')) return;
        var key = event.key;
        if (key === 'ArrowRight' || key === 'ArrowDown' || key === 'PageDown' || key === ' ' || key === 'Enter') {
            event.preventDefault();
            deck.next();
        } else if (key === 'ArrowLeft' || key === 'ArrowUp' || key === 'PageUp') {
            event.preventDefault();
            deck.prev();
        } else if (key === 'Home') {
            event.preventDefault();
            deck.slide(0);
        } else if (key === 'End') {
            event.preventDefault();
            deck.slide(deck.getTotalSlides() - 1);
        } else if ((key === 'f' || key === 'F') && !event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
            toggleFullscreen();
        }
    });

    document.addEventListener('click', function (event) {
        if (event.defaultPrevented || isInteractive(event.target)) return;
        if (window.getSelection && String(window.getSelection()).trim()) return;
        deck.next();
    });

    document.addEventListener('fullscreenchange', function () {
        var active = Boolean(document.fullscreenElement);
        fullscreen.setAttribute('aria-label', active ? 'Exit fullscreen' : 'Enter fullscreen');
        fullscreen.innerHTML = '<i class="fas ' + (active ? 'fa-compress' : 'fa-expand') + '"></i>';
    });

    deck.on('slidechanged', updateControls);
    deck.initialize().then(function () {
        if (initialHash && initialHash.indexOf('/') === -1) {
            var target = document.getElementById(initialHash);
            if (target && target.matches('.slides > section')) {
                var slides = Array.prototype.slice.call(document.querySelectorAll('.slides > section'));
                deck.slide(slides.indexOf(target));
            }
        }
        updateControls();
    });
}());