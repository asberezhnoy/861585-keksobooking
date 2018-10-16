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
    var _avatarFieldEl = _root.querySelector('.ad-form__field');
    var _avatarEl = _avatarFieldEl.querySelector('#avatar');
    var _avatarViewEl = _root.querySelector('.ad-form-header__preview').querySelector('img');
    var _imageContainerEl = _root.querySelector('.ad-form__photo-container');
    var _imageUploadEl = _imageContainerEl.querySelector('.ad-form__upload');
    var _imagesEl = _imageUploadEl.querySelector('#images');
    var _imageViewEl = _imageContainerEl.querySelector('.ad-form__photo');
    var _buildingTyperEl = _root.querySelector('#type');
    var _pricerEl = _root.querySelector('#price');

    var _self = this;

    this.submitEvent = null;
    this.resetEvent = null;

    this.onLoad = onLoad;
    this.activate = activate;
    this.disable = disable;
    this.setAddress = setAddress;

    _btnSubmit.addEventListener('click', onSubmit);
    _btnReset.addEventListener('click', onReset);
    _roomNumberEl.addEventListener('change', onRoomNumberChange);
    _timeinEl.addEventListener('change', onTimeInOrOutChange);
    _timeoutEl.addEventListener('change', onTimeInOrOutChange);
    _avatarEl.addEventListener('change', onAvatarChange);
    _imagesEl.addEventListener('change', onImagesChange);
    _avatarFieldEl.addEventListener('dragover', onAvatarDragOver);
    _avatarFieldEl.addEventListener('drop', onAvatarChange);
    _imageUploadEl.addEventListener('dragover', onImageUploadDragOver);
    _imageUploadEl.addEventListener('drop', onImagesChange);
    _buildingTyperEl.addEventListener('change', onBuilderTypeChange);

    function onImageUploadDragOver(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy';
    }

    function onAvatarDragOver(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy';
    }

    function onLoad() {
      setValidCapacity();
      setValidMinPrice();
    }

    function setAddress(address) {
      _addrEl.value = address;
    }

    function activate() {
      _root.classList.remove('ad-form--disabled');
      var elements = _root.querySelectorAll('fieldset');
      elements.forEach(function (value) {
        value.classList.remove('disabled');
      });
    }

    function disable() {
      reset();
      _root.classList.add('ad-form--disabled');
      var elements = _root.querySelectorAll('fieldset');
      elements.forEach(function (value) {
        value.classList.add('disabled');
      });
    }

    function onAvatarChange(evt) {
      evt.stopPropagation();
      evt.preventDefault();

      var file = evt instanceof DragEvent ? evt.dataTransfer.files[0] : _avatarEl.files[0];

      var fReader = new FileReader();
      fReader.readAsDataURL(file);
      fReader.onloadend = avatarFReaerLoadnEnd;
    }

    function onImagesChange(evt) {
      evt.stopPropagation();
      evt.preventDefault();

      var file = evt instanceof DragEvent ? evt.dataTransfer.files[0] : _imagesEl.files[0];

      var fReader = new FileReader();
      fReader.readAsDataURL(file);
      fReader.onloadend = imageFReaderLoadEnd;
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

    function onBuilderTypeChange() {
      setValidMinPrice();
    }

    function avatarFReaerLoadnEnd(event) {
      _avatarViewEl.src = event.target.result;
    }

    function imageFReaderLoadEnd(event) {
      var cloneNode = _imageViewEl.cloneNode();
      var img = document.createElement('img');
      img.width = _imageViewEl.offsetWidth;
      img.height = _imageViewEl.offsetHeight;
      img.src = event.target.result;
      _imageViewEl.appendChild(img);

      _imageContainerEl.appendChild(cloneNode);
      _imageViewEl = cloneNode;
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

    function setValidMinPrice() {
      var buildingTyper = _buildingTyperEl.selectedOptions[0].value;
      var minPrice = buildingTyper in Building.minPrice ? Building.minPrice[buildingTyper] : 0;

      _pricerEl.min = minPrice.toString();
      _pricerEl.placeholder = minPrice.toString();
    }
  }

  window.AdForm = AdForm;
})();
