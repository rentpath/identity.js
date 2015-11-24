import UniversalZid from './zutron';

const localhost = 'http://localhost';
const port      = 3000;

function report() {
  const id = this.universal_zid.uuid;

  console.log('Reporting: ');
  console.log(id);
  UniversalZid.cookify(id);
  UniversalZid.track(() => { console.log('Success!'); }, () => {}, localhost, port);
  console.log(UniversalZid.uzid()); }

UniversalZid.fetch(report, () => {}, localhost, port);

