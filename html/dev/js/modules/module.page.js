var rps = rps || {};
rps.mfc = rps.mfc || {};

rps.mfc.Page = (function () {
    'use strict';

    var $html = $('html'),
        $body = $('body'),
        $page = $('.main'),
        $pageTitle = $('.header-inner h1'),
        request,
        hasHistoryAPI = Modernizr.history,
        loaded = false,
        path = window.location.pathname,
        pageTimeout,
        pageName,

    // Add event listener to check when a "pathchange" or a popstate has been fired
    addListenerForStateChange = function () {
        var eventType;
        // Need to check if history/popstate is available else fall back to hashChange
        $(window).on('pathchange', function (e) {
            eventType = e.type;
            processPath(window.location.pathname);
        });
    },

    // Add a listener for page load
    addListenerForPageLoad = function () {
        $(window).on('load', function (e) {
            loaded = true;
            window.picturefill();
            $page.find('.content').addClass('loaded');
        });
    },

    addListenerForPopstate = function () {
        var initial = window.location.href;
        $(window).on('popstate', function (e) {
            $(window).trigger('pathchange');
        });
    },

    // Abort existing AJAX page request and send a new AJAX request to a url
    getPage = function (target) {
        // Stop any existing ajax request
        abortExistingRequest(request);
        // Start a new request
        request = $.ajax({
            type: 'GET',
            url: target
        }).done(function (data) {
            handleSuccess(data);
        }).fail(function (jqXHR) {
            handleFailure();
        }).always();
    },

    // Handle the response from a getPage request
    handleSuccess = function (data) {
        var $main = $(data).find('.main'),
            $content = $main.html(),
            newPageName = $main.data('page');
        pageName = newPageName;

        // Update Page
        updatePage(pageName, getPageTitle(data));
        // Timeout to show page loading
        clearTimeout(pageTimeout);
        pageTimeout = setTimeout(function () {
            clearTimeout(pageTimeout);
            // Add the new page content
            addPage($content, pageName);
        }, 50);
    },

    addPage = function ($content, pageName) {
        removeLoading();
        $page.append($content);
        setTimeout(function () {
            $page.find('.content').not('.destroy').addClass('new');
        }, 100);
        if (pageName) {
            console.log('Added: ' + pageName);
            $(window).trigger(pageName + '-page-added');
        }
        $(window).trigger('page-added');
        window.picturefill();
    },

    handleFailure = function (data) {
        console.log('getPage Fail');
        console.log(data);
    },

    go = function (newPath) {
        if (hasHistoryAPI) {
            history.pushState('', '', newPath);
            $(window).trigger('pathchange');
        } else {
            window.document.location = newPath;
        }
    },

    abortExistingRequest = function (request) {
        if (request) {
            request.abort();
        }
    },

    getPageTitle = function (data) {
        var title = data.match(/<title>(.*?)<\/title>/)[1].trim();
        return title;
    },

    updatePage = function (pageName, pageTitleText) {
        $('body').removeClass().addClass('page-' + pageName);
        $('main').attr('data-page', pageName);
        $('title').text(pageTitleText);
    },

    addLoading = function () {
        $html.addClass('loading');
    },

    removeLoading = function () {
        $html.removeClass('loading');
    },

    startPageTransition = function () {
        if ($('body').hasClass('show-menu')) {
            $('body').removeClass('show-menu');
            removeContent();
        } else {
            removeContent();
        }
    },

    removeContent = function () {
        console.log('Removed: ' + pageName);
        $(window).trigger('page-removed');
        $(window).trigger(pageName + '-page-removed');
        $page.find('.content:first').remove();
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
        startPageTransition();
        getPage(path);
    },

    init = (function () {
        $html.addClass('js');
        pageName = $('.main').data('page');
        addListenerForPageLoad();
        addListenerForPopstate();
        addListenerForStateChange();
    })();

    return {
        go: go,
        pageName: pageName
    };

})();