'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
/* Regex class */
function Regex(str) {
  'use strict';
  this.str = str;
  this.patterns = {
    dot: new RegExp(/^\[([a-zA-Z0-9\.]+)\]\.([a-zA-Z0-9\.]+)/),
    phrase: new RegExp(/^\[([\s\S]+)\]\.([a-zA-Z0-9\.]+)/),
    phrase2: new RegExp(/^\[(.*)\]/),
    brackdot: new RegExp(/^\[([a-zA-Z0-9\.]+)\]\.([a-z\.]+)/),
    brackdot2: new RegExp(/^\[([a-zA-Z0-9\.]+)\]/)
  };
  return this;
}

// Regex.dot prototype hack
function DotBase(_this) {
  'use strict';
  this.str = _this.str;
  this.patterns = _this.patterns;
  this.isPhrase = false;
  if (this.patterns.phrase.test(this.str) || this.patterns.phrase2.test(this.str)) this.isPhrase = true;
  this.isDot = this.str.match(/\.[^.]/) && !this.str.match(/\s/) && !this.isPhrase ? true : false;
  return this;
}

// Regex.bracket prototype hack
function BracketBase(_this) {
  'use strict';
  this.str = _this.str;
  this.patterns = _this.patterns;
  this.isDot = false;
  this.isPhrase = false;
  this.isBracket = false;

  if (this.patterns.dot.test(this.str)) this.isDot = true;
  if (this.patterns.phrase.test(this.str) || this.patterns.phrase2.test(this.str)) this.isPhrase = true;
  if (this.patterns.brackdot.test(this.str) || this.patterns.brackdot2.test(this.str)) this.isBracket = true;

  return this;
}

Regex.prototype.dot = function () {
  'use strict';
  return new DotBase(this);
};

Regex.prototype.bracket = function () {
  'use strict';
  return new BracketBase(this);
};

DotBase.prototype.exec = function () {
  'use strict';
  if (this.isDot) return this.str;
};

DotBase.prototype.match = function () {
  'use strict';
  return this.isDot;
};

BracketBase.prototype.exec = function () {
  'use strict';
  if (this.isDot) return this.patterns.dot.exec(this.str);else if (this.isPhrase) return this.patterns.phrase.exec(this.str) || this.patterns.phrase2.exec(this.str);else if (this.isBracket) return this.patterns.brackdot.exec(this.str) || this.patterns.brackdot2.exec(this.str);
};

BracketBase.prototype.match = function () {
  'use strict';
  return this.isDot || this.isPhrase || this.isBracket;
};

exports['default'] = function (str) {
  'use strict';
  return new Regex(str);
};

module.exports = exports['default'];