'use strict';

(function () {
  var Elements = window.Utils.Elements;

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

  window.Card = Card;
})();
