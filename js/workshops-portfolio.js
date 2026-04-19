$(document).ready(function() {
    var API_BASE = 'https://shouldcallpaul.replit.app/resume/';
    var allItems = [];

    var customWorkshopImages = {
        'Master the Art of Public Speaking - Bell Works': 'img-new/workshops/public_speaking_workshop_bell_works.png',
        'Youth Leadership Program - Coordinator': 'img/PXL_20240824_152158036.MP.jpg'
    };

    function getWorkshopImage(item) {
        var label = item.label || '';
        if (customWorkshopImages[label]) {
            return customWorkshopImages[label];
        }
        return item.image || 'img-new/banner/2.jpg';
    }

    $.ajax({ url: API_BASE + 'workshops', type: 'get', dataType: 'json', cache: false,
        success: function(data) {
            allItems = data.records || [];
            allItems.forEach(function(item) {
                item._category = getWorkshopCategory(item.label || item.title);
            });
            renderGrid();
            setupFilterHandlers();
            setupModalHandlers();
            ModalNav.init(allItems, openModal);
            ModalNav.bindEvents();
        },
        error: function() {
            $('#workshop-grid').html('<div class="loading-spinner">Failed to load workshops.</div>');
        }
    });

    function getWorkshopCategory(title) {
        if (!title) return 'speaking';
        var t = title.toLowerCase();
        if (t.indexOf(' ai ') !== -1 || t.indexOf('ai ') === 0 || t.indexOf(' ai') === t.length - 3 ||
            t.indexOf('chatgpt') !== -1 || t.indexOf('artificial') !== -1 ||
            t.indexOf('machine learning') !== -1 || t.indexOf('prompt') !== -1) {
            return 'ai';
        }
        if (t.indexOf('career day') !== -1 || t.indexOf('youth leadership') !== -1 ||
            t.indexOf('week of respect') !== -1 || t.indexOf('school') !== -1 ||
            t.indexOf('grades') !== -1) {
            return 'youth';
        }
        return 'speaking';
    }

    function getInitialFilter() {
        var match = window.location.search.match(/[?&]filter=([^&]+)/);
        if (!match) return 'all';
        var f = decodeURIComponent(match[1]).toLowerCase();
        if (f === 'ai' || f === 'speaking' || f === 'youth' || f === 'all') return f;
        return 'all';
    }

    function applyFilter(filter) {
        $('.filter-btn').removeClass('active');
        $('.filter-btn[data-filter="' + filter + '"]').addClass('active');
        if (filter === 'all') {
            $('.portfolio-card').show();
        } else {
            $('.portfolio-card').each(function() {
                $(this).toggle($(this).data('category') === filter);
            });
        }
    }

    function renderGrid() {
        var html = '';
        allItems.forEach(function(item, idx) {
            var img = getWorkshopImage(item);
            var label = item.label || 'Untitled';
            var categoryLabel = item._category === 'ai' ? 'AI Workshop'
                : item._category === 'youth' ? 'Youth & Community'
                : 'Public Speaking';
            html += '<div class="portfolio-card" data-category="' + item._category + '" data-index="' + idx + '">' +
                '<div class="card-image"><img src="' + img + '" alt="' + label + '" loading="lazy"></div>' +
                '<div class="card-content"><h5>' + label + '</h5>' +
                '<span class="card-category">' + categoryLabel + '</span></div></div>';
        });
        $('#workshop-grid').html(html);
        applyFilter(getInitialFilter());
    }

    function setupFilterHandlers() {
        $('.filter-btn').on('click', function() {
            applyFilter($(this).data('filter'));
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
        var modalImage = getWorkshopImage(item);
        var allImages = [];
        if (modalImage) allImages.push(modalImage);
        if (item.gallery && item.gallery.length > 0) {
            for (var j = 0; j < item.gallery.length; j++) {
                if (item.gallery[j] !== modalImage) allImages.push(item.gallery[j]);
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
            linkButtonHtml = '<a class="btn btn-md circle btn-theme" href="' + item.link + '" target="_blank" style="margin-top: 20px; width: 100%; text-align: center; display: block;">Learn More</a>';
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