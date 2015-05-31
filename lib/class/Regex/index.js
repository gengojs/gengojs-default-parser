// Regex patterns
var patterns = {
  dot: new RegExp(/^\[([a-zA-Z0-9\.]+)\]\.([a-zA-Z0-9\.]+)/),
  phrase: new RegExp(/^\[([\s\S]+)\]\.([a-zA-Z0-9\.]+)/),
  phrase2: new RegExp(/^\[(.*)\]/),
  brackdot: new RegExp(/^\[([a-zA-Z0-9\.]+)\]\.([a-z\.]+)/),
  brackdot2: new RegExp(/^\[([a-zA-Z0-9\.]+)\]/)
};
/* Class RegexType */
class RegexType {
  constructor() {
    this.isPhrase = false;
    this.isDot = false;
    this.isBracket = false;
  }
}
/* Class Bracket */
class Bracket extends RegexType {
  constructor(str, patterns) {
    super();
    this.str = str;
    this.patterns = patterns;
  }
  match(){
    this.test();
    return this.isDot || this.isPhrase || this.isBracket;
  }
  exec(){
    this.test();
    if (this.isDot)
      return this.patterns.dot.exec(this.str);
    else if (this.isPhrase)
      return this.patterns.phrase.exec(this.str) ||
        this.patterns.phrase2.exec(this.str);
    else if (this.isBracket)
      return this.patterns.brackdot.exec(this.str) ||
        this.patterns.brackdot2.exec(this.str);
  }
  test(){
    if (this.patterns.dot.test(this.str)) this.isDot = true;
    if (this.patterns.phrase.test(this.str) ||
      this.patterns.phrase2.test(this.str)) this.isPhrase = true;
    if (this.patterns.brackdot.test(this.str) ||
      this.patterns.brackdot2.test(this.str)) this.isBracket = true;
      return this;
  }
}
/* Class Dot */
class Dot extends RegexType {
  constructor(str, patterns) {
    super();
    this.str = str;
    this.patterns = patterns;
  }
  match(){
    this.test();
    return this.isDot;
  }

  exec(){
    this.test();
    if (this.isDot) return this.str;
  }

  test(){
    if (this.patterns.phrase.test(this.str) ||
      this.patterns.phrase2.test(this.str)) this.isPhrase = true;
    this.isDot = this.str.match(/\.[^.]/) &&
      !this.str.match(/\s/) && !this.isPhrase ? true : false;
      return this;
  }
}
/* Class Notation */
class Notation {
  constructor(str, patterns) {
    this.str = str;
    this.patterns = patterns;
  }
  bracket(str, pattern){
    return (new Bracket(str || this.str,
      pattern || this.patterns));
  }
  dot(str, pattern){
    return (new Dot(str || this.str,
      pattern || this.patterns));
  }
}
/* Class Notation */
class Regex extends Notation {
  constructor(str) {
    super(str, patterns);
  }
}

export
default str => {
  'use strict';
  return new Regex(str);
};
