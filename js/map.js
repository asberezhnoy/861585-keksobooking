'use strict';

var Point = window.drawing.Point;
var Size = window.drawing.Size;
var Rectangle = window.drawing.Rectangle;
var Elements = window.Utils.Elements;
var Random = window.Utils.Random;

function Author() {
  this.avatar = null;
}

function Offer() {
  this.title = null;
  this.address = null;
  this.price = null;
  this.type = null;
  this.rooms = null;
  this.guests = null;
  this.checkin = null;
  this.checkout = null;
  this.features = [];
  this.description = null;
  this.photos = [];
}

function Advertisement() {
  this.author = new Author();
  this.offer = new Offer();
  this.location = new Point();
}

function Card(advertisement) {
  var _currElement = Elements.find('.map__card', '#card').cloneNode(true);
  var _typeDescriptions = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  this.advertisement = advertisement;
  this.element = _currElement;

  initAvatar();
  initTitle();
  initAddress();
  initPrice();
  initType();
  initCapacity();
  initTime();
  initDescription();
  initPhotos();
  initFeatures();

  function initAvatar() {
    var avatar = _currElement.querySelector('.popup__avatar');
    avatar.src = advertisement.author.avatar;
    avatar.alt = advertisement.title;
    avatar.style.left = advertisement.location.x;
    avatar.style.top = advertisement.location.y;
  }

  function initTitle() {
    _currElement.querySelector('.popup__title').textContent = advertisement.offer.title;
  }

  function initAddress() {
    _currElement.querySelector('.popup__text--address').textContent = advertisement.offer.address;
  }

  function initPrice() {
    _currElement.querySelector('.popup__text--price').textContent = advertisement.offer.price + '₽/ночь';
  }

  function initType() {
    _currElement.querySelector('.popup__type').textContent = advertisement.offer.type in _typeDescriptions ? _typeDescriptions[advertisement.offer.type] : '';
  }

  function initCapacity() {
    _currElement.querySelector('.popup__text--capacity').textContent = advertisement.offer.rooms + ' комнат для ' + advertisement.offer.guests + 'гостей';
  }

  function initTime() {
    _currElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + advertisement.offer.checkin + ', выезд до ' + advertisement.offer.checkout;
  }

  function initDescription() {
    _currElement.querySelector('.popup__description').textContent = advertisement.offer.description;
  }

  function initPhotos() {
    var photos = _currElement.querySelector('.popup__photos');
    var template = photos.querySelector('img');
    var photo;

    for (var i = 0; i < advertisement.offer.photos.length; i++) {
      photo = i in photos.children && photos.children[i].tagName === 'IMG' ? photos.children[i] : photos.appendChild(template.cloneNode());
      photo.src = advertisement.offer.photos[i];
    }
  }

  function initFeatures() {
    var features = _currElement.querySelector('.popup__features');
    var feature = null;
    var featureName = null;
    var index;

    if (!advertisement.offer.features.length) {
      Elements.hide(features);
      return;
    }

    for (var i = 0; i < features.children.length; i++) {
      feature = features.children[i];
      featureName = feature.classList[1].split('-').pop();
      index = advertisement.offer.features.indexOf(featureName);
      if (index !== -1) {
        feature.textContent = advertisement.offer.features[index];
      } else {
        Elements.hide(feature);
      }
    }
  }
}

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

function MockAdvertisementFactory() {
  var _userId = -1;
  var _offerTitles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец", "Маленький ужасный дворец',
    'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var _offerTypes = ['palace', 'flat', 'house', 'bungalo'];
  var _checkinList = ['12:00', '13:00', '14:00'];
  var _checkoutList = ['12:00', '13:00', '14:00'];
  var _features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  this.create = function () {
    _userId++;

    var card = new Advertisement();
    card.author.avatar = 'img/avatars/user0' + _userId + '.png';
    card.location.x = Random.getRandomNumber(window.getComputedStyle(document.querySelector('.map__pins')).width.split(/(\d+).+/)[1], 0, Math.floor);
    card.location.y = Random.getRandomNumber(630, 130, Math.floor);
    card.offer.title = getOfferTitle();
    card.offer.address = card.location.toString();
    card.offer.price = Random.getRandomNumber(1000000, 1000, toFixed);
    card.offer.type = _offerTypes[Random.getRandomArrayIndex(_offerTypes.length)];
    card.offer.rooms = Random.getRandomNumber(5, 1, Math.floor);
    card.offer.guests = Random.getRandomNumber(10, 1, Math.floor);
    card.offer.checkin = _checkinList[Random.getRandomArrayIndex(_checkinList.length)];
    card.offer.checkout = _checkoutList[Random.getRandomArrayIndex(_checkoutList.length)];
    card.offer.features = getFeatures();
    card.offer.description = '';
    card.offer.photos = getPhotos();

    return card;
  };

  function getOfferTitle() {
    var index = Random.getRandomArrayIndex(_offerTitles.length);
    var title = _offerTitles[index];
    _offerTitles.splice(index, 1);
    return title;
  }

  function getFeatures() {
    var retdata = [];
    var length = Random.getRandomNumber(_features.length, 1, Math.floor);

    for (var i = 0; i < length; i++) {
      retdata.push(_features[Random.getRandomArrayIndex(_features.length)]);
    }

    return retdata;
  }

  function getPhotos() {
    var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
    var retdata = [];

    while (photos.length) {
      var index = Random.getRandomArrayIndex(photos.length);
      retdata.push(photos[index]);
      photos.splice(index, 1);
    }

    return retdata;
  }

  function toFixed(number) {
    return +number.toFixed(2);
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
  }

  this.Element = _root;
  this.activateEvent = null;
  this.moveEvent = null;

  _root.addEventListener('mousedown', onMouseDown);
  _root.addEventListener('click', onClick);

  function onClick() {
    if (!_isDrag && _self.activateEvent !== null) {
      _self.activateEvent();
    }
    _isDrag = false;
  }

  function onMouseUp(evt) {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    if (_isDrag) {
      move(evt.clientX, evt.clientY);
      evt.preventDefault();
      _startMouseCoord = null;
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
      if (_self.onMouseMove != null) {
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

  this.mainPin = new MainPin(_mapPins);
  this.pins = [];

  this.addPins = function (advertisements) {
    var pins = [];
    var pinSize = getPinDefaultSize();

    for (var i = 0; i < advertisements.length; i++) {
      pins.push(new Pin(advertisements[i], pinSize));
    }
    var fragment = document.createDocumentFragment();
    pins.forEach(function (value) {
      fragment.appendChild(value.element);
      value.clickEvent = onPinClick;
      pins.push(value);
    });
    _mapPins.appendChild(fragment);
  };

  this.activate = function () {
    _root.classList.remove('map--faded');
  };

  this.disable = function () {
    _root.classList.add('map--faded');
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

function Capacity() {
  throw new Error('Нельзя создать объект этого класса');
}
Capacity.getCountGuestsFor = function (roomNumber) {
  switch (roomNumber) {
    case 1: return [1];
    case 2: return [2, 1];
    case 3: return [3, 2, 1];
    default: return [0];
  }
};

function AdForm() {
  var _root = document.querySelector('.ad-form');
  var _addrEl = _root.querySelector('#address');
  var _roomNumberEl = _root.querySelector('#room_number');
  var _capacityEl = _root.querySelector('#capacity');

  this.setAddress = function (address) {
    _addrEl.value = address;
  };

  init();

  this.onLoad = function () {
    setValidCapacity();
  };

  this.activate = function () {
    _root.classList.remove('ad-form--disabled');
    var elements = _root.querySelectorAll('fieldset');
    elements.forEach(function (value) {
      value.classList.remove('disabled');
    });
  };

  this.disable = function () {
    _root.classList.add('ad-form--disabled');
    var elements = _root.querySelectorAll('fieldset');
    elements.forEach(function (value) {
      value.classList.add('disabled');
    });
  };

  function init() {
    _roomNumberEl.addEventListener('change', onRoomNumberChange);
  }

  function onRoomNumberChange() {
    setValidCapacity();
  }

  function setValidCapacity() {
    var newSelectIndex = -1;
    var rooomNumber = +_roomNumberEl.selectedOptions[0].value;
    var capacity = Capacity.getCountGuestsFor(rooomNumber);
    var options = _capacityEl.options;
    for (var i = 0; i < options.length; i++) {
      options[i].disabled = capacity.indexOf(+options[i].value) === -1;
      if (!options[i].disabled && i > newSelectIndex) {
        newSelectIndex = i;
      }
    }
    _capacityEl.selectedIndex = newSelectIndex;
  }
}

function Page() {
  var _map = new Map();
  var _adForm = new AdForm();
  var _isActive = false;
  var _advertisements = [];

  this.onLoad = function () {
    _map.mainPin.activateEvent = function () {
      activate();
      setAddress(_map.mainPin.Element);
      addAdvertisements();
    };
    _map.mainPin.onMouseMove = function () {
      setAddress(_map.mainPin.Element);
    };
    getAdvertisements();
    setAddress(_map.mainPin.Element);
    _adForm.onLoad();
  };

  function setAddress(pinn) {
    var coord = Elements.getRect(pinn);
    var point = new Point(Math.round(coord.leftTopCorner.x + coord.size.width / 2), Math.round(coord.leftTopCorner.y + (isActivate() ? coord.size.height : coord.size.height / 2)));
    _adForm.setAddress(point.toString());
  }

  function activate() {
    _map.activate();
    _adForm.activate();
    _isActive = true;
  }

  function isActivate() {
    return _isActive;
  }

  function getAdvertisements() {
    var factory = new MockAdvertisementFactory();

    for (var i = 0; i < 8; i++) {
      _advertisements.push(factory.create());
    }
  }

  function addAdvertisements() {
    _map.addPins(_advertisements);
  }
}

var page = new Page();
window.onload = page.onLoad;


