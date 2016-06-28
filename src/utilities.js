'use strict';

var GAP = 50;

module.exports = {
  getPageHeight: function() {
    return Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );
  },
  isBottomReached: function() {
    var pageHeight = this.getPageHeight();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var space = pageHeight - (scrollTop + document.documentElement.clientHeight);
    return space < GAP;
  },
  isNextPageAvailable: function(picturesList, page, pageSize) {
    return page < Math.floor(picturesList.length / pageSize);
  }
};
