import Parser from './parser';
import _ from 'lodash';

export default () => {
  'use strict';
  return {
    main: function(input) {
      return (() => {
        var result = new Parser(input, this).parse();
        console.log('RESULT', result);
        return result;
      })();
    },
    package: _.merge({
      type: 'parser'
    }, require('../package')),
    defaults: require('../defaults')
  };
};