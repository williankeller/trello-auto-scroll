(function (document, window, Selector, Storage, Runtime) {
  'use strict';

  /**
   * Default settings.
   * @type Object
   */
  var defaults = {
    // Button element class.
    button: '.action-scroll',
    // Expected element style action.
    behavior: 'scrolling'
  };

  /**
   * Set a translatable variable to a element.
   *
   * @param {Object} element
   * @param {String} obj
   * @param {String} string
   */
  var translate = function (element, obj, string) {
    element[obj] = Runtime.api('i18n').getMessage(string);
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
      element.textContent = Runtime.api('i18n').getMessage('buttonPause');

      // Return behavior.
      return defaults.behavior;
    }
    // Set star text.
    element.textContent = Runtime.api('i18n').getMessage('buttonStart');
  };

  /**
   * Retrieve values from Chrome storage and change button behavior.
   */
  var start = function () {
    // Get saved options.
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

    // Set button options title.
    translate(Selector.element('.img-settings'), 'title', 'buttonOptions');
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

    // Create a message to send the action to content script.
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

})(document, window, Selector, Storage, Runtime);