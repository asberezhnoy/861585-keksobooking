'use strict';

(function () {
  var Random = window.Utils.Random;
  var Advertisement = window.Advertisement;

  function MockAdvertisementFactory() {
    var _userId = 0;
    var _offerTitles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец", "Маленький ужасный дворец',
      'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
    var _offerTypes = ['palace', 'flat', 'house', 'bungalo'];
    var _checkinList = ['12:00', '13:00', '14:00'];
    var _checkoutList = ['12:00', '13:00', '14:00'];
    var _features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

    this.get = function (callbackLoad) {
      var advertisements = [];

      for (var i = 0; i < 8; i++) {
        advertisements.push(create());
      }
      callbackLoad(advertisements);
    };

    function create() {
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
    }

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

  window.AdvertisementStorage = MockAdvertisementFactory;
})();
