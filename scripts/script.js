(function ($) {
  "use strict";

  /**
   * Scroll board to last card and back to the first one.
   *
   * @returns {Boolean}
   */
  var trelloAutoScroll = function () {
    // Get board variables.
    var $board = $('#board'),
      $cards = $('.list-wrapper').not('.js-add-list'),
      cards = 0,
      scrollTime = 3500,
      animation = 800,
      margin = 10;

    // Map all cards and get there width size.
    $cards.each(function () {
      cards += $(this).width();
    });

    // Initial step is the same of all of the other steps.
    var leftPos = 0,
      scrollStep = (cards / $cards.length),
      scrollPrev = margin;

    // Set interval as a loop to stop by each card.
    setInterval(function () {
      // While cards is more bigger then current scroll.
      if ((cards >= leftPos) && ($board.scrollLeft() != scrollPrev)) {
        // Save previus scroll.
        scrollPrev = $board.scrollLeft();

        // Increment scroll.
        leftPos += parseInt(scrollStep + margin);

        // Animate to right.
        $board.animate({
          scrollLeft: leftPos
        }, animation);
      } else {
        // Animate to left.
        $board.animate({
          scrollLeft: 0
        }, animation);

        // Clear sroll.
        leftPos = 0;
        scrollPrev = margin;
      }
    }, scrollTime);
  };

  /**
   * Interval to detect if Trello board is already loaded.
   */
  intervalListener = setInterval(function () {
    // Board loaded already?
    if ($('#board').length > 0) {
      // Load function.
      trelloAutoScroll();

      // Stop interval.
      window.clearInterval(intervalListener);
    }
  }, 100);

})(jQuery);