$(document).ready(function() {
    var API_URL = 'https://shouldcallpaul.replit.app/speaker/speaker_menu';

    var shortTitles = {
        'ai_technology': 'AI & Technology',
        'public_speaking': 'Public Speaking',
        'youth_education': 'Youth & Education'
    };

    if (window.__WORKSHOP_CATALOG_DATA__ && Array.isArray(window.__WORKSHOP_CATALOG_DATA__.categories)) {
        setupFilterHandlers();
    } else {
        $.ajax({ url: API_URL, type: 'get', dataType: 'json', cache: false,
            success: function(data) {
                renderFilters(data.categories || []);
                renderCatalog(data.categories || []);
                setupFilterHandlers();
            },
            error: function() {
                $('#catalog-content').html('<div class="loading-spinner">Failed to load the catalog. Please try again later.</div>');
            }
        });
    }

    function esc(s) {
        return $('<div>').text(s || '').html();
    }

    function renderFilters(categories) {
        var $filters = $('#catalog-filters');
        categories.forEach(function(cat) {
            var label = shortTitles[cat.id] || cat.title;
            $filters.append('<button class="filter-btn" data-filter="' + esc(cat.id) + '">' + esc(label) + '</button>');
        });
    }

    function renderCatalog(categories) {
        var html = '';
        categories.forEach(function(cat) {
            var items = cat.items || [];
            html += '<div class="catalog-section" data-category="' + esc(cat.id) + '">';
            html += '<h2 class="catalog-section-title">' + esc(cat.title) + '</h2>';
            html += '<div class="catalog-section-count">' + items.length + (items.length === 1 ? ' offering' : ' offerings') + '</div>';
            html += '<div class="catalog-list">';
            items.forEach(function(item) {
                html += '<div class="catalog-item">';
                html += '<div class="catalog-item-header">';
                html += '<h5>' + esc(item.title) + '</h5>';
                if (item.type === 'series') {
                    var count = (item.parts || []).length;
                    html += '<span class="catalog-badge">' + (count ? count + '-Part ' : '') + 'Series</span>';
                }
                html += '</div>';
                if (item.description) {
                    html += '<p>' + esc(item.description) + '</p>';
                }
                if (item.parts && item.parts.length) {
                    html += '<ul class="catalog-parts">';
                    item.parts.forEach(function(part, i) {
                        html += '<li>' + (i + 1) + '. ' + esc(part) + '</li>';
                    });
                    html += '</ul>';
                }
                html += '</div>';
            });
            html += '</div></div>';
        });
        $('#catalog-content').html(html);
    }

    function setupFilterHandlers() {
        $('#catalog-filters').on('click', '.filter-btn', function() {
            $('#catalog-filters .filter-btn').removeClass('active');
            $(this).addClass('active');
            var filter = $(this).data('filter');
            if (filter === 'all') {
                $('.catalog-section').show();
            } else {
                $('.catalog-section').hide();
                $('.catalog-section[data-category="' + filter + '"]').show();
            }
        });
    }
});
