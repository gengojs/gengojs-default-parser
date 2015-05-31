import _ from 'lodash';
import d from 'debug';
var debug = d('default-parser');
/* Find class */
class Find {
  constructor(object) {
    debug('constructor:', 'Find');
    this.object = object;
  }
  dot(path) {
    var obj = this.object;
    if (!obj ||
      _.isNull(obj) ||
      _.isNull(path) ||
      !path) return null;
    else {
      var i, keys;
      if (path.indexOf('.') !== -1) {
        keys = path.split('.');
        for (i = 0; i < keys.length; i++) {
          if (keys[i].indexOf('*') !== -1) keys[i] = keys[i].replace('*', '.');
          if (obj)
            if (_.has(obj, keys[i])) {
              if (i === (keys.length - 1)) return obj[keys[i]];
              else obj = obj[keys[i]];
              //error or could be global
            } else return null;
          else return null;
        }
        return obj;
      } else {
        return obj[path];
      }
    }
  }
  // http://bit.ly/1HWJu9o
  interpolate(obj, property) {
    if (!obj) return '';
    if (property.length === 0) return obj;

    var found = obj[property[0]];
    var remainder = property.slice(1);
    return this.interpolate(found, remainder);
  }
}

export
default (object) => {
  'use strict';
  return new Find(object);
};
