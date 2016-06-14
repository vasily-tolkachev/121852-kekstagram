'use strict';

var dataLength = 0;
var picturesContainer = document.querySelector('.pictures');
var templateElement = document.querySelector('template');
var elementToClone;
var filterContainer = document.querySelector('.filters');

function scriptRequest(source, callback) {
  window.__picturesLoadCallback = function(data) {
    filterContainer.classList.add('hidden');
    delete window.__picturesLoadCallback;
    var script = document.getElementById('pictures-load-script');
    script.parentNode.removeChild(script);
    dataLength = data.length;
    callback(data);
  };

  var newScript = document.createElement('script');
  var currentScript = document.currentScript;
  var parent = currentScript.parentNode;
  newScript.src = source;
  newScript.id = 'pictures-load-script';
  parent.insertBefore(newScript, currentScript.nextSibling);
}

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

var IMAGE_LOAD_TIMEOUT = 10000;
var IMAGE_WIDTH = 182;
var IMAGE_HEIGTH = 182;

var checkLoadingEnd = function() {
  dataLength--;
  if(dataLength === 0) {
    filterContainer.classList.remove('hidden');
  }
};

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
    checkLoadingEnd();
  };

  image.onerror = function() {
    clearTimeout(pictureLoadTimeout);
    element.classList.add('picture-load-failure');
    checkLoadingEnd();
  };

  image.src = data.url;

  pictureLoadTimeout = setTimeout(function() {
    image.src = '';
    element.classList.add('picture-load-failure');
    checkLoadingEnd();
  }, IMAGE_LOAD_TIMEOUT);

  return element;
};

scriptRequest('https://up.htmlacademy.ru/assets/js_intensive/jsonp/pictures.js', function(pictures) {
  pictures.forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });
});
