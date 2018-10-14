'use strict';

(function () {
  var Elements = window.Utils.Elements;
  var KeyCodes = window.KeyCodes;

  function Error(parent) {
    var _parent = parent;
    var _element = Elements.find('.error', '#error').cloneNode(true);
    var _messageEl = _element.querySelector('.error__message');
    var _btn = _element.querySelector('.error__button');

    this.show = show;

    _btn.addEventListener('click', close);

    function show(message) {
      document.addEventListener('keyup', close);
      document.addEventListener('click', close);

      _messageEl.textContent = message;
      _parent.appendChild(_element);
    }

    function close(evt) {
      if (evt instanceof KeyboardEvent && evt.keyCode !== KeyCodes.ESCAPE) {
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

    this.show = show;

    function show() {
      document.addEventListener('keyup', close);
      document.addEventListener('click', close);

      _parent.appendChild(_element);
    }

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
