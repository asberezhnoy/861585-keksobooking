'use strict';

(function () {
  var Rectangle = window.DrawingClasses.Rectangle;
  var Point = window.DrawingClasses.Point;
  var Size = window.DrawingClasses.Size;

  function isTemplate(element) {
    return element.tagName === 'TEMPLATE';
  }

  function find(selector, parent) {
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
  }

  function hide(element /* селектор или Element */, parent) {
    var el = typeof (element) === 'string' ? Elements.find(element, parent) : element;
    el.classList.add('hidden');
  }

  function getLeft(element /* селектор или Element */, parent) {
    var el = typeof (element) === 'string' ? Elements.find(element, parent) : element;
    var value = el.style.left || window.getComputedStyle(el).left;
    return parseInt(/(\d+).*/.exec(value)[1], 10);
  }

  function geTop(element /* селектор или Element */, parent) {
    var el = typeof (element) === 'string' ? Elements.find(element, parent) : element;
    var value = el.style.top || window.getComputedStyle(el).top;
    return parseInt(/(\d+).*/.exec(value)[1], 10);
  }

  function geWidth(element /* селектор или Element */, parent) {
    var el = typeof (element) === 'string' ? Elements.find(element, parent) : element;
    var value = el.style.width || window.getComputedStyle(el).width;
    return parseInt(/(\d+).*/.exec(value)[1], 10);
  }

  function getHeight(element /* селектор или Element */, parent) {
    var el = typeof (element) === 'string' ? Elements.find(element, parent) : element;
    var value = el.style.height || window.getComputedStyle(el).height;
    return parseInt(/(\d+).*/.exec(value)[1], 10);
  }

  function getRect(element /* селектор или Element */, parent) {
    var el = typeof (element) === 'string' ? Elements.find(element, parent) : element;
    return new Rectangle(
        new Point(Elements.getLeft(el), Elements.geTop(el)),
        new Size(Elements.geWidth(el), Elements.getHeight(el))
    );
  }

  function Elements() {
  }

  Elements.isTemplate = isTemplate;
  Elements.find = find;
  Elements.hide = hide;
  Elements.getLeft = getLeft;
  Elements.geTop = geTop;
  Elements.geWidth = geWidth;
  Elements.getHeight = getHeight;
  Elements.getRect = getRect;

  function DebounceTimer(callback) {
    var _callback = callback;
    var _id = null;

    this.setTimeout = setTimeout;

    function setTimeout(value) {
      if (_id) {
        window.clearTimeout(_id);
        _id = null;
      }
      _id = setTimeout(_callback, value);
    }
  }

  window.Utils = {
    Elements: Elements,
    DebounceTimer: DebounceTimer
  };
})();
