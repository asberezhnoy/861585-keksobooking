
'use strict';

(function () {
  function Point(x, y) {
    var _self = this;

    this.x = x;
    this.y = y;

    this.toString = toString;

    function toString() {
      return _self.x + ', ' + _self.y;
    }
  }

  function Size(width, height) {
    this.width = width;
    this.height = height;
  }

  function Rectangle(leftTopCorner, size) {
    this.leftTopCorner = leftTopCorner;
    this.size = size;
  }

  window.DrawingClasses = {
    Point: Point,
    Size: Size,
    Rectangle: Rectangle
  };
})();
