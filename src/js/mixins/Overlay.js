// (C) Copyright 2014 Hewlett-Packard Development Company, L.P.

var DOM = require('../utils/DOM');

// Overlay is a mixin for ensuring components layerd on top align with their initiating controls underneath.
var Overlay = {

  _overlay: {
    controlElement: null,
    layerElement: null,
    align: null,
    scrollParents: []
  },

  startOverlay: function (controlElement, layerElement, align) {
    this._overlay.controlElement = controlElement;
    this._overlay.layerElement = layerElement;
    this._overlay.align = align;
    this._overlay.scrollParents = DOM.findScrollParents(this._overlay.controlElement);
    this._overlay.scrollParents.forEach(function (parent) {
      parent.addEventListener('scroll', this.positionOverlay);
    }, this);
    window.addEventListener('resize', this.positionOverlay);

    this.positionOverlay();
  },

  stopOverlay: function () {
    if (this._overlay.controlElement) {
      this._overlay.scrollParents.forEach(function (parent) {
        parent.removeEventListener('scroll', this.positionOverlay);
      }, this);
      window.removeEventListener('resize', this.positionOverlay);
      this._overlay.controlElement = null;
      this._overlay.layerElement = null;
      this._overlay.align = null;
      this._overlay.scrollParents = [];
    }
  },

  positionOverlay: function () {
    var controlElement = this._overlay.controlElement;
    var layerElement = this._overlay.layerElement;

    var controlRect = controlElement.getBoundingClientRect();
    var windowWidth = window.innerWidth;

    // clear prior styling
    layerElement.style.left = '';
    layerElement.style.width = '';
    layerElement.style.top = '';

    var width = Math.min(
      Math.max(controlRect.width, layerElement.offsetWidth),
        windowWidth);
    // align right edge and make at least as wide as the control
    var left = (controlRect.left + layerElement.offsetWidth) - width;
    if ('right' === this._overlay.align) {
      // align right edge
      left = (controlRect.left + controlRect.width) -
        layerElement.offsetWidth;
    } else {
      // align left edge
      left = controlRect.left;
    }
    if ((left + width) > windowWidth) {
      left -= ((left + width) - windowWidth);
    } else if (left < 0) {
      left = 0;
    }

    var top = controlRect.top;
    if ('up' === this.props.direction) {
      // align bottom edge
      top = (controlRect.top + controlRect.height) -
        layerElement.offsetHeight;
    } else if ('below' === this._overlay.align) {
      // align top of layer to bottom of control
      top = (controlRect.top + controlRect.height);
    }

    // ensure height is within viewport
    var maxHeight = window.innerHeight - top;

    layerElement.style.left = '' + left + 'px';
    layerElement.style.width = '' + width + 'px';
    layerElement.style.top = '' + top + 'px';
    layerElement.style.maxHeight = '' + maxHeight + 'px';
  },

  componentWillUnmount: function () {
    this.stopOverlay();
  }
};

module.exports = Overlay;
