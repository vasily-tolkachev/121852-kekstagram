'use strict';

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

var getPictureElement = function(data, container) {
  var element = elementToClone.cloneNode(true);
  container.appendChild(element);

  element.querySelector('.picture-comments').textContent = data.comments;
  element.querySelector('.picture-likes').textContent = data.likes;

  var imageTag = element.querySelector('img');
  var image = new Image(182, 182);
  var pictureLoadTimeout;

  image.onload = function(evt) {
    clearTimeout(pictureLoadTimeout);
    imageTag.src = evt.target.src;
    imageTag.width = 182;
    imageTag.height = 182;
  };

  image.onerror = function() {
    element.classList.add('picture-load-failure');
  };

  image.src = data.url;

  pictureLoadTimeout = setTimeout(function() {
    image.src = '';
    element.classList.add('picture-load-failure');
  }, IMAGE_LOAD_TIMEOUT);

  return element;
};

window.pictures.forEach(function(picture) {
  getPictureElement(picture, picturesContainer);
});

filterContainer.classList.remove('hidden');
