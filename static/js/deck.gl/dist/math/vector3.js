'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getVector = getVector;

var _glMatrix = require('gl-matrix');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getVector(vec) {
  return vec.glvec ? vec.glvec : vec;
}

var Vector3 = function () {
  // Creates a new, empty vec3
  function Vector3(glvec3) {
    _classCallCheck(this, Vector3);

    this.glvec3 = glvec3 || _glMatrix.vec3.create();
  }

  _createClass(Vector3, [{
    key: 'set',
    value: function set(x, y, z) {
      _glMatrix.vec3.set(this.glvec3, x, y, z);
      return this;
    }
  }, {
    key: 'copy',
    value: function copy(vector) {
      _glMatrix.vec3.copy(this.glvec3, getVector(vector));
      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new Vector3(_glMatrix.vec3.clone(this.glvec3));
    }
  }, {
    key: 'toString',
    value: function toString() {
      return _glMatrix.vec3.str(this.glvec3);
    }
  }, {
    key: 'toArray',
    value: function toArray() {
      return this.glvec;
    }
  }, {
    key: 'toFloat32Array',
    value: function toFloat32Array() {
      return this.glvec;
    }
  }, {
    key: 'equals',
    value: function equals(vector) {
      return _glMatrix.vec3.equals(getVector(vector));
    }
  }, {
    key: 'exactEquals',
    value: function exactEquals(vector) {
      return _glMatrix.vec3.exactEquals(getVector(vector));
    }

    // Getters/setters

  }, {
    key: 'distance',
    value: function distance(vector) {
      return _glMatrix.vec3.distance(getVector(vector));
    }
  }, {
    key: 'dist',
    value: function dist(vector) {
      return _glMatrix.vec3.dist(getVector(vector));
    }
  }, {
    key: 'angle',
    value: function angle(vector) {
      return _glMatrix.vec3.angle(getVector(vector));
    }
  }, {
    key: 'add',
    value: function add() {
      for (var _len = arguments.length, vectors = Array(_len), _key = 0; _key < _len; _key++) {
        vectors[_key] = arguments[_key];
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = vectors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var vector = _step.value;

          _glMatrix.vec3.add(this.glvec3, getVector(vector));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return this;
    }
  }, {
    key: 'subtract',
    value: function subtract() {
      for (var _len2 = arguments.length, vectors = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        vectors[_key2] = arguments[_key2];
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = vectors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var vector = _step2.value;

          _glMatrix.vec3.subtract(this.glvec3, getVector(vector));
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return this;
    }
  }, {
    key: 'sub',
    value: function sub() {
      for (var _len3 = arguments.length, vectors = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        vectors[_key3] = arguments[_key3];
      }

      return this.subtract(vectors);
    }
  }, {
    key: 'multiply',
    value: function multiply() {
      for (var _len4 = arguments.length, vectors = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        vectors[_key4] = arguments[_key4];
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = vectors[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var vector = _step3.value;

          _glMatrix.vec3.multiply(this.glvec3, getVector(vector));
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return this;
    }
  }, {
    key: 'divide',
    value: function divide() {
      for (var _len5 = arguments.length, vectors = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        vectors[_key5] = arguments[_key5];
      }

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = vectors[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var vector = _step4.value;

          _glMatrix.vec3.divide(this.glvec3, getVector(vector));
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return this;
    }
  }, {
    key: 'ceil',
    value: function ceil() {
      _glMatrix.vec3.ceil(this.glvec3, this.glvec3);
      return this;
    }
  }, {
    key: 'floor',
    value: function floor() {
      _glMatrix.vec3.floor(this.glvec3, this.glvec3);
      return this;
    }
  }, {
    key: 'min',
    value: function min() {
      _glMatrix.vec3.min(this.glvec3, this.glvec3);
      return this;
    }
  }, {
    key: 'max',
    value: function max() {
      _glMatrix.vec3.max(this.glvec3, this.glvec3);
      return this;
    }
  }, {
    key: 'scale',
    value: function scale(_scale) {
      _glMatrix.vec3.scale(this.glvec3, this.glvec3, _scale);
      return this;
    }
  }, {
    key: 'scaleAndAdd',
    value: function scaleAndAdd(vector, scale) {
      _glMatrix.vec3.scaleAndAdd(this.glvec3, this.glvec3, getVector(vector), scale);
      return this;
    }
  }, {
    key: 'negate',
    value: function negate() {
      _glMatrix.vec3.negate(this.glvec3, this.glvec3);
      return this;
    }
  }, {
    key: 'inverse',
    value: function inverse() {
      _glMatrix.vec3.inverse(this.glvec3, this.glvec3);
      return this;
    }
  }, {
    key: 'normalize',
    value: function normalize() {
      _glMatrix.vec3.normalize(this.glvec3, this.glvec3);
      return this;
    }
  }, {
    key: 'dot',
    value: function dot(scale) {
      _glMatrix.vec3.dot(this.glvec3, this.glvec3, scale);
      return this;
    }
  }, {
    key: 'cross',
    value: function cross(scale) {
      _glMatrix.vec3.cross(this.glvec3, this.glvec3, scale);
      return this;
    }
  }, {
    key: 'lerp',
    value: function lerp(scale) {
      _glMatrix.vec3.lerp(this.glvec3, this.glvec3, scale);
      return this;
    }
  }, {
    key: 'hermite',
    value: function hermite(scale) {
      _glMatrix.vec3.hermite(this.glvec3, this.glvec3, scale);
      return this;
    }
  }, {
    key: 'bezier',
    value: function bezier(scale) {
      _glMatrix.vec3.bezier(this.glvec3, this.glvec3, scale);
      return this;
    }
  }, {
    key: 'random',
    value: function random(scale) {
      _glMatrix.vec3.cross(this.glvec3, this.glvec3, scale);
      return this;
    }
  }, {
    key: 'rotateX',
    value: function rotateX(origin, angle) {
      _glMatrix.vec3.rotateX(this.glvec3, this.glvec3, getVector(origin), angle);
    }
  }, {
    key: 'rotateY',
    value: function rotateY(origin, angle) {
      _glMatrix.vec3.rotateY(this.glvec3, this.glvec3, getVector(origin), angle);
    }
  }, {
    key: 'rotateZ',
    value: function rotateZ(origin, angle) {
      _glMatrix.vec3.rotateZ(this.glvec3, this.glvec3, getVector(origin), angle);
    }
  }, {
    key: 'x',
    get: function get() {
      return this.glvec[0];
    },
    set: function set(value) {
      this.glvec[0] = value;
      return this;
    }
  }, {
    key: 'y',
    get: function get() {
      return this.glvec[1];
    },
    set: function set(value) {
      this.glvec[1] = value;
      return this;
    }
  }, {
    key: 'z',
    get: function get() {
      return this.glvec[2];
    },
    set: function set(value) {
      this.glvec[2] = value;
      return this;
    }
  }]);

  return Vector3;
}();

exports.default = Vector3;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYXRoL3ZlY3RvcjMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O1FBRWdCLFMsR0FBQSxTOztBQUZoQjs7OztBQUVPLFNBQVMsU0FBVCxDQUFtQixHQUFuQixFQUF3QjtBQUM3QixTQUFPLElBQUksS0FBSixHQUFZLElBQUksS0FBaEIsR0FBd0IsR0FBL0I7QUFDRDs7SUFFb0IsTztBQUNuQjtBQUNBLG1CQUFZLE1BQVosRUFBb0I7QUFBQTs7QUFDbEIsU0FBSyxNQUFMLEdBQWMsVUFBVSxlQUFLLE1BQUwsRUFBeEI7QUFDRDs7Ozt3QkFFRyxDLEVBQUcsQyxFQUFHLEMsRUFBRztBQUNYLHFCQUFLLEdBQUwsQ0FBUyxLQUFLLE1BQWQsRUFBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUI7QUFDQSxhQUFPLElBQVA7QUFDRDs7O3lCQUVJLE0sRUFBUTtBQUNYLHFCQUFLLElBQUwsQ0FBVSxLQUFLLE1BQWYsRUFBdUIsVUFBVSxNQUFWLENBQXZCO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7Ozs0QkFFTztBQUNOLGFBQU8sSUFBSSxPQUFKLENBQVksZUFBSyxLQUFMLENBQVcsS0FBSyxNQUFoQixDQUFaLENBQVA7QUFDRDs7OytCQUVVO0FBQ1QsYUFBTyxlQUFLLEdBQUwsQ0FBUyxLQUFLLE1BQWQsQ0FBUDtBQUNEOzs7OEJBRVM7QUFDUixhQUFPLEtBQUssS0FBWjtBQUNEOzs7cUNBRWdCO0FBQ2YsYUFBTyxLQUFLLEtBQVo7QUFDRDs7OzJCQUVNLE0sRUFBUTtBQUNiLGFBQU8sZUFBSyxNQUFMLENBQVksVUFBVSxNQUFWLENBQVosQ0FBUDtBQUNEOzs7Z0NBRVcsTSxFQUFRO0FBQ2xCLGFBQU8sZUFBSyxXQUFMLENBQWlCLFVBQVUsTUFBVixDQUFqQixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7NkJBNEJTLE0sRUFBUTtBQUNmLGFBQU8sZUFBSyxRQUFMLENBQWMsVUFBVSxNQUFWLENBQWQsQ0FBUDtBQUNEOzs7eUJBRUks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QUNyQixxQkFBSyxPQUFMLENBQWEsS0FBSyxNQUFsQixFQUEwQixLQUFLLE1BQS9CLEVBQXVDLFVBQVUsTUFBVixDQUF2QyxFQUEwRCxLQUExRDtBQUNEOzs7NEJBRU8sTSxFQUFRLEssRUFBTztBQUNyQixxQkFBSyxPQUFMLENBQWEsS0FBSyxNQUFsQixFQUEwQixLQUFLLE1BQS9CLEVBQXVDLFVBQVUsTUFBVixDQUF2QyxFQUEwRCxLQUExRDtBQUNEOzs7d0JBNUpPO0FBQ04sYUFBTyxLQUFLLEtBQUwsQ0FBVyxDQUFYLENBQVA7QUFDRCxLO3NCQUVLLEssRUFBTztBQUNYLFdBQUssS0FBTCxDQUFXLENBQVgsSUFBZ0IsS0FBaEI7QUFDQSxhQUFPLElBQVA7QUFDRDs7O3dCQUVPO0FBQ04sYUFBTyxLQUFLLEtBQUwsQ0FBVyxDQUFYLENBQVA7QUFDRCxLO3NCQUVLLEssRUFBTztBQUNYLFdBQUssS0FBTCxDQUFXLENBQVgsSUFBZ0IsS0FBaEI7QUFDQSxhQUFPLElBQVA7QUFDRDs7O3dCQUVPO0FBQ04sYUFBTyxLQUFLLEtBQUwsQ0FBVyxDQUFYLENBQVA7QUFDRCxLO3NCQUVLLEssRUFBTztBQUNYLFdBQUssS0FBTCxDQUFXLENBQVgsSUFBZ0IsS0FBaEI7QUFDQSxhQUFPLElBQVA7QUFDRDs7Ozs7O2tCQWxFa0IsTyIsImZpbGUiOiJ2ZWN0b3IzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHt2ZWMzfSBmcm9tICdnbC1tYXRyaXgnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmVjdG9yKHZlYykge1xuICByZXR1cm4gdmVjLmdsdmVjID8gdmVjLmdsdmVjIDogdmVjO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWZWN0b3IzIHtcbiAgLy8gQ3JlYXRlcyBhIG5ldywgZW1wdHkgdmVjM1xuICBjb25zdHJ1Y3RvcihnbHZlYzMpIHtcbiAgICB0aGlzLmdsdmVjMyA9IGdsdmVjMyB8fCB2ZWMzLmNyZWF0ZSgpO1xuICB9XG5cbiAgc2V0KHgsIHksIHopIHtcbiAgICB2ZWMzLnNldCh0aGlzLmdsdmVjMywgeCwgeSwgeik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjb3B5KHZlY3Rvcikge1xuICAgIHZlYzMuY29weSh0aGlzLmdsdmVjMywgZ2V0VmVjdG9yKHZlY3RvcikpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IzKHZlYzMuY2xvbmUodGhpcy5nbHZlYzMpKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB2ZWMzLnN0cih0aGlzLmdsdmVjMyk7XG4gIH1cblxuICB0b0FycmF5KCkge1xuICAgIHJldHVybiB0aGlzLmdsdmVjO1xuICB9XG5cbiAgdG9GbG9hdDMyQXJyYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2x2ZWM7XG4gIH1cblxuICBlcXVhbHModmVjdG9yKSB7XG4gICAgcmV0dXJuIHZlYzMuZXF1YWxzKGdldFZlY3Rvcih2ZWN0b3IpKTtcbiAgfVxuXG4gIGV4YWN0RXF1YWxzKHZlY3Rvcikge1xuICAgIHJldHVybiB2ZWMzLmV4YWN0RXF1YWxzKGdldFZlY3Rvcih2ZWN0b3IpKTtcbiAgfVxuXG4gIC8vIEdldHRlcnMvc2V0dGVyc1xuICBnZXQgeCgpIHtcbiAgICByZXR1cm4gdGhpcy5nbHZlY1swXTtcbiAgfVxuXG4gIHNldCB4KHZhbHVlKSB7XG4gICAgdGhpcy5nbHZlY1swXSA9IHZhbHVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZ2V0IHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2x2ZWNbMV07XG4gIH1cblxuICBzZXQgeSh2YWx1ZSkge1xuICAgIHRoaXMuZ2x2ZWNbMV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGdldCB6KCkge1xuICAgIHJldHVybiB0aGlzLmdsdmVjWzJdO1xuICB9XG5cbiAgc2V0IHoodmFsdWUpIHtcbiAgICB0aGlzLmdsdmVjWzJdID0gdmFsdWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBkaXN0YW5jZSh2ZWN0b3IpIHtcbiAgICByZXR1cm4gdmVjMy5kaXN0YW5jZShnZXRWZWN0b3IodmVjdG9yKSk7XG4gIH1cblxuICBkaXN0KHZlY3Rvcikge1xuICAgIHJldHVybiB2ZWMzLmRpc3QoZ2V0VmVjdG9yKHZlY3RvcikpO1xuICB9XG5cbiAgYW5nbGUodmVjdG9yKSB7XG4gICAgcmV0dXJuIHZlYzMuYW5nbGUoZ2V0VmVjdG9yKHZlY3RvcikpO1xuICB9XG5cbiAgYWRkKC4uLnZlY3RvcnMpIHtcbiAgICBmb3IgKGNvbnN0IHZlY3RvciBvZiB2ZWN0b3JzKSB7XG4gICAgICB2ZWMzLmFkZCh0aGlzLmdsdmVjMywgZ2V0VmVjdG9yKHZlY3RvcikpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHN1YnRyYWN0KC4uLnZlY3RvcnMpIHtcbiAgICBmb3IgKGNvbnN0IHZlY3RvciBvZiB2ZWN0b3JzKSB7XG4gICAgICB2ZWMzLnN1YnRyYWN0KHRoaXMuZ2x2ZWMzLCBnZXRWZWN0b3IodmVjdG9yKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3ViKC4uLnZlY3RvcnMpIHtcbiAgICByZXR1cm4gdGhpcy5zdWJ0cmFjdCh2ZWN0b3JzKTtcbiAgfVxuXG4gIG11bHRpcGx5KC4uLnZlY3RvcnMpIHtcbiAgICBmb3IgKGNvbnN0IHZlY3RvciBvZiB2ZWN0b3JzKSB7XG4gICAgICB2ZWMzLm11bHRpcGx5KHRoaXMuZ2x2ZWMzLCBnZXRWZWN0b3IodmVjdG9yKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZGl2aWRlKC4uLnZlY3RvcnMpIHtcbiAgICBmb3IgKGNvbnN0IHZlY3RvciBvZiB2ZWN0b3JzKSB7XG4gICAgICB2ZWMzLmRpdmlkZSh0aGlzLmdsdmVjMywgZ2V0VmVjdG9yKHZlY3RvcikpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNlaWwoKSB7XG4gICAgdmVjMy5jZWlsKHRoaXMuZ2x2ZWMzLCB0aGlzLmdsdmVjMyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBmbG9vcigpIHtcbiAgICB2ZWMzLmZsb29yKHRoaXMuZ2x2ZWMzLCB0aGlzLmdsdmVjMyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBtaW4oKSB7XG4gICAgdmVjMy5taW4odGhpcy5nbHZlYzMsIHRoaXMuZ2x2ZWMzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG1heCgpIHtcbiAgICB2ZWMzLm1heCh0aGlzLmdsdmVjMywgdGhpcy5nbHZlYzMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2NhbGUoc2NhbGUpIHtcbiAgICB2ZWMzLnNjYWxlKHRoaXMuZ2x2ZWMzLCB0aGlzLmdsdmVjMywgc2NhbGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2NhbGVBbmRBZGQodmVjdG9yLCBzY2FsZSkge1xuICAgIHZlYzMuc2NhbGVBbmRBZGQodGhpcy5nbHZlYzMsIHRoaXMuZ2x2ZWMzLCBnZXRWZWN0b3IodmVjdG9yKSwgc2NhbGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbmVnYXRlKCkge1xuICAgIHZlYzMubmVnYXRlKHRoaXMuZ2x2ZWMzLCB0aGlzLmdsdmVjMyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBpbnZlcnNlKCkge1xuICAgIHZlYzMuaW52ZXJzZSh0aGlzLmdsdmVjMywgdGhpcy5nbHZlYzMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbm9ybWFsaXplKCkge1xuICAgIHZlYzMubm9ybWFsaXplKHRoaXMuZ2x2ZWMzLCB0aGlzLmdsdmVjMyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBkb3Qoc2NhbGUpIHtcbiAgICB2ZWMzLmRvdCh0aGlzLmdsdmVjMywgdGhpcy5nbHZlYzMsIHNjYWxlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNyb3NzKHNjYWxlKSB7XG4gICAgdmVjMy5jcm9zcyh0aGlzLmdsdmVjMywgdGhpcy5nbHZlYzMsIHNjYWxlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxlcnAoc2NhbGUpIHtcbiAgICB2ZWMzLmxlcnAodGhpcy5nbHZlYzMsIHRoaXMuZ2x2ZWMzLCBzY2FsZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBoZXJtaXRlKHNjYWxlKSB7XG4gICAgdmVjMy5oZXJtaXRlKHRoaXMuZ2x2ZWMzLCB0aGlzLmdsdmVjMywgc2NhbGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYmV6aWVyKHNjYWxlKSB7XG4gICAgdmVjMy5iZXppZXIodGhpcy5nbHZlYzMsIHRoaXMuZ2x2ZWMzLCBzY2FsZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByYW5kb20oc2NhbGUpIHtcbiAgICB2ZWMzLmNyb3NzKHRoaXMuZ2x2ZWMzLCB0aGlzLmdsdmVjMywgc2NhbGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcm90YXRlWChvcmlnaW4sIGFuZ2xlKSB7XG4gICAgdmVjMy5yb3RhdGVYKHRoaXMuZ2x2ZWMzLCB0aGlzLmdsdmVjMywgZ2V0VmVjdG9yKG9yaWdpbiksIGFuZ2xlKTtcbiAgfVxuXG4gIHJvdGF0ZVkob3JpZ2luLCBhbmdsZSkge1xuICAgIHZlYzMucm90YXRlWSh0aGlzLmdsdmVjMywgdGhpcy5nbHZlYzMsIGdldFZlY3RvcihvcmlnaW4pLCBhbmdsZSk7XG4gIH1cblxuICByb3RhdGVaKG9yaWdpbiwgYW5nbGUpIHtcbiAgICB2ZWMzLnJvdGF0ZVoodGhpcy5nbHZlYzMsIHRoaXMuZ2x2ZWMzLCBnZXRWZWN0b3Iob3JpZ2luKSwgYW5nbGUpO1xuICB9XG5cbn1cbiJdfQ==