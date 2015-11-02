import UniversalZid from './zutron';
import Request from './request';

function report() {
  console.log('Reporting: ')
  console.log(this.universal_zid.zids); }

let localhost = 'http://127.0.0.1';
let port      = 3000;
let zid       = undefined;

let r = new Request(
  function success () {
    let zidUuid = this.zid.key;
    UniversalZid.link(report, report, zidUuid, localhost, port); },
  () => {},
  localhost,
  port,
  '/zids/new');

r.send();

// UniversalZid.fetch(report, report, localhost, port);
