import Request from './request';

const Cookies = require('js-cookie');

const Identity = {
  _request:
    function (successFn, failureFn, zidUuid, host, port, action, data) {
      const callback = function () {
        const params = Identity._serialize(data);
        const uzid   = this.universal_zid.uuid;
        const url    = `/universal_zids/${uzid}/${action}/${zidUuid}`;
        const target = params ? `${url}?${params}` : url;
        const xhr    = new Request(successFn, failureFn, host, port, target, 'POST');
        xhr.send(); };
      Identity.fetch(callback, failureFn, host, port ); },

  _serialize:
    function (object) {
      const str = [];

      if (object === undefined) {
        return undefined; }

      for (let p in object) {
        if (object.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(object[p])); } }

      return str.join('&'); },

  cookify:
    function (value, cookieName = 'uzid', expiry = 365) {
      Cookies.set(cookieName, value, { expires: expiry }); },

  fetch:
    function (successFn, errorFn, host, port, retries, timeout) {
      const uzidUuid = Identity.uzid();

      if (uzidUuid && successFn) {
        successFn.call({ 'universal_zid': { 'uuid': uzidUuid } });
        return;
      }

      const target = '/universal_zids/new';
      const xhr    = new Request(successFn, errorFn, host, port, target, 'GET', retries, timeout);
      xhr.send(); },

  link:
    function (successFn, failureFn, zidUuid, host, port) {
      Identity._request(successFn, failureFn, zidUuid, host, port, 'zid_link'); },

  track:
    function (successFn, failureFn, host, port) {
      const data = { 'address': window.location.href };
      Identity._request(successFn, failureFn, '', host, port, 'access_log', data); },

  push:
    function (params) {
      const methodName = params.shift();
      this[methodName].apply(this, params); },

  unlink:
    function (successFn, failureFn, zidUuid, host, port) {
      Identity._request(successFn, failureFn, zidUuid, host, port, 'zid_decouple'); },

  uzid:
    function (cookieName = 'uzid') {
      return Cookies.getJSON(cookieName); }
};

export default Identity;

if (window && window.Identity) {
  while (window.Identity.length) {
    Identity.push(window.Identity.shift()); } }

window.Identity = Identity;