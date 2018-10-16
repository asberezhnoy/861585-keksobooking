'use strict';

(function () {
  function Building() {
    throw new Error('Нельзя создать объект этого класса');
  }

  Building.capacity = {
    1: [1],
    2: [2, 1],
    3: [3, 2, 1]
  };

  Building.minPrice = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  window.Building = Building;
})();
