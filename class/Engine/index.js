'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _find = require('../Find');

var _find2 = _interopRequireWildcard(_find);

var _sprintf = require('sprintf-js');

var _sprintf2 = _interopRequireWildcard(_sprintf);

var _S = require('string');

var _S2 = _interopRequireWildcard(_S);

var _MessageFormat = require('intl-messageformat');

var _MessageFormat2 = _interopRequireWildcard(_MessageFormat);

var _Markdown = require('markdown-it');

var _Markdown2 = _interopRequireWildcard(_Markdown);

var _type = require('../Type');

var _type2 = _interopRequireWildcard(_type);

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _d = require('debug');

var _d2 = _interopRequireWildcard(_d);

var vsprintf = _sprintf2['default'].vsprintf;
var debug = _d2['default']('default-parser');
/* Engine class */

var Engine = (function () {
  function Engine(input, _this) {
    _classCallCheck(this, Engine);

    debug('constructor:', 'Engine');
    // Set locale
    this.locale = _this.header.getLocale();
    // Set options
    this.options = _this.options;
    // Get the input
    this.input = _type2['default'](input, _this).input();
    // Find the phrase
    this.found = this.find(this.input.phrase);
  }

  _createClass(Engine, [{
    key: 'run',

    /**
     * Starts the engine and parses the input
     * @return {String} The i18ned string.
     */
    value: function run() {
      if (_import2['default'].isNull(this.input.phrase)) {
        return '';
      } else {
        var _format, _default;
        try {
          // Parse both at once
          _format = this.formatParser();
          _default = this.defaultParser();
          if (!_format && !_S2['default'](this.formatParser(_default)).isEmpty()) throw new Error('Woops, did you forget to specify the type of parser?');
        } catch (error) {
          debug(error.stack || String(error));
        }
        // Determine if the user specified a parser
        switch (this.input.keywords.parser) {
          case 'default':
            // Render default
            return _default || '';
          case 'format':
            // Render format
            return _format || '';
          case '*':
            // If formatted string was empty, then it could
            // in the default string else just return an empty
            // string.
            if (!_S2['default'](_format).isEmpty()) {
              debug('type:', 'format:', this.format());
              return _format;
            } else if (!_S2['default'](_default).isEmpty()) {
              debug('type:', 'default:', this['default']());
              return _default;
            } else {
              return '';
            }break;
        }
      }
    }
  }, {
    key: 'defaultParser',

    /**
     * The default parser
     * @return {String}
     */
    value: function defaultParser(str) {
      debug('process:', 'default');
      var phrase = str || this.found;
      var _options$parser = this.options.parser;
      var markdown = _options$parser.markdown;
      var template = _options$parser.template;
      var sprintf = _options$parser.sprintf;
      var overrides = _options$parser.overrides;

      // Get the default parser if any
      var _default = overrides.engine['default'];
      // Allow users to override the default parser
      if (_import2['default'].isFunction(_default)) phrase = _default.bind(this)(this.input);else try {
        // Check if markdown is enabled
        if (markdown.enabled) phrase = this.markdown(phrase);
        // Apply interpolation
        if (!_import2['default'].isEmpty(this.input.template) && template.enabled) phrase = this.template(phrase);
        // Apply vsprintf
        if (!_import2['default'].isEmpty(this.input.arguments) && sprintf.enabled) phrase = this.vsprintf(phrase);
      } catch (error) {
        debug(error.stack || String(error));
      }
      return phrase || undefined;
    }
  }, {
    key: 'formatParser',

    /**
     * The message formatting parser
     * @return {String}
     */
    value: function formatParser(str) {
      debug('process:', 'format');
      var phrase = str || this.found,
          result;
      var _options$parser2 = this.options.parser;
      var markdown = _options$parser2.markdown;
      var overrides = _options$parser2.overrides;

      // Get the format parser if any
      var _format = overrides.engine.format;
      // Allow users to override the format parser
      if (_import2['default'].isFunction(_format)) phrase = _format.bind()(this.input);else try {
        if (markdown.enabled) phrase = this.markdown(phrase);
        result = this.messageFormat(phrase).format(this.input.template);
      } catch (error) {
        debug(error.stack || String(error));
      }
      phrase = result;
      return phrase || undefined;
    }
  }, {
    key: 'find',

    /**
     * Finds the translated phrase in the dictionary
     * @param  {Object}
     * @return {String}
     */
    value: function find(object) {
      debug('process:', 'find');
      var _options = this.options;
      var parser = _options.parser;
      var header = _options.header;
      var overrides = parser.overrides;

      var key = this.locale.toLowerCase() === header['default'].toLowerCase() ? parser.keywords['default'] : parser.keywords.translated;
      var _find = overrides.engine.find;
      debug('process:', 'find:', 'key:', key);
      debug('process:', 'find:', 'object:', object);
      // Allow users to override the find function
      if (_import2['default'].isFunction(_find)) {
        return _find.bind(this)(object, key);
      } else {
        if (!object) {
          return '';
        } // If the object is already a string then return
        if (_import2['default'].isString(object)) {
          return object;
        } // If it's an object
        if (_import2['default'].isPlainObject(object)) {
          // Check if already contains the key 'default' or 'translated'
          if (_import2['default'].has(object, key)) {
            return _import2['default'].has(object, key) ? object[key] : object;
          }
        }
      }
    }
  }, {
    key: 'messageFormat',

    /* Messageformat */
    value: function messageFormat(str) {
      debug('process:', 'message formatting');
      str = this.find(str);
      return !_S2['default'](str).isEmpty() || !str ? new _MessageFormat2['default'](str, this.locale) : '';
    }
  }, {
    key: 'markdown',

    /* Markdown */
    value: function markdown(str) {
      debug('process:', 'markdown');
      return new _Markdown2['default'](_import2['default'].omit(this.options.markdown, 'enabled')).renderInline(str);
    }
  }, {
    key: 'vsprintf',

    /* Sprintf */
    value: (function (_vsprintf) {
      function vsprintf(_x) {
        return _vsprintf.apply(this, arguments);
      }

      vsprintf.toString = function () {
        return _vsprintf.toString();
      };

      return vsprintf;
    })(function (str) {
      debug('process:', 'vsprintf');
      return vsprintf(str, this.input.arguments);
    })
  }, {
    key: 'template',

    /* Interpolation */
    value: function template(str) {
      debug('process:', 'template');
      var phrase = str;
      var parser = this.options.parser;

      var open = parser.template.open,
          close = parser.template.close;
      if (_S2['default'](phrase).include(open) && _S2['default'](phrase).include(close)) {
        var opening = open;
        var closing = close;

        open = opening.replace(/[-[\]()*\s]/g, '\\$&').replace(/\$/g, '\\$');
        close = closing.replace(/[-[\]()*\s]/g, '\\$&').replace(/\$/g, '\\$');
        var r = new RegExp(open + '(.+?)' + close, 'g');
        //, r = /\{\{(.+?)\}\}/g
        var matches = phrase.match(r) || [];
        _import2['default'].forEach(matches, function (match) {
          var keys = match.substring(opening.length,
          // Chop {{ and }}
          match.length - closing.length).trim().split('.');
          var value = _find2['default'](this.input.template).dot(keys);
          phrase = phrase.replace(match, value);
        }, this);
      }
      return phrase;
    }
  }]);

  return Engine;
})();

exports['default'] = function (input, _this) {
  'use strict';
  return new Engine(input, _this);
};

module.exports = exports['default'];