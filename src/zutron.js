import Request from './request';

const Cookies = require('js-cookie');

const UniversalZid = {
  cookify:
    function (value, cookieName = 'uzid', expiry = 365)
    {
      Cookies.set(cookieName, value, { expires: expiry });
    },

  fetch:
    function (
      successFn,
      errorFn,
      host    = 'http://zutron.primedia.com',
      target  = '/universal_zids/new',
      port    = 80,
      method  = 'GET',
      retries = 3,
      timeout = 500)
    {
      let xhr = new Request(successFn, errorFn, host, target, port, method, retries, timeout);
      xhr.send();
    },

  push:
    function (params)
    {
      let methodName = params.shift();
      this[methodName].apply(this, params);
    },

  uzid:
    function (cookieName = 'uzid')
    {
      return Cookies.getJSON(cookieName);
    }
};

export default UniversalZid;

if (window && window.UniversalZid) {
  while (window.UniversalZid.length) {
    UniversalZid.push(window.UniversalZid.shift());
  }
}

window.UniversalZid = UniversalZid;
