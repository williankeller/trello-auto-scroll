
var executeScroll = function(items) {
  // Get board variables.
  var $cards = $('.list-wrapper').not('.js-add-list'),
    cards = 0,
    scrollTime = items.scrollTime,
    animation = items.animationTime,
    margin = 10;

  $cards.each(function () {
    cards += $(this).width();
  });

  var $board = $('#board'),
    scrollStep = (cards / $cards.length),
    scrollPrev = margin,
    // Initial step is the same of all of the other steps.
    leftPos = 0;

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
    }
    else {
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

$('document').ready(function() {
  intervalListener = setInterval(function () {
    if ($('#board').length > 0) {
      chrome.storage.sync.get({
        scrollTime: 3500,
        animationTime: 800
      }, function(items) {
        executeScroll(items);
        window.clearInterval(intervalListener);
      });
    }
  }, 200);
});
