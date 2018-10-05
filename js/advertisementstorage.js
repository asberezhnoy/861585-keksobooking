'use strict';

(function () {
  var Backend = window.Backend;

  function Storage() {
    this.get = function (callbackLoad, callbackError) {
      Backend.download(callbackLoad, callbackError);
    };

    this.save = function (data, callbackLoad, callbackError) {
      Backend.upload(data, callbackLoad, callbackError);
    };
  }

  window.AdvertisementStorage = Storage;
})();
