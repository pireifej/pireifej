var ModalNav = (function() {
    var currentIndex = -1;
    var itemsList = [];
    var openModalFn = null;
    var touchStartX = 0;
    var touchEndX = 0;
    var styleInjected = false;

    function init(items, openFn) {
        itemsList = items;
        openModalFn = openFn;
    }

    function setCurrent(index) {
        currentIndex = index;
    }

    function getVisibleIndices() {
        var visible = [];
        $('.portfolio-card:visible').each(function() {
            visible.push(parseInt($(this).data('index')));
        });
        return visible;
    }

    function navigate(direction) {
        var visible = getVisibleIndices();
        if (visible.length === 0) return;
        var pos = visible.indexOf(currentIndex);
        var newPos;
        if (direction === 'next') {
            newPos = pos + 1;
            if (newPos >= visible.length) newPos = 0;
        } else {
            newPos = pos - 1;
            if (newPos < 0) newPos = visible.length - 1;
        }
        currentIndex = visible[newPos];
        if (openModalFn && itemsList[currentIndex]) {
            openModalFn(itemsList[currentIndex], currentIndex);
            var modalEl = document.getElementById('portfolioModal');
            if (modalEl) modalEl.scrollTop = 0;
        }
    }

    function getNavButtonsHtml() {
        return '<button class="modal-nav-btn modal-nav-prev" title="Previous"><i class="fas fa-chevron-left"></i></button>' +
               '<button class="modal-nav-btn modal-nav-next" title="Next"><i class="fas fa-chevron-right"></i></button>';
    }

    function bindEvents() {
        $(document).off('click.modalnav keydown.modalnav');

        $(document).on('click.modalnav', '.modal-nav-prev', function(e) {
            e.stopPropagation();
            navigate('prev');
        });

        $(document).on('click.modalnav', '.modal-nav-next', function(e) {
            e.stopPropagation();
            navigate('next');
        });

        $(document).on('keydown.modalnav', function(e) {
            var modal = document.getElementById('portfolioModal');
            if (!modal || !modal.classList.contains('show')) return;
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                navigate('prev');
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                navigate('next');
            }
        });

        var modalBody = document.getElementById('portfolioModalContent');
        if (modalBody) {
            modalBody.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            modalBody.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                var diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        navigate('next');
                    } else {
                        navigate('prev');
                    }
                }
            }, { passive: true });
        }
    }

    function injectStyleOnce() {
        if (styleInjected) return;
        styleInjected = true;
        $('head').append('<style>' +
            '.modal-nav-btn { position: fixed; top: 50%; transform: translateY(-50%); z-index: 1060; background: rgba(255,255,255,0.9); border: none; width: 50px; height: 50px; border-radius: 50%; font-size: 1.2rem; color: #333; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; }' +
            '.modal-nav-btn:hover { background: #fff; transform: translateY(-50%) scale(1.1); }' +
            '.modal-nav-prev { left: 15px; }' +
            '.modal-nav-next { right: 15px; }' +
            '@media (max-width: 768px) { .modal-nav-btn { width: 40px; height: 40px; font-size: 1rem; } .modal-nav-prev { left: 8px; } .modal-nav-next { right: 8px; } }' +
            '</style>');
    }

    return {
        init: init,
        setCurrent: setCurrent,
        getNavButtonsHtml: getNavButtonsHtml,
        bindEvents: bindEvents,
        injectStyleOnce: injectStyleOnce
    };
})();