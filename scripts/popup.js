(function (j, chrome, document) {
  'use strict';
  j('.options-scroll').on('click', function () {
    if (chrome.runtime.openOptionsPage) {
      // New way to open options pages, if supported (Chrome 42+).
      chrome.runtime.openOptionsPage();
    } else {
      // Reasonable fallback.
      window.open(chrome.runtime.getURL('pages/options.html'));
    }
  });

})(jQuery, chrome, document);
