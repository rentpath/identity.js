import Request from './request';

const Cookies = require('js-cookie');

const UniversalZid = {
  _fetch:
    function (successFn, failureFn, zidUuid, host, port, method, action) {
      UniversalZid.fetch(
        function (data) {
          let uzid   = data['uzid'];
          let target = `/universal_zids/${uzid}/${action}/${zidUuid}`;
          let xhr    = new Request(successFn, failureFn, host, port, target);
          xhr.send(); },
        failureFn,
        host,
        port ); },

  cookify:
    function (value, cookieName = 'uzid', expiry = 365) {
      Cookies.set(cookieName, value, { expires: expiry }); },

  fetch:
    function (successFn, errorFn, host, port, retries, timeout) {
      let target = '/universal_zids/new';
      let xhr    = new Request(successFn, errorFn, host, port, target, 'GET', retries, timeout);
      xhr.send(); },

  link:
    function (successFn, failureFn, zidUuid, host, port) {
      UniversalZid._fetch(successFn, failureFn, zidUuid, host, port, 'POST', 'zid_link'); },

  push:
    function (params) {
      let methodName = params.shift();
      this[methodName].apply(this, params); },

  unlink:
    function (successFn, failureFn, zidUuid, host, port) {
      UniversalZid._fetch(successFn, failureFn, zidUuid, host, port, 'POST', 'zid_decouple'); },

  uzid:
    function (cookieName = 'uzid') {
      return Cookies.getJSON(cookieName); }
};

export default UniversalZid;

if (window && window.UniversalZid) {
  while (window.UniversalZid.length) {
    UniversalZid.push(window.UniversalZid.shift()); } }

window.UniversalZid = UniversalZid;
