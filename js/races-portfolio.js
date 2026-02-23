$(document).ready(function() {
    var API_BASE = 'https://shouldcallpaul.replit.app/resume/';
    var allItems = [];

    $.ajax({ url: API_BASE + 'races', type: 'get', dataType: 'json', cache: false,
        success: function(data) {
            allItems = data.records || [];
            allItems.forEach(function(item) {
                var distance = (item.details && item.details.distance) ? item.details.distance : '';
                item._category = getRaceCategory(distance);
            });
            renderGrid();
            setupFilterHandlers();
            setupModalHandlers();
            ModalNav.init(allItems, openModal);
            ModalNav.bindEvents();
        },
        error: function() {
            $('#race-grid').html('<div class="loading-spinner">Failed to load races.</div>');
        }
    });

    function getRaceCategory(distance) {
        if (!distance) return 'other';
        var dist = distance.toLowerCase().trim();
        if (dist.includes('26.2')) return 'marathon';
        if (dist.includes('13.1')) return 'half';
        if (dist.includes('6.2')) return '10k';
        if (dist.includes('3.1')) return '5k';
        return 'other';
    }

    function getCategoryLabel(cat) {
        var labels = { '5k': '5K', '10k': '10K', 'half': 'Half Marathon', 'marathon': 'Marathon', 'other': 'Other' };
        return labels[cat] || 'Race';
    }

    function renderGrid() {
        var html = '';
        allItems.forEach(function(item, idx) {
            var img = item.image || 'img-new/banner/2.jpg';
            var label = item.label || 'Untitled';
            html += '<div class="portfolio-card" data-category="' + item._category + '" data-index="' + idx + '">' +
                '<div class="card-image"><img src="' + img + '" alt="' + label + '" loading="lazy"></div>' +
                '<div class="card-content"><h5>' + label + '</h5>' +
                '<span class="card-category">' + getCategoryLabel(item._category) + '</span></div></div>';
        });
        $('#race-grid').html(html);
    }

    function setupFilterHandlers() {
        $('.filter-btn').on('click', function() {
            var filter = $(this).data('filter');
            $('.filter-btn').removeClass('active');
            $(this).addClass('active');
            if (filter === 'all') {
                $('.portfolio-card').show();
            } else {
                $('.portfolio-card').each(function() {
                    $(this).toggle($(this).data('category') === filter);
                });
            }
        });
    }

    function setupModalHandlers() {
        $(document).on('click', '.portfolio-card', function() {
            var index = $(this).data('index');
            var item = allItems[index];
            if (item) openModal(item, index);
        });
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    function openModal(item, index) {
        if (typeof index !== 'undefined') ModalNav.setCurrent(index);
        var detailsHtml = '';
        if (item.details) {
            for (var key in item.details) {
                detailsHtml += '<li><div class="icon"><i class="fas fa-chevron-right"></i></div>' +
                    '<div class="content"><h4>' + toTitleCase(key) + '</h4><span>' + item.details[key] + '</span></div></li>';
            }
        }
        var allImages = [];
        if (item.image) allImages.push(item.image);
        if (item.gallery && item.gallery.length > 0) {
            for (var j = 0; j < item.gallery.length; j++) {
                if (item.gallery[j] !== item.image) allImages.push(item.gallery[j]);
            }
        }
        var pictureHtml = '';
        if (allImages.length > 1) {
            pictureHtml = '<div class="swiper modal-image-swiper" style="border-radius: 10px; overflow: hidden;">' +
                '<div class="swiper-wrapper">';
            for (var k = 0; k < allImages.length; k++) {
                pictureHtml += '<div class="swiper-slide"><img src="' + allImages[k] + '" alt="Photo ' + (k+1) + '" style="width: 100%; display: block; border-radius: 10px;"></div>';
            }
            pictureHtml += '</div>' +
                '<div class="swiper-button-prev"></div>' +
                '<div class="swiper-button-next"></div>' +
                '<div class="swiper-pagination"></div>' +
                '</div>';
        } else if (allImages.length === 1) {
            pictureHtml = '<div class="thumb"><img src="' + allImages[0] + '" alt="Image" style="max-width: 100%; border-radius: 10px;"></div>';
        }
        var linkButtonHtml = '';
        if (item.link) {
            linkButtonHtml = '<a class="btn btn-md circle btn-theme" href="' + item.link + '" target="_blank" style="margin-top: 20px; width: 100%; text-align: center; display: block;">View Results</a>';
        }
        ModalNav.injectStyleOnce();
        var modalContent = ModalNav.getNavButtonsHtml() +
            '<div class="container"><div class="row">' +
            '<div class="col-12 d-md-none" style="margin-bottom: 20px; padding-top: 60px;">' +
            '<a class="btn btn-md circle portfolio-modal-close-btn" style="width: 100%; text-align: center; display: block; background: #fff; color: #333; cursor: pointer;">Close</a></div>' +
            '<div class="col-12 d-none d-md-block" style="margin-bottom: 20px;">' +
            '<button type="button" class="portfolio-modal-close-btn btn btn-light" style="float: right; width: 45px; height: 45px; border-radius: 50%; font-size: 22px; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.3); display: inline-flex; align-items: center; justify-content: center; line-height: 1;">&#10005;</button><div style="clear: both;"></div></div></div>' +
            '<div class="row align-center justify-content-center">' +
            '<div class="col-lg-5 col-md-6" style="margin-bottom: 30px;">' + pictureHtml + '</div>' +
            '<div class="col-lg-6 col-md-6 offset-lg-1">' +
            '<h4 class="sub-title" style="color: #fff;">Details</h4>' +
            '<h2 class="title" style="color: #fff; font-size: 2rem;">' + (item.label || 'Untitled') + '</h2>' +
            '<div style="color: #fff; margin-bottom: 20px; font-size: 16px; line-height: 1.6;">' + (item.desc || '') + '</div>' +
            '<div class="skill-list" style="margin-bottom: 25px;"><ul style="color: #fff;">' + detailsHtml + '</ul></div>' +
            linkButtonHtml + '</div></div></div>';
        $('#portfolioModalContent').html(modalContent);
        if (allImages.length > 1) {
            new Swiper('.modal-image-swiper', {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: true,
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
                pagination: { el: '.swiper-pagination', clickable: true }
            });
        }
        var modalEl = document.getElementById('portfolioModal');
        var portfolioModal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        portfolioModal.show();
        $('#portfolioModalContent').scrollTop(0);
        $('.portfolio-modal-close-btn').on('click', function() { portfolioModal.hide(); });
    }
});