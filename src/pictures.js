'use strict';

function scriptRequest(source, callback) {
  window.__picturesLoadCallback = function(data) {
    delete window.__picturesLoadCallback;
    document.body.removeChild(script);
    callback(data);
  };

  var script = document.createElement('script');
  script.src = source;
  document.body.appendChild(script);
}

var picturesContainer = document.querySelector('.pictures');
var templateElement = document.querySelector('template');
var elementToClone;
var filterContainer = document.querySelector('.filters');

filterContainer.classList.add('hidden');

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

var IMAGE_LOAD_TIMEOUT = 10000;
var IMAGE_WIDTH = 182;
var IMAGE_HEIGTH = 182;

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

scriptRequest('https://up.htmlacademy.ru/assets/js_intensive/jsonp/pictures.js', function(pictures) {
  pictures.forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });
});

filterContainer.classList.remove('hidden');
