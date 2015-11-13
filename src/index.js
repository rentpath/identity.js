import UniversalZid from './zutron';

const localhost = 'http://localhost';
const port      = 3000;

function report() {
  const id = this.universal_zid.uuid;

  console.log('Reporting: ');
  console.log(id);
  UniversalZid.cookify(id); }

UniversalZid.fetch(report, report, localhost, port);
