(function ($, chrome, window) {
  'use strict';

  /**
   * Scroll board to last card and back to the first one.
   *
   * @param Object items
   *   Settings returned From google.
   *
   * @returns {Boolean}
   */
  var trelloAutoScroll = function (items) {
    // Get board variables.
    var $board = $('#board'),
      $cards = $('.list-wrapper').not('.js-add-list'),
      scrollTime = items.scrollTime,
      scrollStepBack = items.scrollStepBack,
      animation = items.animationTime,
      cards = 0,
      margin = 10;

    // Map all cards and get there width size.
    $cards.each(function () {
      cards += $(this).width();
    });

    // Initial step is the same of all of the other steps.
    var leftPos = 0,
      scrollStep = (cards / $cards.length),
      scrollPrev = margin,
      direction = 'right';

    // Set interval as a loop to stop by each card.
    setInterval(function () {
      // Update direction when direction back to initial point.
      if (leftPos === 0) {
        direction = 'right';
      }

      // While cards is more bigger then current scroll.
      if ((cards >= leftPos) && ($board.scrollLeft() !== scrollPrev) && (direction === 'right')) {
        // Save previus scroll.
        scrollPrev = $board.scrollLeft();

        // Increment scroll.
        leftPos += parseInt(scrollStep + margin);

        // Animate to right.
        $board.animate({
          scrollLeft: leftPos
        }, animation);
      }
      // When all card was displayed.
      else {
        // Check if is needed to back in steps.
        if (scrollStepBack) {
          // Update direction to back to initial estate.
          direction = 'left';
          // Decrement left position in steps.
          leftPos -= parseInt(scrollStep + margin);
        }
        // Set left position to initial point.
        else {
          leftPos = 0;
        }
        // Animate to left.
        $board.animate({
          scrollLeft: leftPos
        }, animation);

        scrollPrev = margin;
      }
    }, scrollTime);
  };

  /**
   * Interval to detect if Trello board is already loaded.
   *
   * @type Interval
   */
  var intervalListener = setInterval(function () {
    // Board loaded already?
    if ($('#board').length > 0) {
      // Get chrome data.
      chrome.storage.sync.get({
        scrollTime: 3500,
        scrollStepBack: false,
        animationTime: 800
      }, function (items) {
        // Load function.
        trelloAutoScroll(items);
      });
      // Stop interval.
      window.clearInterval(intervalListener);
    }
  }, 100);
})(jQuery, chrome, window);
