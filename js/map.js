'use strict';

var Point = window.DrawingClasses.Point;
var Elements = window.Utils.Elements;
var AdForm = window.AdForm;
var Map = window.Map;
var AdvertisementStorage = window.AdvertisementStorage;
var Messages = window.Messages;

var _map = new Map();
var _adForm = new AdForm();
var _isActive = false;
var _errorMsg = null;
var _successMsg = null;

_adForm.resetEvent = disable;
_adForm.submitEvent = upload;

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

function upload(data) {
  var storage = new AdvertisementStorage();
  storage.save(data, function () {
    disable();
    displaySuccess();
  }, function (error) {
    displayError(error);
  });
}

function getAdvertisements() {
  var storage = new AdvertisementStorage();
  storage.get(function (advertisements) {
    _map.setAdvertisements(advertisements);
  }, function (error) {
    displayError(error);
  });
}

function displaySuccess() {
  if (!_successMsg) {
    _successMsg = new Messages.Success(document.body.querySelector('main'));
  }
  _successMsg.show();
}

function displayError(message) {
  if (!_errorMsg) {
    _errorMsg = new Messages.Error(document.body.querySelector('main'));
  }
  _errorMsg.show(message);
}

function mainPinDragEvenHandler() {
  _map.mainPin.dragEvent = null;
  setAddress(_map.mainPin.element);
  getAdvertisements();
  activate();
}

function mainPinMouseMoveEventHandler() {
  setAddress(_map.mainPin.element);
}

function load() {
  _map.mainPin.dragEvent = mainPinDragEvenHandler;
  _map.mainPin.mouseMoveEvent = mainPinMouseMoveEventHandler;
  setAddress(_map.mainPin.element);
  _adForm.onLoad();
}

window.onload = load;
