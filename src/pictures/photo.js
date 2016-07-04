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
  var self = this;
  self.data = data;
  self.element = getPictureElement(this.data, container);

  self.onPictureClick = function(evt) {
    onElementAction(evt, data);
  };

  this.onPictureKeydown = function(evt) {
    if (utilities.isActivationEvent(evt)) {
      onElementAction(evt, data);
    }
  };

  self.remove = function() {
    self.element.removeEventListener('click', self.onPictureClick);
    self.element.removeEventListener('keydown', self.onPictureKeydown);
    self.element.parentNode.removeChild(self.element);
  };

  self.element.addEventListener('click', self.onPictureClick);
  self.element.addEventListener('keydown', self.onPictureKeydown);
  container.appendChild(self.element);
};

module.exports = Photo;
