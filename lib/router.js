import Find from './find';
import d from 'debug';
import _ from 'lodash';
var debug = d('default-parser');
/* Router class */
class Router {
  constructor(input, core) {
    debug('constructor:', 'Router');
    this._router = core.router;
    this._header = core.header;
    this._backend = core.backend;
    // Get the locale from either the keyword
    // or header
    this._locale = _.has(input.keywords, 'locale') ?
      this._header.setLocale(input.keywords.locale) :
      this._header.getLocale();
    this._data = this._backend.find(this._locale);
    debug('data exists:', !(!this._data));
  }
  isEnabled() {
    return this._router.isEnabled();
  }
  global(keyword) {
    return this.isEnabled() && keyword ?
      (this._data[keyword] || undefined) : this._data;
  }
  local() {
    //check if router is enabled
    if (this.isEnabled()) {
      debug('router enabled:', this.isEnabled());
      //if dot depth is 0 else deep search for the data
      debug('router.toArray()', this.router.toArray());
      if (this.router.toArray().length === 0)
        return (this._data[this.router.toDot()] || undefined);
      else return Find.find(this._data, this.router.toDot());
    } else return undefined;
  }
}
export default Router;