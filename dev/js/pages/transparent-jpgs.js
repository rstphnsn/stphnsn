var base = base || {};

base.blogTransparentJpgs = (function (window, $) {
    'use strict';

    var $window = $(window);

    $window.on('transparent-jpgs-page-added', function () {
        window.TransparentJPGs.init();
        console.warn('Base: Transparent JPGs page added');
    });

    $window.on('transparent-jpgs-page-removed', function () {
        console.warn('Base: Transparent JPGs removed');
    });

    if ($('.main').data('page') === 'transparent-jpgs') {
        console.warn('Base: Starting on the Transparent JPGs page');
    }

})(window, window.jQuery);
