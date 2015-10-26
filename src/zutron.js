var monster = require('monster')

const UniversalZid = {
  cookify:
    function (cookieName = 'uzid')
    {
      monster.get(cookieName);
    }

  fetch:
    function (
      successFn,
      errorFn,
      host    = 'http://zutron.primedia.com',
      port    = 80,
      target  = '/universal_zids/new',
      retries = 3,
      timeout = 500)
    {
      let path    = target.replace(/^\//, '');
      let url     = `${host}:${port}/${path}`;
      let request = new XMLHttpRequest();

      request.open('GET', url, true);
      request.setRequestHeader('Accept', 'application/json');
      request.setRequestHeader('Content-Type', 'application/json');

      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          let data = JSON.parse(request.responseText);
          successFn.call(data);
        } else {
          if (errorFn) {
            errorFn(this.status, this.responseText);
          }
        }
      };

      request.onerror = function () {
        if (this.readyState === 4 && this.status === 0) {
          errorFn('NO_NETWORK');
        } else {
          errorFn(this.status, this.responseText);
        }
      };

      if (retries > 0) {
        request.ontimeout = function () {
          UniversalZid.fetch(successFn, errorFn, host, port, target, retries - 1, timeout);
        };
      } else {
        request.ontimeout = function () {
          errorFn('timeout');
        };
      }

      request.timeout = timeout;
      request.send();
    },

  push:
    function (params)
    {
      let methodName = params.shift();
      this[methodName].apply(this, params);
    }
};

export default UniversalZid;

if (window && window.UniversalZid) {
  while (window.UniversalZid.length) {
    UniversalZid.push(window.UniversalZid.shift());
  }
}

window.UniversalZid = UniversalZid;
