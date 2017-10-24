(function (chrome, window, Selector, Storage, Runtime) {
  'use strict';

  /**
   * Default settings.
   * @type Object
   */
  var defaults = {
    // Texto to Start scroll action.
    startText: 'Start auto scroll',
    // Text to Pause scroll action.
    pauseText: 'Pause auto scroll',
    // Button element class.
    button: '.action-scroll',
    // Expected element style action.
    behavior: 'scrolling'
  };

  /**
   * Handler button behavior, changing text and color.
   *
   * @returns {defaults.behavior|String|Boolean}
   */
  var button = function () {
    // Instance button element.
    var element = Selector.element(defaults.button);

    // Check if class is already defined to change the text.
    if ((element.classList.contains(defaults.behavior))) {
      // Set default Pause text.
      element.innerHTML = defaults.pauseText;

      // Return behavior.
      return defaults.behavior;
    }
    // Set star text.
    element.innerHTML = defaults.startText;
    // Kill function.
    return false;
  };

  /**
   * Retrieve values from Chrome storage and change button behavior.
   */
  var start = function () {
    Storage.get({
      scrollAction: false
    }, function (storage) {
      // Check if a behavior is already saved.
      if (storage.scrollAction === defaults.behavior) {
        // Add behavior as element class.
        Selector.addClass(defaults.button, defaults.behavior);
      }
      /**
       * Handler button behavior, changing text and color.
       */
      button();
    });
  };

  /**
   * Detect click action under the Start/Stop button.
   */
  Selector.click(defaults.button, null, function () {
    // Toogle scrolling class.
    Selector.toggle(defaults.button, defaults.behavior);

    /**
     * Handler button behavior, changing text and color.
     */
    var action = button();

    // Store scroll behavior action to Start or Pause.
    Storage.save({
      scrollAction: action
    });

    // Create a message to sent the action to content script.
    Runtime.api('tabs').query({currentWindow: true, active: true}, function (tabs) {
      var activeTab = tabs[0];
      Runtime.api('tabs').sendMessage(activeTab.id, {
        'message': action
      });
    });
  });

  /**
   * Go to the settings page.
   */
  Selector.click('.open-options', null, function () {
    if (Runtime.api('runtime').openOptionsPage) {
      // New way to open options pages, if supported (Chrome 42+).
      Runtime.api('runtime').openOptionsPage();
    } else {
      // Reasonable fallback.
      window.open(Runtime.api('runtime').getURL('options.html'));
    }
  });

  // Set default button behavior.
  document.addEventListener('DOMContentLoaded', start);

})(chrome, window, Selector, Storage, Runtime);