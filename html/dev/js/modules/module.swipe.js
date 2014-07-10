// base.js
var rps = rps || {};
rps.mfc = rps.mfc || {};

rps.mfc.Swipe = (function (options) {
    'use strict';

    var $html = $('html'),
        index = 0,
        $sliderNav,
        $slider = $('#slider'),
        slides = 0,
        active = 0,
        sliding = false,
        slideSpeed = 400,
        nudgeSpeed = 400,
        nudgeDistance = 50,
        nudgeOverlap = 10,
        nudgeTimeout = 100,
        breakPoint = 1000,

    addSwipe = function () {
        if (!window.mfcSwipe) {
            window.mfcSwipe = new Swipe(document.getElementById('slider'), {
                speed: 400,
                continuous: true,
                disableScroll: false,
                stopPropagation: false,
                transitionEnd: function (index, elem) {
                    sliding = false;
                    active = index;
                    $slider.removeClass('moving');
                    $slider.addClass('not-moving');
                    markActiveSlide();
                    // Update nav
                    $sliderNav.find('.selected').removeClass('selected');
                    $sliderNav.find('li:nth-child(' + (active + 1) + ')').addClass('selected');
                }
            });
            slides = window.mfcSwipe.getNumSlides();
            $slider.addClass('not-moving');
            markActiveSlide();
        }
    },

    markActiveSlide = function () {
        $slider.find('.active').removeClass('active');
        $slider.find('figure').eq(active).addClass('active');
    },

    addCounter = function ($slider) {
        var $slides = $slider.find('figure');
        $slider.after('<section class="swipe-nav"><ul></ul></section>');
        $sliderNav = $slider.next('.swipe-nav').find('ul');
        $.each($slides, function (i) {
            $sliderNav.append('<li>' + i + '</li>');
        });
        $sliderNav.find('li:first-child').addClass('selected');
    },

    addPrevNext = function () {
        $slider.append('<a href="#prev" id="slider-prev" class="btn btn-prev">Prev</a><a href="#next" id="slider-next" class="btn btn-next">Next</a>');

        $('#slider-prev').on({
            click: function (e) {
                e.preventDefault();
                if (!sliding) {
                    sliding = true;
                    $slider.addClass('moving');
                    $slider.removeClass('done-moving');
                    window.mfcSwipe.prev();
                }
            },
            mouseenter: function () {
                nudgePrev();
            },
            mouseleave: function () {
                unNudgePrev();
            }
        });

        $('#slider-next').on({
            click: function (e) {
                e.preventDefault();
                if (!sliding) {
                    sliding = true;
                    $slider.addClass('moving');
                    $slider.removeClass('not-moving');
                    window.mfcSwipe.next();
                }
            },
            mouseenter: function () {
                nudgeNext();
            },
            mouseleave: function () {
                unNudgeNext();
            }
        });
    },

    nudgePrev = function () {
        if (!sliding) {
            var pos = 0 - $slider.width() + nudgeDistance,
                prev = getPrev();
            moveUp(prev);
            // Animate previous slide
            setTimeout(function () {
                mfcSwipe.translate(prev, pos, nudgeSpeed);
            }, nudgeTimeout);
            // Animate active slide
            setTimeout(function () {
                mfcSwipe.translate(active, nudgeDistance - nudgeOverlap, nudgeSpeed);
            }, nudgeTimeout + 10);
        }
    },

    unNudgePrev = function () {
        if (!sliding) {
            var pos = 0 - $slider.width(),
                prev = getPrev();
            // Animate active slide
            setTimeout(function () {
                mfcSwipe.translate(active, 0, nudgeSpeed);
            }, nudgeTimeout);
            // Animate previous slide
            setTimeout(function () {
                mfcSwipe.translate(prev, pos, nudgeSpeed);
            }, nudgeTimeout + 10);
        }
    },

    nudgeNext = function () {
        if (!sliding) {
            var pos = $slider.width() - nudgeDistance,
                next = getNext();
            moveUp(next);
            // Animate next slide
            setTimeout(function () {
                mfcSwipe.translate(next, pos, nudgeSpeed);
            }, nudgeTimeout);
            // Animate active slide
            setTimeout(function () {
                mfcSwipe.translate(active, 0 - nudgeDistance + nudgeOverlap, nudgeSpeed);
            }, nudgeTimeout + 10);
        }
    },

    unNudgeNext = function () {
        if (!sliding) {
            var pos = $slider.width(),
                next = getNext();
            // Animate active slide
            setTimeout(function () {
                mfcSwipe.translate(active, 0, nudgeSpeed);
            }, nudgeTimeout);
            // Animate next slide
            setTimeout(function () {
                mfcSwipe.translate(next, pos, nudgeSpeed);
            }, nudgeTimeout + 10);
        }
    },

    moveUp = function (i) {
        moveDown(active);
        $('.swipe figure').eq(i).css({'z-index': 1});
    },

    moveDown = function (i) {
        $('.swipe figure').eq(i).css({'z-index': 0});
    },

    getPrev = function () {
        var prev = active - 1;
        if (prev === -1) {
            prev = slides - 1;
        }
        return prev;
    },

    getNext = function () {
        var next = active + 1;
        if (next === slides) {
            next = 0;
        }
        return next;
    },

    destroy = function () {
        window.mfcSwipe = null;
    },

    init = function () {
        if (document.getElementById('slider')) {
            $slider = $('#slider');
            addSwipe();
            addPrevNext($slider);
            addCounter($slider);
        }
    };

    return {
        init: init,
        addSwipe: addSwipe,
        destroy: destroy
    };

})();