import find from '../Find';
import sprintf from 'sprintf-js';
import S from 'string';
import MessageFormat from 'intl-messageformat';
import Markdown from 'markdown-it';
import type from '../Type';
import _ from 'lodash';
import d from 'debug';

var vsprintf = sprintf.vsprintf;
var debug = d('default-parser');
/* Engine class */
class Engine {
  constructor(input, _this) {
    debug('constructor:', 'Engine');
    // Set locale
    this.locale = _this.header.getLocale();
    // Set options
    this.options = _this.options;
    // Get the input
    this.input = type(input, _this).input();
    // Find the phrase
    this.found = this.find(this.input.phrase);
  }
  /**
   * Starts the engine and parses the input
   * @return {String} The i18ned string.
   */
  run() {
    if (_.isNull(this.input.phrase)) return '';
    else {
      var _format, _default;
      try {
        // Parse both at once
        _format = this.formatParser();
        _default = this.defaultParser();
        debug('run:', 'format:', _format);
        debug('run:', 'default:', _default);
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
          if (!S(_format).isEmpty() && !S(_default).isEmpty()) {
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
            if (S(result).isEmpty()) return _default;
            else return result;
          }
          // If formatted string was empty, then it could be
          // in the default string else just return an empty
          // string.
          else if (!S(_format).isEmpty() && !_default) {
            debug('type:', 'format:', _format);
            return _format;
          } else if (!S(_default).isEmpty() && !_format) {
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
  defaultParser(str) {
    debug('process:', 'default');
    var phrase = str || this.found;
    var {
      markdown, template, sprintf, overrides
    } = this.options.parser;
    // Get the default parser if any
    var _default = overrides.engine.default;
    // Allow users to override the default parser
    if (_.isFunction(_default))
      phrase = _default.bind(this)(this.input);
    else
      try {
        // Check if markdown is enabled
        if (markdown.enabled) phrase = this.markdown(phrase);
        // Apply interpolation
        if (!_.isEmpty(this.input.template) && template.enabled)
          phrase = this.template(phrase);
        // Apply vsprintf
        if (!_.isEmpty(this.input.arguments) && sprintf.enabled)
          phrase = this.vsprintf(phrase);
      } catch (error) {
        debug(error.stack || String(error));
      }
    return phrase || undefined;
  }
  /**
   * The message formatting parser
   * @return {String}
   */
  formatParser(str) {
    debug('process:', 'format');
    var phrase = str || this.found,
      result;
    var {
      markdown, overrides
    } = this.options.parser;
    // Get the format parser if any
    var _format = overrides.engine.format;
    // Allow users to override the format parser
    if (_.isFunction(_format))
      phrase = _format.bind()(this.input);
    else
      try {
        if (markdown.enabled) phrase = this.markdown(phrase);
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
  find(object) {
    debug('process:', 'find');
    var {
      parser, header
    } = this.options;
    var {
      overrides
    } = parser;
    var key = (
      this.locale.toLowerCase() ===
      header.default.toLowerCase() ?
      parser.keywords.default : parser.keywords.translated);
    var _find = overrides.engine.find;
    debug('process:', 'find:', 'key:', key);
    debug('process:', 'find:', 'object:', object);
    // Allow users to override the find function
    if (_.isFunction(_find))
      return _find.bind(this)(object, key);
    else {
      if (!object) return '';
      // If the object is already a string then return
      if (_.isString(object)) return object;
      // If it's an object
      if (_.isPlainObject(object)) {
        // Check if already contains the key 'default' or 'translated'
        if (_.has(object, key)) {
          return _.has(object, key) ? object[key] : object;
        }
      }
    }
  }

  /* Messageformat */
  messageFormat(str) {
    debug('process:', 'message formatting');
    str = this.find(str);
    return !S(str).isEmpty() || !str ?
      new MessageFormat(str, this.locale) : '';
  }

  /* Markdown */
  markdown(str) {
    debug('process:', 'markdown');
    return new Markdown(_.omit(this.options.markdown,
      'enabled')).renderInline(str);
  }

  /* Sprintf */
  vsprintf(str) {
    debug('process:', 'vsprintf');
    return vsprintf(str, this.input.arguments);
  }

  /* Interpolation */
  template(str) {
    debug('process:', 'template');
    var phrase = str;
    var {
      parser
    } = this.options;
    var open = parser.template.open,
      close = parser.template.close;
    if (S(phrase).include(open) && S(phrase).include(close)) {
      var opening = open;
      var closing = close;

      open = opening.replace(/[-[\]()*\s]/g, '\\$&').replace(/\$/g, '\\$');
      close = closing.replace(/[-[\]()*\s]/g, '\\$&').replace(/\$/g, '\\$');
      var r = new RegExp(open + '(.+?)' + close, 'g');
      //, r = /\{\{(.+?)\}\}/g
      var matches = phrase.match(r) || [];
      _.forEach(matches, function(match) {
        var keys = match.substring(opening.length,
          // Chop {{ and }}
          match.length - closing.length).trim().split('.');
        var value = find(this.input.template).dot(keys);
        phrase = phrase.replace(match, value);
      }, this);
    }
    return phrase;
  }
}

export
default (input, _this) => {
  'use strict';
  return new Engine(input, _this);
};