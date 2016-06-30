'use strict';

var PAGE_SIZE = 12;

var picturesContainer = document.querySelector('.pictures');
var Photo = require('./photo');
var renderedPictures = [];

module.exports = function(loadedPictures, page, replace) {
  if(replace) {
    renderedPictures.forEach(function(photo) {
      photo.remove();
    });
    renderedPictures = [];
  }

  var from = page * PAGE_SIZE;
  var to = from + PAGE_SIZE;

  loadedPictures.slice(from, to).forEach(function(picture) {
    renderedPictures.push(new Photo(picture, picturesContainer));
  });
};
