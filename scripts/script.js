(function ($, chrome, window) {
  'use strict';

  /*
   * Default settings.
   * @type Object
   */
  var settings = {
    // Default start definitions.
    defaults: {
      animationTime: 800,
      scrollStepBack: false,
      scrollTime: 3500
    },

    // Trello board ID.
    board: '#board',
    // Column definition.
    column: {
      list: '.list-wrapper',
      exclude: '.js-add-list',
      margin: 10
    }

  };

  /**
   * Function to check if Trello board exists and load default settings.
   *
   * @param {Function} callback
   * @returns {Boolean|Object}
   */
  var boarding = function (callback) {
    // Get chrome data.
    chrome.storage.sync.get(settings.defaults, callback);
  };

  var getSizes = function () {
    var sizeColumns = 0,
      sizeBoard = $(settings.board).width(),
      columns = $(settings.column.list);

    // Map all columns and get there width size.
    columns.each(function () {
      sizeColumns += ($(this).width() + settings.column.margin);
    });

    return {
      step: parseInt(sizeColumns / columns.length),
      total: parseInt(sizeColumns - sizeBoard)
    };
  };

  /**
   * Create a scroll function to navegate for each column.
   *
   * @param {Int} size
   * @param {Int} steps
   */
  var scrollAction = function (size, steps) {
    // Increment scroll size.
    steps += size.step;

    // Total window size is still bigger than current scroll?
    if (size.total >= steps) {
      // Animate to right.
      $(settings.board).animate({

        scrollLeft: steps

      }, settings.defaults.animationTime);
    }
    // Set left position to initial point.
    else {
      steps = 0;
    }
  };

  /**
   * Scroll board to last column and back to the first one.
   *
   * @param {Boolean} action
   * @returns {Boolean}
   */
  var trelloAutoScroll = function (action) {
    // Board loaded already?
    if ($(settings.board).length < 1) {
      return false;
    }

    // Retrieve the Chrome storage values.
    boarding(function (storage) {
      settings.defaults = storage;
    });

    // Instance counter variables.
    var steps = 0,
      size = getSizes();

    // Set interval as a loop to stop by each column.
    setInterval(function () {

      scrollAction(size, steps);

    }, settings.defaults.scrollTime);
  };

  /**
   * Add listener to request message defined under the popup file.
   * Check if the requested action and execute the Auto Scroll function.
   */
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      // Check if the scrolling actions is requested.
      if (request.message === 'scrolling') {
        // Scroll board to last column and back to the first one.
        trelloAutoScroll(true);
      }
      else {
        // Pause the scroll action.
        trelloAutoScroll(false);
      }
    }
  );

})(jQuery, chrome, window);
