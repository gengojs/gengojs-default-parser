'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Find = require('../Find');

var _Find2 = _interopRequireDefault(_Find);

var _sprintfJs = require('sprintf-js');

var _sprintfJs2 = _interopRequireDefault(_sprintfJs);

var _string = require('string');

var _string2 = _interopRequireDefault(_string);

var _intlMessageformat = require('intl-messageformat');

var _intlMessageformat2 = _interopRequireDefault(_intlMessageformat);

var _markdownIt = require('markdown-it');

var _markdownIt2 = _interopRequireDefault(_markdownIt);

var _Type = require('../Type');

var _Type2 = _interopRequireDefault(_Type);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _vsprintf = _sprintfJs2['default'].vsprintf;
var debug = (0, _debug2['default'])('default-parser');
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
    this.input = (0, _Type2['default'])(input, _this).input();
    // Find the phrase
    this.found = this.find(this.input.phrase);
  }

  /**
   * Starts the engine and parses the input
   * @return {String} The i18ned string.
   */

  _createClass(Engine, [{
    key: 'run',
    value: function run() {
      debug('process:', 'run');
      if (_lodash2['default'].isNull(this.input.phrase)) return '';else {
        var _format, _default;
        try {
          // Parse both at once
          _format = this.formatParser();
          _default = this.defaultParser();
          debug('run -- format:', _format);
          debug('run -- default:', _default);
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
            if (!(0, _string2['default'])(_format).isEmpty() && !(0, _string2['default'])(_default).isEmpty()) {
              var result = '';
              // If interpolation failed for default
              if (/\{[\s\S]*\}/g.test(_default)) {
                debug('type:', 'format:', _format);
                result = _format;
              }
              // If interpolation failed for format
              if (/\{[\s\S]*\}/g.test(_format)) {
                debug('type:', 'default:', _default);
                result = _default;
              }
              // If all fails then we tried so
              // return the default since it could
              // possibly be that _default and _format
              // are the same.
              if ((0, _string2['default'])(result).isEmpty()) return _default;else return result;
            }
            // If formatted string was empty, then it could be
            // in the default string else just return an empty
            // string.
            else if (!(0, _string2['default'])(_format).isEmpty() && !_default) {
                debug('type:', 'format:', _format);
                return _format;
              } else if (!(0, _string2['default'])(_default).isEmpty() && !_format) {
                debug('type:', 'default:', _default);
                return _default;
              } else return '';
            break;
        }
      }
    }

    /**
     * The default parser
     * @return {String}
     */
  }, {
    key: 'defaultParser',
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
      if (_lodash2['default'].isFunction(_default)) phrase = _default.bind(this)(this.input);else try {
        // Check if markdown is enabled
        if (markdown.enabled) phrase = this.markdown(phrase);
        // Apply interpolation
        if (!_lodash2['default'].isEmpty(this.input.template) && template.enabled) phrase = this.template(phrase);
        // Apply vsprintf
        if (!_lodash2['default'].isEmpty(this.input.arguments) && sprintf.enabled) phrase = this.vsprintf(phrase);
      } catch (error) {
        debug(error.stack || String(error));
      }
      return phrase || undefined;
    }

    /**
     * The message formatting parser
     * @return {String}
     */
  }, {
    key: 'formatParser',
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
      if (_lodash2['default'].isFunction(_format)) phrase = _format.bind()(this.input);else try {
        // Check if markdown is enabled
        if (markdown.enabled) phrase = this.markdown(phrase);
        // Try to apply message format
        result = this.messageFormat(phrase).format(this.input.template);
      } catch (error) {
        debug(error.stack || String(error));
      }
      phrase = result;
      return phrase || undefined;
    }

    /**
     * Finds the translated phrase in the dictionary
     * @param  {Object}
     * @return {String}
     */
  }, {
    key: 'find',
    value: function find(object) {
      debug('process:', 'find');
      var _options = this.options;
      var parser = _options.parser;
      var header = _options.header;
      var overrides = parser.overrides;

      var key = this.locale.toLowerCase() === header['default'].toLowerCase() ? parser.keywords['default'] : parser.keywords.translated;
      var _find = overrides.engine.find;
      debug('find -- key:', key);
      debug('find -- object:', object);
      // Allow users to override the find function
      if (_lodash2['default'].isFunction(_find)) return _find.bind(this)(object, key);else {
        if (!object) return '';
        // If the object is already a string then return
        if (_lodash2['default'].isString(object)) return object;
        // If it's an object
        if (_lodash2['default'].isPlainObject(object)) {
          // Check if already contains the key 'default' or 'translated'
          if (_lodash2['default'].has(object, key)) {
            return _lodash2['default'].has(object, key) ? object[key] : object;
          }
        }
      }
    }

    /* Messageformat */
  }, {
    key: 'messageFormat',
    value: function messageFormat(str) {
      debug('process:', 'message formatting');
      str = this.find(str);
      return !(0, _string2['default'])(str).isEmpty() || !str ? new _intlMessageformat2['default'](str, this.locale) : '';
    }

    /* Markdown */
  }, {
    key: 'markdown',
    value: function markdown(str) {
      debug('process:', 'markdown');
      return new _markdownIt2['default'](_lodash2['default'].omit(this.options.markdown, 'enabled')).renderInline(str);
    }

    /* Sprintf */
  }, {
    key: 'vsprintf',
    value: function vsprintf(str) {
      debug('process:', 'vsprintf');
      return _vsprintf(str, this.input.arguments);
    }

    /* Interpolation */
  }, {
    key: 'template',
    value: function template(str) {
      debug('process:', 'template');
      var phrase = str;
      var parser = this.options.parser;

      // Get the opening and closing template
      // from options
      var open = parser.template.open,
          close = parser.template.close;
      if ((0, _string2['default'])(phrase).include(open) && (0, _string2['default'])(phrase).include(close)) {
        var opening = open;
        var closing = close;

        open = opening.replace(/[-[\]()*\s]/g, '\\$&').replace(/\$/g, '\\$');
        close = closing.replace(/[-[\]()*\s]/g, '\\$&').replace(/\$/g, '\\$');
        var r = new RegExp(open + '(.+?)' + close, 'g');
        // Process the interpolation
        var matches = phrase.match(r) || [];
        _lodash2['default'].forEach(matches, function (match) {
          var keys = match.substring(opening.length,
          // Chop {{ and }}
          match.length - closing.length).trim().split('.');
          var value = (0, _Find2['default'])().interpolate(this.input.template, keys);
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
