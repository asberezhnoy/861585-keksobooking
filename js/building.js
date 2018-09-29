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

  window.Building = Building;
})();
