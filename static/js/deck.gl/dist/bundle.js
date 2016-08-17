'use strict';

require('babel-polyfill');

var _index = require('./index');

var DeckGL = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* Generate script that can be used in browser without browserify */

/* global window */
(function exposeAsGlobal() {
  if (typeof window !== 'undefined') {
    window.DeckGL = DeckGL;
  }
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9idW5kbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQTs7QUFDQTs7SUFBWSxNOzs7O0FBSlo7O0FBRUE7QUFJQyxVQUFTLGNBQVQsR0FBMEI7QUFDekIsTUFBSSxPQUFPLE1BQVAsS0FBa0IsV0FBdEIsRUFBbUM7QUFDakMsV0FBTyxNQUFQLEdBQWdCLE1BQWhCO0FBQ0Q7QUFDRixDQUpBLEdBQUQiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogR2VuZXJhdGUgc2NyaXB0IHRoYXQgY2FuIGJlIHVzZWQgaW4gYnJvd3NlciB3aXRob3V0IGJyb3dzZXJpZnkgKi9cblxuLyogZ2xvYmFsIHdpbmRvdyAqL1xuaW1wb3J0ICdiYWJlbC1wb2x5ZmlsbCc7XG5pbXBvcnQgKiBhcyBEZWNrR0wgZnJvbSAnLi9pbmRleCc7XG5cbihmdW5jdGlvbiBleHBvc2VBc0dsb2JhbCgpIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgd2luZG93LkRlY2tHTCA9IERlY2tHTDtcbiAgfVxufSgpKTtcbiJdfQ==