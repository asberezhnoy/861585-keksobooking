'use strict';

(function () {
  var Elements = window.Utils.Elements;
  var Point = window.DrawingClasses.Point;
  var Size = window.DrawingClasses.Size;
  var Card = window.Card;

  function Pin(advertisement, pinSize) {
    var _currElement = Elements.find('.map__pin', '#pin').cloneNode(true);
    var _self = this;

    this.element = _currElement;
    this.advertisement = advertisement;
    this.clickEvent = null;

    initCoord();
    initImg();
    _currElement.addEventListener('click', function (evt) {
      if (_self.clickEvent) {
        _self.clickEvent(_self, evt);
      }
    });

    function initImg() {
      var img = _currElement.querySelector('img');
      img.src = advertisement.author.avatar;
      img.alt = advertisement.offer.title;
    }

    function initCoord() {
      _currElement.style.left = (advertisement.location.x - Math.round(pinSize.width / 2)) + 'px';
      _currElement.style.top = (advertisement.location.y - pinSize.height) + 'px';
    }
  }

  function MainPin(parent) {
    var _root = parent.querySelector('.map__pin--main');
    var _parentClientRect = Elements.getRect(parent);
    var _clientRect = Elements.getRect(_root);
    var _isDrag = false;
    var _startMouseCoord = null;
    var _self = this;
    var _moveRect = {
      left: 0,
      right: _parentClientRect.leftTopCorner.x + _parentClientRect.size.width - _clientRect.size.width,
      top: 130,
      bottom: 630
    };

    this.Element = _root;
    this.activateEvent = null;

    _root.addEventListener('mousedown', onMouseDown);

    this.disable = function () {
      _root.style.left = _clientRect.leftTopCorner.x + 'px';
      _root.style.top = _clientRect.leftTopCorner.y + 'px';
    };

    function onMouseUp(evt) {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (_isDrag) {
        move(evt.clientX, evt.clientY);
        _startMouseCoord = null;

        if (_self.activateEvent !== null) {
          _self.activateEvent();
        }
      }
    }

    function onMouseDown(evt) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      _isDrag = false;
      _startMouseCoord = new Point(evt.clientX, evt.clientY);
    }

    function onMouseMove(evt) {
      if (isDraggin(evt.clientX, evt.clientY)) {
        _isDrag = true;
        move(evt.clientX, evt.clientY);
        if (_self.onMouseMove !== null) {
          _self.onMouseMove();
        }
      }
    }

    function move(x, y) {
      var shift = {
        offsetX: _startMouseCoord.x - x,
        offsetY: _startMouseCoord.y - y
      };

      _root.style.left = getNewLeft(shift.offsetX) + 'px';
      _root.style.top = getNewTop(shift.offsetY) + 'px';

      _startMouseCoord.x = x;
      _startMouseCoord.y = y;
    }

    function isDraggin(x, y) {
      return Math.abs(_startMouseCoord.x - x) >= 5 || Math.abs(_startMouseCoord.y - y) >= 5;
    }

    function getNewLeft(offsetX) {
      var newValue = _root.offsetLeft - offsetX;

      if (newValue < _moveRect.left) {
        newValue = _moveRect.left;
      } else if (newValue > _moveRect.right) {
        newValue = _moveRect.right;
      }
      return newValue;
    }

    function getNewTop(offsetY) {
      var newValue = _root.offsetTop - offsetY;

      if (newValue < _moveRect.top) {
        newValue = _moveRect.top;
      } else if (newValue > _moveRect.bottom) {
        newValue = _moveRect.bottom;
      }
      return newValue;
    }
  }

  function Map() {
    var _root = document.querySelector('.map');
    var _mapPins = _root.querySelector('.map__pins');
    var _showedCard = null;
    var _mainPin = new MainPin(_mapPins);
    var _pins = [];

    this.mainPin = _mainPin;

    this.addPins = function (advertisements) {
      _pins.length = 0;
      var pinSize = getPinDefaultSize();

      for (var i = 0; i < advertisements.length; i++) {
        _pins.push(new Pin(advertisements[i], pinSize));
      }
      var fragment = document.createDocumentFragment();
      _pins.forEach(function (value) {
        fragment.appendChild(value.element);
        value.clickEvent = onPinClick;
      });
      _mapPins.appendChild(fragment);
    };

    this.activate = function () {
      _root.classList.remove('map--faded');
    };

    this.disable = function () {
      _pins.forEach(function (pin) {
        _mapPins.removeChild(pin.element);
      });

      _root.classList.add('map--faded');
      _mainPin.disable();
    };

    function getPinDefaultSize() {
      return new Size(50, 70);
    }

    function onPinClick(sender) {
      showCard(new Card(sender.advertisement));
    }

    function showCard(card) {
      var fragment = document.createDocumentFragment();
      fragment.appendChild(card.element);
      if (_showedCard) {
        _root.removeChild(_showedCard);
      }
      _root.insertBefore(fragment, _root.querySelector('.map__filters-container'));
      _showedCard = card.element;
    }
  }

  window.Map = Map;
})();
