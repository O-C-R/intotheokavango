'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _layer = require('../layer');

var _layer2 = _interopRequireDefault(_layer);

var _luma = require('luma.gl');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable max-statements, no-var */
/* eslint-disable array-bracket-spacing, no-multi-spaces */

var VERTEX_SHADER = '\nattribute vec3 positions;\nattribute vec4 colors;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  gl_Position = uPMatrix * uMVMatrix * vec4(positions, 1.0);\n  vColor = colors;\n}\n';

var FRAGMENT_SHADER = '\n#ifdef GL_ES\nprecision highp float;\n#endif\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  gl_FragColor = vColor;\n}\n';

var TestLayer = function (_Layer) {
  _inherits(TestLayer, _Layer);

  /*
   * @classdesc
   * TestLayer
   *
   * @class
   * @param {object} props
   * @param {number} props.radius - point radius
   */
  function TestLayer(_ref) {
    var _ref$rTri = _ref.rTri;
    var rTri = _ref$rTri === undefined ? 0.0 : _ref$rTri;
    var _ref$rSquare = _ref.rSquare;
    var rSquare = _ref$rSquare === undefined ? 0.0 : _ref$rSquare;

    var props = _objectWithoutProperties(_ref, ['rTri', 'rSquare']);

    _classCallCheck(this, TestLayer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TestLayer).call(this, _extends({
      rTri: rTri,
      rSquare: rSquare
    }, props)));
  }

  _createClass(TestLayer, [{
    key: 'initializeState',
    value: function initializeState() {
      var gl = this.state.gl;


      this.setState({
        model: this.getModel(gl)
      });
    }
  }, {
    key: 'didMount',
    value: function didMount() {
      this.updateUniforms();
    }
  }, {
    key: 'willReceiveProps',
    value: function willReceiveProps(oldProps, newProps) {
      _get(Object.getPrototypeOf(TestLayer.prototype), 'willReceiveProps', this).call(this, oldProps, newProps);
      this.updateUniforms();
    }
  }, {
    key: 'getModel',
    value: function getModel(gl) {
      var triangleGeometry = new _luma.Geometry({
        positions: new Float32Array([0, 1, 0, -1, -1, 0, 1, -1, 0]),
        colors: {
          value: new Float32Array([1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1]),
          size: 4
        }
      });

      var squareGeometry = new _luma.Geometry({
        positions: new Float32Array([1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0]),
        colors: {
          value: new Float32Array([0.5, 0.5, 1, 1, 0.5, 0.5, 1, 1, 0.5, 0.5, 1, 1, 0.5, 0.5, 1, 1]),
          size: 4
        }
      });

      var program = new _luma.Program(gl, {
        vs: VERTEX_SHADER,
        fs: FRAGMENT_SHADER
      });

      var triangle = new _luma.Model({
        geometry: triangleGeometry,
        program: program
      });

      var square = new _luma.Model({
        geometry: squareGeometry,
        program: program
      });

      return triangle;
    }
  }, {
    key: 'updateUniforms',
    value: function updateUniforms() {
      var camera = new _luma.PerspectiveCamera({
        aspect: this.props.width / this.props.height
      });

      var model = this.state.model;

      // get new view matrix out of element and camera matrices

      var view = new _luma.Mat4();
      view.mulMat42(camera.view, model.matrix);

      this.setUniforms({
        uMVMatrix: view,
        uPMatrix: camera.projection
      });
    }
  }]);

  return TestLayer;
}(_layer2.default);

/*
export function app() {

  function animate() {
    rTri += 0.01;
    rSquare += 0.1;
  }

  function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw triangle
    triangle
      .setPosition(new Vec3(-1.5, 0, -7))
      .setRotation(new Vec3(0, rTri, 0))
      .updateMatrix();
    setupModel(triangle);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Draw Square
    square
      .setPosition(new Vec3(1.5, 0, -7))
      .setRotation(new Vec3(rSquare, 0, 0))
      .updateMatrix();
    setupModel(square);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function tick() {
    drawScene();
    animate();
    Fx.requestAnimationFrame(tick);
  }

  tick();
};
*/


exports.default = TestLayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0LWxheWVycy90cmlhbmdsZS1sYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBR0E7Ozs7QUFDQTs7Ozs7Ozs7OzsrZUFKQTtBQUNBOztBQUtBLElBQU0sNFBBQU47O0FBZUEsSUFBTSw4SUFBTjs7SUFZcUIsUzs7O0FBRW5COzs7Ozs7OztBQVFBLDJCQUlHO0FBQUEseUJBSEQsSUFHQztBQUFBLFFBSEQsSUFHQyw2QkFITSxHQUdOO0FBQUEsNEJBRkQsT0FFQztBQUFBLFFBRkQsT0FFQyxnQ0FGUyxHQUVUOztBQUFBLFFBREUsS0FDRjs7QUFBQTs7QUFBQTtBQUVDLGdCQUZEO0FBR0M7QUFIRCxPQUlJLEtBSko7QUFNRjs7OztzQ0FFaUI7QUFBQSxVQUNULEVBRFMsR0FDSCxLQUFLLEtBREYsQ0FDVCxFQURTOzs7QUFHaEIsV0FBSyxRQUFMLENBQWM7QUFDWixlQUFPLEtBQUssUUFBTCxDQUFjLEVBQWQ7QUFESyxPQUFkO0FBR0Q7OzsrQkFFVTtBQUNULFdBQUssY0FBTDtBQUNEOzs7cUNBRWdCLFEsRUFBVSxRLEVBQVU7QUFDbkMsNEZBQXVCLFFBQXZCLEVBQWlDLFFBQWpDO0FBQ0EsV0FBSyxjQUFMO0FBQ0Q7Ozs2QkFFUSxFLEVBQUk7QUFDWCxVQUFJLG1CQUFtQixtQkFBYTtBQUNsQyxtQkFBVyxJQUFJLFlBQUosQ0FBaUIsQ0FDMUIsQ0FEMEIsRUFDckIsQ0FEcUIsRUFDbEIsQ0FEa0IsRUFFMUIsQ0FBQyxDQUZ5QixFQUV0QixDQUFDLENBRnFCLEVBRWxCLENBRmtCLEVBRzFCLENBSDBCLEVBR3RCLENBQUMsQ0FIcUIsRUFHbEIsQ0FIa0IsQ0FBakIsQ0FEdUI7QUFNbEMsZ0JBQVE7QUFDTixpQkFBTyxJQUFJLFlBQUosQ0FBaUIsQ0FDdEIsQ0FEc0IsRUFDbkIsQ0FEbUIsRUFDaEIsQ0FEZ0IsRUFDYixDQURhLEVBRXRCLENBRnNCLEVBRW5CLENBRm1CLEVBRWhCLENBRmdCLEVBRWIsQ0FGYSxFQUd0QixDQUhzQixFQUduQixDQUhtQixFQUdoQixDQUhnQixFQUdiLENBSGEsQ0FBakIsQ0FERDtBQU1OLGdCQUFNO0FBTkE7QUFOMEIsT0FBYixDQUF2Qjs7QUFnQkEsVUFBSSxpQkFBaUIsbUJBQWE7QUFDaEMsbUJBQVcsSUFBSSxZQUFKLENBQWlCLENBQzFCLENBRDBCLEVBQ3JCLENBRHFCLEVBQ2xCLENBRGtCLEVBRTFCLENBQUMsQ0FGeUIsRUFFckIsQ0FGcUIsRUFFbEIsQ0FGa0IsRUFHMUIsQ0FIMEIsRUFHdEIsQ0FBQyxDQUhxQixFQUdsQixDQUhrQixFQUkxQixDQUFDLENBSnlCLEVBSXRCLENBQUMsQ0FKcUIsRUFJbEIsQ0FKa0IsQ0FBakIsQ0FEcUI7QUFNaEMsZ0JBQVE7QUFDTixpQkFBTyxJQUFJLFlBQUosQ0FBaUIsQ0FDdEIsR0FEc0IsRUFDakIsR0FEaUIsRUFDWixDQURZLEVBQ1QsQ0FEUyxFQUV0QixHQUZzQixFQUVqQixHQUZpQixFQUVaLENBRlksRUFFVCxDQUZTLEVBR3RCLEdBSHNCLEVBR2pCLEdBSGlCLEVBR1osQ0FIWSxFQUdULENBSFMsRUFJdEIsR0FKc0IsRUFJakIsR0FKaUIsRUFJWixDQUpZLEVBSVQsQ0FKUyxDQUFqQixDQUREO0FBT04sZ0JBQU07QUFQQTtBQU53QixPQUFiLENBQXJCOztBQWlCQSxVQUFJLFVBQVUsa0JBQVksRUFBWixFQUFnQjtBQUM1QixZQUFJLGFBRHdCO0FBRTVCLFlBQUk7QUFGd0IsT0FBaEIsQ0FBZDs7QUFLQSxVQUFJLFdBQVcsZ0JBQVU7QUFDdkIsa0JBQVUsZ0JBRGE7QUFFdkI7QUFGdUIsT0FBVixDQUFmOztBQUtBLFVBQUksU0FBUyxnQkFBVTtBQUNyQixrQkFBVSxjQURXO0FBRXJCO0FBRnFCLE9BQVYsQ0FBYjs7QUFLQSxhQUFPLFFBQVA7QUFDRDs7O3FDQUVnQjtBQUNmLFVBQUksU0FBUyw0QkFBc0I7QUFDakMsZ0JBQVEsS0FBSyxLQUFMLENBQVcsS0FBWCxHQUFtQixLQUFLLEtBQUwsQ0FBVztBQURMLE9BQXRCLENBQWI7O0FBRGUsVUFLUixLQUxRLEdBS0MsS0FBSyxLQUxOLENBS1IsS0FMUTs7QUFPZjs7QUFDQSxVQUFJLE9BQU8sZ0JBQVg7QUFDQSxXQUFLLFFBQUwsQ0FBYyxPQUFPLElBQXJCLEVBQTJCLE1BQU0sTUFBakM7O0FBRUEsV0FBSyxXQUFMLENBQWlCO0FBQ2YsbUJBQVcsSUFESTtBQUVmLGtCQUFVLE9BQU87QUFGRixPQUFqQjtBQUlEOzs7Ozs7QUFHSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQTdHcUIsUyIsImZpbGUiOiJ0cmlhbmdsZS1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG1heC1zdGF0ZW1lbnRzLCBuby12YXIgKi9cbi8qIGVzbGludC1kaXNhYmxlIGFycmF5LWJyYWNrZXQtc3BhY2luZywgbm8tbXVsdGktc3BhY2VzICovXG5cbmltcG9ydCBMYXllciBmcm9tICcuLi9sYXllcic7XG5pbXBvcnQge1Byb2dyYW0sIFBlcnNwZWN0aXZlQ2FtZXJhLCBNb2RlbCwgR2VvbWV0cnksIE1hdDR9IGZyb20gJ2x1bWEuZ2wnO1xuXG5jb25zdCBWRVJURVhfU0hBREVSID0gYFxuYXR0cmlidXRlIHZlYzMgcG9zaXRpb25zO1xuYXR0cmlidXRlIHZlYzQgY29sb3JzO1xuXG51bmlmb3JtIG1hdDQgdU1WTWF0cml4O1xudW5pZm9ybSBtYXQ0IHVQTWF0cml4O1xuXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xuXG52b2lkIG1haW4odm9pZCkge1xuICBnbF9Qb3NpdGlvbiA9IHVQTWF0cml4ICogdU1WTWF0cml4ICogdmVjNChwb3NpdGlvbnMsIDEuMCk7XG4gIHZDb2xvciA9IGNvbG9ycztcbn1cbmA7XG5cbmNvbnN0IEZSQUdNRU5UX1NIQURFUiA9IGBcbiNpZmRlZiBHTF9FU1xucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xuI2VuZGlmXG5cbnZhcnlpbmcgdmVjNCB2Q29sb3I7XG5cbnZvaWQgbWFpbih2b2lkKSB7XG4gIGdsX0ZyYWdDb2xvciA9IHZDb2xvcjtcbn1cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlc3RMYXllciBleHRlbmRzIExheWVyIHtcblxuICAvKlxuICAgKiBAY2xhc3NkZXNjXG4gICAqIFRlc3RMYXllclxuICAgKlxuICAgKiBAY2xhc3NcbiAgICogQHBhcmFtIHtvYmplY3R9IHByb3BzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwcm9wcy5yYWRpdXMgLSBwb2ludCByYWRpdXNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHtcbiAgICByVHJpID0gMC4wLFxuICAgIHJTcXVhcmUgPSAwLjAsXG4gICAgLi4ucHJvcHNcbiAgfSkge1xuICAgIHN1cGVyKHtcbiAgICAgIHJUcmksXG4gICAgICByU3F1YXJlLFxuICAgICAgLi4ucHJvcHNcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICBjb25zdCB7Z2x9ID0gdGhpcy5zdGF0ZTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9kZWw6IHRoaXMuZ2V0TW9kZWwoZ2wpXG4gICAgfSk7XG4gIH1cblxuICBkaWRNb3VudCgpIHtcbiAgICB0aGlzLnVwZGF0ZVVuaWZvcm1zKCk7XG4gIH1cblxuICB3aWxsUmVjZWl2ZVByb3BzKG9sZFByb3BzLCBuZXdQcm9wcykge1xuICAgIHN1cGVyLndpbGxSZWNlaXZlUHJvcHMob2xkUHJvcHMsIG5ld1Byb3BzKTtcbiAgICB0aGlzLnVwZGF0ZVVuaWZvcm1zKCk7XG4gIH1cblxuICBnZXRNb2RlbChnbCkge1xuICAgIHZhciB0cmlhbmdsZUdlb21ldHJ5ID0gbmV3IEdlb21ldHJ5KHtcbiAgICAgIHBvc2l0aW9uczogbmV3IEZsb2F0MzJBcnJheShbXG4gICAgICAgIDAsICAgMSwgMCxcbiAgICAgICAgLTEsIC0xLCAwLFxuICAgICAgICAxLCAgLTEsIDBcbiAgICAgIF0pLFxuICAgICAgY29sb3JzOiB7XG4gICAgICAgIHZhbHVlOiBuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAgICAgICAxLCAwLCAwLCAxLFxuICAgICAgICAgIDAsIDEsIDAsIDEsXG4gICAgICAgICAgMCwgMCwgMSwgMVxuICAgICAgICBdKSxcbiAgICAgICAgc2l6ZTogNFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIHNxdWFyZUdlb21ldHJ5ID0gbmV3IEdlb21ldHJ5KHtcbiAgICAgIHBvc2l0aW9uczogbmV3IEZsb2F0MzJBcnJheShbXG4gICAgICAgIDEsICAgMSwgMCxcbiAgICAgICAgLTEsICAxLCAwLFxuICAgICAgICAxLCAgLTEsIDAsXG4gICAgICAgIC0xLCAtMSwgMF0pLFxuICAgICAgY29sb3JzOiB7XG4gICAgICAgIHZhbHVlOiBuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAgICAgICAwLjUsIDAuNSwgMSwgMSxcbiAgICAgICAgICAwLjUsIDAuNSwgMSwgMSxcbiAgICAgICAgICAwLjUsIDAuNSwgMSwgMSxcbiAgICAgICAgICAwLjUsIDAuNSwgMSwgMVxuICAgICAgICBdKSxcbiAgICAgICAgc2l6ZTogNFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIHByb2dyYW0gPSBuZXcgUHJvZ3JhbShnbCwge1xuICAgICAgdnM6IFZFUlRFWF9TSEFERVIsXG4gICAgICBmczogRlJBR01FTlRfU0hBREVSXG4gICAgfSk7XG5cbiAgICB2YXIgdHJpYW5nbGUgPSBuZXcgTW9kZWwoe1xuICAgICAgZ2VvbWV0cnk6IHRyaWFuZ2xlR2VvbWV0cnksXG4gICAgICBwcm9ncmFtXG4gICAgfSk7XG5cbiAgICB2YXIgc3F1YXJlID0gbmV3IE1vZGVsKHtcbiAgICAgIGdlb21ldHJ5OiBzcXVhcmVHZW9tZXRyeSxcbiAgICAgIHByb2dyYW1cbiAgICB9KTtcblxuICAgIHJldHVybiB0cmlhbmdsZTtcbiAgfVxuXG4gIHVwZGF0ZVVuaWZvcm1zKCkge1xuICAgIHZhciBjYW1lcmEgPSBuZXcgUGVyc3BlY3RpdmVDYW1lcmEoe1xuICAgICAgYXNwZWN0OiB0aGlzLnByb3BzLndpZHRoIC8gdGhpcy5wcm9wcy5oZWlnaHRcbiAgICB9KTtcblxuICAgIGNvbnN0IHttb2RlbH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgLy8gZ2V0IG5ldyB2aWV3IG1hdHJpeCBvdXQgb2YgZWxlbWVudCBhbmQgY2FtZXJhIG1hdHJpY2VzXG4gICAgdmFyIHZpZXcgPSBuZXcgTWF0NCgpO1xuICAgIHZpZXcubXVsTWF0NDIoY2FtZXJhLnZpZXcsIG1vZGVsLm1hdHJpeCk7XG5cbiAgICB0aGlzLnNldFVuaWZvcm1zKHtcbiAgICAgIHVNVk1hdHJpeDogdmlldyxcbiAgICAgIHVQTWF0cml4OiBjYW1lcmEucHJvamVjdGlvblxuICAgIH0pO1xuICB9XG59XG5cbi8qXG5leHBvcnQgZnVuY3Rpb24gYXBwKCkge1xuXG4gIGZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gICAgclRyaSArPSAwLjAxO1xuICAgIHJTcXVhcmUgKz0gMC4xO1xuICB9XG5cbiAgZnVuY3Rpb24gZHJhd1NjZW5lKCkge1xuICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKTtcblxuICAgIC8vIERyYXcgdHJpYW5nbGVcbiAgICB0cmlhbmdsZVxuICAgICAgLnNldFBvc2l0aW9uKG5ldyBWZWMzKC0xLjUsIDAsIC03KSlcbiAgICAgIC5zZXRSb3RhdGlvbihuZXcgVmVjMygwLCByVHJpLCAwKSlcbiAgICAgIC51cGRhdGVNYXRyaXgoKTtcbiAgICBzZXR1cE1vZGVsKHRyaWFuZ2xlKTtcbiAgICBnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFUywgMCwgMyk7XG5cbiAgICAvLyBEcmF3IFNxdWFyZVxuICAgIHNxdWFyZVxuICAgICAgLnNldFBvc2l0aW9uKG5ldyBWZWMzKDEuNSwgMCwgLTcpKVxuICAgICAgLnNldFJvdGF0aW9uKG5ldyBWZWMzKHJTcXVhcmUsIDAsIDApKVxuICAgICAgLnVwZGF0ZU1hdHJpeCgpO1xuICAgIHNldHVwTW9kZWwoc3F1YXJlKTtcbiAgICBnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFX1NUUklQLCAwLCA0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpY2soKSB7XG4gICAgZHJhd1NjZW5lKCk7XG4gICAgYW5pbWF0ZSgpO1xuICAgIEZ4LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgfVxuXG4gIHRpY2soKTtcbn07XG4qL1xuIl19