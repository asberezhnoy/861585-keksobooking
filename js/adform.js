'use strict';

(function () {
  var Building = window.Building;

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
      var capacity = rooomNumber in Building.capacity ? Building.capacity[rooomNumber] : [0];

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

  window.AdForm = AdForm;
})();
