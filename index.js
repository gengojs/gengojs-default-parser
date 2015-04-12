'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _engine = require('./class/Engine');

var _engine2 = _interopRequireWildcard(_engine);

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _d = require('debug');

var _d2 = _interopRequireWildcard(_d);

var debug = _d2['default']('default-parser');

var Parser = (function () {
  function Parser(input, _this) {
    _classCallCheck(this, Parser);

    debug('constructor:', 'Parser');
    this.engine = _engine2['default'](input, _this);
  }

  _createClass(Parser, [{
    key: 'parse',
    value: function parse() {
      return this.engine.run();
    }
  }]);

  return Parser;
})();

exports['default'] = function () {
  'use strict';
  return {
    main: function main(input) {
      this.result = new Parser(input, this).parse();
    },
    'package': _import2['default'].merge({
      type: 'parser'
    }, require('./package')),
    defaults: require('./defaults')
  };
};

module.exports = exports['default'];