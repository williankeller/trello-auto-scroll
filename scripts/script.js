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
    // Column definitions
    column: {
      list: '.list-wrapper',
      exclude: '.js-add-list',
      margin: 10
    },
    // Actions to define board.
    position: 0,
    interval: null
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

  /**
   * Get and define the scroll step size and board window size.
   *
   * @returns {Object}
   */
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
   * Create a scroll animation to navegate for each column.
   *
   * @param {Object} define
   * @param {Int} steps
   */
  var scrollAnimation = function (define, steps) {
    // Animate to right.
    $(settings.board).animate({
      // Steps to scroll.
      scrollLeft: steps
      // Animation delay time.
    }, define.defaults.animationTime);
  };

  /**
   * Initialize the scroll action with a interval steps.
   *
   * @param {Object} define
   */
  var scrollAction = function (define, action) {
    // Check if need to stop interval.
    if (action === 'stop') {
      // Clear current interval.
      clearInterval(settings.interval);

      // Return to kill function.
      return false;
    }

    // Instance counter variables.
    var size = getSizes();

    // Set interval as a loop to stop by each column.
    settings.interval = setInterval(function () {
      // Increment scroll size.
      settings.position += size.step;
      // Total window size is still bigger than current scroll?
      if (size.total >= settings.position) {

        // Scroll animation to navegate for each column.
        scrollAnimation(define, settings.position);
      }
      // Set left position to initial point.
      else {
        settings.position = 0;
      }
      // Delay time between the setps.
    }, define.defaults.scrollTime);
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
      // Define the Chorme storage to default settings.
      settings.defaults = storage;

      // Initialize the scroll action with a interval steps.
      scrollAction(settings, action);
    });
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
        trelloAutoScroll();
      }
      else {
        // Pause the scroll action.
        trelloAutoScroll('stop');
      }
    }
  );

})(jQuery, chrome, window);
