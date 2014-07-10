var rps = rps || {};
rps.mfc = rps.mfc || {};

rps.mfc.Nav = (function () {
    'use strict';

    var $body = $('body'),
        $nav = $('#menu'),

    hijackLinks = function () {
        $('html').on('click', 'a[rel=internal]', checkInternalLink);
    },

    // Check to see if we are not already on this page before loading a new one
    checkInternalLink = function (e) {
        var newPath = this.pathname,
            currentPath = window.location.pathname;
        e.preventDefault();
        e.stopPropagation();
        window.scrollTo(0, 0);
        if (newPath !== currentPath) {
            rps.mfc.Page.go(newPath);
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
        $(window).on('add-nav', function () {
            $body.addClass('show-menu');
        });
        $(window).on('remove-nav', function () {
            $body.removeClass('show-menu');
        });
    },

    init = (function () {
        moveMenu();
        showHideNav();
        openCloseNav();
        hijackLinks();
    })();

})();