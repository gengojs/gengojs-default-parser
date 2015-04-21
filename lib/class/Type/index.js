import find from '../Find';
import router from '../Router';
import filter from '../Filter';
import regex from '../Regex';
import _ from 'lodash';
import d from 'debug';
var debug = d('default-parser');
/* Type class */
class Type {
  constructor(input, _this) {
    debug('constructor:', 'Type');
    debug('input:', input);
    // Set dependencies
    this.header = _this.header;
    this.router = router(input, _this);
    // Set options
    this.options = _this.options.parser;
    // Set filtered input
    this.filter = (() => {
      var {
        _filter
      } = this.options.overrides;
      // Allow users to override the filter
      if (_.isFunction(_filter))
        return _filter(input, {
          debug: debug,
          '_': _
        });
      else
        return filter(input).input();
    })();
    // Check if type of parser is specified
    if (!this.input().keywords.parser)
      this.input().keywords.parser = this.options.type;
    // Set regex result
    this.regex = regex(this.input().phrase);
    debug('locale:', _this.header.getLocale());
    // Parse
    this.parse();
  }
  /**
   * Returns the filtered input
   * @return {Object}
   */
  input() {
    return this.filter;
  }
  /**
   * Finds the data containing result from the input
   * @return {String}
   */
  parse() {
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
    else if (this.regex.dot().match())
      this.type = {
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

  /**
   * Finds the data from a string that is a phrase
   * @return {String | Object | null}
   */
  getPhrase() {
    var keywords = this.options.keywords,
      result, local, global, key = this.type.key;
    try {
      // local data is
      local = this.router.local();
      // Check if global data exists
      global = this.router.global(keywords.global);
      debug('global exists:', !(!global), 'local exists:', !(!local));
      // Check if the value exists under that key
      result = _.has(global, key) ?
        global[key] : _.has(local, key) ?
        local[key] : null;
    } catch (error) {
      if (this.router.isEnabled())
        debug('Woops! Couldn\'t find key: ' + key +
          ' with router enabled.');
      else debug(error.stack || String(error));
    }
    debug('result:', result);
    return result || null;
  }
  /**
   * Parses a string that contains a bracket notation
   * @return {String | null}
   */
  getBracket() {
    debug('process:', 'getBracket');
    var keywords = this.options.keywords,
      key = this.type.key[1] ?

      this.type.key[1] : null,
      dot = this.type.key[2] ?

      this.type.key[2] : null,
      result, local, global;
    debug('process:', 'getBracket:', 'key:', key);
    try {
      // Check if router is enabled and data exists under router
      local = this.router.local();
      // Check if local data exists or even has the value from the key
      if (!_.isNull(local))
        local = (_.has(local, key)) ? (local[key] || local) : local;
      // Check if global data exists
      global = this.router.global(keywords.global);
      // Find the phrase in the local scope
      local = _.has(local, key) ? local[key] : null;
      // Find the phrase in the global scope
      global = _.has(global, key) ? global[key] : null;

      debug('global exists:', !(!global), 'local exists:', !(!local));
      // If the bracket contains a dot notation
      if (dot) {
        //match the dot.dot.dot
        if (regex(dot).dot().match()) {
          //deep search for the data and parse the result
          result = find(local).dot(dot) || find(global).dot(dot);
          //check if key exists
          result = _.has(result, key) ? result[key] : (result || null);
        } else result = local ? local[dot] :
          local || global ? global[dot] : global;
      } else {
        // Since it contains only a single dot
        // Check if the local or global scope contains the key
        if (local && !_.isNull(local))
          result = (_.has(local, key)) ? local[key] : local;
        else if (global && !_.isNull(global))
          result = (_.has(global, key)) ? global[key] : global;
      }

    } catch (error) {
      if (this.router.isEnabled())
        debug('Woops! Couldn\'t find key: ' + dot || key +
          ' with router enabled.');
      else debug(error.stack || String(error));
    }
    debug('result:', result);
    return result || null;
  }
  /**
   * Parses a string that contains a dot notation
   * @return {String | null}
   */
  getDot() {
    debug('process:', 'getDot');
    var keywords = this.options.keywords,
      key = this.type.key,
      result, local, global;
    debug('process:', 'getDot:', 'key:', key);
    try {
      // Find the phrase in the local scope
      local = this.router.local();
      // Find the phrase in the global scope
      global = this.router.global(keywords.global);

      debug('global exists:', !(!global), 'local exists:', !(!local));
      result = find(local).dot(key) || find(global).dot(key);
    } catch (error) {
      if (this.router.isEnabled())
        debug('Woops! Couldn\'t find key: ' + this._type.key +
          ' with router enabled.');
      else debug(error.stack || String(error));
    }
    debug('result:', result);
    return result || null;
  }
}

export
default (input, _this) => {
  'use strict';
  return new Type(input, _this);
};