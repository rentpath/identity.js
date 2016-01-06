import Identity from './identity';

const host = 'http://identity.rentpathservices.com';
const port = 80;

function report() {
  const id = this.universal_zid.uuid;

  console.log('Reporting: ');
  console.log(id);
  Identity.cookify(id);
  Identity.track(() => { console.log('Success!'); }, () => {}, host, port);
  console.log(Identity.uzid()); }

Identity.fetch(report, () => {}, host, port);
