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
      animateTime: 1,
      delayScroll: 3.5,
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

    // Start translate the seconds labels.
    translate(Selector.element('.seconds-div1-label'), 'textContent', 'labelInputSecond');
    translate(Selector.element('.seconds-div2-label'), 'textContent', 'labelInputSecond');

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
      // Set default values or saved options to number inputs.
      Selector.element('.animate-time').value = storage.animateTime;
      Selector.element('.delay-scroll').value = storage.delayScroll;

      // Set default values or saved options to range inputs.
      Selector.element('.animate-time-range').value = storage.animateTime;
      Selector.element('.delay-scroll-range').value = storage.delayScroll;

      // Set default values or saved options to checkbox input.
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
   * Live get input value and set inside a label.
   *
   * @param {String} selector
   * @param {String} label
   * @returns {Boolean}
   */
  var elementRange = function (selector, label) {
    var element = Selector.element(selector);
    var numbers = Selector.element(label);

    // To listener the frame animation.
    var listener = function () {
      window.requestAnimationFrame(function () {
        // Define changed input value on slide.
        numbers.value = element.value;
      });
    };
    // To listener the mouse down action.
    element.addEventListener('mousedown', function () {
      element.addEventListener('mousemove', listener);
    });
    return false;
  };

  /**
   * Function to start the application.
   */
  var start = function () {
    // Add translatable content.
    translateContent();

    // Start and fill fields with storage values.
    fillFields();

    elementRange('.delay-scroll-range', '.delay-scroll');
    elementRange('.animate-time-range', '.animate-time');
  };

  /**
   * Detect click action under save button.
   */
  Selector.click('.save-options', null, function () {
    // Get filled options as callback.
    get(function (options) {
      // If all is okay, proceed and save options.
      Storage.save(options, response('buttonSaved', 'buttonToSave', '.save-options'));
    });
    return false;
  });

  /**
   * Detect click action under save button.
   */
  Selector.click('.reset-options', null, function () {
    Storage.save(settings.defaults, response('buttonReset', 'buttonToReset', '.reset-options'));

    // Restart and fill fields with new storage values.
    fillFields();
  });

  // Set default options or saved options already.
  document.addEventListener('DOMContentLoaded', start);

})(document, Selector, Storage, Runtime);