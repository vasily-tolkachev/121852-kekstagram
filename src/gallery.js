'use strict';

var utilities = require('./utilities');

var Gallery = function() {
  this.element = document.querySelector('.gallery-overlay');
  this.preview = this.element.querySelector('.gallery-overlay-image');
  this.likes = this.element.querySelector('.likes-count');
  this.comments = this.element.querySelector('.comments-count');
  this.closeElement = this.element.querySelector('.gallery-overlay-close');

  this.galleryPictures = [];
  this.activePictureNumber = 0;

  this.savePictures = this.savePictures.bind(this);
  this._showGallery = this._showGallery.bind(this);
  this._setActivePicture = this._setActivePicture.bind(this);
  this._getElementByUrl = this._getElementByUrl.bind(this);
  this._hideGallery = this._hideGallery.bind(this);
  this._onPhotoClick = this._onPhotoClick.bind(this);
  this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  this._onHashChange = this._onHashChange.bind(this);

  window.addEventListener('hashchange', this._onHashChange);
};

Gallery.prototype.savePictures = function(pictures) {
  this.galleryPictures = pictures;
};

Gallery.prototype._showGallery = function(pictureUrl) {
  var picture = this._getElementByUrl(pictureUrl);
  this.activePictureNumber = this.galleryPictures.indexOf(picture);
  this._setActivePicture(picture);
  this.element.classList.remove('invisible');

  document.addEventListener('keydown', this._onDocumentKeyDown);
  this.preview.addEventListener('click', this._onPhotoClick);
  this.closeElement.addEventListener('click', this._hideGallery);
};

Gallery.prototype._setActivePicture = function(actPicture) {
  this.preview.src = actPicture.url;
  this.likes.textContent = actPicture.likes;
  this.comments.textContent = actPicture.comments;
};

Gallery.prototype._getElementByUrl = function(pictureUrl) {
  var picture = this.galleryPictures.filter(function(item) {
    return item.url === pictureUrl;
  })[0];
  return picture;
};

Gallery.prototype._hideGallery = function() {
  this.element.classList.add('invisible');
  location.hash = '';

  this.preview.removeEventListener('click', this._onPhotoClick);
  document.removeEventListener('keydown', this._onDocumentKeyDown);
  this.closeElement.removeEventListener('click', this._hideGallery);
};

Gallery.prototype._onPhotoClick = function() {
  if (this.activePictureNumber < this.galleryPictures.length - 1) {
    this.activePictureNumber++;
    var currentSrc = this.galleryPictures[this.activePictureNumber].url;
    location.hash = '#photo/' + currentSrc;
  }
};

Gallery.prototype._onDocumentKeyDown = function(evt) {
  if (utilities.isDeactivationEvent(evt)) {
    evt.preventDefault();
    this._hideGallery();
  }
};

Gallery.prototype._onHashChange = function() {
  var hash = window.location.hash;
  var getPhotoRegExp = /#photo\/(\S+)/.exec(hash);
  if (getPhotoRegExp) {
    if (this.galleryPictures.some(function(item) {
      return item.url === getPhotoRegExp[1];
    })) {
      this._showGallery(getPhotoRegExp[1]);
    } else {
      this._hideGallery();
    }
  } else {
    this._hideGallery();
  }
};

var gallery = new Gallery();

module.exports = gallery;
