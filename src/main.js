(function ($, chrome, window, Storage) {
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
    // Retrieve currrent action to load page.
    action: {
      scrollAction: false
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
    interval: null,
    direction: 'right'
  };

  /**
   * Function to check if Trello board exists and load default settings.
   *
   * @param {Object} request
   * @param {Function} callback
   * @returns {Boolean|Object}
   */
  var boarding = function (request, callback) {
    // Get saved data.
    Storage.get(request, callback);
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
      sizeColumns += parseInt($(this).outerWidth() + settings.column.margin);
    });
    return {
      step: (sizeColumns / columns.length),
      total: (sizeColumns - sizeBoard)
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
    }, parseInt(define.defaults.animationTime));
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
      // Update direction when direction back to initial point.
      if (settings.position === 0) {
        settings.direction = 'right';
      }

      // Total window size is still bigger than current scroll?
      if ((size.total >= settings.position) && (settings.direction === 'right')) {
        // Increment scroll size.
        settings.position += size.step;
      }
      // When all card was displayed.
      else {
        // Check if is needed to back in steps.
        if (define.defaults.scrollStepBack) {
          // Update direction to back to initial estate.
          settings.direction = 'left';

          // Decrement scroll size.
          settings.position -= size.step;
        }
        // Set left position to initial point.
        else {
          settings.position = 0;
        }
      }
      // Scroll animation to navegate for each column.
      scrollAnimation(define, settings.position);

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

    // Load default settings and start scroll action.
    boarding(settings.defaults, function (storage) {
      // Define the Chorme storage to default settings.
      settings.defaults = storage;

      // Initialize the scroll action with a interval steps.
      scrollAction(settings, action);
    });
  };

  /**
   * Add listener to request message defined by action under the popup file.
   * Check if the requested action and execute the Auto Scroll function.
   */
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      // Check if the scrolling actions is requested.
      if (request.message === 'scrolling') {
        // Scroll board to last column and back to the first one.
        trelloAutoScroll();
      }
      // Pause the scroll action..
      else {
        trelloAutoScroll('stop');
      }
    }
  );

  /**
   * Iniciate globally to detect if Trello board is already loaded.
   */
  var intervalListener = setInterval(function () {
    // Board loaded already?
    if ($(settings.board).length > 0) {
      // Stop interval.
      clearInterval(intervalListener);
    }

    // Load default action and start scroll action.
    boarding(settings.action, function (storage) {
      // Start paused if button to start is not pressed yet.
      if (storage.scrollAction === false) {
        // Pause the scroll action.
        trelloAutoScroll('stop');

        return false;
      }
      // Start board if there is no rquest to pause.
      trelloAutoScroll('start');
    });
  }, 100);

})(jQuery, chrome, window, Storage);
