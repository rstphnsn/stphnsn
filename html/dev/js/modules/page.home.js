var rps = rps || {};
rps.mfc = rps.mfc || {};

rps.mfc.HomePage = (function () {
    'use strict';

    var $html = $('html'),
        pageName = $('.main').data('page'),

    // Add a listener for the custom "home-page-added" event
    addListeners = function () {
        $(window).on('home-page-added', function () {
            window.picturefill();
            rps.mfc.Swipe.init();
        });
        $(window).on('home-page-removed', function () {
            rps.mfc.Swipe.destroy();
        });
    },

    init = (function () {
        addListeners();
        if (pageName === 'home') {
            //Starting on the home page
            rps.mfc.Swipe.init();
        }
    })();

})();