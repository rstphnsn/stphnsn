/* jshint indent: 2 */
module.exports.register = function (Handlebars) {
  'use strict';

  var PAGE_LENGTH = 8;

  var fs = require("fs");

  /* chain Handlebars helpers together */
  Handlebars.registerHelper('chain', function () {
    var arg;
    var helper = '';
    var helpers = [];
    var i = 0;
    var j = 0;
    var lenArgs = 0;
    var lenHelpers = 0;
    var value;

    i = 0;
    lenArgs = arguments.length;

    for (; i < lenArgs; i++) {
      arg = arguments[i];

      if (Handlebars.helpers[arg]) {
        helpers.push(Handlebars.helpers[arg]);
      } else {
        value = arg;
        lenHelpers = helpers.length;
        for (j = 0; j < lenHelpers; j++) {
          helper = helpers[j];
          value = helper(value, arguments[i + 1]);
        }
        return value;
      }
    }
    return value;
  });

  Handlebars.registerHelper('replaceStr', function (haystack, needle, replacement) {
    if (haystack && needle) {
      return haystack.replace(needle, replacement);
    } else {
      return '';
    }
  });

  /* Check whether a post is in a particular filter.
   * Filters can be inclusive, or exclusive (prefixed with a !)
   *
   * @param post       object    The post
   * @param filter     object    The filter object
   * @return           object    Whether the post is included
   */
  function isPostInFilter(post, filter) {
    var allowed = true;
    var prop = {};
    var values = [];

    for (prop in filter) {
      if (allowed && filter.hasOwnProperty(prop)) {
        filter[prop] = filter[prop].toString();

        // included items
        if (prop.indexOf('!') === -1) {
          if (typeof post.data[prop] === 'boolean') {
            post.data[prop] = post.data[prop].toString();
          }
          values = [].concat(post.data[prop]);

          if (values.indexOf(filter[prop]) === -1) {
            // value not found
            allowed = false;
          }
        // excluded items
        } else {
          if (typeof post.data[prop] === 'boolean') {
            post.data[prop.substr(1)] = post.data[prop.substr(1)].toString();
          }
          values = [].concat(post.data[prop.substr(1)]);
          if (values.indexOf(filter[prop]) > -1) {
            // value found
            allowed = false;
          }
        }

      }
    }

    return allowed;
  }

  function isPostOnPage(count, startPost, endPost) {
    //console.log(count, startPost, endPost);
    return (count >= startPost && count < endPost);
  }

  function getFilters(thisPost, options) {
    var filters = {};
    var hashOption = '';
    var indexOpen = 0;
    var indexClose = 0;
    var prop = {};

    if (options && options.hash && options.hash.filter) {
      filters = JSON.parse(options.hash.filter) || {};

      for (prop in filters) {
        if (filters.hasOwnProperty(prop)) {
          hashOption = filters[prop];

          // convert numbers and booleans to strings
          if (typeof hashOption !== 'string') {
            hashOption = hashOption.toString();
          }

          indexOpen = hashOption.indexOf('{');
          indexClose = hashOption.indexOf('}');

          if (indexOpen > -1 && indexClose > -1) {
            filters[prop] = thisPost[hashOption.substring(indexOpen + 1, indexClose)] || '';
          }
        }
      }
    }

    return filters;
  }


  /* Get the sorting options
   *
   * @param options    object    The handlebar helper options
   * @return           object    Sort object
   */
  function getSortOptions(options) {
    var i = 0;
    var l = 0;
    var sort = [];
    var sortJson = {};

    if (options && options.hash && options.hash.sort) {
      sortJson = JSON.parse(options.hash.sort) || {};

      if (Object.prototype.toString.call(sortJson) !== '[object Array]') {
        sort.push(sortJson);
      } else {
        sort = sortJson;
      }

      for (i = 0, l = sort.length; i < l; i++) {
        sort[i].ascOrder = (sort[i].order === 'asc');
      }
    }

    return sort;
  }

  function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result = (a.data[property] < b.data[property]) ? -1 : (a.data[property] > b.data[property]) ? 1 : 0;
      return result * sortOrder;
    };
  }

  function dynamicSortMultiple(props) {
    return function (obj1, obj2) {
      var i = 0, result = 0, numberOfProperties = props.length;
      /* try getting a different result from 0 (equal)
       * as long as we have extra properties to compare
       */
      while (result === 0 && i < numberOfProperties) {
        result = dynamicSort(props[i])(obj1, obj2);
        i++;
      }
      return result;
    };
  }

  /* Sort posts based on a property.
   *
   * @param sortOptions   array    An array of sort options
   */
  function sortPosts(sortOptions) {
    var options = [].slice.call(sortOptions);
    var i = 0;
    var l = options.length;
    var props = [];

    for (i = 0; i < l; i++) {
      if (options[i].order && options[i].order === 'asc') {
        props.push(options[i].property);
      } else {
        props.push('-' + options[i].property);
      }
    }

    return dynamicSortMultiple(props);
  }

  /* Get a list of posts based on the filter specified.
   *
   * @param posts      object    The posts list
   * @param thisPost   object    The current post
   * @param options    object    The handlebar helper options
   * @return           object    The filtered list of posts
   */
  Handlebars.registerHelper('getPosts', function (posts, thisPost, options) {
    var count = 0;
    var debug = false;
    var endPost = 0;
    var i = 0;
    var l = 0;
    var page = {};
    var post = {};
    var result = '';
    var startPost = 0;

    var filter = getFilters(thisPost, options);
    var sort = getSortOptions(options);

    // get page details
    if (options && options.hash && options.hash.page) {
      page = JSON.parse(options.hash.page) || {};
    }

    if (options && options.hash && options.hash.debug) {
      debug = true;
      console.log('debug set to true');
    }

    page.start = page.start || 1;
    page.length = page.length || PAGE_LENGTH;
    if (page.all) {
      page.length = posts.length;
    }

    i = posts.length;

    // remove all posts not in our filter
    while (i--) {
      post = posts[i] || {};
      if (!post.data || !isPostInFilter(post, filter)) {
        posts.splice(i, 1);
      }
    }

    if (debug) {
      console.log('> Sort: ', sort);
    }

    // sort our posts
    posts.sort(sortPosts(sort));

    // calculate start and end posts.
    startPost = (page.start - 1) * page.length;
    endPost = startPost + page.length;

    for (i = 0, l = posts.length; i < l; i++) {
      post = posts[i] || {};

      if (isPostOnPage(count, startPost, endPost)) {
        if (debug) {
          console.log('> ' + post.data.title, post.data.posted, count, startPost, endPost);
        }

        result += options.fn({
          item: post,
          index: i
        });
      }
      count++;
    }
    return result;
  });



/* Get a list of posts based on the filter specified.
   *
   * @param posts      object    The posts list
   * @param thisPost   object    The current post
   * @param options    object    The handlebar helper options
   * @return           object    The filtered list of posts
   */
  Handlebars.registerHelper('ifPostContentFound', function (posts, thisPost, options) {
    var count = 0;
    var endPost = 0;
    var i = 0;
    var l = 0;
    var page = {};
    var post = {};
    var startPost = 0;

    var filter = getFilters(thisPost, options);

    // get page details
    if (options && options.hash && options.hash.page) {
      page = JSON.parse(options.hash.page) || {};
    }

    page.start = page.start || 0;
    page.length = page.length || PAGE_LENGTH;

    // calculate start and end posts.
    startPost = (page.start - 1) * page.length;
    endPost = startPost + page.length;

    for (i = 0, l = posts.length; i < l; i++) {
      post = posts[i] || {};

      if (post.data && isPostInFilter(post, filter)) {
        if (isPostOnPage(count, startPost, endPost)) {
          return options.fn(this);
        }
        count++;
      }
    }
    return options.inverse(this);
  });

  /* Get a list of items.
   *
   * @param posts      object    The posts list
   * @param thisPost   object    The current post
   * @param options    object    The handlebar helper options
   * @return           object    The filtered list of posts
   */
  Handlebars.registerHelper('getItems', function (items, options) {
    var endPost = 0;
    var i = 0;
    var l = 0;
    var item = {};
    var page = {};
    var result = '';
    var startPost = 0;

    // get page details
    if (options && options.hash && options.hash.page) {
      page = JSON.parse(options.hash.page) || {};
    }

    // calculate start and end posts.
    startPost = parseInt(page.start - 1, 10) * parseInt(page.length, 10);
    endPost = parseInt(startPost, 10) + parseInt(page.length, 10);

    for (i = 0, l = items.length; i < l; i++) {
      item = items[i] || {};

      if (isPostOnPage(i, startPost, endPost)) {
        item.index = i + 1;
        item.page = parseInt(page.start, 10);
        item.total = l;
        item.first = (i === 0);
        item.firstOnPage = (i === startPost);
        item.last = (i === (l - 1));
        item.lastOnPage = (i === (l - 1) || i === (endPost - 1));
        result += options.fn(item);
      }
    }
    return result;
  });

};