'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _layer = require('../layer');

var _layer2 = _interopRequireDefault(_layer);

var _luma = require('luma.gl');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Copyright (c) 2015 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var glslify = require('glslify');

var ATTRIBUTES = {
  instancePositions: { size: 3, '0': 'x', '1': 'y', '2': 'unused' },
  instanceColors: { size: 3, '0': 'red', '1': 'green', '2': 'blue' }
};

var TestLayer = function (_Layer) {
  _inherits(TestLayer, _Layer);

  _createClass(TestLayer, null, [{
    key: 'attributes',
    get: function get() {
      return ATTRIBUTES;
    }

    /*
     * @classdesc
     * TestLayer
     *
     * @class
     * @param {object} props
     * @param {number} props.radius - point radius
     */

  }]);

  function TestLayer(_ref) {
    var _ref$getPosition = _ref.getPosition;
    var getPosition = _ref$getPosition === undefined ? function (x) {
      return x.position;
    } : _ref$getPosition;
    var _ref$getElevation = _ref.getElevation;
    var getElevation = _ref$getElevation === undefined ? function (x) {
      return x.elevation || 0;
    } : _ref$getElevation;
    var _ref$getColor = _ref.getColor;
    var getColor = _ref$getColor === undefined ? function (x) {
      return x.color || [255, 0, 0];
    } : _ref$getColor;

    var props = _objectWithoutProperties(_ref, ['getPosition', 'getElevation', 'getColor']);

    _classCallCheck(this, TestLayer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TestLayer).call(this, _extends({
      getPosition: getPosition,
      getElevation: getElevation,
      getColor: getColor
    }, props)));
  }

  _createClass(TestLayer, [{
    key: 'initializeState',
    value: function initializeState() {
      var gl = this.state.gl;
      var attributeManager = this.state.attributeManager;


      this.setState({
        model: this.getModel(gl)
      });

      attributeManager.addInstanced(ATTRIBUTES, {
        instancePositions: { update: this.calculateInstancePositions },
        instanceColors: { update: this.calculateInstanceColors }
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
      var NUM_SEGMENTS = 16;
      var PI2 = Math.PI * 2;

      var positions = [];
      for (var i = 0; i < NUM_SEGMENTS; i++) {
        positions = [].concat(_toConsumableArray(positions), [Math.cos(PI2 * i / NUM_SEGMENTS), Math.sin(PI2 * i / NUM_SEGMENTS), 0]);
      }

      return new _luma.Model({
        program: new _luma.Program(gl, {
          vs: '#define GLSLIFY 1\n// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* vertex shader for the scatterplot-layer */\n#define SHADER_NAME test-layer-vs\n\nhighp float random(vec2 co) {\n  highp float a = 12.9898;\n  highp float b = 78.233;\n  highp float c = 43758.5453;\n  highp float dt= dot(co.xy ,vec2(a,b));\n  highp float sn= mod(dt,3.14);\n  return fract(sin(sn) / c) - .5;\n}\n\nconst float TILE_SIZE_1604150559 = 512.0;\nconst float PI = 3.1415926536;\nconst float WORLD_SCALE_1604150559 = TILE_SIZE_1604150559 / (PI * 2.0);\n\n// non-linear projection: lnglats => zoom 0 tile [0-512, 0-512] * scale\nvec2 mercatorProject(vec2 lnglat, float zoomScale) {\n  float scale = WORLD_SCALE_1604150559 * zoomScale;\n  return vec2(\n  \tscale * (radians(lnglat.x) + PI),\n  \tscale * (PI - log(tan(PI * 0.25 + radians(lnglat.y) * 0.5)))\n  );\n}\n\nuniform float mercatorScale;\n\nattribute vec3 positions;\nattribute vec3 instancePositions;\nattribute vec3 instanceColors;\nattribute vec3 instancePickingColors;\n\nuniform float radius;\nuniform float opacity;\n\nuniform mat4 worldMatrix;\nuniform mat4 projectionMatrix;\n\nvarying vec4 vColor;\nuniform float renderPickingBuffer;\n\nvoid main(void) {\n  gl_Position = vec4(positions, 1.0);\n  // vec2 pos = mercatorProject(instancePositions.xy);\n  // vec3 p = vec3(pos, instancePositions.z) + positions * radius;\n  // // gl_Position = projectionMatrix * vec4(p, 1.0);\n  // // float rand = random(pos);\n  // // gl_Position = vec4(rand, rand, 0, 1.);\n\n  // vec4 color = vec4(instanceColors / 255.0, 1.);\n  // vec4 pickingColor = vec4(instancePickingColors / 255.0, 1.);\n  // vColor = mix(color, pickingColor, renderPickingBuffer);\n\n  // vec2 pos = mercatorProject(instancePositions.xy, mercatorScale);\n  // vec3 p = vec3(pos, instancePositions.z) + positions * radius;\n  // gl_Position = projectionMatrix * vec4(p, 1.0);\n\n  // vec4 color = vec4(instanceColors / 255.0, 1.);\n  // vec4 pickingColor = vec4(instancePickingColors / 255.0, 1.);\n  // vColor = mix(color, pickingColor, renderPickingBuffer);\n}\n',
          fs: '// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* fragment shader for the scatterplot-layer */\n#define SHADER_NAME test-layer-fs\n\n#ifdef GL_ES\nprecision highp float;\n#define GLSLIFY 1\n#endif\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  // gl_FragColor = vColor;\n  gl_FragColor = vec4(1., 0., 0., 1.);\n}\n',
          id: 'test'
        }),
        geometry: new _luma.Geometry({
          drawMode: 'TRIANGLE_FAN',
          positions: new Float32Array(positions)
        })
      });
    }
  }, {
    key: 'updateUniforms',
    value: function updateUniforms() {
      this.calculateRadius();
      var radius = this.state.radius;

      this.setUniforms({
        radius: radius
      });
    }
  }, {
    key: 'calculateInstancePositions',
    value: function calculateInstancePositions(attribute) {
      var _props = this.props;
      var data = _props.data;
      var getPosition = _props.getPosition;
      var getElevation = _props.getElevation;
      var value = attribute.value;
      var size = attribute.size;

      var i = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var point = _step.value;

          var position = getPosition(point);
          var elevation = getElevation(point);
          value[i + 0] = position[0] || 0;
          value[i + 1] = position[1] || 0;
          value[i + 2] = elevation || 0;
          i += size;
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
    }
  }, {
    key: 'calculateInstanceColors',
    value: function calculateInstanceColors(attribute) {
      var _props2 = this.props;
      var data = _props2.data;
      var getColor = _props2.getColor;
      var value = attribute.value;
      var size = attribute.size;

      var i = 0;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var point = _step2.value;

          var color = getColor(point);
          value[i + 0] = color[0] || 255;
          value[i + 1] = color[1] || 0;
          value[i + 2] = color[2] || 0;
          i += size;
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
    }
  }, {
    key: 'calculateRadius',
    value: function calculateRadius() {
      // use radius if specified
      if (this.props.radius) {
        this.state.radius = this.props.radius;
        return;
      }

      var pixel0 = this.project({ lon: -122, lat: 37.5 });
      var pixel1 = this.project({ lon: -122, lat: 37.5002 });

      var dx = pixel0.x - pixel1.x;
      var dy = pixel0.y - pixel1.y;

      this.state.radius = Math.max(Math.sqrt(dx * dx + dy * dy), 2.0);
    }
  }]);

  return TestLayer;
}(_layer2.default);

exports.default = TestLayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0LWxheWVycy90ZXN0LWxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFvQkE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7OytlQXJCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFJQSxJQUFNLFVBQVUsUUFBUSxTQUFSLENBQWhCOztBQUVBLElBQU0sYUFBYTtBQUNqQixxQkFBbUIsRUFBQyxNQUFNLENBQVAsRUFBVSxLQUFLLEdBQWYsRUFBb0IsS0FBSyxHQUF6QixFQUE4QixLQUFLLFFBQW5DLEVBREY7QUFFakIsa0JBQWdCLEVBQUMsTUFBTSxDQUFQLEVBQVUsS0FBSyxLQUFmLEVBQXNCLEtBQUssT0FBM0IsRUFBb0MsS0FBSyxNQUF6QztBQUZDLENBQW5COztJQUtxQixTOzs7Ozt3QkFFSztBQUN0QixhQUFPLFVBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7QUFRQSwyQkFLRztBQUFBLGdDQUpELFdBSUM7QUFBQSxRQUpELFdBSUMsb0NBSmE7QUFBQSxhQUFLLEVBQUUsUUFBUDtBQUFBLEtBSWI7QUFBQSxpQ0FIRCxZQUdDO0FBQUEsUUFIRCxZQUdDLHFDQUhjO0FBQUEsYUFBSyxFQUFFLFNBQUYsSUFBZSxDQUFwQjtBQUFBLEtBR2Q7QUFBQSw2QkFGRCxRQUVDO0FBQUEsUUFGRCxRQUVDLGlDQUZVO0FBQUEsYUFBSyxFQUFFLEtBQUYsSUFBVyxDQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVMsQ0FBVCxDQUFoQjtBQUFBLEtBRVY7O0FBQUEsUUFERSxLQUNGOztBQUFBOztBQUFBO0FBRUMsOEJBRkQ7QUFHQyxnQ0FIRDtBQUlDO0FBSkQsT0FLSSxLQUxKO0FBT0Y7Ozs7c0NBRWlCO0FBQUEsVUFDVCxFQURTLEdBQ0gsS0FBSyxLQURGLENBQ1QsRUFEUztBQUFBLFVBRVQsZ0JBRlMsR0FFVyxLQUFLLEtBRmhCLENBRVQsZ0JBRlM7OztBQUloQixXQUFLLFFBQUwsQ0FBYztBQUNaLGVBQU8sS0FBSyxRQUFMLENBQWMsRUFBZDtBQURLLE9BQWQ7O0FBSUEsdUJBQWlCLFlBQWpCLENBQThCLFVBQTlCLEVBQTBDO0FBQ3hDLDJCQUFtQixFQUFDLFFBQVEsS0FBSywwQkFBZCxFQURxQjtBQUV4Qyx3QkFBZ0IsRUFBQyxRQUFRLEtBQUssdUJBQWQ7QUFGd0IsT0FBMUM7QUFJRDs7OytCQUVVO0FBQ1QsV0FBSyxjQUFMO0FBQ0Q7OztxQ0FFZ0IsUSxFQUFVLFEsRUFBVTtBQUNuQyw0RkFBdUIsUUFBdkIsRUFBaUMsUUFBakM7QUFDQSxXQUFLLGNBQUw7QUFDRDs7OzZCQUVRLEUsRUFBSTtBQUNYLFVBQU0sZUFBZSxFQUFyQjtBQUNBLFVBQU0sTUFBTSxLQUFLLEVBQUwsR0FBVSxDQUF0Qjs7QUFFQSxVQUFJLFlBQVksRUFBaEI7QUFDQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksWUFBcEIsRUFBa0MsR0FBbEMsRUFBdUM7QUFDckMsaURBQ0ssU0FETCxJQUVFLEtBQUssR0FBTCxDQUFTLE1BQU0sQ0FBTixHQUFVLFlBQW5CLENBRkYsRUFHRSxLQUFLLEdBQUwsQ0FBUyxNQUFNLENBQU4sR0FBVSxZQUFuQixDQUhGLEVBSUUsQ0FKRjtBQU1EOztBQUVELGFBQU8sZ0JBQVU7QUFDZixpQkFBUyxrQkFBWSxFQUFaLEVBQWdCO0FBQ3ZCLDBtR0FEdUI7QUFFdkIsazVDQUZ1QjtBQUd2QixjQUFJO0FBSG1CLFNBQWhCLENBRE07QUFNZixrQkFBVSxtQkFBYTtBQUNyQixvQkFBVSxjQURXO0FBRXJCLHFCQUFXLElBQUksWUFBSixDQUFpQixTQUFqQjtBQUZVLFNBQWI7QUFOSyxPQUFWLENBQVA7QUFZRDs7O3FDQUVnQjtBQUNmLFdBQUssZUFBTDtBQURlLFVBRVIsTUFGUSxHQUVFLEtBQUssS0FGUCxDQUVSLE1BRlE7O0FBR2YsV0FBSyxXQUFMLENBQWlCO0FBQ2Y7QUFEZSxPQUFqQjtBQUdEOzs7K0NBRTBCLFMsRUFBVztBQUFBLG1CQUNNLEtBQUssS0FEWDtBQUFBLFVBQzdCLElBRDZCLFVBQzdCLElBRDZCO0FBQUEsVUFDdkIsV0FEdUIsVUFDdkIsV0FEdUI7QUFBQSxVQUNWLFlBRFUsVUFDVixZQURVO0FBQUEsVUFFN0IsS0FGNkIsR0FFZCxTQUZjLENBRTdCLEtBRjZCO0FBQUEsVUFFdEIsSUFGc0IsR0FFZCxTQUZjLENBRXRCLElBRnNCOztBQUdwQyxVQUFJLElBQUksQ0FBUjtBQUhvQztBQUFBO0FBQUE7O0FBQUE7QUFJcEMsNkJBQW9CLElBQXBCLDhIQUEwQjtBQUFBLGNBQWYsS0FBZTs7QUFDeEIsY0FBTSxXQUFXLFlBQVksS0FBWixDQUFqQjtBQUNBLGNBQU0sWUFBWSxhQUFhLEtBQWIsQ0FBbEI7QUFDQSxnQkFBTSxJQUFJLENBQVYsSUFBZSxTQUFTLENBQVQsS0FBZSxDQUE5QjtBQUNBLGdCQUFNLElBQUksQ0FBVixJQUFlLFNBQVMsQ0FBVCxLQUFlLENBQTlCO0FBQ0EsZ0JBQU0sSUFBSSxDQUFWLElBQWUsYUFBYSxDQUE1QjtBQUNBLGVBQUssSUFBTDtBQUNEO0FBWG1DO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFZckM7Ozs0Q0FFdUIsUyxFQUFXO0FBQUEsb0JBQ1IsS0FBSyxLQURHO0FBQUEsVUFDMUIsSUFEMEIsV0FDMUIsSUFEMEI7QUFBQSxVQUNwQixRQURvQixXQUNwQixRQURvQjtBQUFBLFVBRTFCLEtBRjBCLEdBRVgsU0FGVyxDQUUxQixLQUYwQjtBQUFBLFVBRW5CLElBRm1CLEdBRVgsU0FGVyxDQUVuQixJQUZtQjs7QUFHakMsVUFBSSxJQUFJLENBQVI7QUFIaUM7QUFBQTtBQUFBOztBQUFBO0FBSWpDLDhCQUFvQixJQUFwQixtSUFBMEI7QUFBQSxjQUFmLEtBQWU7O0FBQ3hCLGNBQU0sUUFBUSxTQUFTLEtBQVQsQ0FBZDtBQUNBLGdCQUFNLElBQUksQ0FBVixJQUFlLE1BQU0sQ0FBTixLQUFZLEdBQTNCO0FBQ0EsZ0JBQU0sSUFBSSxDQUFWLElBQWUsTUFBTSxDQUFOLEtBQVksQ0FBM0I7QUFDQSxnQkFBTSxJQUFJLENBQVYsSUFBZSxNQUFNLENBQU4sS0FBWSxDQUEzQjtBQUNBLGVBQUssSUFBTDtBQUNEO0FBVmdDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFXbEM7OztzQ0FFaUI7QUFDaEI7QUFDQSxVQUFJLEtBQUssS0FBTCxDQUFXLE1BQWYsRUFBdUI7QUFDckIsYUFBSyxLQUFMLENBQVcsTUFBWCxHQUFvQixLQUFLLEtBQUwsQ0FBVyxNQUEvQjtBQUNBO0FBQ0Q7O0FBRUQsVUFBTSxTQUFTLEtBQUssT0FBTCxDQUFhLEVBQUMsS0FBSyxDQUFDLEdBQVAsRUFBWSxLQUFLLElBQWpCLEVBQWIsQ0FBZjtBQUNBLFVBQU0sU0FBUyxLQUFLLE9BQUwsQ0FBYSxFQUFDLEtBQUssQ0FBQyxHQUFQLEVBQVksS0FBSyxPQUFqQixFQUFiLENBQWY7O0FBRUEsVUFBTSxLQUFLLE9BQU8sQ0FBUCxHQUFXLE9BQU8sQ0FBN0I7QUFDQSxVQUFNLEtBQUssT0FBTyxDQUFQLEdBQVcsT0FBTyxDQUE3Qjs7QUFFQSxXQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQW9CLEtBQUssR0FBTCxDQUFTLEtBQUssSUFBTCxDQUFVLEtBQUssRUFBTCxHQUFVLEtBQUssRUFBekIsQ0FBVCxFQUF1QyxHQUF2QyxDQUFwQjtBQUNEOzs7Ozs7a0JBaElrQixTIiwiZmlsZSI6InRlc3QtbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi4vbGF5ZXInO1xuaW1wb3J0IHtNb2RlbCwgUHJvZ3JhbSwgR2VvbWV0cnl9IGZyb20gJ2x1bWEuZ2wnO1xuY29uc3QgZ2xzbGlmeSA9IHJlcXVpcmUoJ2dsc2xpZnknKTtcblxuY29uc3QgQVRUUklCVVRFUyA9IHtcbiAgaW5zdGFuY2VQb3NpdGlvbnM6IHtzaXplOiAzLCAnMCc6ICd4JywgJzEnOiAneScsICcyJzogJ3VudXNlZCd9LFxuICBpbnN0YW5jZUNvbG9yczoge3NpemU6IDMsICcwJzogJ3JlZCcsICcxJzogJ2dyZWVuJywgJzInOiAnYmx1ZSd9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXN0TGF5ZXIgZXh0ZW5kcyBMYXllciB7XG5cbiAgc3RhdGljIGdldCBhdHRyaWJ1dGVzKCkge1xuICAgIHJldHVybiBBVFRSSUJVVEVTO1xuICB9XG5cbiAgLypcbiAgICogQGNsYXNzZGVzY1xuICAgKiBUZXN0TGF5ZXJcbiAgICpcbiAgICogQGNsYXNzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wc1xuICAgKiBAcGFyYW0ge251bWJlcn0gcHJvcHMucmFkaXVzIC0gcG9pbnQgcmFkaXVzXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgZ2V0UG9zaXRpb24gPSB4ID0+IHgucG9zaXRpb24sXG4gICAgZ2V0RWxldmF0aW9uID0geCA9PiB4LmVsZXZhdGlvbiB8fCAwLFxuICAgIGdldENvbG9yID0geCA9PiB4LmNvbG9yIHx8IFsyNTUsIDAsIDBdLFxuICAgIC4uLnByb3BzXG4gIH0pIHtcbiAgICBzdXBlcih7XG4gICAgICBnZXRQb3NpdGlvbixcbiAgICAgIGdldEVsZXZhdGlvbixcbiAgICAgIGdldENvbG9yLFxuICAgICAgLi4ucHJvcHNcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICBjb25zdCB7Z2x9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCB7YXR0cmlidXRlTWFuYWdlcn0gPSB0aGlzLnN0YXRlO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb2RlbDogdGhpcy5nZXRNb2RlbChnbClcbiAgICB9KTtcblxuICAgIGF0dHJpYnV0ZU1hbmFnZXIuYWRkSW5zdGFuY2VkKEFUVFJJQlVURVMsIHtcbiAgICAgIGluc3RhbmNlUG9zaXRpb25zOiB7dXBkYXRlOiB0aGlzLmNhbGN1bGF0ZUluc3RhbmNlUG9zaXRpb25zfSxcbiAgICAgIGluc3RhbmNlQ29sb3JzOiB7dXBkYXRlOiB0aGlzLmNhbGN1bGF0ZUluc3RhbmNlQ29sb3JzfVxuICAgIH0pO1xuICB9XG5cbiAgZGlkTW91bnQoKSB7XG4gICAgdGhpcy51cGRhdGVVbmlmb3JtcygpO1xuICB9XG5cbiAgd2lsbFJlY2VpdmVQcm9wcyhvbGRQcm9wcywgbmV3UHJvcHMpIHtcbiAgICBzdXBlci53aWxsUmVjZWl2ZVByb3BzKG9sZFByb3BzLCBuZXdQcm9wcyk7XG4gICAgdGhpcy51cGRhdGVVbmlmb3JtcygpO1xuICB9XG5cbiAgZ2V0TW9kZWwoZ2wpIHtcbiAgICBjb25zdCBOVU1fU0VHTUVOVFMgPSAxNjtcbiAgICBjb25zdCBQSTIgPSBNYXRoLlBJICogMjtcblxuICAgIGxldCBwb3NpdGlvbnMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE5VTV9TRUdNRU5UUzsgaSsrKSB7XG4gICAgICBwb3NpdGlvbnMgPSBbXG4gICAgICAgIC4uLnBvc2l0aW9ucyxcbiAgICAgICAgTWF0aC5jb3MoUEkyICogaSAvIE5VTV9TRUdNRU5UUyksXG4gICAgICAgIE1hdGguc2luKFBJMiAqIGkgLyBOVU1fU0VHTUVOVFMpLFxuICAgICAgICAwXG4gICAgICBdO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgTW9kZWwoe1xuICAgICAgcHJvZ3JhbTogbmV3IFByb2dyYW0oZ2wsIHtcbiAgICAgICAgdnM6IGdsc2xpZnkoJy4vdGVzdC1sYXllci12ZXJ0ZXguZ2xzbCcpLFxuICAgICAgICBmczogZ2xzbGlmeSgnLi90ZXN0LWxheWVyLWZyYWdtZW50Lmdsc2wnKSxcbiAgICAgICAgaWQ6ICd0ZXN0J1xuICAgICAgfSksXG4gICAgICBnZW9tZXRyeTogbmV3IEdlb21ldHJ5KHtcbiAgICAgICAgZHJhd01vZGU6ICdUUklBTkdMRV9GQU4nLFxuICAgICAgICBwb3NpdGlvbnM6IG5ldyBGbG9hdDMyQXJyYXkocG9zaXRpb25zKVxuICAgICAgfSksXG4gICAgICAvLyBpc0luc3RhbmNlZDogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlVW5pZm9ybXMoKSB7XG4gICAgdGhpcy5jYWxjdWxhdGVSYWRpdXMoKTtcbiAgICBjb25zdCB7cmFkaXVzfSA9IHRoaXMuc3RhdGU7XG4gICAgdGhpcy5zZXRVbmlmb3Jtcyh7XG4gICAgICByYWRpdXNcbiAgICB9KTtcbiAgfVxuXG4gIGNhbGN1bGF0ZUluc3RhbmNlUG9zaXRpb25zKGF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IHtkYXRhLCBnZXRQb3NpdGlvbiwgZ2V0RWxldmF0aW9ufSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge3ZhbHVlLCBzaXplfSA9IGF0dHJpYnV0ZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChjb25zdCBwb2ludCBvZiBkYXRhKSB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IGdldFBvc2l0aW9uKHBvaW50KTtcbiAgICAgIGNvbnN0IGVsZXZhdGlvbiA9IGdldEVsZXZhdGlvbihwb2ludCk7XG4gICAgICB2YWx1ZVtpICsgMF0gPSBwb3NpdGlvblswXSB8fCAwO1xuICAgICAgdmFsdWVbaSArIDFdID0gcG9zaXRpb25bMV0gfHwgMDtcbiAgICAgIHZhbHVlW2kgKyAyXSA9IGVsZXZhdGlvbiB8fCAwO1xuICAgICAgaSArPSBzaXplO1xuICAgIH1cbiAgfVxuXG4gIGNhbGN1bGF0ZUluc3RhbmNlQ29sb3JzKGF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IHtkYXRhLCBnZXRDb2xvcn0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHt2YWx1ZSwgc2l6ZX0gPSBhdHRyaWJ1dGU7XG4gICAgbGV0IGkgPSAwO1xuICAgIGZvciAoY29uc3QgcG9pbnQgb2YgZGF0YSkge1xuICAgICAgY29uc3QgY29sb3IgPSBnZXRDb2xvcihwb2ludCk7XG4gICAgICB2YWx1ZVtpICsgMF0gPSBjb2xvclswXSB8fCAyNTU7XG4gICAgICB2YWx1ZVtpICsgMV0gPSBjb2xvclsxXSB8fCAwO1xuICAgICAgdmFsdWVbaSArIDJdID0gY29sb3JbMl0gfHwgMDtcbiAgICAgIGkgKz0gc2l6ZTtcbiAgICB9XG4gIH1cblxuICBjYWxjdWxhdGVSYWRpdXMoKSB7XG4gICAgLy8gdXNlIHJhZGl1cyBpZiBzcGVjaWZpZWRcbiAgICBpZiAodGhpcy5wcm9wcy5yYWRpdXMpIHtcbiAgICAgIHRoaXMuc3RhdGUucmFkaXVzID0gdGhpcy5wcm9wcy5yYWRpdXM7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGl4ZWwwID0gdGhpcy5wcm9qZWN0KHtsb246IC0xMjIsIGxhdDogMzcuNX0pO1xuICAgIGNvbnN0IHBpeGVsMSA9IHRoaXMucHJvamVjdCh7bG9uOiAtMTIyLCBsYXQ6IDM3LjUwMDJ9KTtcblxuICAgIGNvbnN0IGR4ID0gcGl4ZWwwLnggLSBwaXhlbDEueDtcbiAgICBjb25zdCBkeSA9IHBpeGVsMC55IC0gcGl4ZWwxLnk7XG5cbiAgICB0aGlzLnN0YXRlLnJhZGl1cyA9IE1hdGgubWF4KE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSksIDIuMCk7XG4gIH1cblxufVxuIl19