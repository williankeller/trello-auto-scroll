(function (document, Selector, Storage, Runtime) {
  'use strict';

  /**
   * Predefined values.
   *
   * @type Object
   */
  var settings = {
    // Default start definitions.
    defaults: {
      animateTime: 800,
      delayScroll: 3500,
      scrollSteps: false
    }
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
   * Translate content.
   */
  var translateContent = function () {
    // Start translate labels.
    translate(Selector.element('.delay-scroll-label'), 'textContent', 'labelDelayScroll');
    translate(Selector.element('.animate-time-label'), 'textContent', 'labelAnimateTime');
    translate(Selector.element('.scroll-steps-label'), 'textContent', 'labelScrollSteps');

    // Start translate buttons.
    translate(Selector.element('.reset-options'), 'textContent', 'buttonToReset');
    translate(Selector.element('.save-options'), 'textContent', 'buttonToSave');
  };

  /**
   * Get values from the selectors and return as callback.
   *
   * @param {Callback} callback
   */
  var get = function (callback) {
    callback({
      animateTime: Selector.element('.animate-time').value,
      delayScroll: Selector.element('.delay-scroll').value,
      scrollSteps: Selector.element('.scroll-steps').checked
    });
  };

  /**
   * Retrieve values from Chrome storage and set as default value.
   */
  var fillFields = function () {
    // Get saved options.
    Storage.get(settings.defaults, function (storage) {
      // Set degault values or saved options.
      Selector.element('.animate-time').value = storage.animateTime;
      Selector.element('.delay-scroll').value = storage.delayScroll;
      Selector.element('.scroll-steps').checked = storage.scrollSteps;
    });
  };

  /**
   * Set message to the options container.
   *
   * @param {String} message
   * @param {String} classname
   */
  var response = function (messageIn, messageOut, classname) {
    var element = Selector.element(classname);

    // Set text message.
    element.textContent = Runtime.api('i18n').getMessage(messageIn);

    // Remove old message and set new one.
    setTimeout(function () {
      element.textContent = Runtime.api('i18n').getMessage(messageOut);
    }, 2000);
  };

  /**
   * Function to start the application.
   */
  var start = function () {
    // Add translatable content.
    translateContent();

    // Start and fill fields with storage values.
    fillFields();
  };

  /**
   * Detect click action under save button.
   */
  Selector.click('.save-options', null, function (element) {
    // Get filled options as callback.
    get(function (options) {
      // If all is okay, proceed and save options.
      Storage.save(options,
        response('buttonSaved', 'buttonToSave', '.save-options'));
    });
  });

  /**
   * Detect click action under save button.
   */
  Selector.click('.reset-options', null, function () {
    Storage.save(settings.defaults,
      response('buttonReset', 'buttonToReset', '.reset-options'));

    // Restart and fill fields with new storage values.
    fillFields();
  });

  // Set default options or saved options already.
  document.addEventListener('DOMContentLoaded', start);

})(document, Selector, Storage, Runtime);