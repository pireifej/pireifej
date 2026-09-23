(function () {
    'use strict';

    var root = document.documentElement;
    root.classList.add('academy-presentation');

    function init() {
        var wrapper = document.querySelector('.slides-wrapper');
        if (!wrapper) return;

        var slides = Array.prototype.slice.call(wrapper.querySelectorAll(':scope > .slide-section'));
        if (!slides.length) return;

        // The deck is usable now; external video loads must not block its controls.
        var preloader = document.getElementById('preloader');
        if (preloader) preloader.remove();

        var dotsNav = document.querySelector('.nav-dots');
        if (!dotsNav) {
            dotsNav = document.createElement('nav');
            dotsNav.className = 'nav-dots';
            dotsNav.setAttribute('aria-label', 'Choose a slide');
            document.body.appendChild(dotsNav);
        }

        dotsNav.innerHTML = '';
        var dots = slides.map(function (slide, index) {
            if (!slide.id) slide.id = 'slide-' + (index + 1);
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', (index + 1) + ' of ' + slides.length);
            slide.setAttribute('tabindex', '-1');

            var dot = document.createElement('a');
            dot.href = '#' + slide.id;
            dot.title = slide.querySelector('h1, h2, h3') ? slide.querySelector('h1, h2, h3').textContent.trim() : 'Slide ' + (index + 1);
            dot.setAttribute('aria-label', 'Go to slide ' + (index + 1) + ': ' + dot.title);
            dot.addEventListener('click', function (event) {
                event.preventDefault();
                show(index, true);
            });
            dotsNav.appendChild(dot);
            return dot;
        });

        var controls = document.createElement('div');
        controls.className = 'academy-controls';
        controls.setAttribute('role', 'group');
        controls.setAttribute('aria-label', 'Presentation controls');
        controls.innerHTML =
            '<button type="button" class="academy-prev" aria-label="Previous slide" title="Previous slide (Left arrow)"><i class="fas fa-chevron-left" aria-hidden="true"></i></button>' +
            '<span class="academy-slide-count" aria-live="polite"></span>' +
            '<button type="button" class="academy-next" aria-label="Next slide" title="Next slide (Right arrow)"><i class="fas fa-chevron-right" aria-hidden="true"></i></button>' +
            '<button type="button" class="academy-fullscreen" aria-label="Enter fullscreen" title="Toggle fullscreen"><i class="fas fa-expand" aria-hidden="true"></i></button>';
        document.body.appendChild(controls);

        var previous = controls.querySelector('.academy-prev');
        var next = controls.querySelector('.academy-next');
        var count = controls.querySelector('.academy-slide-count');
        var fullscreen = controls.querySelector('.academy-fullscreen');
        var current = 0;

        function hashIndex() {
            var id;
            try {
                id = decodeURIComponent(window.location.hash.slice(1));
            } catch (error) {
                return -1;
            }
            if (!id) return -1;
            return slides.findIndex(function (slide) { return slide.id === id; });
        }

        function updateHash(id, push) {
            var hash = '#' + encodeURIComponent(id);
            if (window.location.hash === hash) return;
            if (push) {
                window.history.pushState(null, '', hash);
            } else {
                window.history.replaceState(null, '', hash);
            }
        }

        function show(index, pushHash) {
            index = Math.max(0, Math.min(index, slides.length - 1));
            current = index;
            slides.forEach(function (slide, slideIndex) {
                var active = slideIndex === current;
                slide.classList.toggle('is-active', active);
                slide.setAttribute('aria-hidden', active ? 'false' : 'true');
                if (active) slide.scrollTop = 0;
            });
            dots.forEach(function (dot, dotIndex) {
                var active = dotIndex === current;
                dot.classList.toggle('active', active);
                if (active) dot.setAttribute('aria-current', 'page');
                else dot.removeAttribute('aria-current');
            });
            previous.disabled = current === 0;
            next.disabled = current === slides.length - 1;
            count.textContent = (current + 1) + ' / ' + slides.length;
            updateHash(slides[current].id, pushHash);
            if (pushHash) slides[current].focus({ preventScroll: true });
        }

        previous.addEventListener('click', function () { show(current - 1, true); });
        next.addEventListener('click', function () { show(current + 1, true); });

        Array.prototype.forEach.call(document.querySelectorAll('.scroll-indicator'), function (indicator) {
            indicator.removeAttribute('onclick');
            indicator.setAttribute('role', 'button');
            indicator.setAttribute('tabindex', '0');
            indicator.setAttribute('aria-label', 'Next slide');
            indicator.addEventListener('click', function () { show(current + 1, true); });
            indicator.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    show(current + 1, true);
                }
            });
        });

        fullscreen.addEventListener('click', function () {
            if (!(document.fullscreenElement || document.webkitFullscreenElement)) {
                var request = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
                if (request) {
                    var result = request.call(document.documentElement);
                    if (result && result.catch) result.catch(function () {});
                }
            } else {
                var exit = document.exitFullscreen || document.webkitExitFullscreen;
                if (exit) exit.call(document);
            }
        });

        document.addEventListener('fullscreenchange', function () {
            var isFullscreen = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
            fullscreen.setAttribute('aria-label', isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen');
            fullscreen.title = isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen';
            fullscreen.innerHTML = '<i class="fas ' + (isFullscreen ? 'fa-compress' : 'fa-expand') + '" aria-hidden="true"></i>';
        });
        document.addEventListener('webkitfullscreenchange', function () {
            var isFullscreen = Boolean(document.webkitFullscreenElement);
            fullscreen.setAttribute('aria-label', isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen');
            fullscreen.title = isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen';
            fullscreen.innerHTML = '<i class="fas ' + (isFullscreen ? 'fa-compress' : 'fa-expand') + '" aria-hidden="true"></i>';
        });

        function isInteractive(target) {
            return Boolean(target.closest('a, button, input, select, textarea, video, iframe, [contenteditable="true"], .flip-card, .whiteboard, .drawing-board, .timer-container'));
        }

        document.addEventListener('keydown', function (event) {
            if (event.defaultPrevented || isInteractive(event.target)) return;
            if (event.key === 'ArrowRight' || event.key === 'PageDown') {
                event.preventDefault();
                show(current + 1, true);
            } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
                event.preventDefault();
                show(current - 1, true);
            } else if (event.key === 'Home') {
                event.preventDefault();
                show(0, true);
            } else if (event.key === 'End') {
                event.preventDefault();
                show(slides.length - 1, true);
            } else if ((event.key === 'f' || event.key === 'F') && !event.ctrlKey && !event.metaKey && !event.altKey) {
                event.preventDefault();
                fullscreen.click();
            }
        });

        window.addEventListener('popstate', function () {
            var index = hashIndex();
            if (index >= 0) show(index, false);
        });
        window.addEventListener('hashchange', function () {
            var index = hashIndex();
            if (index >= 0 && index !== current) show(index, false);
        });

        var initial = hashIndex();
        show(initial >= 0 ? initial : 0, false);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}());