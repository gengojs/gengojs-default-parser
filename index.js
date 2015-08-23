'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _classEngine = require('./class/Engine');

var _classEngine2 = _interopRequireDefault(_classEngine);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var debug = (0, _debug2['default'])('default-parser');

var Parser = (function () {
  function Parser(input, _this) {
    _classCallCheck(this, Parser);

    debug('constructor:', 'Parser');
    this.engine = (0, _classEngine2['default'])(input, _this);
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
    'package': _lodash2['default'].merge({
      type: 'parser'
    }, require('./package')),
    defaults: require('./defaults')
  };
};

module.exports = exports['default'];
