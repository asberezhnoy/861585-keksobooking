'use strict';

(function () {
  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';
  var DOWNLOAD_URL = 'https://js.dump.academy/keksobooking/data';

  function Request(url, callbacknLoad, callbackError) {
    var _url = url;
    var _xhr = new XMLHttpRequest();
    var _callbacknLoad = callbacknLoad;
    var _callbackError = callbackError;

    this.get = get;
    this.post = post;

    _xhr.addEventListener('load', onLoad);
    _xhr.addEventListener('error', onError);
    _xhr.addEventListener('timeout', onTimeout);

    function get() {
      _xhr.responseType = 'json';
      _xhr.open('GET', _url);
      _xhr.send();
    }

    function post(data) {
      _xhr.open('POST', _url);
      _xhr.send(data);
    }

    function onLoad() {
      if (_xhr.status === 200) {
        _callbacknLoad(_xhr.response);
      } else {
        onError();
      }
    }

    function onError() {
      var error;
      switch (_xhr.status) {
        case 400:
          error = 'Неверный запрос';
          break;
        case 401:
          error = 'Пользователь не авторизован';
          break;
        case 404:
          error = 'Ничего не найдено';
          break;

        default:
          error = 'Cтатус ответа: : ' + _xhr.status + ' ' + _xhr.statusText;
      }

      _callbackError(error);
    }

    function onTimeout() {
      _callbackError('Сработал таймаут при ожидании ответа от сервера');
    }
  }

  window.Backend = {
    upload: function (data, callbacknLoad, callbackError) {
      var request = new Request(UPLOAD_URL, callbacknLoad, callbackError);
      request.post(data);
    },

    download: function (callbacknLoad, callbackError) {
      var request = new Request(DOWNLOAD_URL, callbacknLoad, callbackError);
      request.get();
    }
  };
})();
