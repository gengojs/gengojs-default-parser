import sprintf from 'sprintf-js';
import S from 'string';
import MessageFormat from 'intl-messageformat';
import Markdown from 'markdown-it';
import debug from 'gengojs-debug';
import _ from 'lodash';

import Filter from './filter';
import Type from './type';
import Find from './find';

var log = debug('parser');
var vsprintf = sprintf.vsprintf;

class Parser extends Filter {
  constructor(input, core) {
      super(input);
      // Set locale
      this.locale = core.header.getLocale();
      // Set options
      this.options = core.options;
      /**
       * 1. Parser recieves a string as an input.
       * 2. The super class will filter the input.
       * 3. Use Type class to determine the input type
       */
      this.input = super.filter();
      var resultType = new Type(this.input.phrase);
      switch (resultType.getType().type) {
        case 'phrase':
          this.input.phrase = resultType.getPhrase();
          break;
        case 'bracket':
          this.input.phrase = resultType.getBracket();
          break;
        case 'dot':
          this.input.phrase = resultType.getDot();
          break;
        default:
          break;
      }
    }
    /**
     * Starts the engine and parses the input
     * @return {String} The i18ned string.
     */
  parse() {
      if (!this.input.phrase) return '';
      else {
        var _format, _default;
        try {
          // Parse both at once
          _format = this.formatParser();
          _default = this.defaultParser();
        } catch (error) {
          log.error(error.stack || String(error));
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
                result = _format;
              }
              // If interpolation failed for format
              if (/\{[\s\S]*\}/g.test(_format)) {
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
              return _format;
            } else if (!S(_default).isEmpty() && !_format) {
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
      var phrase = str || this.phrase;
      var {
        markdown, template, sprintf
      } = this.options.parser;
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
        log.error(error.stack || String(error));
      }
      return phrase || undefined;
    }
    /**
     * The message formatting parser
     * @return {String}
     */
  formatParser(str) {
    var phrase = str || this.phrase,
      result;
    var {
      markdown
    } = this.options.parser;
    try {
      // Check if markdown is enabled
      if (markdown.enabled) phrase = this.markdown(phrase);
      // Try to apply message format
      result = this.messageFormat(phrase).format(this.input.template);
    } catch (error) {
      log.error(error.stack || String(error));
    }
    phrase = result;
    return phrase || undefined;
  }

  /**
   * Finds the translated phrase in the dictionary
   * @param  {Object}
   * @return {String}
   */
  preparse(object) {
    var {
      parser, header
    } = this.options;
    var key = (
      this.locale.toLowerCase() ===
      header.default.toLowerCase() ?
      parser.keywords.default : parser.keywords.translated);
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

  /* Messageformat */
  messageFormat(str) {
    str = this.preparse(str);
    return !S(str).isEmpty() || !str ?
      new MessageFormat(str, this.locale) : '';
  }

  /* Markdown */
  markdown(str) {
    return new Markdown(_.omit(this.options.markdown,
      'enabled')).renderInline(str);
  }

  /* Sprintf */
  vsprintf(str) {
    return vsprintf(str, this.input.arguments);
  }

  /* Interpolation */
  template(str) {
    var phrase = str;
    var {
      parser
    } = this.options;
    // Get the opening and closing template
    // from options
    var open = parser.template.open,
      close = parser.template.close;
    if (S(phrase).include(open) && S(phrase).include(close)) {
      var opening = open;
      var closing = close;

      open = opening.replace(/[-[\]()*\s]/g, '\\$&').replace(/\$/g, '\\$');
      close = closing.replace(/[-[\]()*\s]/g, '\\$&').replace(/\$/g, '\\$');
      var r = new RegExp(open + '(.+?)' + close, 'g');
      // Process the interpolation
      var matches = phrase.match(r) || [];
      _.forEach(matches, function(match) {
        var keys = match.substring(opening.length,
          // Chop {{ and }}
          match.length - closing.length).trim().split('.');
        var value = Find.findR(this.input.template, keys);
        phrase = phrase.replace(match, value);
      }, this);
    }
    return phrase;
  }
}

export default Parser;