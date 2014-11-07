var rps = rps || {};

rps.nav = (function (window, $) {
    'use strict';

    var $html = $('html'),

    hijackInternalLinks = function () {
        $html.on('click', 'a[href^="/"]', checkInternalLink);
    },

    // Check to see link is to another page
    checkInternalLink = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.pathname !== window.location.pathname) {
            rps.page.go(this.pathname);
        }
    },

    init = (function () {
        hijackInternalLinks();
    })();

})(window, window.jQuery);