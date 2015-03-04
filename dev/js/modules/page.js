var base = base || {};

base.page = (function (window, document, $) {
    'use strict';

    var $window = $(window),
        $html = $('html'),
        $body = $('body'),
        $main = $('main'),
        $title = $('title'),
        request,
        hasHistoryAPI = Modernizr.history,
        loaded = false,
        pageTimeout,
        pageName = $main.data('page'),

    addListeners = function () {
        var eventType;
        // Need to check if history/popstate is available else fall back to hashChange
        $window
        .on('pathchange', function (e) {
            eventType = e.type;
            processPath(window.location);
        })
        .on('load', function () {
            loaded = true;
            $html.addClass('loaded');
            $main.find('.content').addClass('loaded');
        })
        .on('popstate', function () {
            $window.trigger('pathchange');
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
            handleFailure(jqXHR);
        }).always();
    },

    // Handle the response from a getPage request
    handleSuccess = function (data) {
        var $newMain = $(data).find('.main'),
            $content = $newMain.html(),
            newPageName = $newMain.data('page');
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
        $main.append($content);
        // Timeout needed to trigger animation class change
        setTimeout(function () {
            $main.find('.content').not('.destroy').addClass('new');
        }, 50);
        if (pageName) {
            $window.trigger(pageName + '-page-added');
        }
        $window.trigger('page-added');
    },

    handleFailure = function (jqXHR) {
        if (jqXHR.status === 404) {
            getPage('/404');
        }
    },

    go = function (newPath) {
        if (hasHistoryAPI) {
            history.pushState('', '', newPath);
            $window.trigger('pathchange');
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
        $body.removeClass().addClass('page-' + pageName);
        $main.attr('data-page', pageName);
        $title.text(pageTitleText);
    },

    addLoading = function () {
        $html.addClass('loading');
    },

    removeLoading = function () {
        $html.removeClass('loading');
    },

    startPageTransition = function () {
        if ($body.hasClass('show-menu')) {
            $body.removeClass('show-menu');
            removeContent();
        } else {
            removeContent();
        }
    },

    removeContent = function () {
        $window.trigger('page-removed');
        $window.trigger(pageName + '-page-removed');
        $main.find('.content:first').remove();
    },

    processPath = function (location) {
        var path = location.pathname;

        // Internal page link
        if (location.hash) {
            return;
        }

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

    hijackInternalLink = function (e) {
        e.preventDefault();
        e.stopPropagation();
        // Check the link is not to the current page
        if (this.pathname !== window.location.pathname) {
            go(this.pathname);
        }
    };

    $('html').on('click', 'a[href^="/"]', hijackInternalLink);

    $html.addClass('js');
    addListeners();

})(window, window.document, window.jQuery);