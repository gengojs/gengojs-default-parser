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

/* Class Engine */
class Engine {
  constructor(input, _this) {
    // Create a Type instance
    this.type = type(input, _this);
    debug('constructor:', 'Engine');
    // Set locale
    this.locale = _this.header.getLocale();
    // Set options
    this.options = _this.options;
  }
  /* Returns an object of the type of input. */
  input() {
    return this.type.input();
  }
  /* Run the parser */
  run() {
    if (_.isNull(this.input().phrase)) return '';
    else {
      // Call the default and format parsers once
      var _default = this.default();
      var _format = this.format();
      // Determine if the user specified a parser
      switch (this.input().keywords.parser) {
        case 'default':
          // Render default
          return _default;
        case 'format':
          // Render format
          return _format;
        case '*':
          // If formatted string was empty then it could 
          // in the default string else just return an empty
          // string.
          if (!S(_format).isEmpty()) {
            debug('type:', 'format:', this.format());
            return _format;
          } else if (!S(_default).isEmpty()) {
            debug('type:', 'default:', _default);
            return _default;
          } else return '';
          break;
      }
    }
  }
  /* Default parser */
  default () {
    debug('process:', 'default');
    var phrase = this.find(this.input().phrase);
    var {
      markdown, parsers, template, sprintf
    } = this.options.parser;
    // Allow users to override the default parser
    if (_.isFunction(parsers.default))
      phrase = parsers.default.bind(this)(this.input());
    else
      try {
        // Check if markdown is enabled 
        if (markdown.enabled) phrase = this.markdown(phrase);
        // Apply interpolation
        if (!_.isEmpty(this.input().template) && template.enabled)
          phrase = this.template(phrase);
        // Apply vsprintf
        if (!_.isEmpty(this.input().arguments) && sprintf.enabled)
          phrase = this.vsprintf(phrase);
      } catch (error) {
        debug(error.stack || String(error));
      }
    return phrase || '';
  }
  /* Message formatting parser */
  format() {
    debug('process:', 'format');
    var phrase = this.find(this.input().phrase),
      result;
    var {
      markdown, parsers
    } = this.options.parser;
    // Allow users to override the default parser
    if (_.isFunction(parsers.default))
      phrase = parsers.format.bind(this)(this.input());
    else
      try {
        if (markdown.enabled) phrase = this.markdown(phrase);
        result = this.messageFormat(phrase).format(this.input().template);
      } catch (error) {
        debug(error.stack || String(error));
      }
    phrase = result;
    return phrase || '';
  }

  find(object) {
    debug('process:', 'find');
    var {
      parser, header
    } = this.options;
    var key = (
      this.locale.toLowerCase() ===
      header.default.toLowerCase() ?
      parser.keywords.default : parser.keywords.translated);
    debug('process:', 'find:', 'key:', key);
    debug('process:', 'find:', 'object:', object);
    if (!object) return '';
    //if the object is already a string then return
    if (_.isString(object)) return object;
    //if its a {}
    if (_.isPlainObject(object)) {
      //check if already contains the key 'default' or 'translated'
      if (_.has(object, key)) {
        return _.has(object, key) ? object[key] : object;
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
    return vsprintf(str, this.input().arguments);
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
          //chop {{ and }}
          match.length - closing.length).trim().split('.');
        var value = find(this.input().template).dot(keys);
        phrase = phrase.replace(match, value);
      }, this);
    }
    return phrase;
  }
}

module.exports = (input, _this) => {
  'use strict';
  return new Engine(input, _this);
};