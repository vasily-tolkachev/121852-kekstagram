'use strict';

var getPictureElement = require('./picture-block');
var utilities = require('../utilities');

var onElementAction = function(evt, data) {
  if (evt.target.tagName === 'IMG') {
    evt.preventDefault();
    location.hash = '#photo/' + data.url;
  }
};

var Photo = function(data, container) {
  this.data = data;
  this.element = getPictureElement(this.data, container);

  this.element.addEventListener('click', this.onPictureClick.bind(this));
  this.element.addEventListener('keydown', this.onPictureKeydown.bind(this));
  container.appendChild(this.element);
};

Photo.prototype.remove = function() {
  this.element.removeEventListener('click', this.onPictureClick.bind(this));
  this.element.removeEventListener('keydown', this.onPictureClick.bind(this));
  this.element.parentNode.removeChild(this.element);
};

Photo.prototype.onPictureKeydown = function(evt) {
  if (utilities.isActivationEvent(evt)) {
    onElementAction(evt, this.data);
  }
};

Photo.prototype.onPictureClick = function(evt) {
  onElementAction(evt, this.data);
};

module.exports = Photo;
