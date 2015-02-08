var base = base || {};

base.homepage = (function (window, $) {
    'use strict';

    var $window = $(window);

    $window.on('home-page-added', function () {
        console.warn('Base: Hompage added');
    });

    $window.on('home-page-removed', function () {
        console.warn('Base: Homepage removed');
    });

    if ($('.main').data('page') === 'home') {
        console.warn('Base: Starting on the homepage');
    }

})(window, window.jQuery);
