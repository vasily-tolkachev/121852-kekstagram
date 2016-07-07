'use strict';

var getPictureElement = require('./picture-block');
var utilities = require('../utilities');
var BaseComponent = require('../base-component');

var onElementAction = function(evt, data) {
  if (evt.target.tagName === 'IMG') {
    evt.preventDefault();
    location.hash = '#photo/' + data.url;
  }
};

var Photo = function(data, container) {
  BaseComponent.call(this, data);
  this.element.addEventListener('click', this.onPictureClick.bind(this));
  this.element.addEventListener('keydown', this.onPictureKeydown.bind(this));
  this._addToParentContainer(container);
};

utilities.inherit(BaseComponent, Photo);

Photo.prototype._createDomElement = function() {
  return getPictureElement(this.data);
};

Photo.prototype.onPictureKeydown = function(evt) {
  if (utilities.isActivationEvent(evt)) {
    onElementAction(evt, this.data);
  }
};

Photo.prototype.onPictureClick = function(evt) {
  onElementAction(evt, this.data);
};

Photo.prototype.remove = function() {
  this.element.removeEventListener('click', this.onPictureClick.bind(this));
  this.element.removeEventListener('keydown', this.onPictureClick.bind(this));
  this.element.parentNode.removeChild(this.element);
};

module.exports = Photo;
