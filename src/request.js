class Request {
  constructor(
    successFn,
    errorFn,
    host,
    target,
    port      = 80,
    method    = 'GET',
    retries   = 3,
    timeout   = 500,
    timeoutFn = this.defaultTimeout)
  {
    this.errorFn    = errorFn;
    this.host       = host;
    this.method     = method;
    this.port       = port;
    this.request    = new XMLHttpRequest();
    this.retries    = retries;
    this.successFn  = successFn;
    this.target     = target;
    this.timeout    = timeout;
    this.timeoutFn  = timeoutFn;

    let hostname    = this.host.replace(/\/$/, '');
    let path        = this.target.replace(/^\//, '');
    let url         = `${hostname}:${port}/${path}`;

    this.request.open('GET', url, true);
    this.request.setRequestHeader('Accept', 'application/json');
    this.request.setRequestHeader('Content-Type', 'application/json');

    this.request.onload = function () {
      if (this.status >= 200 && this.status < 400) {
        let data = JSON.parse(this.responseText);
        successFn.call(data);
      } else {
        if (errorFn) {
          errorFn(this.status, this.responseText);
        }
      }
    };

    this.request.onerror = function () {
      if (this.readyState === 4 && this.status === 0) {
        errorFn('NO_NETWORK');
      } else {
        errorFn(this.status, this.responseText);
      }
    };

    this.request.ontimeout = this.timeoutFn;
  }

  defaultTimeout()
  {
    if (this.retries > 0) {
      let retry = new Request(
        this.successFn,
        this.errorFn,
        this.host,
        this.target,
        this.method,
        this.port,
        this.retries - 1,
        this.timeout,
        this.timeoutFn);
      retry.send();
    } else {
      this.onerror('timeout');
    }
  }

  send()
  {
    this.request.timeout = this.timeout;
    this.request.send();
  }
}

export default Request;
