
'use strict';

(function () {
  function Point(x, y) {
    this.x = x;
    this.y = y;

    this.toString = function () {
      return this.x + ', ' + this.y;
    };
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
