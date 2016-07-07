'use strict';

var GAP = 50;

var KeyCode = {
  ENTER: 13,
  ESC: 27,
  SPACE: 32
};

module.exports = {
  getPageHeight: function() {
    return Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );
  },
  isActivationEvent: function(evt) {
    return [KeyCode.ENTER, KeyCode.SPACE].indexOf(evt.keyCode) > -1;
  },
  isDeactivationEvent: function(evt) {
    return evt.keyCode === KeyCode.ESC;
  },
  isBottomReached: function() {
    var pageHeight = this.getPageHeight();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var space = pageHeight - (scrollTop + document.documentElement.clientHeight);
    return space < GAP;
  },
  isNextPageAvailable: function(picturesList, page, pageSize) {
    return page < Math.floor(picturesList.length / pageSize);
  },
  changeHash: function(newHashString) {
    window.location.hash = newHashString;
  },
  getHash: function() {
    return window.location.hash;
  },
  inherit: function(Parent, Child) {
    var EmptyCtor = function() {};
    EmptyCtor.prototype = Parent.prototype;
    Child.prototype = new EmptyCtor();
  }
};
