'use strict';

var BaseComponent = function(data) {
  this.data = data;
  this.element = this._createDomElement();
};

BaseComponent.prototype._createDomElement = function() {
  var element;
  return element;
};

BaseComponent.prototype._addToParentContainer = function(container) {
  container.appendChild(this.element);
};

BaseComponent.prototype.remove = function() {
  this.element.parentNode.removeChild(this.element);
};

module.exports = BaseComponent;
