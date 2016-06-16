'use strict';

var picturesContainer = document.querySelector('.pictures');
var templateElement = document.querySelector('template');
var elementToClone;
var filtersContainer = document.querySelector('.filters');
var pictures = [];

var IMAGE_LOAD_TIMEOUT = 10000;
var IMAGE_WIDTH = 182;
var IMAGE_HEIGTH = 182;
var PICTURES_LOAD_URL = '//o0.github.io/assets/json/pictures.json';
var DAYS_LIMIT = 4;

var filtersList = {
  'POPULAR': {
    value: 'popular',
    id: 'filter-popular'
  },
  'NEW': {
    value: 'new',
    id: 'filter-new'
  },
  'DISCUSSED': {
    value: 'discussed',
    id: 'filter-discussed'
  }
};

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

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

  xhr.timeout = 10000;
  xhr.ontimeout = onFailure;

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

var compareCommentsNumber = function(a, b) {
  if (b.comments < a.comments) {
    return -1;
  }
  if (b.comments > a.comments) {
    return 1;
  }
  return 0;
};

var compareDate = function(a, b) {
  var firstDate = new Date(a.date);
  var secondDate = new Date(b.date);

  if (secondDate < firstDate) {
    return -1;
  }
  if (secondDate > firstDate) {
    return 1;
  }
  return 0;
};

var isPictureNew = function(picture) {
  //количество дней от даты публикации до текущего момента
  var daysAre = (Date.now() - Date.parse(picture.date)) / 24 / 60 / 60 / 1000;
  return daysAre <= DAYS_LIMIT;
};

var getFilteredPictures = function(loadedPictures, filter) {
  var picturesToFilter = loadedPictures.slice(0);

  switch (filter) {
    case filtersList.POPULAR.value:
      picturesToFilter = picturesToFilter.filter(function() {
        return true;
      });
      break;
    case filtersList.DISCUSSED.value:
      picturesToFilter.sort(compareCommentsNumber);
      break;
    case filtersList.NEW.value:
      picturesToFilter = picturesToFilter.sort(compareDate).filter(isPictureNew);
      break;
    default:
      picturesToFilter = picturesToFilter.filter(function() {
        return true;
      });
      break;
  }

  return picturesToFilter;
};

var setFilterEnabled = function(filter) {
  if (typeof filter === 'undefined') {
    filter = 'popular';
  }
  var filteredPictures = getFilteredPictures(pictures, filter);
  if (filteredPictures.length === 0) {
    picturesContainer.classList.add('pictures-not-found');
  } else {
    renderPictures(filteredPictures);
  }
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
  setFilterEnabled();
});
