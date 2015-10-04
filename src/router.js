'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _find = require('./find');

var _find2 = _interopRequireDefault(_find);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var debug = (0, _debug2['default'])('default-parser');
/* Router class */

var Router = (function () {
  function Router(input, core) {
    _classCallCheck(this, Router);

    debug('constructor:', 'Router');
    this._router = core.router;
    this._header = core.header;
    this._backend = core.backend;
    // Get the locale from either the keyword
    // or header
    this._locale = _lodash2['default'].has(input.keywords, 'locale') ? this._header.setLocale(input.keywords.locale) : this._header.getLocale();
    this._data = this._backend.find(this._locale);
    debug('data exists:', !!this._data);
  }

  _createClass(Router, [{
    key: 'isEnabled',
    value: function isEnabled() {
      return this._router.isEnabled();
    }
  }, {
    key: 'global',
    value: function global(keyword) {
      return this.isEnabled() && keyword ? this._data[keyword] || undefined : this._data;
    }
  }, {
    key: 'local',
    value: function local() {
      //check if router is enabled
      if (this.isEnabled()) {
        debug('router enabled:', this.isEnabled());
        //if dot depth is 0 else deep search for the data
        debug('router.toArray()', this.router.toArray());
        if (this.router.toArray().length === 0) return this._data[this.router.toDot()] || undefined;else return _find2['default'].find(this._data, this.router.toDot());
      } else return undefined;
    }
  }]);

  return Router;
})();

exports['default'] = Router;
module.exports = exports['default'];
//# sourceMappingURL=source maps/router.js.map
