'use strict';

var XHR_TIMEOUT = 10000;
var PICTURES_LOAD_URL = '//o0.github.io/assets/json/pictures.json';

var picturesContainer = document.querySelector('.pictures');
var filtersContainer = document.querySelector('.filters');

var onFailure = function() {
  picturesContainer.classList.remove('pictures-loading');
  picturesContainer.classList.add('pictures-failure');
  filtersContainer.classList.remove('hidden');
};

var getPictures = function(callback) {
  filtersContainer.classList.add('hidden');
  var xhr = new XMLHttpRequest();

  xhr.onload = function(evt) {
    picturesContainer.classList.remove('pictures-loading');
    var loadedData = JSON.parse(evt.target.response);
    callback(loadedData);
    filtersContainer.classList.remove('hidden');
  };

  xhr.onerror = onFailure;

  xhr.timeout = XHR_TIMEOUT;
  xhr.ontimeout = onFailure;

  picturesContainer.classList.add('pictures-loading');

  xhr.open('GET', PICTURES_LOAD_URL);
  xhr.send();
};

module.exports = getPictures;
