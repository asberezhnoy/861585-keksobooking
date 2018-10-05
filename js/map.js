'use strict';

var Point = window.DrawingClasses.Point;
var Elements = window.Utils.Elements;
var AdForm = window.AdForm;
var Map = window.Map;
var AdvertisementStorage = window.AdvertisementStorage;

var _map = new Map();
var _adForm = new AdForm();
var _isActive = false;

_adForm.resetEvent = disable;

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

function disable() {
  _map.disable();
  _adForm.disable();
  _isActive = false;
}

function isActivate() {
  return _isActive;
}

function getAdvertisements() {
  var storage = new AdvertisementStorage();
  storage.get(function (advertisements) {
    _map.addPins(advertisements);
  }, function (error) {
    var element = Elements.find('.error', '#error').cloneNode(true).querySelector('.error__message');
    element.textContent = error;
    var main = document.body.querySelector('main');
    main.insertBefore(element, main.firstChild);
  });
}

window.onload = function () {
  _map.mainPin.activateEvent = function () {
    _map.mainPin.activateEvent = null;
    setAddress(_map.mainPin.Element);
    getAdvertisements();
    activate();
  };
  _map.mainPin.onMouseMove = function () {
    setAddress(_map.mainPin.Element);
  };
  setAddress(_map.mainPin.Element);
  _adForm.onLoad();
};
