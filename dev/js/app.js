var base = base || {};

base.app = (function (window, $, hljs) {
    'use strict';

    var $window = $(window),

    highLightCode = function () {
        $('pre code').each(function (i, elem) {
            hljs.highlightBlock(elem);
        });
    };

    $window.on('load', function () {
        $('html').addClass('loaded');
    });

    $window.on('page-added', function () {
        highLightCode();
    });

    highLightCode();

})(window, window.jQuery, window.hljs);
