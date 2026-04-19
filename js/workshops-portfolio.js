$(document).ready(function() {
    var API_BASE = 'https://shouldcallpaul.replit.app/resume/';
    var allItems = [];

    var customWorkshopImages = {
        'Master the Art of Public Speaking - Bell Works': 'img-new/workshops/public_speaking_workshop_bell_works.png',
        'Youth Leadership Program - Coordinator': 'img/PXL_20240824_152158036.MP.jpg'
    };

    var PROGRAMS = [
        {
            key: 'ai',
            icon: 'fas fa-microchip',
            title: 'AI Literacy Series',
            tagline: 'Demystifying AI for educators, leaders, and curious adults.',
            audience: 'Educators · Library patrons · School leadership',
            promise: 'A practical, no-jargon onramp. Attendees leave with prompts, workflows, and the confidence to use AI in real work.',
            bullets: [
                'Hands-on with ChatGPT, Claude, and Gemini',
                'Bring-your-own real task — leave with a finished draft',
                'Frameworks for evaluating AI output critically'
            ]
        },
        {
            key: 'speaking',
            icon: 'fas fa-microphone-alt',
            title: 'Public Speaking Programs',
            tagline: 'Find your voice, structure your message, captivate any room.',
            audience: 'Teens · Adults · Professionals',
            promise: 'Interactive labs combining impromptu drills, real-time feedback, and proven frameworks for stage fright, structure, and delivery.',
            bullets: [
                'Compelling speech structure: intro, body, conclusion',
                'Vocal variety, body language, and stage presence',
                'Breath, visualization, and stage-fright techniques'
            ]
        },
        {
            key: 'youth',
            icon: 'fas fa-users',
            title: 'Youth & Community Leadership',
            tagline: 'Career inspiration, respect, and leadership programs for K–12 audiences.',
            audience: 'Grades 4–12 · Youth Leadership Programs',
            promise: 'Multi-session coordination and one-off keynotes that meet kids where they are — career talks, leadership coaching, and Week-of-Respect programming.',
            bullets: [
                'Career Day talks: software engineering for grades 4–6',
                'Youth Leadership Program — coordinator & guest speaker',
                'Week of Respect keynote — kindness, friendship, responsibility'
            ]
        }
    ];

    function getWorkshopImage(item) {
        var label = item.label || '';
        if (customWorkshopImages[label]) {
            return customWorkshopImages[label];
        }
        return item.image || 'img-new/banner/2.jpg';
    }

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

    function escapeHtml(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function parseDateForSort(dateStr) {
        if (!dateStr) return 0;
        var d = new Date(dateStr);
        var t = d.getTime();
        if (!isNaN(t)) return t;
        // fallback: try to extract year
        var m = String(dateStr).match(/(\d{4})/);
        return m ? parseInt(m[1], 10) * 10000 : 0;
    }

    function totalAttendees(items) {
        var sum = 0;
        items.forEach(function(item) {
            var a = item.details && item.details.attendees;
            if (!a) return;
            var m = String(a).match(/\d+/);
            if (m) sum += parseInt(m[0], 10);
        });
        return sum;
    }

    function shortLocation(loc) {
        if (!loc) return '';
        return loc.split(',')[0].trim();
    }

    function shortDate(dateStr) {
        if (!dateStr) return '';
        var d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    $.ajax({ url: API_BASE + 'workshops', type: 'get', dataType: 'json', cache: false,
        success: function(data) {
            allItems = data.records || [];
            allItems.forEach(function(item, idx) {
                item._category = getWorkshopCategory(item.label || item.title);
                item._index = idx;
                item._sortTs = parseDateForSort(item.details && item.details.date);
            });
            renderPrograms();
            setupModalHandlers();
            ModalNav.init(allItems, openModal);
            ModalNav.bindEvents();
        },
        error: function() {
            $('#signature-programs').html('<div class="loading-spinner">Failed to load workshops.</div>');
        }
    });

    function renderPrograms() {
        var html = '<div class="programs-intro"><p>Every workshop pulls from one of three signature programs &mdash; built over <strong>' + allItems.length + '</strong> engagements across schools, libraries, and community spaces in Monmouth County and beyond.</p></div>';
        html += '<div class="programs-grid">';
        PROGRAMS.forEach(function(prog) {
            html += renderProgramCard(prog);
        });
        html += '</div>';
        html += renderCtaStrip();
        $('#signature-programs').html(html);
        bindProgramHandlers();
    }

    function renderProgramCard(prog) {
        var items = allItems.filter(function(i) { return i._category === prog.key; });
        items.sort(function(a, b) { return b._sortTs - a._sortTs; });
        var featured = items[0];
        var others = items.slice(1);
        var attendees = totalAttendees(items);

        var bulletsHtml = prog.bullets.map(function(b) {
            return '<li><i class="fas fa-check-circle"></i><span>' + escapeHtml(b) + '</span></li>';
        }).join('');

        var featuredHtml = '';
        if (featured) {
            var fImg = getWorkshopImage(featured);
            var fLoc = (featured.details && featured.details.location) || '';
            var fDate = (featured.details && featured.details.date) || '';
            var fAtt = (featured.details && featured.details.attendees) || '';
            featuredHtml =
                '<div class="program-featured" data-index="' + featured._index + '">' +
                    '<div class="program-featured-image"><img src="' + escapeHtml(fImg) + '" alt="' + escapeHtml(featured.label) + '" loading="lazy"></div>' +
                    '<div class="program-featured-body">' +
                        '<span class="program-featured-tag">Featured Engagement</span>' +
                        '<h6>' + escapeHtml(featured.label) + '</h6>' +
                        '<div class="program-featured-meta">' +
                            (fDate ? '<span><i class="fas fa-calendar-alt"></i>' + escapeHtml(shortDate(fDate)) + '</span>' : '') +
                            (fLoc ? '<span><i class="fas fa-map-marker-alt"></i>' + escapeHtml(shortLocation(fLoc)) + '</span>' : '') +
                            (fAtt ? '<span><i class="fas fa-users"></i>' + escapeHtml(fAtt) + '</span>' : '') +
                        '</div>' +
                    '</div>' +
                '</div>';
        }

        var othersHtml = '';
        if (others.length) {
            othersHtml = '<div class="program-archive collapsed">' +
                '<button type="button" class="program-archive-toggle" aria-expanded="false">' +
                    '<span class="archive-toggle-text">View all ' + items.length + ' sessions</span>' +
                    '<i class="fas fa-chevron-down"></i>' +
                '</button>' +
                '<ul class="program-archive-list">';
            others.forEach(function(item) {
                var loc = (item.details && item.details.location) || '';
                var date = (item.details && item.details.date) || '';
                othersHtml +=
                    '<li class="archive-item" data-index="' + item._index + '">' +
                        '<div class="archive-item-title">' + escapeHtml(item.label) + '</div>' +
                        '<div class="archive-item-meta">' +
                            (date ? '<span>' + escapeHtml(shortDate(date)) + '</span>' : '') +
                            (loc ? '<span>· ' + escapeHtml(shortLocation(loc)) + '</span>' : '') +
                        '</div>' +
                    '</li>';
            });
            othersHtml += '</ul></div>';
        }

        return '<div class="program-card program-' + prog.key + '">' +
            '<div class="program-header">' +
                '<div class="program-icon"><i class="' + prog.icon + '"></i></div>' +
                '<span class="program-eyebrow">Signature Program</span>' +
                '<h4 class="program-title">' + escapeHtml(prog.title) + '</h4>' +
                '<p class="program-tagline">' + escapeHtml(prog.tagline) + '</p>' +
            '</div>' +
            '<div class="program-body">' +
                '<div class="program-meta-row">' +
                    '<div class="program-stat"><strong>' + items.length + '</strong><span>session' + (items.length === 1 ? '' : 's') + ' delivered</span></div>' +
                    (attendees ? '<div class="program-stat"><strong>' + attendees + '+</strong><span>attendees reached</span></div>' : '') +
                '</div>' +
                '<div class="program-section-label">For</div>' +
                '<div class="program-audience">' + escapeHtml(prog.audience) + '</div>' +
                '<div class="program-section-label">The Promise</div>' +
                '<p class="program-promise">' + escapeHtml(prog.promise) + '</p>' +
                '<ul class="program-bullets">' + bulletsHtml + '</ul>' +
                featuredHtml +
                othersHtml +
            '</div>' +
        '</div>';
    }

    function renderCtaStrip() {
        return '<div class="programs-cta">' +
            '<div class="programs-cta-text">' +
                '<h4>Have an audience that needs one of these?</h4>' +
                '<p>Sessions are tailored to your group, venue, and time. Most are offered free to community partners.</p>' +
            '</div>' +
            '<a href="index.html#contact-paul-now" class="btn btn-md circle btn-theme">Book Paul to Speak <i class="fas fa-arrow-right" style="margin-left:8px;"></i></a>' +
        '</div>';
    }

    function bindProgramHandlers() {
        $('.program-archive-toggle').on('click', function() {
            var $wrap = $(this).closest('.program-archive');
            var collapsed = $wrap.hasClass('collapsed');
            $wrap.toggleClass('collapsed', !collapsed);
            $(this).attr('aria-expanded', String(collapsed));
            var total = $wrap.find('.archive-item').length;
            $(this).find('.archive-toggle-text').text(collapsed ? 'Hide sessions' : 'View all ' + (total + 1) + ' sessions');
        });
    }

    function setupModalHandlers() {
        $(document).on('click', '.program-featured, .archive-item', function(e) {
            // ignore clicks on the archive toggle button
            if ($(e.target).closest('.program-archive-toggle').length) return;
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
