// Regex patterns
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var patterns = {
  dot: new RegExp(/^\[([a-zA-Z0-9\.]+)\]\.([a-zA-Z0-9\.]+)/),
  phrase: new RegExp(/^\[([\s\S]+)\]\.([a-zA-Z0-9\.]+)/),
  phrase2: new RegExp(/^\[(.*)\]/),
  brackdot: new RegExp(/^\[([a-zA-Z0-9\.]+)\]\.([a-z\.]+)/),
  brackdot2: new RegExp(/^\[([a-zA-Z0-9\.]+)\]/)
};
/* Class RegexType */

var RegexType = function RegexType() {
  _classCallCheck(this, RegexType);

  this.isPhrase = false;
  this.isDot = false;
  this.isBracket = false;
}
/* Class Bracket */
;

var Bracket = (function (_RegexType) {
  _inherits(Bracket, _RegexType);

  function Bracket(str, patterns) {
    _classCallCheck(this, Bracket);

    _get(Object.getPrototypeOf(Bracket.prototype), 'constructor', this).call(this);
    this.str = str;
    this.patterns = patterns;
  }

  /* Class Dot */

  _createClass(Bracket, [{
    key: 'match',
    value: function match() {
      this.test();
      return this.isDot || this.isPhrase || this.isBracket;
    }
  }, {
    key: 'exec',
    value: function exec() {
      this.test();
      if (this.isDot) return this.patterns.dot.exec(this.str);else if (this.isPhrase) return this.patterns.phrase.exec(this.str) || this.patterns.phrase2.exec(this.str);else if (this.isBracket) return this.patterns.brackdot.exec(this.str) || this.patterns.brackdot2.exec(this.str);
    }
  }, {
    key: 'test',
    value: function test() {
      if (this.patterns.dot.test(this.str)) this.isDot = true;
      if (this.patterns.phrase.test(this.str) || this.patterns.phrase2.test(this.str)) this.isPhrase = true;
      if (this.patterns.brackdot.test(this.str) || this.patterns.brackdot2.test(this.str)) this.isBracket = true;
      return this;
    }
  }]);

  return Bracket;
})(RegexType);

var Dot = (function (_RegexType2) {
  _inherits(Dot, _RegexType2);

  function Dot(str, patterns) {
    _classCallCheck(this, Dot);

    _get(Object.getPrototypeOf(Dot.prototype), 'constructor', this).call(this);
    this.str = str;
    this.patterns = patterns;
  }

  /* Class Notation */

  _createClass(Dot, [{
    key: 'match',
    value: function match() {
      this.test();
      return this.isDot;
    }
  }, {
    key: 'exec',
    value: function exec() {
      this.test();
      if (this.isDot) return this.str;
    }
  }, {
    key: 'test',
    value: function test() {
      if (this.patterns.phrase.test(this.str) || this.patterns.phrase2.test(this.str)) this.isPhrase = true;
      this.isDot = this.str.match(/\.[^.]/) && !this.str.match(/\s/) && !this.isPhrase ? true : false;
      return this;
    }
  }]);

  return Dot;
})(RegexType);

var Notation = (function () {
  function Notation(str, patterns) {
    _classCallCheck(this, Notation);

    this.str = str;
    this.patterns = patterns;
  }

  /* Class Notation */

  _createClass(Notation, [{
    key: 'bracket',
    value: function bracket(str, pattern) {
      return new Bracket(str || this.str, pattern || this.patterns);
    }
  }, {
    key: 'dot',
    value: function dot(str, pattern) {
      return new Dot(str || this.str, pattern || this.patterns);
    }
  }]);

  return Notation;
})();

var Regex = (function (_Notation) {
  _inherits(Regex, _Notation);

  function Regex(str) {
    _classCallCheck(this, Regex);

    _get(Object.getPrototypeOf(Regex.prototype), 'constructor', this).call(this, str, patterns);
  }

  return Regex;
})(Notation);

exports['default'] = function (str) {
  'use strict';
  return new Regex(str);
};

module.exports = exports['default'];
