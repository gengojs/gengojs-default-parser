import _ from 'lodash';

import Find from './find';
/* Router class */
class Router {
  constructor(input, core) {
    this._router = core.router;
    this._header = core.header;
    this._backend = core.backend;
    // Get the locale from either the keyword
    // or header
    this._locale = _.has(input.keywords, 'locale') ?
      this._header.setLocale(input.keywords.locale) :
      this._header.getLocale();
    this._data = this._backend.find(this._locale);
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
      //if dot depth is 0 else deep search for the data
      if (this.router.toArray().length === 0)
        return (this._data[this.router.toDot()] || undefined);
      else return Find.find(this._data, this.router.toDot());
    } else return undefined;
  }
}
export default Router;