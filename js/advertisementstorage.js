'use strict';

(function () {
  var Backend = window.Backend;

  function Storage() {
    this.get = function (callbackLoad, callbackError) {
      Backend.download(function (data) {
        onLoad(data, callbackLoad);
      }, callbackError);
    };

    function onLoad(data, callbackLoad) {
      callbackLoad(data);
    }
  }

  window.AdvertisementStorage = Storage;
})();
