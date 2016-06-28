'use strict';

var THROTTLE_DELAY = 100;
var PAGE_SIZE = 12;

var pageNumber = 0;
var filteredPictures = [];
var scrollTimeout;
var filtersContainer = document.querySelector('.filters');
var pictures = [];
var picturesContainer = document.querySelector('.pictures');

var renderPicturesPage = require('./render-pictures-page');
var getFilteredPictures = require('./filter');
var utilities = require('../utilities');
var getPictures = require('./load');

var scrollThrottler = function() {
  if (!scrollTimeout) {
    scrollTimeout = setTimeout(function() {
      scrollTimeout = null;
      drawNextPage();
    }, THROTTLE_DELAY);
  }
};

var drawNextPage = function() {
  if (utilities.isBottomReached() && utilities.isNextPageAvailable(filteredPictures, pageNumber, PAGE_SIZE)) {
    pageNumber++;
    renderPicturesPage(filteredPictures, pageNumber, false);
  }
};

var setFilterEnabled = function(filter) {
  pageNumber = 0;

  filteredPictures = getFilteredPictures(pictures, filter);
  if (filteredPictures.length === 0) {
    picturesContainer.classList.add('pictures-not-found');
    renderPicturesPage(filteredPictures, pageNumber, true);
  } else {
    picturesContainer.classList.remove('pictures-not-found');
    renderPicturesPage(filteredPictures, pageNumber, true);

    while (utilities.isBottomReached() && utilities.isNextPageAvailable(filteredPictures, pageNumber, PAGE_SIZE)) {
      pageNumber++;
      renderPicturesPage(filteredPictures, pageNumber, false);
    }
  }
};

var setFiltrationEnabled = function() {
  filtersContainer.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('filters-radio')) {
      setFilterEnabled(evt.target.value);
    }
  });
};

getPictures(function(loadedPictures) {
  pictures = loadedPictures;
  setFiltrationEnabled();
  setFilterEnabled();
  window.addEventListener('scroll', scrollThrottler);
});
