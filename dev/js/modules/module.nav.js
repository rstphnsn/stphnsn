var rps = rps || {};

rps.nav = (function (window, $) {
    'use strict';

    var $window = $(window),
        $body = $('body'),
        $nav = $('#menu'),

    hijackLinks = function () {
        $('html').on('click', 'a[href^="/"]', checkInternalLink);
    },

    // Check to see if we are not already on this page before loading a new one
    checkInternalLink = function (e) {
        var newPath = this.pathname,
            currentPath = window.location.pathname;
        e.preventDefault();
        e.stopPropagation();
        if (newPath !== currentPath) {
            rps.page.go(newPath);
        }
    },

    openCloseNav = function () {
        $('.no-touch body').on('click', '#showNav', function (e) {
            e.preventDefault();
            $body.toggleClass('show-menu');
        });
        $('.touch body').on('touchstart', '#showNav', function (e) {
            e.preventDefault();
            $body.toggleClass('show-menu');
        });
    },

    moveMenu = function () {
        var menu = $('#menu').remove();
        $('header').after(menu);
    },

    showHideNav = function () {
        $window.on('add-nav', function () {
            $body.addClass('show-menu');
        });
        $window.on('remove-nav', function () {
            $body.removeClass('show-menu');
        });
    },

    init = (function () {
        moveMenu();
        showHideNav();
        openCloseNav();
        hijackLinks();
    })();

})(window, window.jQuery);