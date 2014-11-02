var rps = rps || {};

rps.nav = (function (window, document) {
    'use strict';

    var init,

    checkInternalLink = function (event) {
        var newPath = this.pathname,
            currentPath = window.location.pathname;
        event.preventDefault();
        event.stopPropagation();
        if (newPath !== currentPath) {
            rps.page.go(newPath);
        }
    },

    showHideNav = function (event) {
        console.log('showHideNav');
        event.preventDefault();
        event.stopPropagation();
        rps.lib.toggleClass(document.body, 'show-menu');
    };

    init = function () {
        if ('ontouchend' in document) {
            rps.lib.addEventListeners('#showNav', 'touchstart', showHideNav);
            rps.lib.addEventListeners('a[href^="/"]', 'touchstart', checkInternalLink);
        } else {
            rps.lib.addEventListeners('#showNav', 'click', showHideNav);
            rps.lib.addEventListeners('a[href^="/"]', 'click', checkInternalLink);
        }
    };

    return {
        init: init
    };

})(window, window.document);

rps.nav.init();
