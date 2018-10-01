'use strict';

(function () {
  var Rectangle = window.DrawingClasses.Rectangle;
  var Point = window.DrawingClasses.Point;
  var Size = window.DrawingClasses.Size;

  function Random() {
  }

  Random.getRandomNumber = function (max, min, handler) {
    var minValue = Number(min);
    var maxValue = Number(max);

    var value = minValue ? Math.random() * (maxValue + 1 - minValue) + minValue : Math.random() * (maxValue + 1);
    return handler ? handler(value) : value;
  };

  Random.getRandomArrayIndex = function (length) {
    return Random.getRandomNumber(length - 1, 0, Math.floor);
  };

  Random.getArrayRandomItem = function (array, prevFoundItem) {
    var index = Random.getRandomNumber(array.length - 1, 0, Math.floor);
    var item = array[index];
    if (item === prevFoundItem) {
      index = (index === (array.length - 1)) ? 0 : index + 1;
      item = array[index];
    }
    return item;
  };


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

  Elements.findAll = function (selector, parent) {
    var parentElement = null;

    if (typeof (parent) === 'string') {
      parentElement = Elements.find(parent);
    } else if (parent) {
      parentElement = Elements.isTemplate(parent) ? parent.content : parent;
    } else {
      parentElement = document;
    }

    var elementList = parentElement.querySelectorAll(selector);
    if (elementList.length) {
      return elementList;
    }
    throw new TypeError('Не найден элемент [' + selector + ']');
  };

  Elements.visible = function (element /* селектор или Element */, parent) {
    Elements.removeClass(element, 'hidden', parent);
  };

  Elements.hide = function (element /* селектор или Element */, parent) {
    Elements.addClass(element, 'hidden', parent);
  };

  Elements.addClass = function (element /* селектор или Element */, className, parent) {
    var el = typeof (element) === 'string' ? Elements.find(element, parent) : element;
    el.classList.add(className);
  };

  Elements.removeClass = function (element /* селектор или Element */, className, parent) {
    var el = typeof (element) === 'string' ? Elements.find(element, parent) : element;
    el.classList.remove(className);
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

  window.Utils = {};
  window.Utils.Random = Random;
  window.Utils.Elements = Elements;
})();
