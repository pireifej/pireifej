/* Public feeds only. No credentials, management APIs, or local-data fallbacks. */
(function ($) {
    'use strict';
    if (!$) return;
    var origin = 'https://shouldcallpaul.replit.app';
    $.ajaxPrefilter(function (options) {
        var url = new URL(options.url, window.location.href);
        if (url.origin !== origin) return;
        var match = url.pathname.match(/^\/(?:resume|resume_data)\/(workshops|speech|conference|hackathon|patent|projects|races|awards|certificates|testimonials)(?:\.json)?$/);
        var menu = /^\/(?:speaker|speaker_data)\/speaker_menu(?:\.json)?$/.test(url.pathname);
        if (!match && !menu) return;
        options.cache = false;
        options.timeout = 15000;
        options.converters = Object.assign({}, options.converters, {
            'text json': function (text) {
                var data = JSON.parse(text);
                var key = menu ? 'categories' : match[1] === 'certificates' ? 'certifications' : 'records';
                if (!data || !Array.isArray(data[key])) {
                    throw new Error('Invalid public feed response: expected ' + key);
                }
                return data; // Preserve every field, nested value, ID, and feed order.
            }
        });
    });
})(window.jQuery);
