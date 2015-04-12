import _ from 'lodash';
import d from 'debug';
var debug = d('default-parser');
class Filter {
  constructor(input) {
    this._phrase = '';
    this._arguments = [];
    this._keywords = {};
    this._templates = {};
    this.filter(input);
  }
  /**
   * Filters the input
   * @param  {Object} input
   * @return {Object}
   */
  filter(input) {
    debug('process:', 'filter');
    var {
      phrase, other
    } = input, {
      args, values
    } = other;
    if (_.isPlainObject(phrase)) {
      if (_.has(phrase, 'phrase')) this._phrase = phrase.phrase;
      if (_.has(phrase, 'parser')) this._keywords.parser = phrase.parser;
    } else this._phrase = phrase;

    if (!_.isEmpty(args)) {
      // Iterate the arguments
      _.forEach(args, function(item) {
        // If the arguments contains an Object
        // then check for some keywords
        if (_.isPlainObject(item)) {
          _.forOwn(item, function(oitem, key) {
            switch (key) {
              case 'phrase':
                if (!_.isEmpty(this._phrase)) this._phrase = item;
                break;
              case 'parser':
                if (!this._keywords.parser) this._keywords.parser = oitem;
                break;
              case 'locale':
                if (!this._keywords.locale) this._keywords.locale = oitem;
                break;
              default:
                if (!this._templates[key]) this._templates[key] = oitem;
                break;
            }
          }, this);
        }
        if (!_.isArray(item) && !_.isPlainObject(item))
          this._arguments.push(item);
      }, this);
    }
    if (!_.isEmpty(values)) {
      _.forOwn(values, function(item, key) {
        switch (key) {
          case 'phrase':
            if (!_.isEmpty(this._phrase)) this._phrase = item;
            break;
          case 'parser':
            if (!this._keywords.parser) this._keywords.parser = item;
            break;
          case 'locale':
            if (!this._keywords.locale) this._keywords.locale = item;
            break;
          default:
            if (!this._templates[key]) this._templates[key] = item;
            break;
        }
      }, this);
    }
  }
  /**
   * Returns the filtered input
   * @return {Object}
   */
  input() {
    var input = {
      phrase: this._phrase,
      arguments: this._arguments,
      template: this._templates,
      keywords: this._keywords
    };
    debug('filtered input:', input);
    return input;
  }
}

export
default (input) => {
  'use strict';
  return new Filter(input);
};