'use strict';

function Point(x, y) {
  this.x = x;
  this.y = y;

  this.toString = function () {
    return this.x + ', ' + this.y;
  };
}

function Size(width, height) {
  this.width = width;
  this.height = height;
}

function Coord(leftTopCorner, size) {
  this.leftTopCorner = leftTopCorner;
  this.size = size;
}

/* ************************   Utils   ***************************** */
function Utils() {
}

Utils.getRandomNumber = function (max, min, handler) {
  var minValue = Number(min);
  var maxValue = Number(max);

  var value = minValue ? Math.random() * (maxValue + 1 - minValue) + minValue : Math.random() * (maxValue + 1);
  return handler ? handler(value) : value;
};

Utils.getRandomArrayIndex = function (length) {
  return Utils.getRandomNumber(length - 1, 0, Math.floor);
};

/* *********************************************************************** */

/* ************************   Elements   ***************************** */
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

Elements.getCoord = function (element /* селектор или Element */, parent) {
  var el = typeof (element) === 'string' ? Elements.find(element, parent) : element;
  return new Coord(
      new Point(Elements.getLeft(el), Elements.geTop(el)),
      new Size(Elements.geWidth(el), Elements.getHeight(el))
  );
};

/* *********************************************************************** */

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

function CardListBuilder() {
  var _result = null;
  var _templateElement = getTemplate();
  var _currElement = null;
  var _advertisement = null;
  var _typeDescriptions = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  this.start = function () {
    _result = [];
  };

  this.add = function (advertisement) {
    _advertisement = advertisement;
    _currElement = _templateElement.cloneNode(true);

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

    _result.push(_currElement);
  };

  this.getResult = function () {
    return _result;
  };

  function getTemplate() {
    return Elements.find('.map__card', '#card');
  }

  function initAvatar() {
    var avatar = _currElement.querySelector('.popup__avatar');
    avatar.src = _advertisement.author.avatar;
    avatar.alt = _advertisement.title;
    avatar.style.left = _advertisement.location.x;
    avatar.style.top = _advertisement.location.y;
  }

  function initTitle() {
    _currElement.querySelector('.popup__title').textContent = _advertisement.offer.title;
  }

  function initAddress() {
    _currElement.querySelector('.popup__text--address').textContent = _advertisement.offer.address;
  }

  function initPrice() {
    _currElement.querySelector('.popup__text--price').textContent = _advertisement.offer.price + '₽/ночь';
  }

  function initType() {
    _currElement.querySelector('.popup__type').textContent = _advertisement.offer.type in _typeDescriptions ? _typeDescriptions[_advertisement.offer.type] : '';
  }

  function initCapacity() {
    _currElement.querySelector('.popup__text--capacity').textContent = _advertisement.offer.rooms + ' комнат для ' + _advertisement.offer.guests + 'гостей';
  }

  function initTime() {
    _currElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + _advertisement.offer.checkin + ', выезд до ' + _advertisement.offer.checkout;
  }

  function initDescription() {
    _currElement.querySelector('.popup__description').textContent = _advertisement.offer.description;
  }

  function initPhotos() {
    var photos = _currElement.querySelector('.popup__photos');
    var template = photos.querySelector('img');
    var photo;

    for (var i = 0; i < _advertisement.offer.photos.length; i++) {
      photo = i in photos.children && photos.children[i].tagName === 'IMG' ? photos.children[i] : photos.appendChild(template.cloneNode());
      photo.src = _advertisement.offer.photos[i];
    }
  }

  function initFeatures() {
    var features = _currElement.querySelector('.popup__features');
    var feature = null;
    var featureName = null;
    var index;

    if (!_advertisement.offer.features.length) {
      Elements.hide(features);
      return;
    }

    for (var i = 0; i < features.children.length; i++) {
      feature = features.children[i];
      featureName = feature.classList[1].split('-').pop();
      index = _advertisement.offer.features.indexOf(featureName);
      if (index !== -1) {
        feature.textContent = _advertisement.offer.features[index];
      } else {
        Elements.hide(feature);
      }
    }
  }
}

function PinListBuilder(pinSize) {
  var _result = null;
  var _templateElement = getTemplate();
  var _currElement = null;
  var _advertisement = null;

  this.start = function () {
    _result = [];
  };

  this.add = function (advertisement) {
    _advertisement = advertisement;
    _currElement = _templateElement.cloneNode(true);

    initCoord();
    initImg();

    _result.push(_currElement);
  };

  this.getResult = function () {
    return _result;
  };

  function getTemplate() {
    return Elements.find('.map__pin', '#pin');
  }

  function initImg() {
    var img = _currElement.querySelector('img');
    img.src = _advertisement.author.avatar;
    img.alt = _advertisement.offer.title;
  }

  function initCoord() {
    _currElement.style.left = (_advertisement.location.x - Math.round(pinSize.width / 2)) + 'px';
    _currElement.style.top = (_advertisement.location.y - pinSize.height) + 'px';
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
    card.location.x = Utils.getRandomNumber(window.getComputedStyle(document.querySelector('.map__pins')).width.split(/(\d+).+/)[1], 0, Math.floor);
    card.location.y = Utils.getRandomNumber(630, 130, Math.floor);
    card.offer.title = getOfferTitle();
    card.offer.address = card.location.toString();
    card.offer.price = Utils.getRandomNumber(1000000, 1000, toFixed);
    card.offer.type = _offerTypes[Utils.getRandomArrayIndex(_offerTypes.length)];
    card.offer.rooms = Utils.getRandomNumber(5, 1, Math.floor);
    card.offer.guests = Utils.getRandomNumber(10, 1, Math.floor);
    card.offer.checkin = _checkinList[Utils.getRandomArrayIndex(_checkinList.length)];
    card.offer.checkout = _checkoutList[Utils.getRandomArrayIndex(_checkoutList.length)];
    card.offer.features = getFeatures();
    card.offer.description = '';
    card.offer.photos = getPhotos();

    return card;
  };

  function getOfferTitle() {
    var index = Utils.getRandomArrayIndex(_offerTitles.length);
    var title = _offerTitles[index];
    _offerTitles.splice(index, 1);
    return title;
  }

  function getFeatures() {
    var retdata = [];
    var length = Utils.getRandomNumber(_features.length, 1, Math.floor);

    for (var i = 0; i < length; i++) {
      retdata.push(_features[Utils.getRandomArrayIndex(_features.length)]);
    }

    return retdata;
  }

  function getPhotos() {
    var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
    var retdata = [];

    while (photos.length) {
      var index = Utils.getRandomArrayIndex(photos.length);
      retdata.push(photos[index]);
      photos.splice(index, 1);
    }

    return retdata;
  }

  function toFixed(number) {
    return +number.toFixed(2);
  }
}

function Map() {
  function MapPins(_parentRoot) {
    var _root = _parentRoot.querySelector('.map__pins');

    this.mainPin = _root.querySelector('.map__pin--main');

    this.add = function (advertisements) {
      var builder = new PinListBuilder(getPinDefaultSize());

      builder.start();

      for (var i = 0; i < advertisements.length; i++) {
        builder.add(advertisements[i]);
      }
      var elements = builder.getResult();
      var fragment = document.createDocumentFragment();
      elements.forEach(function (value) {
        fragment.appendChild(value);
      });
      _root.appendChild(fragment);
    };

    function getPinDefaultSize() {
      return new Size(50, 70);
    }
  }

  var _root = document.querySelector('.map');

  this.mapPins = new MapPins(_root);

  this.addPins = function (advertisements) {
    this.mapPins.add(advertisements);
  };

  this.addCards = function (advertisements) {
    var builder = new CardListBuilder();

    builder.start();
    for (var i = 0; i < advertisements.length; i++) {
      builder.add(advertisements[i]);
    }

    var elements = builder.getResult();
    var fragment = document.createDocumentFragment();
    elements.forEach(function (value) {
      fragment.appendChild(value);
    });
    _root.insertBefore(fragment, _root.querySelector('.map__filters-container'));
  };

  this.activate = function () {
    _root.classList.remove('map--faded');
  };

  this.disable = function () {
    _root.classList.add('map--faded');
  };
}

function AdForm() {
  var _root = document.querySelector('.ad-form');
  var _addrEl = _root.querySelector('#address');

  this.setAddress = function (address) {
    _addrEl.value = address;
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
}

function createMockAdvertisements() {
  var factory = new MockAdvertisementFactory();
  var advertisements = [];

  for (var i = 0; i < 8; i++) {
    advertisements.push(factory.create());
  }

  return advertisements;
}

function Page() {
  var _map = new Map();
  var _adForm = new AdForm();
  var _isActive = false;

  this.onLoad = function () {
    _map.mapPins.mainPin.addEventListener('mouseup', function () {
      activate();
      setAddress(_map.mapPins.mainPin);
    });
    setAddress(_map.mapPins.mainPin);
  };

  function setAddress(pinn) {
    var coord = Elements.getCoord(pinn);
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
}

var advertisements = createMockAdvertisements();
var page = new Page();
window.onload = page.onLoad;

//map.addPins(advertisements);
//map.addCards([advertisements[0]]);
//map.activate();

