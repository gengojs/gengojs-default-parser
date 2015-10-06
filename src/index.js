'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

exports['default'] = function () {
  'use strict';
  return {
    main: function main(input) {
      var _this = this;

      return (function () {
        var result = new _parser2['default'](input, _this).parse();
        console.log('RESULT', result);
        return result;
      })();
    },
    'package': _lodash2['default'].merge({
      type: 'parser'
    }, require('../package')),
    defaults: require('../defaults')
  };
};

module.exports = exports['default'];
//# sourceMappingURL=source maps/index.js.map
