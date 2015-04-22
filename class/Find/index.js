'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

/* Find class */

var Find = (function () {
  function Find(object) {
    _classCallCheck(this, Find);

    this.object = object;
  }

  _createClass(Find, [{
    key: 'dot',
    value: function dot(path) {
      var obj = this.object;
      if (!obj || _import2['default'].isNull(obj) || _import2['default'].isNull(path) || !path) {
        return null;
      } else {
        var i, keys;
        if (path.indexOf('.') !== -1) {
          keys = path.split('.');
          for (i = 0; i < keys.length; i++) {
            if (keys[i].indexOf('*') !== -1) keys[i] = keys[i].replace('*', '.');
            if (obj) if (_import2['default'].has(obj, keys[i])) {
              if (i === keys.length - 1) {
                return obj[keys[i]];
              } else obj = obj[keys[i]];
              //error or could be global
            } else {
              return null;
            } else {
              return null;
            }
          }
          return obj;
        } else {
          return obj[path];
        }
      }
    }
  }, {
    key: 'template',
    value: function template() {}
  }]);

  return Find;
})();

exports['default'] = function (object) {
  'use strict';
  return new Find(object);
};

module.exports = exports['default'];

/*Find.prototype.template = function(obj) {
'use strict';
this.obj = obj || this.obj;
if (!obj) {
return '';
}
if (property.length === 0) {
return obj;
}
var found = obj[property[0]];
var remainder = property.slice(1);
return this.template(found, remainder);
};*/