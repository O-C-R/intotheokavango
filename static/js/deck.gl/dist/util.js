'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.addIterator = addIterator;
exports.areEqualShallow = areEqualShallow;

var _marked = [valueIterator].map(regeneratorRuntime.mark);

// Enable classic JavaScript object maps to be used as data

function addIterator(object) {
  if (isPlainObject(object) && !object[Symbol.iterator]) {
    object[Symbol.iterator] = function iterator() {
      return valueIterator(this);
    };
  }
}

function valueIterator(obj) {
  var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key;

  return regeneratorRuntime.wrap(function valueIterator$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 3;
          _iterator = Object.keys(obj)[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 13;
            break;
          }

          key = _step.value;

          if (!(obj.hasOwnProperty(key) && key !== Symbol.iterator)) {
            _context.next = 10;
            break;
          }

          _context.next = 10;
          return obj[key];

        case 10:
          _iteratorNormalCompletion = true;
          _context.next = 5;
          break;

        case 13:
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context['catch'](3);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 19:
          _context.prev = 19;
          _context.prev = 20;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 22:
          _context.prev = 22;

          if (!_didIteratorError) {
            _context.next = 25;
            break;
          }

          throw _iteratorError;

        case 25:
          return _context.finish(22);

        case 26:
          return _context.finish(19);

        case 27:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this, [[3, 15, 19, 27], [20,, 22, 26]]);
}

function isPlainObject(o) {
  return o !== null && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && o.constructor === Object;
}

// Shallow compare
/* eslint-disable complexity */
function areEqualShallow(a, b) {
  var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var _ref$ignore = _ref.ignore;
  var ignore = _ref$ignore === undefined ? {} : _ref$ignore;


  if (a === b) {
    return true;
  }

  if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) !== 'object' || a === null || (typeof b === 'undefined' ? 'undefined' : _typeof(b)) !== 'object' || b === null) {
    return false;
  }

  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (var key in a) {
    if (!(key in ignore) && (!(key in b) || a[key] !== b[key])) {
      return false;
    }
  }
  for (var _key in b) {
    if (!(_key in ignore) && !(_key in a)) {
      return false;
    }
  }
  return true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O1FBRWdCLFcsR0FBQSxXO1FBc0JBLGUsR0FBQSxlOztlQWROLGE7O0FBVlY7O0FBRU8sU0FBUyxXQUFULENBQXFCLE1BQXJCLEVBQTZCO0FBQ2xDLE1BQUksY0FBYyxNQUFkLEtBQXlCLENBQUMsT0FBTyxPQUFPLFFBQWQsQ0FBOUIsRUFBdUQ7QUFDckQsV0FBTyxPQUFPLFFBQWQsSUFBMEIsU0FBUyxRQUFULEdBQW9CO0FBQzVDLGFBQU8sY0FBYyxJQUFkLENBQVA7QUFDRCxLQUZEO0FBR0Q7QUFDRjs7QUFFRCxTQUFVLGFBQVYsQ0FBd0IsR0FBeEI7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBQ29CLE9BQU8sSUFBUCxDQUFZLEdBQVosQ0FEcEI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFDYSxhQURiOztBQUFBLGdCQUVRLElBQUksY0FBSixDQUFtQixHQUFuQixLQUEyQixRQUFRLE9BQU8sUUFGbEQ7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxpQkFHWSxJQUFJLEdBQUosQ0FIWjs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVFBLFNBQVMsYUFBVCxDQUF1QixDQUF2QixFQUEwQjtBQUN4QixTQUFPLE1BQU0sSUFBTixJQUFjLFFBQU8sQ0FBUCx5Q0FBTyxDQUFQLE9BQWEsUUFBM0IsSUFBdUMsRUFBRSxXQUFGLEtBQWtCLE1BQWhFO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNPLFNBQVMsZUFBVCxDQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUFtRDtBQUFBLG1FQUFKLEVBQUk7O0FBQUEseUJBQW5CLE1BQW1CO0FBQUEsTUFBbkIsTUFBbUIsK0JBQVYsRUFBVTs7O0FBRXhELE1BQUksTUFBTSxDQUFWLEVBQWE7QUFDWCxXQUFPLElBQVA7QUFDRDs7QUFFRCxNQUFJLFFBQU8sQ0FBUCx5Q0FBTyxDQUFQLE9BQWEsUUFBYixJQUF5QixNQUFNLElBQS9CLElBQ0YsUUFBTyxDQUFQLHlDQUFPLENBQVAsT0FBYSxRQURYLElBQ3VCLE1BQU0sSUFEakMsRUFDdUM7QUFDckMsV0FBTyxLQUFQO0FBQ0Q7O0FBRUQsTUFBSSxPQUFPLElBQVAsQ0FBWSxDQUFaLEVBQWUsTUFBZixLQUEwQixPQUFPLElBQVAsQ0FBWSxDQUFaLEVBQWUsTUFBN0MsRUFBcUQ7QUFDbkQsV0FBTyxLQUFQO0FBQ0Q7O0FBRUQsT0FBSyxJQUFNLEdBQVgsSUFBa0IsQ0FBbEIsRUFBcUI7QUFDbkIsUUFBSSxFQUFFLE9BQU8sTUFBVCxNQUFxQixFQUFFLE9BQU8sQ0FBVCxLQUFlLEVBQUUsR0FBRixNQUFXLEVBQUUsR0FBRixDQUEvQyxDQUFKLEVBQTREO0FBQzFELGFBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFDRCxPQUFLLElBQU0sSUFBWCxJQUFrQixDQUFsQixFQUFxQjtBQUNuQixRQUFJLEVBQUUsUUFBTyxNQUFULEtBQXFCLEVBQUUsUUFBTyxDQUFULENBQXpCLEVBQXVDO0FBQ3JDLGFBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFDRCxTQUFPLElBQVA7QUFDRCIsImZpbGUiOiJ1dGlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRW5hYmxlIGNsYXNzaWMgSmF2YVNjcmlwdCBvYmplY3QgbWFwcyB0byBiZSB1c2VkIGFzIGRhdGFcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEl0ZXJhdG9yKG9iamVjdCkge1xuICBpZiAoaXNQbGFpbk9iamVjdChvYmplY3QpICYmICFvYmplY3RbU3ltYm9sLml0ZXJhdG9yXSkge1xuICAgIG9iamVjdFtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gaXRlcmF0b3IoKSB7XG4gICAgICByZXR1cm4gdmFsdWVJdGVyYXRvcih0aGlzKTtcbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uKiB2YWx1ZUl0ZXJhdG9yKG9iaikge1xuICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhvYmopKSB7XG4gICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGtleSAhPT0gU3ltYm9sLml0ZXJhdG9yKSB7XG4gICAgICB5aWVsZCBvYmpba2V5XTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvKSB7XG4gIHJldHVybiBvICE9PSBudWxsICYmIHR5cGVvZiBvID09PSAnb2JqZWN0JyAmJiBvLmNvbnN0cnVjdG9yID09PSBPYmplY3Q7XG59XG5cbi8vIFNoYWxsb3cgY29tcGFyZVxuLyogZXNsaW50LWRpc2FibGUgY29tcGxleGl0eSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFyZUVxdWFsU2hhbGxvdyhhLCBiLCB7aWdub3JlID0ge319ID0ge30pIHtcblxuICBpZiAoYSA9PT0gYikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBhICE9PSAnb2JqZWN0JyB8fCBhID09PSBudWxsIHx8XG4gICAgdHlwZW9mIGIgIT09ICdvYmplY3QnIHx8IGIgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoT2JqZWN0LmtleXMoYSkubGVuZ3RoICE9PSBPYmplY3Qua2V5cyhiKS5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmb3IgKGNvbnN0IGtleSBpbiBhKSB7XG4gICAgaWYgKCEoa2V5IGluIGlnbm9yZSkgJiYgKCEoa2V5IGluIGIpIHx8IGFba2V5XSAhPT0gYltrZXldKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICBmb3IgKGNvbnN0IGtleSBpbiBiKSB7XG4gICAgaWYgKCEoa2V5IGluIGlnbm9yZSkgJiYgKCEoa2V5IGluIGEpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cbiJdfQ==