'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _d = require('debug');

var _d2 = _interopRequireWildcard(_d);

var debug = _d2['default']('default-parser');

var Filter = (function () {
  function Filter(input) {
    _classCallCheck(this, Filter);

    this._phrase = '';
    this._arguments = [];
    this._keywords = {};
    this._templates = {};
    this.filter(input);
  }

  _createClass(Filter, [{
    key: 'filter',
    value: function filter(input) {
      debug('process:', 'filter');
      var phrase = input.phrase;
      var other = input.other;var args = other.args;
      var values = other.values;

      if (_import2['default'].isPlainObject(phrase)) {
        if (_import2['default'].has(phrase, 'phrase')) this._phrase = phrase.phrase;
        if (_import2['default'].has(phrase, 'parser')) this._keywords.parser = phrase.parser;
      } else this._phrase = phrase;

      if (!_import2['default'].isEmpty(args)) {
        // Iterate the arguments
        _import2['default'].forEach(args, function (item) {
          // If the arguments contains an Object
          // then check for some keywords
          if (_import2['default'].isPlainObject(item)) {
            _import2['default'].forOwn(item, function (oitem, key) {
              switch (key) {
                case 'phrase':
                  if (!_import2['default'].isEmpty(this._phrase)) this._phrase = item;
                  break;
                case 'parser':
                  if (!this._keywords.parser) this._keywords.parser = oitem;
                  break;
                default:
                  if (!this._templates[key]) this._templates[key] = oitem;
                  break;
              }
            }, this);
          }
          if (!_import2['default'].isArray(item) && !_import2['default'].isPlainObject(item)) this._arguments.push(item);
        }, this);
      }
      if (!_import2['default'].isEmpty(values)) {
        _import2['default'].forOwn(values, function (item, key) {
          switch (key) {
            case 'phrase':
              if (!_import2['default'].isEmpty(this._phrase)) this._phrase = item;
              break;
            case 'parser':
              if (!this._keywords.parser) this._keywords.parser = item;
              break;
            default:
              if (!this._templates[key]) this._templates[key] = item;
              break;
          }
        }, this);
      }
    }
  }, {
    key: 'input',
    value: (function (_input) {
      function input() {
        return _input.apply(this, arguments);
      }

      input.toString = function () {
        return _input.toString();
      };

      return input;
    })(function () {
      var input = {
        phrase: this._phrase,
        arguments: this._arguments,
        template: this._templates,
        keywords: this._keywords
      };
      debug('filtered input:', input);
      return input;
    })
  }]);

  return Filter;
})();

exports['default'] = function (input) {
  'use strict';
  return new Filter(input);
};

module.exports = exports['default'];