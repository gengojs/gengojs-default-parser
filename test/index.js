/*global describe, it*/
var assert = require('chai').assert;
var core = require('gengojs-core');
var parser = require('../');

describe('Parser', function(){
  'use strict';
  describe('load plugin', function() {
    it('should exist Gengo', function() {
      var gengo = core({}, parser());
      assert.isDefined(gengo.plugins.parsers[0]);
    });
  });
});
