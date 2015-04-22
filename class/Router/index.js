'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _find = require('../Find');

var _find2 = _interopRequireWildcard(_find);

var _d = require('debug');

var _d2 = _interopRequireWildcard(_d);

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var debug = _d2['default']('default-parser');
/* Router class */

var Router = (function () {
  function Router(input, _this) {
    _classCallCheck(this, Router);

    debug('constructor:', 'Router');
    this.router = _this.router;
    // Get the locale from either the keyword
    // or header
    this.locale = _import2['default'].has(input.keywords, 'locale') ? _this.header.setLocale(input.keywords.locale) : _this.header.getLocale();
    this.data = _this.backend.find(this.locale);
    debug('data exists:', !!this.data);
  }

  _createClass(Router, [{
    key: 'isEnabled',
    value: function isEnabled() {
      return this.router.isEnabled();
    }
  }, {
    key: 'global',
    value: function global(keyword) {
      var data = this.isEnabled() && keyword ? this.data[keyword] || null : this.data;
      return data;
    }
  }, {
    key: 'local',
    value: function local() {
      var data;
      //check if router is enabled
      if (this.isEnabled()) {
        debug('router enabled:', this.isEnabled());
        //if dot depth is 0 else deep search for the data
        debug('router.toArray()', this.router.toArray());
        if (this.router.toArray().length === 0) data = this.data[this.router.toDot()] || null;else data = _find2['default'](this.data).dot(this.router.toDot()) || null;
      }
      return data;
    }
  }]);

  return Router;
})();

exports['default'] = function (input, _this) {
  'use strict';
  return new Router(input, _this);
};

module.exports = exports['default'];