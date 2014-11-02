var rps = rps || {};

rps.page = (function (window, document) {
    'use strict';

    var xhr,
        hasHistoryAPI = Modernizr.history,
        loaded = false,
        path = window.location.pathname,
        pageTimeout,
        pageName,
        pathchangeEvent = rps.lib.createEvent('pathchange'),

    // Add event listener to check when a "pathchange" or a popstate has been fired
    addListenerForPathChange = function () {
        var eventType;
        // Need to check if history/popstate is available else fall back to hashChange
        window.addEventListener('pathchange', function (e) {
            eventType = e.type;
            processPath(window.location.pathname);
        });
    },

    // Add a listener for page load
    addListenerForPageLoad = function () {
        var content = document.querySelector('.content');
        window.onload = function () {
            loaded = true;
            document.querySelector('html').classList.add('loaded');
            content.classList.add('loaded');
        };
    },

    addListenerForPopstate = function () {
        window.addEventListener('popstate', function (e) {
            window.dispatchEvent(pathchangeEvent);
        });
    },

    // Abort existing AJAX page request and send a new AJAX request to a url
    getPage = function (target) {
        // Stop any existing ajax request
        abortExistingRequest(xhr);
        xhr = new XMLHttpRequest();
        xhr.onload = handleSuccess;
        xhr.onerror = handleFailure;
        xhr.open('get', target, true);
        xhr.send();
    },

    // Handle the response from a getPage request
    handleSuccess = function (data) {
        var div = document.createElement('div'),
            main,
            content;
        div.innerHTML = data.target.response;
        main = div.querySelector('main');
        content = main.querySelector('.content');
        pageName = main.getAttribute('data-page');

        // Update Page
        updatePage(pageName, div.querySelector('title').textContent);
        // Timeout to show page loading
        clearTimeout(pageTimeout);
        pageTimeout = setTimeout(function () {
            clearTimeout(pageTimeout);
            // Add the new page content
            addPage(content, pageName);
        }, 50);
    },

    addPage = function (content, pageName) {
        var specificPageAdded = rps.lib.createEvent(pageName + '-page-added'),
            pageAdded = rps.lib.createEvent('page-added');
        removeLoading();
        document.querySelector('main').appendChild(content);
        setTimeout(function () {
            document.querySelector('.content').classList.add('new');
        }, 50);
        if (pageName) {
            window.dispatchEvent(specificPageAdded);
        }
        window.dispatchEvent(pageAdded);
    },

    handleFailure = function (data) {
        console.log('getPage Fail');
        console.log(data);
    },

    go = function (newPath) {
        if (hasHistoryAPI) {
            history.pushState('', '', newPath);
            window.dispatchEvent(pathchangeEvent);
        } else {
            window.document.location = newPath;
        }
    },

    abortExistingRequest = function (xhr) {
        if (xhr) {
            xhr.abort();
        }
    },

    getPageTitle = function (data) {
        //var title = data.match(/<title>(.*?)<\/title>/)[1].trim();
        return 'title';
    },

    updatePage = function (pageName, pageTitleText) {
        document.querySelector('body').className = 'page-' + pageName;
        document.querySelector('main').setAttribute('data-page', pageName);
        document.querySelector('title').textContent = pageTitleText;
    },

    addLoading = function () {
        document.querySelector('html').classList.add('loading');
    },

    removeLoading = function () {
        document.querySelector('html').classList.remove('loading');
    },

    removeContent = function () {
        var event1 = rps.lib.createEvent('page-removed'),
            event2 = rps.lib.createEvent(pageName + '-page-removed'),
            el = document.querySelector('.content');
        window.dispatchEvent(event1);
        window.dispatchEvent(event2);
        el.parentNode.removeChild(el);
    },

    processPath = function (path) {
        // Index page
        if (path === '') {
            path = '/';
        }

        // Check path has a trailing slash. Add one if it doesn't
        if (path.substr(path.length - 1) !== '/') {
            path = path + '/';
        }

        // Start page load and transition
        addLoading();
        removeContent();
        getPage(path);
    },

    init = (function () {
        pageName = document.querySelector('main').getAttribute('data-page');
        addListenerForPageLoad();
        addListenerForPopstate();
        addListenerForPathChange();
    })();

    return {
        go: go,
        pageName: pageName
    };

})(window, window.document);