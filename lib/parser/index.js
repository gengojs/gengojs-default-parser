import engine from './class/Engine';
import _ from 'lodash';
import d from 'debug';
var debug = d('default-parser');
class Parser {
  constructor(input, _this) {
    debug('constructor:', 'Parser');
    this.engine = engine(input, _this);
  }
  parse() {
    return this.engine.run();
  }
}

export
default () => {
  'use strict';
  return {
    main: function(input) {
      this.result = new Parser(input, this).parse();
    },
    package: _.merge({
      type: 'parser'
    }, require('./package')),
    defaults: require('./defaults')
  };
};