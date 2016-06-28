'use strict';

var PAGE_SIZE = 12;

var picturesContainer = document.querySelector('.pictures');
var getPictureElement = require('./picture-block');

module.exports = function(loadedPictures, page, replace) {
  if(replace) {
    picturesContainer.innerHTML = '';
  }

  var from = page * PAGE_SIZE;
  var to = from + PAGE_SIZE;

  loadedPictures.slice(from, to).forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });
};
