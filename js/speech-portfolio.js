$(document).ready(function() {
    var API_BASE = 'https://shouldcallpaul.replit.app/resume/';
    var allItems = [];

    var customSpeechImages = {
        'Paul, Why Are You So Weird?': 'img-new/speeches/quirky_weird_personality_visual.png'
    };

    var centeredImages = ["Mom's Spaghetti", "We Are Only Human"];

    function getSpeechImage(item) {
        var label = item.label || '';
        if (customSpeechImages[label]) {
            return customSpeechImages[label];
        }
        return item.image || 'img-new/banner/2.jpg';
    }

    function needsCentering(label) {
        return centeredImages.indexOf(label) !== -1;
    }

    $.ajax({ url: API_BASE + 'speech', type: 'get', dataType: 'json', cache: false,
        success: function(data) {
            allItems = data.records || [];
            renderGrid();
            setupModalHandlers();
        },
        error: function() {
            $('#speech-grid').html('<div class="loading-spinner">Failed to load speeches.</div>');
        }
    });

    function renderGrid() {
        var html = '';
        allItems.forEach(function(item, idx) {
            var img = getSpeechImage(item);
            var label = item.label || 'Untitled';
            var centerStyle = needsCentering(label) ? ' style="object-position: center top;"' : '';
            html += '<div class="portfolio-card" data-index="' + idx + '">' +
                '<div class="card-image"><img src="' + img + '" alt="' + label + '"' + centerStyle + ' loading="lazy"></div>' +
                '<div class="card-content"><h5>' + label + '</h5></div></div>';
        });
        $('#speech-grid').html(html);
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
        var modalImage = getSpeechImage(item);
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
            linkButtonHtml = '<a class="btn btn-md circle btn-theme" href="' + item.link + '" target="_blank" style="margin-top: 20px; width: 100%; text-align: center; display: block;">Watch Speech</a>';
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
