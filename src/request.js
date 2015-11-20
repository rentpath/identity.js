class Request {
  constructor(
    successFn,
    failureFn = () => {},
    host      = 'http://zutron.primedia.com',
    port      = 80,
    target    = '/universal_zids/new',
    method    = 'GET',
    retries   = 3,
    timeout   = 500,
    timeoutFn)
  {
    this.failureFn  = failureFn;
    this.host       = host;
    this.method     = method;
    this.port       = port;
    this.request    = new XMLHttpRequest();
    this.retries    = retries;
    this.successFn  = successFn;
    this.target     = target;
    this.timeout    = timeout;
    this.timeoutFn  = timeoutFn;

    const hostname    = this.host.replace(/\/$/, '');
    const path        = this.target.replace(/^\//, '');
    const repeat      = function () { this.retry().send(); };
    const url         = `${hostname}:${port}/${path}`;

    this.request.open(method, url, true);
    this.request.setRequestHeader('Accept', 'application/json');
    this.request.setRequestHeader('Content-Type', 'application/json');

    this.request.onload = function () {
      if (this.status >= 200 && this.status < 400) {
        const data = JSON.parse(this.responseText);
        successFn.call(data);
      } else {
        failureFn(this.status, this.responseText);
      }
    };

    this.request.onerror = function () {
      if (this.readyState === 4 && this.status === 0) {
        failureFn('NO_NETWORK');
      } else {
        failureFn(this.status, this.responseText);
      }
    };

    this.request.ontimeout = function () {
      if (timeoutFn) {
        timeoutFn();
        return;
      }

      if (retries > 0) {
        repeat();
      } else {
        this.onerror('timeout');
      }
    };
  }

  retry = () =>
  {
    return new Request(
      this.successFn,
      this.failureFn,
      this.host,
      this.target,
      this.method,
      this.port,
      this.retries - 1,
      this.timeout,
      this.timeoutFn);
  }

  send = () =>
  {
    this.request.timeout         = this.timeout;
    this.request.send();
  }
}

export default Request;
