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

    function updateControls() {
        var state = deck.getState();
        var total = deck.getTotalSlides();
        count.textContent = (state.indexh + 1) + ' / ' + total;
        previous.disabled = state.indexh === 0;
        next.disabled = state.indexh === total - 1;
        var current = deck.getCurrentSlide();
        if (current) {
            current.querySelectorAll('iframe[data-src]').forEach(function (frame) {
                frame.src = frame.getAttribute('data-src');
                frame.removeAttribute('data-src');
            });
        }
    }

    function isInteractive(target) {
        return Boolean(target.closest('a, button, iframe, input, select, textarea, [contenteditable="true"]'));
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

    previous.addEventListener('click', function () { deck.prev(); });
    next.addEventListener('click', function () { deck.next(); });
    fullscreen.addEventListener('click', toggleFullscreen);

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