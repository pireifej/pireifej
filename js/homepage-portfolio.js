$(document).ready(function() {
    console.log('Homepage Portfolio JS loaded');
    const API_BASE = 'https://shouldcallpaul.replit.app/resume/';
    
    let technicalData = { projects: [], conference: [], hackathon: [], patent: [] };
    let speechData = [];
    let workshopsData = [];
    let racesData = [];
    
    let loadedCount = 0;
    const TOTAL_LOADS = 7;

    function checkAllLoaded() {
        loadedCount++;
        console.log('Loaded count:', loadedCount, '/', TOTAL_LOADS);
        if (loadedCount >= TOTAL_LOADS) {
            console.log('All data loaded, rendering sections...');
            renderAllSections();
        }
    }

    $.ajax({ url: API_BASE + 'projects', type: 'get', dataType: 'json', cache: false,
        success: function(data) { technicalData.projects = data.records || []; checkAllLoaded(); },
        error: checkAllLoaded
    });
    $.ajax({ url: API_BASE + 'conference', type: 'get', dataType: 'json', cache: false,
        success: function(data) { technicalData.conference = data.records || []; checkAllLoaded(); },
        error: checkAllLoaded
    });
    $.ajax({ url: API_BASE + 'hackathon', type: 'get', dataType: 'json', cache: false,
        success: function(data) { technicalData.hackathon = data.records || []; checkAllLoaded(); },
        error: checkAllLoaded
    });
    $.ajax({ url: API_BASE + 'patent', type: 'get', dataType: 'json', cache: false,
        success: function(data) { technicalData.patent = data.records || []; checkAllLoaded(); },
        error: checkAllLoaded
    });
    $.ajax({ url: API_BASE + 'speech', type: 'get', dataType: 'json', cache: false,
        success: function(data) { speechData = data.records || []; checkAllLoaded(); },
        error: checkAllLoaded
    });
    $.ajax({ url: API_BASE + 'workshops', type: 'get', dataType: 'json', cache: false,
        success: function(data) { workshopsData = data.records || []; checkAllLoaded(); },
        error: checkAllLoaded
    });
    $.ajax({ url: API_BASE + 'races', type: 'get', dataType: 'json', cache: false,
        success: function(data) { racesData = data.records || []; checkAllLoaded(); },
        error: checkAllLoaded
    });

    function getWorkshopCategory(title) {
        if (!title) return 'speaking';
        var t = title.toLowerCase();
        if (t.includes('ai') || t.includes('chatgpt') || t.includes('artificial') || t.includes('machine learning') || t.includes('prompt')) {
            return 'ai';
        }
        return 'speaking';
    }

    function getRaceCategory(distance) {
        if (!distance) return 'other';
        var dist = distance.toLowerCase().trim();
        if (dist.includes('26.2')) return 'marathon';
        if (dist.includes('13.1')) return 'half';
        if (dist.includes('6.2')) return '10k';
        if (dist.includes('3.1')) return '5k';
        return 'other';
    }

    function createItemCard(item, category, index) {
        var img = item.image || 'img-new/banner/2.jpg';
        var label = item.label || 'Untitled';
        return `
            <div class="portfolio-card" data-category="${category}" data-index="${index}">
                <div class="card-image">
                    <img src="${img}" alt="${label}" loading="lazy">
                </div>
                <div class="card-content">
                    <h5>${label}</h5>
                </div>
            </div>
        `;
    }

    function createFilterButtons(filters, sectionId) {
        var html = '<div class="filter-buttons" id="filters-' + sectionId + '">';
        filters.forEach(function(f) {
            var activeClass = f.value === 'all' ? ' active' : '';
            html += `<button class="filter-btn${activeClass}" data-filter="${f.value}" data-section="${sectionId}">${f.label}</button>`;
        });
        html += '</div>';
        return html;
    }

    function renderAllSections() {
        renderTechnicalSection();
        renderSpeechSection();
        renderWorkshopsSection();
        renderHobbiesSection();
        setupFilterHandlers();
        setupModalHandlers();
    }

    function renderTechnicalSection() {
        console.log('Rendering Technical section...');
        var allItems = [];
        technicalData.projects.forEach(function(item, i) { 
            item._category = 'projects'; item._index = i;
            allItems.push(item); 
        });
        technicalData.conference.forEach(function(item, i) { 
            item._category = 'conference'; item._index = i;
            allItems.push(item); 
        });
        technicalData.hackathon.forEach(function(item, i) { 
            item._category = 'hackathon'; item._index = i;
            allItems.push(item); 
        });
        technicalData.patent.forEach(function(item, i) { 
            item._category = 'patent'; item._index = i;
            allItems.push(item); 
        });

        var filters = [
            { value: 'all', label: 'All' },
            { value: 'projects', label: 'Work Projects' },
            { value: 'conference', label: 'Conferences' },
            { value: 'hackathon', label: 'Hackathons' },
            { value: 'patent', label: 'Patents' }
        ];

        var html = createFilterButtons(filters, 'technical');
        html += '<div class="portfolio-grid" id="grid-technical">';
        allItems.forEach(function(item, idx) {
            html += createItemCard(item, item._category, idx);
        });
        html += '</div>';
        
        $('#technical-content').html(html);
        window.technicalItems = allItems;
        console.log('Technical section rendered with', allItems.length, 'items');
    }

    function renderSpeechSection() {
        var html = '<div class="portfolio-grid" id="grid-speech">';
        speechData.forEach(function(item, idx) {
            item._category = 'speech';
            item._index = idx;
            html += createItemCard(item, 'speech', idx);
        });
        html += '</div>';
        
        $('#speech-content').html(html);
        window.speechItems = speechData;
        console.log('Speech section rendered with', speechData.length, 'items');
    }

    function renderWorkshopsSection() {
        workshopsData.forEach(function(item, i) {
            item._category = getWorkshopCategory(item.label || item.title);
            item._index = i;
        });

        var filters = [
            { value: 'all', label: 'All' },
            { value: 'ai', label: 'AI Workshops' },
            { value: 'speaking', label: 'Public Speaking' }
        ];

        var html = createFilterButtons(filters, 'workshops');
        html += '<div class="portfolio-grid" id="grid-workshops">';
        workshopsData.forEach(function(item, idx) {
            html += createItemCard(item, item._category, idx);
        });
        html += '</div>';
        
        $('#workshops-content').html(html);
        window.workshopItems = workshopsData;
        console.log('Workshops section rendered with', workshopsData.length, 'items');
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

        var html = createFilterButtons(filters, 'hobbies');
        html += '<div class="portfolio-grid" id="grid-hobbies">';
        racesData.forEach(function(item, idx) {
            html += createItemCard(item, item._category, idx);
        });
        html += '</div>';
        
        $('#hobbies-content').html(html);
        window.raceItems = racesData;
        console.log('Hobbies section rendered with', racesData.length, 'items');
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
                    var cat = $(this).data('category');
                    $(this).toggle(cat === filter);
                });
            }
        });
    }

    function setupModalHandlers() {
        $(document).on('click', '.portfolio-card', function() {
            var $card = $(this);
            var section = $card.closest('.portfolio-section').attr('id');
            var index = $card.data('index');
            var category = $card.data('category');
            
            var item = null;
            if (section === 'technical-section') {
                item = window.technicalItems[index];
            } else if (section === 'speech-section') {
                item = window.speechItems[index];
            } else if (section === 'workshops-section') {
                item = window.workshopItems[index];
            } else if (section === 'hobbies-section') {
                item = window.raceItems[index];
            }
            
            if (item) {
                openPortfolioModal(item, section);
            }
        });
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    function openPortfolioModal(item, section) {
        var detailsHtml = "";
        if (item.details) {
            for (var key in item.details) {
                var detailTitle = toTitleCase(key);
                detailsHtml += `
                    <li>
                        <div class="icon"><i class="fab fa-figma"></i></div>
                        <div class="content">
                            <h4>${detailTitle}</h4>
                            <span>${item.details[key]}</span>
                        </div>
                    </li>`;
            }
        }
        
        var pictureHtml = "";
        if (item.image) {
            pictureHtml = `<div class="thumb"><img src="${item.image}" alt="Image" style="max-width: 100%; border-radius: 10px;"></div>`;
        }
        if (item.gallery && item.gallery.length > 0) {
            for (var j = 0; j < item.gallery.length; j++) {
                pictureHtml += `<div class="thumb" style="margin-top: 15px;"><img src="${item.gallery[j]}" alt="Gallery" style="max-width: 100%; border-radius: 10px;"></div>`;
            }
        }
        
        var buttonLabel = "Check it out";
        if (item.type === "race") buttonLabel = "View Results";
        if (item.type === "speech") buttonLabel = "Watch Speech";
        if (item.type === "patent") buttonLabel = "View Patent";
        
        var linkButtonHtml = "";
        if (item.link) {
            linkButtonHtml = `<a class="btn btn-md circle btn-theme" href="${item.link}" target="_blank" style="margin-top: 20px; width: 100%; text-align: center; display: block;">${buttonLabel}</a>`;
        }
        
        var modalContent = `
            <div class="container">
                <div class="row">
                    <div class="col-12 d-md-none" style="margin-bottom: 20px; padding-top: 60px;">
                        <a class="btn btn-md circle portfolio-modal-close-btn" style="width: 100%; text-align: center; display: block; background: #fff; color: #333; cursor: pointer;">Close</a>
                    </div>
                    <div class="col-12 d-none d-md-block" style="margin-bottom: 20px;">
                        <button type="button" class="portfolio-modal-close-btn btn btn-light" style="float: right; width: 45px; height: 45px; border-radius: 50%; font-size: 22px; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.3); display: inline-flex; align-items: center; justify-content: center; line-height: 1;">✕</button>
                        <div style="clear: both;"></div>
                    </div>
                </div>
                <div class="row align-center justify-content-center">
                    <div class="col-lg-5 col-md-6" style="margin-bottom: 30px;">
                        ${pictureHtml}
                    </div>
                    <div class="col-lg-6 col-md-6 offset-lg-1">
                        <h4 class="sub-title" style="color: #fff;">Details</h4>
                        <h2 class="title" style="color: #fff; font-size: 2rem;">${item.label || 'Untitled'}</h2>
                        <div style="color: #fff; margin-bottom: 20px; font-size: 16px; line-height: 1.6;">
                            ${item.desc || ''}
                        </div>
                        <div class="skill-list" style="margin-bottom: 25px;">
                            <ul style="color: #fff;">
                                ${detailsHtml}
                            </ul>
                        </div>
                        ${linkButtonHtml}
                    </div>
                </div>
            </div>
        `;
        
        $('#portfolioModalContent').html(modalContent);
        var portfolioModal = new bootstrap.Modal(document.getElementById('portfolioModal'));
        portfolioModal.show();
        
        $('.portfolio-modal-close-btn').on('click', function() {
            portfolioModal.hide();
        });
    }
});
