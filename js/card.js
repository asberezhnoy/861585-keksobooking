'use strict';

(function () {
  var Elements = window.Utils.Elements;
  var KeyCodes = window.KeyCodes;

  function Card(linkedPin) {
    var _currElement = Elements.find('.map__card', '#card').cloneNode(true);
    var _btnClose = _currElement.querySelector('.popup__close');
    var _self = this;
    var _advertisement = linkedPin.advertisement;
    var _typeDescriptions = {
      'flat': 'Квартира',
      'bungalo': 'Бунгало',
      'house': 'Дом',
      'palace': 'Дворец'
    };

    this.pin = linkedPin;
    this.element = _currElement;
    this.closeEvent = null;

    init();

    function init() {
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

      _btnClose.addEventListener('click', onClose);
      document.addEventListener('keyup', onClose);
    }

    function onClose(evt) {
      if (evt instanceof KeyboardEvent && evt.keyCode !== KeyCodes.ESCAPE) {
        return;
      }
      document.removeEventListener('keyup', onClose);

      if (_self.closeEvent) {
        _self.closeEvent();
      }
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

  window.Card = Card;
})();
