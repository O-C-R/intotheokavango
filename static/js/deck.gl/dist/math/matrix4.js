'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getMatrix = getMatrix;

var _glMatrix = require('gl-matrix');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import {getVector} from './vector3';

function getVector() {
  throw new Error('not implemented');
}

function getMatrix(mat) {
  return mat.glmat ? mat.glmat : mat;
}

var Matrix4 = function () {
  function Matrix4() {
    var array = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

    _classCallCheck(this, Matrix4);

    this.array = array || _glMatrix.mat4.create();
    Object.seal(this);
  }

  _createClass(Matrix4, [{
    key: 'set',
    value: function set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
      _glMatrix.mat4.set(this.array, n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44);
      return this;
    }
  }, {
    key: 'copy',
    value: function copy(mat) {
      _glMatrix.mat4.copy(this.array, mat.array);
      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new Matrix4().copy(this);
    }

    // Constructors

  }, {
    key: 'identity',
    value: function identity() {
      _glMatrix.mat4.identity(this.array);
      return this;
    }
  }, {
    key: 'frustum',
    value: function frustum(_ref) {
      var left = _ref.left;
      var right = _ref.right;
      var bottom = _ref.bottom;
      var top = _ref.top;
      var near = _ref.near;
      var far = _ref.far;

      _glMatrix.mat4.frustum(this.array, left, right, bottom, top, near, far);
      return this;
    }

    // Accessors

  }, {
    key: 'determinant',
    value: function determinant() {
      return _glMatrix.mat4.determinant(this.array);
    }
  }, {
    key: 'getRotation',
    value: function getRotation() {}

    // Modifiers

  }, {
    key: 'transpose',
    value: function transpose() {
      _glMatrix.mat4.transpose(this.array, this.array);
      return this;
    }
  }, {
    key: 'invert',
    value: function invert() {
      _glMatrix.mat4.invert(this.array, this.array);
      return this;
    }
  }, {
    key: 'adjoint',
    value: function adjoint() {
      _glMatrix.mat4.adjoint(this.array, this.array);
      return this;
    }

    // static multiply(...matrices) {
    //   const result = new Mat4();
    //   for (const mat of matrices) {
    //     return mat4.multiply(result.array, mat.array);
    //   }
    //   return result;
    // }

  }, {
    key: 'translate',
    value: function translate(vec) {
      var glvec = getVector(vec);
      _glMatrix.mat4.adjoint(this.array, glvec);
      return this;
    }
  }, {
    key: 'transform',
    value: function transform(vector) {
      var glvec = getVector(vector);
      _glMatrix.vec3.transformMat4(glvec, glvec, this.glmat);
    }
  }]);

  return Matrix4;
}();

exports.default = Matrix4;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYXRoL21hdHJpeDQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O1FBT2dCLFMsR0FBQSxTOztBQVBoQjs7OztBQUNBOztBQUVBLFNBQVMsU0FBVCxHQUFxQjtBQUNuQixRQUFNLElBQUksS0FBSixDQUFVLGlCQUFWLENBQU47QUFDRDs7QUFFTSxTQUFTLFNBQVQsQ0FBbUIsR0FBbkIsRUFBd0I7QUFDN0IsU0FBTyxJQUFJLEtBQUosR0FBWSxJQUFJLEtBQWhCLEdBQXdCLEdBQS9CO0FBQ0Q7O0lBRW9CLE87QUFFbkIscUJBQTBCO0FBQUEsUUFBZCxLQUFjLHlEQUFOLElBQU07O0FBQUE7O0FBQ3hCLFNBQUssS0FBTCxHQUFhLFNBQVMsZUFBSyxNQUFMLEVBQXRCO0FBQ0EsV0FBTyxJQUFQLENBQVksSUFBWjtBQUNEOzs7O3dCQUdDLEcsRUFBSyxHLEVBQUssRyxFQUFLLEcsRUFDZixHLEVBQUssRyxFQUFLLEcsRUFBSyxHLEVBQ2YsRyxFQUFLLEcsRUFBSyxHLEVBQUssRyxFQUNmLEcsRUFBSyxHLEVBQUssRyxFQUFLLEcsRUFDZjtBQUNBLHFCQUFLLEdBQUwsQ0FDRSxLQUFLLEtBRFAsRUFFRSxHQUZGLEVBRU8sR0FGUCxFQUVZLEdBRlosRUFFaUIsR0FGakIsRUFHRSxHQUhGLEVBR08sR0FIUCxFQUdZLEdBSFosRUFHaUIsR0FIakIsRUFJRSxHQUpGLEVBSU8sR0FKUCxFQUlZLEdBSlosRUFJaUIsR0FKakIsRUFLRSxHQUxGLEVBS08sR0FMUCxFQUtZLEdBTFosRUFLaUIsR0FMakI7QUFPQSxhQUFPLElBQVA7QUFDRDs7O3lCQUVJLEcsRUFBSztBQUNSLHFCQUFLLElBQUwsQ0FBVSxLQUFLLEtBQWYsRUFBc0IsSUFBSSxLQUExQjtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7NEJBRU87QUFDTixhQUFPLElBQUksT0FBSixHQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBUDtBQUNEOztBQUVEOzs7OytCQUVXO0FBQ1QscUJBQUssUUFBTCxDQUFjLEtBQUssS0FBbkI7QUFDQSxhQUFPLElBQVA7QUFDRDs7O2tDQUU4QztBQUFBLFVBQXRDLElBQXNDLFFBQXRDLElBQXNDO0FBQUEsVUFBaEMsS0FBZ0MsUUFBaEMsS0FBZ0M7QUFBQSxVQUF6QixNQUF5QixRQUF6QixNQUF5QjtBQUFBLFVBQWpCLEdBQWlCLFFBQWpCLEdBQWlCO0FBQUEsVUFBWixJQUFZLFFBQVosSUFBWTtBQUFBLFVBQU4sR0FBTSxRQUFOLEdBQU07O0FBQzdDLHFCQUFLLE9BQUwsQ0FBYSxLQUFLLEtBQWxCLEVBQXlCLElBQXpCLEVBQStCLEtBQS9CLEVBQXNDLE1BQXRDLEVBQThDLEdBQTlDLEVBQW1ELElBQW5ELEVBQXlELEdBQXpEO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7a0NBRWM7QUFDWixhQUFPLGVBQUssV0FBTCxDQUFpQixLQUFLLEtBQXRCLENBQVA7QUFDRDs7O2tDQUVhLENBQ2I7O0FBRUQ7Ozs7Z0NBRVk7QUFDVixxQkFBSyxTQUFMLENBQWUsS0FBSyxLQUFwQixFQUEyQixLQUFLLEtBQWhDO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7Ozs2QkFFUTtBQUNQLHFCQUFLLE1BQUwsQ0FBWSxLQUFLLEtBQWpCLEVBQXdCLEtBQUssS0FBN0I7QUFDQSxhQUFPLElBQVA7QUFDRDs7OzhCQUVTO0FBQ1IscUJBQUssT0FBTCxDQUFhLEtBQUssS0FBbEIsRUFBeUIsS0FBSyxLQUE5QjtBQUNBLGFBQU8sSUFBUDtBQUNEOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OzhCQUVVLEcsRUFBSztBQUNiLFVBQU0sUUFBUSxVQUFVLEdBQVYsQ0FBZDtBQUNBLHFCQUFLLE9BQUwsQ0FBYSxLQUFLLEtBQWxCLEVBQXlCLEtBQXpCO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7Ozs4QkFFUyxNLEVBQVE7QUFDaEIsVUFBTSxRQUFRLFVBQVUsTUFBVixDQUFkO0FBQ0EscUJBQUssYUFBTCxDQUFtQixLQUFuQixFQUEwQixLQUExQixFQUFpQyxLQUFLLEtBQXRDO0FBQ0Q7Ozs7OztrQkF2RmtCLE8iLCJmaWxlIjoibWF0cml4NC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7bWF0NCwgdmVjM30gZnJvbSAnZ2wtbWF0cml4Jztcbi8vIGltcG9ydCB7Z2V0VmVjdG9yfSBmcm9tICcuL3ZlY3RvcjMnO1xuXG5mdW5jdGlvbiBnZXRWZWN0b3IoKSB7XG4gIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRyaXgobWF0KSB7XG4gIHJldHVybiBtYXQuZ2xtYXQgPyBtYXQuZ2xtYXQgOiBtYXQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdHJpeDQge1xuXG4gIGNvbnN0cnVjdG9yKGFycmF5ID0gbnVsbCkge1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheSB8fCBtYXQ0LmNyZWF0ZSgpO1xuICAgIE9iamVjdC5zZWFsKHRoaXMpO1xuICB9XG5cbiAgc2V0KFxuICAgIG4xMSwgbjEyLCBuMTMsIG4xNCxcbiAgICBuMjEsIG4yMiwgbjIzLCBuMjQsXG4gICAgbjMxLCBuMzIsIG4zMywgbjM0LFxuICAgIG40MSwgbjQyLCBuNDMsIG40NFxuICApIHtcbiAgICBtYXQ0LnNldChcbiAgICAgIHRoaXMuYXJyYXksXG4gICAgICBuMTEsIG4xMiwgbjEzLCBuMTQsXG4gICAgICBuMjEsIG4yMiwgbjIzLCBuMjQsXG4gICAgICBuMzEsIG4zMiwgbjMzLCBuMzQsXG4gICAgICBuNDEsIG40MiwgbjQzLCBuNDRcbiAgICApO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgY29weShtYXQpIHtcbiAgICBtYXQ0LmNvcHkodGhpcy5hcnJheSwgbWF0LmFycmF5KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgTWF0cml4NCgpLmNvcHkodGhpcyk7XG4gIH1cblxuICAvLyBDb25zdHJ1Y3RvcnNcblxuICBpZGVudGl0eSgpIHtcbiAgICBtYXQ0LmlkZW50aXR5KHRoaXMuYXJyYXkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZnJ1c3R1bSh7bGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXJ9KSB7XG4gICAgbWF0NC5mcnVzdHVtKHRoaXMuYXJyYXksIGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIEFjY2Vzc29yc1xuXG4gIGRldGVybWluYW50KCkge1xuICAgIHJldHVybiBtYXQ0LmRldGVybWluYW50KHRoaXMuYXJyYXkpO1xuICB9XG5cbiAgZ2V0Um90YXRpb24oKSB7XG4gIH1cblxuICAvLyBNb2RpZmllcnNcblxuICB0cmFuc3Bvc2UoKSB7XG4gICAgbWF0NC50cmFuc3Bvc2UodGhpcy5hcnJheSwgdGhpcy5hcnJheSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBpbnZlcnQoKSB7XG4gICAgbWF0NC5pbnZlcnQodGhpcy5hcnJheSwgdGhpcy5hcnJheSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGpvaW50KCkge1xuICAgIG1hdDQuYWRqb2ludCh0aGlzLmFycmF5LCB0aGlzLmFycmF5KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHN0YXRpYyBtdWx0aXBseSguLi5tYXRyaWNlcykge1xuICAvLyAgIGNvbnN0IHJlc3VsdCA9IG5ldyBNYXQ0KCk7XG4gIC8vICAgZm9yIChjb25zdCBtYXQgb2YgbWF0cmljZXMpIHtcbiAgLy8gICAgIHJldHVybiBtYXQ0Lm11bHRpcGx5KHJlc3VsdC5hcnJheSwgbWF0LmFycmF5KTtcbiAgLy8gICB9XG4gIC8vICAgcmV0dXJuIHJlc3VsdDtcbiAgLy8gfVxuXG4gIHRyYW5zbGF0ZSh2ZWMpIHtcbiAgICBjb25zdCBnbHZlYyA9IGdldFZlY3Rvcih2ZWMpO1xuICAgIG1hdDQuYWRqb2ludCh0aGlzLmFycmF5LCBnbHZlYyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB0cmFuc2Zvcm0odmVjdG9yKSB7XG4gICAgY29uc3QgZ2x2ZWMgPSBnZXRWZWN0b3IodmVjdG9yKTtcbiAgICB2ZWMzLnRyYW5zZm9ybU1hdDQoZ2x2ZWMsIGdsdmVjLCB0aGlzLmdsbWF0KTtcbiAgfVxufVxuIl19