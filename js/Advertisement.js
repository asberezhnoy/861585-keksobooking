'use strict';

(function () {
  var Point = window.drawing.Point;

  function Author() {
    this.avatar = null;
  }

  function Offer() {
    this.title = null;
    this.address = null;
    this.price = null;
    this.type = null;
    this.rooms = null;
    this.guests = null;
    this.checkin = null;
    this.checkout = null;
    this.features = [];
    this.description = null;
    this.photos = [];
  }

  function Advertisement() {
    this.author = new Author();
    this.offer = new Offer();
    this.location = new Point();
  }

  window.Advertisement = Advertisement;
})();
