'use strict';

var picturesContainer = document.querySelector('.pictures');
var templateElement = document.querySelector('template');
var elementToClone;
var filtersContainer = document.querySelector('.filters');
var pictures = [];
var pageNumber = 0;
var filteredPictures = [];
var scrollTimeout;

var IMAGE_LOAD_TIMEOUT = 10000;
var XHR_TIMEOUT = 10000;
var IMAGE_WIDTH = 182;
var IMAGE_HEIGTH = 182;
var PICTURES_LOAD_URL = '//o0.github.io/assets/json/pictures.json';
var DAYS_LIMIT = 4;
var PAGE_SIZE = 12;
var THROTTLE_DELAY = 100;
var GAP = 50;

var filtersList = [
  {
    value: 'new',
    filteringMethod: function(picturesToFilter) {
      return picturesToFilter.sort(compareDate).filter(isPictureNew);
    }
  },
  {
    value: 'discussed',
    filteringMethod: function(picturesToFilter) {
      return picturesToFilter.sort(compareCommentsNumber);
    }
  },
  {
    value: 'popular',
    default: true,
    filteringMethod: function(picturesToFilter) {
      return picturesToFilter.filter(function() {
        return true;
      });
    }
  }
];

var defaultFilter = filtersList.filter(function(filter) {
  return filter.default;
})[0];

var filterArray = function(name, picturesToFilter) {
  var currentFilter = filtersList.filter(function(filter) {
    return filter.value === name;
  })[0];
  return currentFilter.filteringMethod(picturesToFilter);
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

  xhr.timeout = XHR_TIMEOUT;
  xhr.ontimeout = onFailure;

  picturesContainer.classList.add('pictures-loading');

  xhr.open('GET', PICTURES_LOAD_URL);
  xhr.send();
};

var renderPictures = function(loadedPictures, page, replace) {
  if(replace) {
    picturesContainer.innerHTML = '';
  }

  var from = page * PAGE_SIZE;
  var to = from + PAGE_SIZE;

  loadedPictures.slice(from, to).forEach(function(picture) {
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
  return filterArray(filter, loadedPictures.slice(0));
};

var setFilterEnabled = function(filter) {
  pageNumber = 0;
  filter = filter || defaultFilter.value;
  filteredPictures = getFilteredPictures(pictures, filter);
  if (filteredPictures.length === 0) {
    picturesContainer.classList.add('pictures-not-found');
    renderPictures(filteredPictures, pageNumber, true);
  } else {
    picturesContainer.classList.remove('pictures-not-found');
    renderPictures(filteredPictures, pageNumber, true);

    while (isBottomReached() && isNextPageAvailable(filteredPictures, pageNumber, PAGE_SIZE)) {
      pageNumber++;
      renderPictures(filteredPictures, pageNumber, false);
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

var getPageHeight = function() {
  return Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
};

var isBottomReached = function() {
  var pageHeight = getPageHeight();
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  var space = pageHeight - (scrollTop + document.documentElement.clientHeight);
  return space < GAP;
};

var isNextPageAvailable = function(picturesList, page, pageSize) {
  return page < Math.floor(picturesList.length / pageSize);
};

var scrollThrottler = function() {
  if (!scrollTimeout) {
    scrollTimeout = setTimeout(function() {
      scrollTimeout = null;
      drawNextPage();
    }, THROTTLE_DELAY);
  }
};

var drawNextPage = function() {
  if (isBottomReached() && isNextPageAvailable(filteredPictures, pageNumber, PAGE_SIZE)) {
    pageNumber++;
    renderPictures(filteredPictures, pageNumber, false);
  }
};

getPictures(function(loadedPictures) {
  pictures = loadedPictures;
  setFiltrationEnabled();
  setFilterEnabled();
  window.addEventListener('scroll', scrollThrottler);
});
