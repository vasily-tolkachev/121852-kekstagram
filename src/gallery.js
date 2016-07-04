'use strict';

var utilities = require('./utilities');

var Gallery = function() {
  var self = this;

  var element = document.querySelector('.gallery-overlay');
  var preview = element.querySelector('.gallery-overlay-image');
  var likes = element.querySelector('.likes-count');
  var comments = element.querySelector('.comments-count');
  var closeElement = element.querySelector('.gallery-overlay-close');

  this.galleryPictures = [];
  this.activePictureNumber = 0;

  this.savePictures = function(pictures) {
    self.galleryPictures = pictures;
  };

  this.showGallery = function(pictureUrl) {
    var picture = getElementByUrl(pictureUrl);
    self.activePictureNumber = self.galleryPictures.indexOf(picture);
    setActivePicture(picture);
    element.classList.remove('invisible');

    document.addEventListener('keydown', _onDocumentKeyDown);
    preview.addEventListener('click', _onPhotoClick);
    closeElement.addEventListener('click', hideGallery);
  };

  this._onHashChange = function() {
    var hash = window.location.hash;
    var getPhotoRegExp = /#photo\/(\S+)/.exec(hash);
    if (getPhotoRegExp) {
      if (self.galleryPictures.some(function(item) {
        return item.url === getPhotoRegExp[1];
      })) {
        self.showGallery(getPhotoRegExp[1]);
      } else {
        hideGallery();
      }
    } else {
      hideGallery();
    }
  };

  var getElementByUrl = function(pictureUrl) {
    var picture = self.galleryPictures.filter(function(item) {
      return item.url === pictureUrl;
    })[0];
    return picture;
  };

  var _onPhotoClick = function() {
    if (self.activePictureNumber < self.galleryPictures.length - 1) {
      self.activePictureNumber++;
      var currentSrc = self.galleryPictures[self.activePictureNumber].url;
      location.hash = '#photo/' + currentSrc;
    }
  };

  var hideGallery = function() {
    element.classList.add('invisible');
    location.hash = '';

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
    preview.src = actPicture.url;
    likes.textContent = actPicture.likes;
    comments.textContent = actPicture.comments;
  };

  window.addEventListener('hashchange', this._onHashChange);
};

var gallery = new Gallery();

module.exports = gallery;
