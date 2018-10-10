'use strict';

(function () {
  var Rectangle = window.DrawingClasses.Rectangle;
  var Point = window.DrawingClasses.Point;
  var Size = window.DrawingClasses.Size;

  function Elements() {
  }

  Elements.isTemplate = function (element) {
    return element.tagName === 'TEMPLATE';
  };

  Elements.find = function (selector, parent) {
    var parentElement = null;

    if (typeof (parent) === 'string') {
      parentElement = Elements.find(parent);
    } else if (parent) {
      parentElement = Elements.isTemplate(parent) ? parent.content : parent;
    } else {
      parentElement = document;
    }

    var element = parentElement.querySelector(selector);
    if (element) {
      return Elements.isTemplate(element) ? element.content : element;
    }
    throw new TypeError('Не найден элемент [' + selector + ']');
  };

  Elements.hide = function (element /* селектор или Element */, parent) {
    var el = typeof (element) === 'string' ? Elements.find(element, parent) : element;
    el.classList.add('hidden');
  };

  Elements.getLeft = function (element /* селектор или Element */, parent) {
    var el = typeof (element) === 'string' ? Elements.find(element, parent) : element;
    var value = el.style.left || window.getComputedStyle(el).left;
    return parseInt(/(\d+).*/.exec(value)[1], 10);
  };

  Elements.geTop = function (element /* селектор или Element */, parent) {
    var el = typeof (element) === 'string' ? Elements.find(element, parent) : element;
    var value = el.style.top || window.getComputedStyle(el).top;
    return parseInt(/(\d+).*/.exec(value)[1], 10);
  };

  Elements.geWidth = function (element /* селектор или Element */, parent) {
    var el = typeof (element) === 'string' ? Elements.find(element, parent) : element;
    var value = el.style.width || window.getComputedStyle(el).width;
    return parseInt(/(\d+).*/.exec(value)[1], 10);
  };

  Elements.getHeight = function (element /* селектор или Element */, parent) {
    var el = typeof (element) === 'string' ? Elements.find(element, parent) : element;
    var value = el.style.height || window.getComputedStyle(el).height;
    return parseInt(/(\d+).*/.exec(value)[1], 10);
  };

  Elements.getRect = function (element /* селектор или Element */, parent) {
    var el = typeof (element) === 'string' ? Elements.find(element, parent) : element;
    return new Rectangle(
        new Point(Elements.getLeft(el), Elements.geTop(el)),
        new Size(Elements.geWidth(el), Elements.getHeight(el))
    );
  };

  function DebounceTimer(callback) {
    var _callback = callback;
    var _id = null;

    this.setTimeout = function (value) {
      if (_id) {
        window.clearTimeout(_id);
        _id = null;
      }
      _id = setTimeout(_callback, value);
    };
  }

  window.Utils = {
    Elements: Elements,
    DebounceTimer: DebounceTimer
  };
})();
