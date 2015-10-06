import _ from 'lodash';
import debug from 'gengojs-debug';
import Find from './find';
const log = debug('parser');

/* Router class */
class Router {
  constructor(input, core) {
    this._router = core.router;
    this._header = core.header;
    this._backend = core.backend;

    log
      .debug(`class: ${Router.name}`, `process: constructor`)
      .debug('router exists:', !!this._router)
      .debug('header exists:', !!this._header)
      .debug('header exists:', !!this._backend)
      .debug(
        // Get the locale from either the keyword
        // or header
        'locale:', (this._locale = _.has(input.keywords, 'locale') ?
          this._header.setLocale(input.keywords.locale) :
          this._header.getLocale())
      );

    this._data = this._backend.find(this._locale);
  }
  isEnabled() {
    log
      .debug(`class: ${Router.name}`, `process: isEnabled`)
      .debug('isEnabled: ', this._router.isEnabled());
    return this._router.isEnabled();
  }
  global(keyword) {
    log
      .debug(`class: ${Router.name}`, `process: global`);
    var result = this.isEnabled() && keyword ?
      (this._data[keyword]) : this._data;
    log
      .info('global result: ', result);
    return result;
  }
  local() {
    log
      .debug(`class: ${Router.name}`, `process: local`);
    var result;
    //check if router is enabled
    if (this.isEnabled()) {
      //if dot depth is 0 else deep search for the data
      if (this.router.toArray().length === 0) {

        result = (this._data[this.router.toDot()]);
        log.info('local result: ', result);
        return result;
      } else {
        result = Find.find(this._data, this.router.toDot());
        log.info('local result: ', result);
        return result;
      }
    } else return undefined;
  }
}
export default Router;