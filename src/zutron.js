const UniversalZid = {
  fetch: function (host = 'http://zutron.primedia.com', port = 80, target = '/universal_zids') {
    var path    = target.replace(/^\//, '');
    var url     = `${host}:${port}/${path}`;
    var request = new XMLHttpRequest();

    request.open('POST', url, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);
      } else {
      }
    };

    request.onerror = function() {
    };

    request.send();
  }
};

export default UniversalZid;
