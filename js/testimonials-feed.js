/* Public testimonials: network-only on load/retry, revalidated every 5 visible minutes.
 * No CRM credentials, local quote data, persistent cache, or name deduplication.
 */
(function ($) {
    'use strict';
    if (!$) return;

    var endpoint = 'https://shouldcallpaul.replit.app/resume/testimonials';
    var refreshInterval = 5 * 60 * 1000;
    var groups = [
        { value: 'EDUCATORS & SCHOOL STAFF', label: 'Educators & School Staff', icon: 'fas fa-chalkboard-teacher' },
        { value: 'STUDENTS', label: 'Students', icon: 'fas fa-user-graduate' },
        { value: 'WORKSHOP & EVENT ATTENDEES', label: 'Workshop & Event Attendees', icon: 'fas fa-microphone-alt' },
        { value: 'COLLEAGUES', label: 'Colleagues', icon: 'fas fa-laptop-code' }
    ];
    // Presentation only: these existing headshots are not testimonial data.
    var headshots = {
        'Dr. Scott Cascone': 'img/dr-scott-cascone.jpeg',
        'Konstantina H.': 'img/k.png',
        'Jenna A.': 'img/jennaa.png',
        'Eva M.': 'img/eva.jpg',
        'Margaret R.': 'img-new/team/v5-removebg-preview.png',
        'Joshua D.': 'img/joshd.jpeg',
        'James A.': 'img/jamesa.jpeg'
    };
    var sequence = 0;

    function element(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function hasText(value) {
        return typeof value === 'string' && value.trim().length > 0;
    }

    function validate(response) {
        if (!response || !Array.isArray(response.records)) {
            throw new Error('Expected a public records array.');
        }
        response.records.forEach(function (record) {
            if (!record || typeof record !== 'object' || Array.isArray(record) ||
                !hasText(record.name) || !hasText(record.quote) ||
                !groups.some(function (group) { return group.value === record.category; })) {
                throw new Error('Invalid testimonial record.');
            }
            ['title', 'organization', 'event', 'date'].forEach(function (key) {
                if (record[key] != null && typeof record[key] !== 'string') {
                    throw new Error('Invalid optional testimonial field.');
                }
            });
            // IDs are optional, including for legacy records.
        });
        return response.records;
    }

    function imageSource(record) {
        var supplied = record.image || record.imageUrl || record.image_url;
        if (hasText(supplied)) {
            try {
                var url = new URL(supplied, window.location.href);
                if ((url.protocol === 'https:' || url.protocol === 'http:') &&
                    !url.username && !url.password) return url.href;
            } catch (error) {
                // An invalid optional image must not prevent displaying its quote.
            }
        }
        return Object.prototype.hasOwnProperty.call(headshots, record.name) ? headshots[record.name] : '';
    }

    function avatar(record, preview, index) {
        var initials = record.name.trim().split(/\s+/).map(function (part) {
            return Array.from(part)[0];
        }).slice(0, 2).join('');
        var fallback = element('div', preview ? 'tp-avatar-initials' :
            'avatar-initials' + (index % 3 === 1 ? ' coral' : index % 3 === 2 ? ' mint' : ''), initials);
        fallback.setAttribute('aria-label', record.name);
        var src = imageSource(record);
        if (!src) return fallback;
        var image = element('img');
        image.alt = record.name;
        image.loading = 'lazy';
        image.addEventListener('error', function () {
            if (image.parentNode) image.parentNode.replaceChild(fallback, image);
        }, { once: true });
        image.src = src;
        return image;
    }

    function card(record, preview, index) {
        var root = element('div', preview ? 'testimonial-preview-card' : 'testimonial-card');
        if (record.id != null && (typeof record.id === 'string' || typeof record.id === 'number')) {
            root.setAttribute('data-testimonial-id', String(record.id));
        }
        var icon = element('div', preview ? 'tp-quote-icon' : 'quote-icon');
        icon.setAttribute('aria-hidden', 'true');
        icon.appendChild(element('i', 'fas fa-quote-left'));
        root.appendChild(icon);
        if (hasText(record.event)) {
            root.appendChild(element('span', preview ? 'tp-context' : 'context-tag', record.event));
        }
        var quote = element('div', preview ? 'tp-text' : 'quote-text', record.quote);
        quote.style.whiteSpace = 'pre-wrap';
        quote.style.overflowWrap = 'anywhere';
        root.appendChild(quote);
        if (!preview) {
            quote.id = 'testimonial-quote-' + (++sequence);
            quote.classList.add('expandable');
            var toggle = element('button', 'read-more', 'Read more');
            toggle.type = 'button';
            toggle.hidden = true;
            toggle.setAttribute('aria-controls', quote.id);
            toggle.setAttribute('aria-expanded', 'false');
            toggle.addEventListener('click', function () {
                var expanded = quote.classList.toggle('expanded');
                toggle.textContent = expanded ? 'Read less' : 'Read more';
                toggle.setAttribute('aria-expanded', String(expanded));
            });
            root.appendChild(toggle);
        }
        var provider = element('div', preview ? 'tp-provider' : 'provider');
        provider.appendChild(avatar(record, preview, index));
        var info = element('div', preview ? '' : 'info');
        info.style.minWidth = '0';
        info.style.overflowWrap = 'anywhere';
        info.appendChild(element('h4', '', record.name));
        var attribution = [record.title, record.organization].filter(hasText).join(', ');
        var detail = [attribution, record.date].filter(hasText).join(' · ');
        if (detail) info.appendChild(element('span', '', detail));
        provider.appendChild(info);
        root.appendChild(provider);
        return root;
    }

    $(function () {
        var mounts = Array.from(document.querySelectorAll('[data-testimonials-feed]'));
        if (!mounts.length) return;
        var inFlight = false;
        var lastAttempt = 0;
        var expandables = [];

        function counts(records) {
            $('[data-testimonial-count]').text(records ? records.length : '—');
            $('[data-testimonial-category-count]').text(records ? groups.filter(function (group) {
                return records.some(function (record) { return record.category === group.value; });
            }).length : '—');
        }

        function state(kind, message) {
            expandables = [];
            mounts.forEach(function (mount) {
                mount.replaceChildren();
                mount.setAttribute('aria-busy', String(kind === 'loading'));
                var panel = element('div', mount.dataset.testimonialsFeed === 'preview' ?
                    'testimonial-preview-card' : 'testimonial-card');
                panel.style.gridColumn = '1 / -1';
                var status = element('p', '', message);
                status.setAttribute('role', kind === 'error' ? 'alert' : 'status');
                panel.appendChild(status);
                if (kind !== 'loading') {
                    var retry = element('button', 'btn btn-md circle btn-dark', 'Try again');
                    retry.type = 'button';
                    retry.addEventListener('click', load);
                    panel.appendChild(retry);
                }
                mount.appendChild(panel);
            });
        }

        function measureQuotes() {
            expandables.forEach(function (entry) {
                if (entry.quote.classList.contains('expanded')) return;
                entry.quote.classList.add('expandable');
                var overflowing = entry.quote.scrollHeight > entry.quote.clientHeight + 1;
                entry.quote.classList.toggle('expandable', overflowing);
                entry.toggle.hidden = !overflowing;
            });
        }

        function render(records) {
            expandables = [];
            mounts.forEach(function (mount) {
                mount.replaceChildren();
                mount.setAttribute('aria-busy', 'false');
                if (mount.dataset.testimonialsFeed === 'preview') {
                    records.slice(0, 3).forEach(function (record, index) {
                        mount.appendChild(card(record, true, index));
                    });
                    return;
                }
                groups.forEach(function (group) {
                    var section = element('section', 'category-section');
                    var header = element('div', 'category-header');
                    var icon = element('i', group.icon);
                    icon.setAttribute('aria-hidden', 'true');
                    header.appendChild(icon);
                    var members = records.filter(function (record) { return record.category === group.value; });
                    header.appendChild(element('h2', '', group.label + ' (' + members.length + ')'));
                    section.appendChild(header);
                    var grid = element('div', 'testimonial-grid');
                    members.forEach(function (record, index) {
                        var rendered = card(record, false, index);
                        grid.appendChild(rendered);
                        expandables.push({
                            quote: rendered.querySelector('.quote-text'),
                            toggle: rendered.querySelector('.read-more')
                        });
                    });
                    if (!members.length) grid.appendChild(element('p', '', 'No testimonials in this category yet.'));
                    section.appendChild(grid);
                    mount.appendChild(section);
                });
            });
            window.requestAnimationFrame(measureQuotes);
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureQuotes);
        }

        function load() {
            if (inFlight) return;
            inFlight = true;
            lastAttempt = Date.now();
            counts(null);
            state('loading', 'Loading testimonials…');
            $.ajax({
                url: endpoint,
                method: 'GET',
                dataType: 'json',
                cache: false,
                timeout: 15000,
                crossDomain: true,
                xhrFields: { withCredentials: false }
            }).done(function (response) {
                try {
                    var records = validate(response);
                    counts(records);
                    if (records.length) render(records);
                    else state('empty', 'No testimonials are available yet. Please check back soon.');
                } catch (error) {
                    counts(null);
                    state('error', 'Testimonials could not be loaded. Please try again.');
                }
            }).fail(function () {
                counts(null);
                state('error', 'Testimonials could not be loaded. Please check your connection and try again.');
            }).always(function () {
                inFlight = false;
            });
        }

        window.addEventListener('resize', measureQuotes);
        window.setInterval(function () {
            if (!document.hidden) load();
        }, refreshInterval);
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden && Date.now() - lastAttempt >= refreshInterval) load();
        });
        load();
    });
})(window.jQuery);
