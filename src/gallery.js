'use strict';

var utilities = require('./utilities');

var Gallery = function() {
  var self = this;

  var element = document.querySelector('.gallery-overlay');
  var preview = element.querySelector('.gallery-overlay-image');
  var likes = element.querySelector('.likes-count');
  var comments = element.querySelector('.comments-count');
  var closeElement = element.querySelector('.gallery-overlay-close');

  this.activePictureNumber = 0;
  this.galleryPictures = [];

  this.savePictures = function(pictures) {
    self.galleryPictures = pictures;
  };

  this.showGallery = function(picture) {
    self.activePictureNumber = self.galleryPictures.indexOf(picture);
    setActivePicture(self.activePictureNumber);

    element.classList.remove('invisible');

    document.addEventListener('keydown', _onDocumentKeyDown);
    preview.addEventListener('click', _onPhotoClick);
    closeElement.addEventListener('click', hideGallery);
  };

  var _onPhotoClick = function() {
    if (self.activePictureNumber < self.galleryPictures.length - 1) {
      self.activePictureNumber++;
      setActivePicture(self.activePictureNumber);
    }
  };

  var hideGallery = function() {
    element.classList.add('invisible');
    preview.removeEventListener('click', _onPhotoClick);
    document.removeEventListener('keydown', _onDocumentKeyDown);
    closeElement.removeEventListener('click', hideGallery);
  };

  var _onDocumentKeyDown = function(evt) {
    if (utilities.isDeactivationEvent(evt)) {
      evt.preventDefault();
      hideGallery();
    }
  };

  var setActivePicture = function(actPicture) {
    preview.src = self.galleryPictures[actPicture].url;
    likes.textContent = self.galleryPictures[actPicture].likes;
    comments.textContent = self.galleryPictures[actPicture].comments;
  };
};

var gallery = new Gallery();

module.exports = gallery;
