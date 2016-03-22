import Request from './request'

const Cookies = require('js-cookie')

const Identity = {
  _request(successFn, failureFn, zidUuid, host, port, action, data) {
    const callback = function() {
      const params = Identity._serialize(data)
      const uzid = this.universal_zid.uuid
      const url = `/universal_zids/${uzid}/${action}/${zidUuid}`
      const target = params ? `${url}?${params}` : url
      const xhr = new Request(successFn, failureFn, host, port, target, 'POST')
      xhr.send()
    }

    Identity.fetch(callback, failureFn, host, port)
  },

  _serialize(object) {
    const str = []

    if (object === undefined) {
      return undefined
    }

    for (const p in object) {
      if (object.hasOwnProperty(p)) {
        str.push(`${encodeURIComponent(p)}=${encodeURIComponent(object[p])}`)
      }
    }

    return str.join('&')
  },

  cookify(value, cookieName = 'uzid', expiry = 365) {
    Cookies.set(cookieName, value, { expires: expiry })
  },

  fetch(successFn, errorFn, host, port, retries, timeout) {
    const uzidUuid = Identity.uzid()

    if (uzidUuid && successFn) {
      successFn.call({ universal_zid: { uuid: uzidUuid } })
      return
    }

    const target = '/universal_zids/new'
    const xhr = new Request(successFn, errorFn, host, port, target, 'GET', retries, timeout)
    xhr.send()
  },

  link(successFn, failureFn, zidUuid, host, port) {
    Identity._request(successFn, failureFn, zidUuid, host, port, 'zid_link')
  },

  pixel(uri = window.location.href) {
    const host = 'http://wh.consumersource.com'
    const id = Identity.uzid()
    const hostname = window.location.hostname
    const uuUri = encodeURI(uri)
    const target = `wtd.gif?profile=zutron&subprofile=${hostname}&uzid=${id}&path=${uuUri}`
    const imagePixel = new Image()
    imagePixel.src = `${host}/${target}`

    return imagePixel
  },

  push(params) {
    const methodName = params.shift()
    this[methodName].apply(this, params)
  },

  track(successFn, failureFn, host, port) {
    const data = { address: window.location.href }
    Identity._request(successFn, failureFn, '', host, port, 'access_log', data)
  },

  unlink(successFn, failureFn, zidUuid, host, port) {
    Identity._request(successFn, failureFn, zidUuid, host, port, 'zid_decouple')
  },

  uzid(cookieName = 'uzid') {
    return Cookies.getJSON(cookieName)
  }
}

export default Identity

if (window && window.Identity) {
  while (window.Identity.length) {
    Identity.push(window.Identity.shift())
  }
}

window.Identity = Identity
