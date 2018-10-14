'use strict';

(function () {
  var Building = window.Building;

  function AdForm() {
    var _root = document.querySelector('.ad-form');
    var _addrEl = _root.querySelector('#address');
    var _roomNumberEl = _root.querySelector('#room_number');
    var _capacityEl = _root.querySelector('#capacity');
    var _btnReset = _root.querySelector('button[type="reset"');
    var _btnSubmit = _root.querySelector('button[type="submit"');
    var _titleEl = _root.querySelector('#title');
    var _priceeEl = _root.querySelector('#price');
    var _timeinEl = _root.querySelector('#timein');
    var _timeoutEl = _root.querySelector('#timeout');
    var _avatarEl = _root.querySelector('.ad-form__field').querySelector('#avatar');
    var _avatarViewEl = _root.querySelector('.ad-form-header__preview').querySelector('img');
    var _imagesEl = _root.querySelector('.ad-form__upload').querySelector('#images');
    var _imageViewEl = _root.querySelector('.ad-form__photo');

    var _self = this;

    this.submitEvent = null;
    this.resetEvent = null;

    this.setAddress = function (address) {
      _addrEl.value = address;
    };

    _btnSubmit.addEventListener('click', onSubmit);
    _btnReset.addEventListener('click', onReset);
    _roomNumberEl.addEventListener('change', onRoomNumberChange);
    _timeinEl.addEventListener('change', onTimeInOrOutChange);
    _timeoutEl.addEventListener('change', onTimeInOrOutChange);
    _avatarEl.addEventListener('change', onAvatarChange);
    _imagesEl.addEventListener('change', onImagesChange);

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
      reset();
      _root.classList.add('ad-form--disabled');
      var elements = _root.querySelectorAll('fieldset');
      elements.forEach(function (value) {
        value.classList.add('disabled');
      });
    };

    function onAvatarChange() {
      var fReader = new FileReader();
      fReader.readAsDataURL(_avatarEl.files[0]);
      fReader.onloadend = function (event) {
        _avatarViewEl.src = event.target.result;
      };
    }

    function onImagesChange() {
      var fReader = new FileReader();
      fReader.readAsDataURL(_imagesEl.files[0]);
      fReader.onloadend = function (event) {
        var img = document.createElement('img');
        img.src = event.target.result;
        _imageViewEl.appendChild(img);
      };
    }

    function onTimeInOrOutChange(evt) {
      var masterEl = evt.target === _timeinEl ? _timeinEl : _timeoutEl;
      var slaveEl = masterEl === _timeinEl ? _timeoutEl : _timeinEl;
      setValidTimeInAndOut(masterEl, slaveEl);
    }

    function onSubmit(evt) {
      if (!_titleEl.checkValidity() || !_priceeEl.checkValidity()) {
        return;
      }

      if (_self.submitEvent) {
        evt.preventDefault();
        _self.submitEvent(new FormData(_root));
      }
    }

    function onReset(evt) {
      evt.preventDefault();
      reset();
      if (_self.resetEvent) {
        _self.resetEvent();
      }
    }

    function onRoomNumberChange() {
      setValidCapacity();
    }

    function reset() {
      _root.reset();
      setValidCapacity();
    }

    function setValidTimeInAndOut(masterEl, slaveEl) {
      var masterValue = masterEl.selectedOptions[0].value;
      for (var i = 0; i < slaveEl.children.length; i++) {
        var child = slaveEl.children[i];
        if (child.value === masterValue) {
          slaveEl.selectedIndex = i;
          break;
        }
      }
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
