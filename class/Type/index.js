'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _find = require('../Find');

var _find2 = _interopRequireWildcard(_find);

var _router = require('../Router');

var _router2 = _interopRequireWildcard(_router);

var _filter = require('../Filter');

var _filter2 = _interopRequireWildcard(_filter);

var _regex = require('../Regex');

var _regex2 = _interopRequireWildcard(_regex);

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _d = require('debug');

var _d2 = _interopRequireWildcard(_d);

var debug = _d2['default']('default-parser');

////////////////
// Class Type //
////////////////

var Type = (function () {
  function Type(input, _this) {
    var _this2 = this;

    _classCallCheck(this, Type);

    debug('constructor:', 'Type');
    debug('input:', input);
    // Set dependencies
    this.header = _this.header;
    this.router = _router2['default'](input, _this);
    // Set options
    this.options = _this.options.parser;
    // Set filtered input
    this.filter = (function () {
      var _filter = _this2.options.overrides._filter;

      // Allow users to override the filter
      if (_import2['default'].isFunction(_filter)) return _filter(input, {
        debug: debug,
        _: _import2['default']
      });else return _filter2['default'](input).input();
    })();
    // Check if type of parser is specified
    if (!this.input().keywords.parser) this.input().keywords.parser = this.options.type;
    // Set regex result
    this.regex = _regex2['default'](this.input().phrase);
    debug('locale:', _this.header.getLocale());
    // Parse
    this.parse();
  }

  _createClass(Type, [{
    key: 'input',

    /**
     * Returns the filtered input
     * @return {Object}
     */
    value: function input() {
      return this.filter;
    }
  }, {
    key: 'parse',

    /**
     * Finds the data containing result from the input
     * @return {String}
     */
    value: function parse() {
      debug('process:', 'type');
      debug('input:', this.input());
      // If the phrase contains brackets
      if (this.regex.bracket().match())
        // Return the regex result and the type of parser
        this.type = {
          key: this.regex.bracket().exec(),
          type: 'bracket'
        };
        // If the phrase contains dots
      else if (this.regex.dot().match()) this.type = {
        key: this.input().phrase,
        type: 'dot'
      };
      // If the phrase is just something ordinary
      else this.type = {
        key: this.input().phrase,
        type: 'phrase'
      };
      debug('process:', 'type:', this.type.type);
      switch (this.type.type) {
        case 'phrase':
          this.input().phrase = this.getPhrase();
          break;
        case 'bracket':
          this.input().phrase = this.getBracket();
          break;
        case 'dot':
          this.input().phrase = this.getDot();
          break;
      }
    }
  }, {
    key: 'getPhrase',

    /**
     * Finds the data from a string that is a phrase
     * @return {String | Object | null}
     */
    value: function getPhrase() {
      var keywords = this.options.keywords,
          result,
          local,
          global,
          key = this.type.key;
      try {
        // local data is
        local = this.router.local();
        // Check if global data exists
        global = this.router.global(keywords.global);
        debug('global exists:', !!global, 'local exists:', !!local);
        // Check if the value exists under that key
        result = _import2['default'].has(global, key) ? global[key] : _import2['default'].has(local, key) ? local[key] : null;
      } catch (error) {
        if (this.router.isEnabled()) debug('Woops! Couldn\'t find key: ' + key + ' with router enabled.');else debug(error.stack || String(error));
      }
      debug('result:', result);
      return result || null;
    }
  }, {
    key: 'getBracket',

    /**
     * Parses a string that contains a bracket notation
     * @return {String | null}
     */
    value: function getBracket() {
      debug('process:', 'getBracket');
      var keywords = this.options.keywords,
          key = this.type.key[1] ? this.type.key[1] : null,
          dot = this.type.key[2] ? this.type.key[2] : null,
          result,
          local,
          global;
      debug('key:', key);
      try {
        // Check if router is enabled and data exists under router
        local = this.router.local();
        // Check if local data exists or even has the value from the key
        if (!_import2['default'].isNull(local)) local = _import2['default'].has(local, key) ? local[key] || local : local;
        // Check if global data exists
        global = this.router.global(keywords.global);
        // Find the phrase in the local scope
        local = _import2['default'].has(local, key) ? local[key] : null;
        // Find the phrase in the global scope
        global = _import2['default'].has(global, key) ? global[key] : null;

        debug('global exists:', !!global, 'local exists:', !!local);
        // If the bracket contains a dot notation
        if (dot) {
          //match the dot.dot.dot
          if (_regex2['default'](dot).dot().match()) {
            //deep search for the data and parse the result
            result = _find2['default'](local).dot(dot) || _find2['default'](global).dot(dot);
            //check if key exists
            result = _import2['default'].has(result, key) ? result[key] : result || null;
          } else result = local ? local[dot] : local || global ? global[dot] : global;
        } else {
          // Since it contains only a single dot
          // Check if the local or global scope contains the key
          if (local && !_import2['default'].isNull(local)) result = _import2['default'].has(local, key) ? local[key] : local;else if (global && !_import2['default'].isNull(global)) result = _import2['default'].has(global, key) ? global[key] : global;
        }
      } catch (error) {
        if (this.router.isEnabled()) debug('Woops! Couldn\'t find key: ' + dot || key + ' with router enabled.');else debug(error.stack || String(error));
      }
      debug('result:', result);
      return result || null;
    }
  }, {
    key: 'getDot',

    /**
     * Parses a string that contains a dot notation
     * @return {String | null}
     */
    value: function getDot() {
      debug('process:', 'getDot');
      var keywords = this.options.keywords,
          key = this.type.key,
          result,
          local,
          global;
      try {
        // Find the phrase in the local scope
        local = this.router.local();
        // Find the phrase in the global scope
        global = this.router.global(keywords.global);

        debug('global exists:', !!global, 'local exists:', !!local);
        result = _find2['default'](local).dot(key) || _find2['default'](global).dot(key);
      } catch (error) {
        if (this.router.isEnabled()) debug('Woops! Couldn\'t find key: ' + this._type.key + ' with router enabled.');else debug(error.stack || String(error));
      }
      debug('result:', result);
      return result || null;
    }
  }]);

  return Type;
})();

exports['default'] = function (input, _this) {
  'use strict';
  return new Type(input, _this);
};

module.exports = exports['default'];