'use strict';

(function () {
  function KeyCodes() {
    throw new Error('Нельзя создавать экземпляр данного класса');
  }

  KeyCodes.ESCAPE = 27;
  KeyCodes.ENTER = 13;

  window.KeyCodes = KeyCodes;
})();
