var rps = rps || {};

rps.lib = (function (document) {
    'use strict';

    var toggleClass = function (element, className) {
        element.classList.toggle(className);
    },

    createEvent = function (eventName) {
        var ev;
        if (typeof CustomEvent === 'function') {
            ev = new CustomEvent(eventName);
        } else {
            ev = document.createEvent('HTMLEvents');
            ev.initEvent(eventName, true, true);
        }
        return ev;
    },

    addEventListeners = function (selector, eventType, functionName) {
        var elements = document.querySelectorAll(selector);
        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener(eventType, functionName);
        }
    };

    return {
        toggleClass: toggleClass,
        addEventListeners: addEventListeners,
        createEvent: createEvent
    };

})(window.document);