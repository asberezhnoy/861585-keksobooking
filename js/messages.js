'use strict';

(function () {
  var Elements = window.Utils.Elements;
  var KeyCodes = window.KeyCodes;

  function Error(parent) {
    var _parent = parent;
    var _element = Elements.find('.error', '#error').cloneNode(true);
    var _messageEl = _element.querySelector('.error__message');
    var _btn = _element.querySelector('.error__button');

    _btn.addEventListener('click', close);

    this.show = function (message) {
      document.addEventListener('keyup', close);
      document.addEventListener('click', close);

      _messageEl.textContent = message;
      _parent.appendChild(_element);
    };

    function close(evt) {
      if (evt instanceof KeyboardEvent && evt.keyCode !== 27) {
        return;
      }
      _parent.removeChild(_element);
      document.removeEventListener('keyup', close);
      document.removeEventListener('click', close);
    }
  }

  function Success(parent) {
    var _parent = parent;
    var _element = Elements.find('.success', '#success').cloneNode(true);

    this.show = function () {
      document.addEventListener('keyup', close);
      document.addEventListener('click', close);

      _parent.appendChild(_element);
    };

    function close(evt) {
      if (evt instanceof KeyboardEvent && evt.keyCode !== KeyCodes.ESCAPE) {
        return;
      }
      _parent.removeChild(_element);
      document.removeEventListener('keyup', close);
      document.removeEventListener('click', close);
    }
  }

  window.Messages = {
    Error: Error,
    Success: Success
  };
})();
