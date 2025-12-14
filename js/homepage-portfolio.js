$(document).ready(function() {
    var API_BASE = 'https://shouldcallpaul.replit.app/resume/';
    var racesData = [];

    $.ajax({ url: API_BASE + 'races', type: 'get', dataType: 'json', cache: false,
        success: function(data) {
            racesData = data.records || [];
            renderHobbiesSection();
            setupFilterHandlers();
            setupModalHandlers();
        },
        error: function() {
            $('#hobbies-content').html('<div style="text-align: center; padding: 40px; color: #666;">Failed to load races.</div>');
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

    function renderHobbiesSection() {
        racesData.forEach(function(item, i) {
            var distance = (item.details && item.details.distance) ? item.details.distance : '';
            item._category = getRaceCategory(distance);
            item._index = i;
        });

        var filters = [
            { value: 'all', label: 'All' },
            { value: '5k', label: '5K' },
            { value: '10k', label: '10K' },
            { value: 'half', label: 'Half Marathon' },
            { value: 'marathon', label: 'Marathon' },
            { value: 'other', label: 'Other' }
        ];

        var html = '<div class="filter-buttons" id="filters-hobbies">';
        filters.forEach(function(f) {
            var activeClass = f.value === 'all' ? ' active' : '';
            html += '<button class="filter-btn' + activeClass + '" data-filter="' + f.value + '" data-section="hobbies">' + f.label + '</button>';
        });
        html += '</div>';

        html += '<div class="portfolio-grid" id="grid-hobbies">';
        racesData.forEach(function(item, idx) {
            var img = item.image || 'img-new/banner/2.jpg';
            var label = item.label || 'Untitled';
            html += '<div class="portfolio-card" data-category="' + item._category + '" data-index="' + idx + '">' +
                '<div class="card-image"><img src="' + img + '" alt="' + label + '" loading="lazy"></div>' +
                '<div class="card-content"><h5>' + label + '</h5></div></div>';
        });
        html += '</div>';
        
        $('#hobbies-content').html(html);
        window.raceItems = racesData;
    }

    function setupFilterHandlers() {
        $(document).on('click', '.filter-btn', function() {
            var $btn = $(this);
            var section = $btn.data('section');
            var filter = $btn.data('filter');
            
            $('#filters-' + section + ' .filter-btn').removeClass('active');
            $btn.addClass('active');
            
            var $grid = $('#grid-' + section);
            if (filter === 'all') {
                $grid.find('.portfolio-card').show();
            } else {
                $grid.find('.portfolio-card').each(function() {
                    $(this).toggle($(this).data('category') === filter);
                });
            }
        });
    }

    function setupModalHandlers() {
        $(document).on('click', '.portfolio-card', function() {
            var index = $(this).data('index');
            var item = window.raceItems[index];
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
        if (item.image) {
            pictureHtml = '<div class="thumb"><img src="' + item.image + '" alt="Image" style="max-width: 100%; border-radius: 10px;"></div>';
        }
        if (item.gallery && item.gallery.length > 0) {
            for (var j = 0; j < item.gallery.length; j++) {
                pictureHtml += '<div class="thumb" style="margin-top: 15px;"><img src="' + item.gallery[j] + '" alt="Gallery" style="max-width: 100%; border-radius: 10px;"></div>';
            }
        }
        var linkButtonHtml = '';
        if (item.link) {
            linkButtonHtml = '<a class="btn btn-md circle btn-theme" href="' + item.link + '" target="_blank" style="margin-top: 20px; width: 100%; text-align: center; display: block;">View Results</a>';
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
