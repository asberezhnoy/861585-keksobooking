'use strict';

(function () {
  var Backend = window.Backend;

  function Storage() {
    this.get = get;
    this.save = set;

    function get(callbackLoad, callbackError) {
      Backend.download(callbackLoad, callbackError);
    }

    function set(data, callbackLoad, callbackError) {
      Backend.upload(data, callbackLoad, callbackError);
    }
  }

  window.AdvertisementStorage = Storage;
})();
