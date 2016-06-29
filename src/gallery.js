'use strict';

var utilities = require('./utilities');
var element = document.querySelector('.gallery-overlay');
var galleryPictures = [];
var likes = element.querySelector('.likes-count');
var comments = element.querySelector('.comments-count');
var preview = element.querySelector('.gallery-overlay-image');
var activePictureNumber = 0;
var closeElement = element.querySelector('.gallery-overlay-close');

var showGallery = function(picture) {
  activePictureNumber = galleryPictures.indexOf(picture);
  setActivePicture(activePictureNumber);

  element.classList.remove('invisible');

  document.addEventListener('keydown', _onDocumentKeyDown);
  preview.addEventListener('click', _onPhotoClick);
  closeElement.addEventListener('click', hideGallery);
};

var savePictures = function(pictures) {
  galleryPictures = pictures;
};

var setActivePicture = function(actPicture) {
  preview.src = galleryPictures[actPicture].url;
  likes.textContent = galleryPictures[actPicture].likes;
  comments.textContent = galleryPictures[actPicture].comments;
};

var _onDocumentKeyDown = function(evt) {
  if (utilities.isDeactivationEvent(evt)) {
    evt.preventDefault();
    hideGallery();
  }
};

var hideGallery = function() {
  element.classList.add('invisible');
  preview.removeEventListener('click', _onPhotoClick);
  document.removeEventListener('keydown', _onDocumentKeyDown);
  closeElement.removeEventListener('click', hideGallery);
};

var _onPhotoClick = function() {
  if (activePictureNumber <= galleryPictures.length) {
    activePictureNumber++;
    setActivePicture(activePictureNumber);
  }
};

module.exports = {
  savePictures: savePictures,
  showGallery: showGallery
};
