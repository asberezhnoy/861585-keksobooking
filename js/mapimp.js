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

    this.element = _root;
    this.dragEvent = null;
    this.mouseMoveEvent = null;

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

        if (_self.dragEvent !== null) {
          _self.dragEvent();
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
        if (_self.mouseMoveEvent) {
          _self.mouseMoveEvent();
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

  function Filter(parent) {
    var _root = parent.querySelector('.map__filters');
    var _bookingTypeEl = _root.querySelector('#housing-type');
    var _housingPriceEl = _root.querySelector('#housing-price');
    var _housingRoomsEl = _root.querySelector('#housing-rooms');
    var _housingGuestsEl = _root.querySelector('#housing-guests');
    var _featuresEl = [
      _root.querySelector('#filter-wifi'),
      _root.querySelector('#filter-dishwasher'),
      _root.querySelector('#filter-parking'),
      _root.querySelector('#filter-washer'),
      _root.querySelector('#filter-elevator'),
      _root.querySelector('#filter-conditioner')
    ];
    var _timeoutId = null;
    var _self = this;
    var _advertisements = [];

    this.changeEvent = null;

    _bookingTypeEl.addEventListener('change', onChange);
    _housingPriceEl.addEventListener('change', onChange);
    _housingRoomsEl.addEventListener('change', onChange);
    _housingGuestsEl.addEventListener('change', onChange);
    _featuresEl.forEach(function (item) {
      item.addEventListener('change', onChangeFlags);
    });

    this.setAdvertisements = function (advertisements) {
      _advertisements = advertisements;
    };

    function onChange() {
      filter();
    }

    function onChangeFlags() {
      if (_timeoutId) {
        window.clearTimeout(_timeoutId);
        _timeoutId = null;
      }
      _timeoutId = setTimeout(function () {
        filter();
      }, 500);
    }

    function filter() {
      var advertisements = _advertisements.
        filter(isFilterByType).
        filter(isFilterByPrice).
        filter(isFilterByRooms).
        filter(isFilterByHousingGuest).
        filter(isFilterByFeatures);

      if (_self.changeEvent) {
        _self.changeEvent(advertisements);
      }
    }

    function isFilterByType(item) {
      return _bookingTypeEl.value === 'any' || _bookingTypeEl.value === item.offer.type;
    }

    function isFilterByPrice(item) {
      if (_housingPriceEl.value === 'middle') {
        return item.offer.price >= 10000 && item.offer.price <= 50000;
      } else if (_housingPriceEl.value === 'low') {
        return item.offer.price < 10000;
      } else if (_housingPriceEl.value === 'high') {
        return item.offer.price > 50000;
      } else {
        return true;
      }
    }

    function isFilterByRooms(item) {
      return _housingRoomsEl.value === 'any' || _housingRoomsEl.value === item.offer.rooms.toString();
    }

    function isFilterByHousingGuest(item) {
      return _housingGuestsEl.value === 'any' || _housingGuestsEl.value === item.offer.guests.toString();
    }

    function isFilterByFeatures(item) {
      return _featuresEl.every(function (element) {
        if (element.checked && item.offer.features.indexOf(element.value) === -1) {
          return false;
        }
        return true;
      });
    }
  }

  function Map() {
    var _root = document.querySelector('.map');
    var _mapPins = _root.querySelector('.map__pins');
    var _mainPin = new MainPin(_mapPins);
    var _filter = new Filter(_root);
    var _showedCard = null;
    var _pins = [];
    var _filterPins = [];

    this.mainPin = _mainPin;

    _filter.changeEvent = onChangeFilter;

    this.setAdvertisements = function (advertisements) {
      _pins.length = 0;
      var pinSize = getPinDefaultSize();

      for (var i = 0; i < advertisements.length; i++) {
        _pins.push(new Pin(advertisements[i], pinSize));
      }
      _filter.setAdvertisements(advertisements);
      onChangeFilter(advertisements);
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

    function showPins() {
      var fragment = document.createDocumentFragment();
      _filterPins.forEach(function (pin) {
        fragment.appendChild(pin.element);
        pin.clickEvent = onPinClick;
      });
      _mapPins.appendChild(fragment);
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

    function clearShowedPins() {
      _filterPins.forEach(function (pin) {
        _mapPins.removeChild(pin.element);
      });
      _filterPins.length = 0;
    }

    function onChangeFilter(advertisements) {
      clearShowedPins();
      for (var i = 0; i < _pins.length && _filterPins.length <= 5; i++) {
        var pin = _pins[i];
        for (var j = 0; j < advertisements.length; j++) {
          var advertisement = advertisements[j];
          if (pin.advertisement === advertisement) {
            _filterPins.push(pin);
          }
        }
      }
      showPins();
    }
  }

  window.Map = Map;
})();
