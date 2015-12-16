import UniversalZid from './zutron';

const host = 'http://zutron.prod.services.rentpath.com';
const port = 80;

function report() {
  const id = this.universal_zid.uuid;

  console.log('Reporting: ');
  console.log(id);
  UniversalZid.cookify(id);
  UniversalZid.track(() => { console.log('Success!'); }, () => {}, host, port);
  console.log(UniversalZid.uzid()); }

UniversalZid.fetch(report, () => {}, host, port);
