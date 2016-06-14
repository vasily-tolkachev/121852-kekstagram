'use strict';

var picturesContainer = document.querySelector('.pictures');
var templateElement = document.querySelector('template');
var elementToClone;
var filtersContainer = document.querySelector('.filters');
var pictures = [];

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

var IMAGE_LOAD_TIMEOUT = 10000;
var IMAGE_WIDTH = 182;
var IMAGE_HEIGTH = 182;
var PICTURES_LOAD_URL = '//o0.github.io/assets/json/pictures.json';

var getPictureElement = function(data, container) {
  var element = elementToClone.cloneNode(true);
  container.appendChild(element);

  element.querySelector('.picture-comments').textContent = data.comments;
  element.querySelector('.picture-likes').textContent = data.likes;

  var imageTag = element.querySelector('img');
  var image = new Image(IMAGE_WIDTH, IMAGE_HEIGTH);
  var pictureLoadTimeout;

  image.onload = function(evt) {
    clearTimeout(pictureLoadTimeout);
    imageTag.src = evt.target.src;
    imageTag.width = IMAGE_WIDTH;
    imageTag.height = IMAGE_HEIGTH;
  };

  image.onerror = function() {
    clearTimeout(pictureLoadTimeout);
    element.classList.add('picture-load-failure');
  };

  image.src = data.url;

  pictureLoadTimeout = setTimeout(function() {
    image.src = '';
    element.classList.add('picture-load-failure');
  }, IMAGE_LOAD_TIMEOUT);

  return element;
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

  xhr.onerror = function() {
    picturesContainer.classList.remove('pictures-loading');
    picturesContainer.classList.add('pictures-failure');
    filtersContainer.classList.remove('hidden');
  };

  xhr.timeout = 10000;
  xhr.ontimeout = function() {
    picturesContainer.classList.remove('pictures-loading');
    picturesContainer.classList.add('pictures-failure');
    filtersContainer.classList.remove('hidden');
  };

  picturesContainer.classList.add('pictures-loading');

  xhr.open('GET', PICTURES_LOAD_URL);
  xhr.send();
};

var renderPictures = function(loadedPictures) {
  picturesContainer.innerHTML = '';
  loadedPictures.forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });
};

var getFilteredPictures = function(loadedPictures, filter) {
  var picturesToFilter = loadedPictures.slice(0);

  switch (filter) {
    case 'discussed':
      picturesToFilter.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;
    case 'new':
      picturesToFilter.sort(function(a, b) {
        return Date.parse(b.date) - Date.parse(a.date);
      });
      picturesToFilter = picturesToFilter.filter(function(picture) {
        return ((Date.now() - Date.parse(picture.date)) / 24 / 60 / 60 / 1000) <= 4 &&
          ((Date.now() - Date.parse(picture.date)) / 24 / 60 / 60 / 1000) > 0;
      });
      break;
  }

  return picturesToFilter;
};

var setFilterEnabled = function(filter) {
  var filteredHotels = getFilteredPictures(pictures, filter);
  renderPictures(filteredHotels);
};


var setFiltrationEnabled = function() {
  var filters = filtersContainer.querySelectorAll('.filters-radio');
  for (var i = 0; i < filters.length; i++) {
    filters[i].onclick = function() {
      setFilterEnabled(this.value);
    };
  }
};

getPictures(function(loadedPictures) {
  pictures = loadedPictures;
  setFiltrationEnabled();
  setFilterEnabled('popular');
});
