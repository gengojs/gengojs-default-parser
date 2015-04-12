import find from '../Find';
import d from 'debug';
import _ from 'lodash';
var debug = d('default-parser');
class Router {
  constructor(_this) {
    debug('constructor:', 'Router');
    this.router = _this.router;
    this.data = _this.backend.find(_this.header.getLocale());
    debug('data exists:', !(!this.data));
  }
  isEnabled() {
    return this.router.isEnabled();
  }
  global(keyword) {
    var data =
      this.isEnabled() && keyword ?
      this.data[keyword] || null : this.data;
    return data;
  }
  local() {
    var data;
    //check if router is enabled
    if (this.isEnabled()) {
      debug('router enabled:', this.isEnabled());
      //if dot depth is 0 else deep search for the data
      debug('router.toArray()', this.router.toArray());
      if (this.router.toArray().length === 0)
        data = this.data[this.router.toDot()] || null;
      else data = find(this.data).dot(this.router.toDot()) || null;
    }
    return data;
  }
}
export
default (_this) => {
  'use strict';
  return new Router(_this);
};