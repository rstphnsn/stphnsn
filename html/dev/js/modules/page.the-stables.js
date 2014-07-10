var rps = rps || {};
rps.mfc = rps.mfc || {};

rps.mfc.TheStables = (function () {
    'use strict';

    var $html = $('html'),
        pageName = $('.main').data('page'),

    // Add a listener for the custom "about-the-village-page-added" event
    addListeners = function () {
        $(window).on('the-stables-page-added', function () {
            window.picturefill();
            rps.mfc.Swipe.init();
        });
        $(window).on('the-stables-page-removed', function () {
            rps.mfc.Swipe.destroy();
        });
    },

    init = (function () {
        addListeners();
        if (pageName === 'the-stables') {
            //Starting on the about-the-village page
            rps.mfc.Swipe.init();
        }
    })();

})();