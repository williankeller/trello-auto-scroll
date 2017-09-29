// Set a status directly at the status div.
var set_status = function (text, classname) {
  var status = document.getElementById('status');
  status.textContent = text;
  status.className += classname;

  setTimeout(function () {
    status.textContent = '';
    status.className = '';
  }, 1500);
};

// Saves options to chrome.storage.sync.
var optionsSave = function () {
  var scrollTimeValue = document.getElementById('scroll-time').value;
  var animationTimeValue = document.getElementById('animation-time').value;

  if ((! scrollTimeValue) || (! animationTimeValue)) {
    set_status('Please fill all items in the form', 'error');
    return false;
  }

  chrome.storage.sync.set({
    scrollTime: scrollTimeValue,
    animationTime: animationTimeValue
  }, set_status('Options Saved!', 'success'));
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
var optionsRestore = function () {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    scrollTime: 3500,
    animationTime: 800
  }, function (items) {
    document.getElementById('scroll-time').value = items.scrollTime;
    document.getElementById('animation-time').value = items.animationTime;
  });
};

document.addEventListener('DOMContentLoaded', optionsRestore);
document.getElementById('save').addEventListener('click', optionsSave);
