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
        },
        error: function() {
            $('#workshop-grid').html('<div class="loading-spinner">Failed to load workshops.</div>');
        }
    });

    function getWorkshopCategory(title) {
        if (!title) return 'speaking';
        var t = title.toLowerCase();
        if (t.includes('ai') || t.includes('chatgpt') || t.includes('artificial') || t.includes('machine learning') || t.includes('prompt')) {
            return 'ai';
        }
        return 'speaking';
    }

    function renderGrid() {
        var html = '';
        allItems.forEach(function(item, idx) {
            var img = getWorkshopImage(item);
            var label = item.label || 'Untitled';
            var categoryLabel = item._category === 'ai' ? 'AI Workshop' : 'Public Speaking';
            html += '<div class="portfolio-card" data-category="' + item._category + '" data-index="' + idx + '">' +
                '<div class="card-image"><img src="' + img + '" alt="' + label + '" loading="lazy"></div>' +
                '<div class="card-content"><h5>' + label + '</h5>' +
                '<span class="card-category">' + categoryLabel + '</span></div></div>';
        });
        $('#workshop-grid').html(html);
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
            if (item) openModal(item);
        });
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    function openModal(item) {
        var detailsHtml = '';
        if (item.details) {
            for (var key in item.details) {
                detailsHtml += '<li><div class="icon"><i class="fas fa-chevron-right"></i></div>' +
                    '<div class="content"><h4>' + toTitleCase(key) + '</h4><span>' + item.details[key] + '</span></div></li>';
            }
        }
        var pictureHtml = '';
        var modalImage = getWorkshopImage(item);
        if (modalImage) {
            pictureHtml = '<div class="thumb"><img src="' + modalImage + '" alt="Image" style="max-width: 100%; border-radius: 10px;"></div>';
        }
        if (item.gallery && item.gallery.length > 0) {
            for (var j = 0; j < item.gallery.length; j++) {
                pictureHtml += '<div class="thumb" style="margin-top: 15px;"><img src="' + item.gallery[j] + '" alt="Gallery" style="max-width: 100%; border-radius: 10px;"></div>';
            }
        }
        var linkButtonHtml = '';
        if (item.link) {
            linkButtonHtml = '<a class="btn btn-md circle btn-theme" href="' + item.link + '" target="_blank" style="margin-top: 20px; width: 100%; text-align: center; display: block;">Learn More</a>';
        }
        var modalContent = '<div class="container"><div class="row">' +
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
        var portfolioModal = new bootstrap.Modal(document.getElementById('portfolioModal'));
        portfolioModal.show();
        $('.portfolio-modal-close-btn').on('click', function() { portfolioModal.hide(); });
    }
});
