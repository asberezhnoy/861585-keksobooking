'use strict';

(function () {
  function Building() {
    throw new Error('Нельзя создать объект этого класса');
  }
  Building.getCountGuestsFor = function (roomNumber) {
    switch (roomNumber) {
      case 1: return [1];
      case 2: return [2, 1];
      case 3: return [3, 2, 1];
      default: return [0];
    }
  };

  window.Building = Building;
})();
