'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _layer = require('../../layer');

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
  instancePositions: { size: 4, '0': 'x0', '1': 'y0', '2': 'x1', '3': 'y1' },
  instanceColors: { size: 3, '0': 'red', '1': 'green', '2': 'blue' }
};

var RED = [255, 0, 0];
var BLUE = [0, 0, 255];

var ArcLayer = function (_Layer) {
  _inherits(ArcLayer, _Layer);

  /**
   * @classdesc
   * ArcLayer
   *
   * @class
   * @param {object} opts
   */
  function ArcLayer() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$strokeWidth = _ref.strokeWidth;
    var strokeWidth = _ref$strokeWidth === undefined ? 1 : _ref$strokeWidth;
    var _ref$color = _ref.color0;
    var color0 = _ref$color === undefined ? RED : _ref$color;
    var _ref$color2 = _ref.color1;
    var color1 = _ref$color2 === undefined ? BLUE : _ref$color2;

    var opts = _objectWithoutProperties(_ref, ['strokeWidth', 'color0', 'color1']);

    _classCallCheck(this, ArcLayer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ArcLayer).call(this, _extends({
      strokeWidth: strokeWidth,
      color0: color0,
      color1: color1
    }, opts)));
  }

  _createClass(ArcLayer, [{
    key: 'initializeState',
    value: function initializeState() {
      var _state = this.state;
      var gl = _state.gl;
      var attributeManager = _state.attributeManager;


      var model = this.createModel(gl);
      model.userData.strokeWidth = this.props.strokeWidth;
      this.setState({ model: model });

      attributeManager.addInstanced(ATTRIBUTES, {
        instancePositions: { update: this.calculateInstancePositions },
        instanceColors: { update: this.calculateInstanceColors }
      });

      this.updateColors();
    }
  }, {
    key: 'willReceiveProps',
    value: function willReceiveProps(oldProps, nextProps) {
      _get(Object.getPrototypeOf(ArcLayer.prototype), 'willReceiveProps', this).call(this, oldProps, nextProps);
      this.state.model.userData.strokeWidth = nextProps.strokeWidth;
      this.updateColors();
    }
  }, {
    key: 'createModel',
    value: function createModel(gl) {
      var positions = [];
      var NUM_SEGMENTS = 50;
      for (var i = 0; i < NUM_SEGMENTS; i++) {
        positions = [].concat(_toConsumableArray(positions), [i, i, i]);
      }

      return new _luma.Model({
        program: new _luma.Program(gl, {
          vs: '#define GLSLIFY 1\n// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* vertex shader for the arc-layer */\n#define SHADER_NAME arc-layer-vs\n\nconst float TILE_SIZE_1540259130 = 512.0;\nconst float PI = 3.1415926536;\nconst float WORLD_SCALE_1540259130 = TILE_SIZE_1540259130 / (PI * 2.0);\n\n// non-linear projection: lnglats => zoom 0 tile [0-512, 0-512] * scale\nvec2 mercatorProject(vec2 lnglat, float zoomScale) {\n  float scale = WORLD_SCALE_1540259130 * zoomScale;\n  return vec2(\n  \tscale * (radians(lnglat.x) + PI),\n  \tscale * (PI - log(tan(PI * 0.25 + radians(lnglat.y) * 0.5)))\n  );\n}\n\nuniform float mercatorScale;\n\nconst float N = 49.0;\n\nattribute vec3 positions;\nattribute vec3 instanceColors;\nattribute vec4 instancePositions;\nattribute vec3 instancePickingColors;\n\nuniform mat4 worldMatrix;\nuniform mat4 projectionMatrix;\nuniform float opacity;\nuniform float renderPickingBuffer;\n\nvarying vec4 vColor;\n\nfloat paraboloid(vec2 source, vec2 target, float index) {\n  float ratio = index / N;\n\n  vec2 x = mix(source, target, ratio);\n  vec2 center = mix(source, target, 0.5);\n\n  float dSourceCenter = distance(source, center);\n  float dXCenter = distance(x, center);\n  return (dSourceCenter + dXCenter) * (dSourceCenter - dXCenter);\n}\n\nvoid main(void) {\n  vec2 source = mercatorProject(instancePositions.xy, mercatorScale);\n  vec2 target = mercatorProject(instancePositions.zw, mercatorScale);\n\n  // TODO - are we only using x coordinate?\n  float segmentIndex = positions.x;\n  vec3 p = vec3(\n    // xy: linear interpolation of source & target\n    mix(source, target, segmentIndex / N),\n    // z: paraboloid interpolate of source & target\n    sqrt(paraboloid(source, target, segmentIndex))\n  );\n\n  gl_Position = projectionMatrix * vec4(p, 1.0);\n\n  vec4 color = vec4(instanceColors / 255.0, opacity);\n  vec4 pickingColor = vec4(instancePickingColors / 255.0, opacity);\n  vColor = mix(color, pickingColor, renderPickingBuffer);\n}\n',
          fs: '// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* fragment shader for the arc-layer */\n#define SHADER_NAME arc-layer-fs\n\n#ifdef GL_ES\nprecision highp float;\n#define GLSLIFY 1\n#endif\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  gl_FragColor = vColor;\n}\n',
          id: 'arc'
        }),
        geometry: new _luma.Geometry({
          id: 'arc',
          drawMode: 'LINE_STRIP',
          positions: new Float32Array(positions)
        }),
        isInstanced: true,
        onBeforeRender: function onBeforeRender() {
          this.userData.oldStrokeWidth = gl.getParameter(gl.LINE_WIDTH);
          this.program.gl.lineWidth(this.userData.strokeWidth || 1);
        },
        onAfterRender: function onAfterRender() {
          this.program.gl.lineWidth(this.userData.oldStrokeWidth || 1);
        }
      });
    }
  }, {
    key: 'updateColors',
    value: function updateColors() {
      this.setUniforms({
        color0: this.props.color0,
        color1: this.props.color1
      });
    }
  }, {
    key: 'calculateInstancePositions',
    value: function calculateInstancePositions(attribute) {
      var data = this.props.data;
      var value = attribute.value;
      var size = attribute.size;

      var i = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var arc = _step.value;

          value[i + 0] = arc.position.x0;
          value[i + 1] = arc.position.y0;
          value[i + 2] = arc.position.x1;
          value[i + 3] = arc.position.y1;
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
      var data = this.props.data;
      var value = attribute.value;
      var size = attribute.size;

      var i = 0;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var point = _step2.value;

          value[i + 0] = point.color[0];
          value[i + 1] = point.color[1];
          value[i + 2] = point.color[2];
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
  }]);

  return ArcLayer;
}(_layer2.default);

exports.default = ArcLayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvYXJjLWxheWVyL2FyYy1sYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBb0JBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OzsrZUFyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBSUEsSUFBTSxVQUFVLFFBQVEsU0FBUixDQUFoQjs7QUFFQSxJQUFNLGFBQWE7QUFDakIscUJBQW1CLEVBQUMsTUFBTSxDQUFQLEVBQVUsS0FBSyxJQUFmLEVBQXFCLEtBQUssSUFBMUIsRUFBZ0MsS0FBSyxJQUFyQyxFQUEyQyxLQUFLLElBQWhELEVBREY7QUFFakIsa0JBQWdCLEVBQUMsTUFBTSxDQUFQLEVBQVUsS0FBSyxLQUFmLEVBQXNCLEtBQUssT0FBM0IsRUFBb0MsS0FBSyxNQUF6QztBQUZDLENBQW5COztBQUtBLElBQU0sTUFBTSxDQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVMsQ0FBVCxDQUFaO0FBQ0EsSUFBTSxPQUFPLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxHQUFQLENBQWI7O0lBRXFCLFE7OztBQUNuQjs7Ozs7OztBQU9BLHNCQUtRO0FBQUEscUVBQUosRUFBSTs7QUFBQSxnQ0FKTixXQUlNO0FBQUEsUUFKTixXQUlNLG9DQUpRLENBSVI7QUFBQSwwQkFITixNQUdNO0FBQUEsUUFITixNQUdNLDhCQUhHLEdBR0g7QUFBQSwyQkFGTixNQUVNO0FBQUEsUUFGTixNQUVNLCtCQUZHLElBRUg7O0FBQUEsUUFESCxJQUNHOztBQUFBOztBQUFBO0FBRUosOEJBRkk7QUFHSixvQkFISTtBQUlKO0FBSkksT0FLRCxJQUxDO0FBT1A7Ozs7c0NBRWlCO0FBQUEsbUJBQ2UsS0FBSyxLQURwQjtBQUFBLFVBQ1QsRUFEUyxVQUNULEVBRFM7QUFBQSxVQUNMLGdCQURLLFVBQ0wsZ0JBREs7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Q0FFMUIsS0FGMEI7QUFBQSxVQUVuQixJQUZtQixHQUVYLFNBRlcsQ0FFbkIsSUFGbUI7O0FBR2pDLFVBQUksSUFBSSxDQUFSO0FBSGlDO0FBQUE7QUFBQTs7QUFBQTtBQUlqQyw4QkFBb0IsSUFBcEIsbUlBQTBCO0FBQUEsY0FBZixLQUFlOztBQUN4QixnQkFBTSxJQUFJLENBQVYsSUFBZSxNQUFNLEtBQU4sQ0FBWSxDQUFaLENBQWY7QUFDQSxnQkFBTSxJQUFJLENBQVYsSUFBZSxNQUFNLEtBQU4sQ0FBWSxDQUFaLENBQWY7QUFDQSxnQkFBTSxJQUFJLENBQVYsSUFBZSxNQUFNLEtBQU4sQ0FBWSxDQUFaLENBQWY7QUFDQSxlQUFLLElBQUw7QUFDRDtBQVRnQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVWxDOzs7Ozs7a0JBdEdrQixRIiwiZmlsZSI6ImFyYy1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBMYXllciBmcm9tICcuLi8uLi9sYXllcic7XG5pbXBvcnQge01vZGVsLCBQcm9ncmFtLCBHZW9tZXRyeX0gZnJvbSAnbHVtYS5nbCc7XG5jb25zdCBnbHNsaWZ5ID0gcmVxdWlyZSgnZ2xzbGlmeScpO1xuXG5jb25zdCBBVFRSSUJVVEVTID0ge1xuICBpbnN0YW5jZVBvc2l0aW9uczoge3NpemU6IDQsICcwJzogJ3gwJywgJzEnOiAneTAnLCAnMic6ICd4MScsICczJzogJ3kxJ30sXG4gIGluc3RhbmNlQ29sb3JzOiB7c2l6ZTogMywgJzAnOiAncmVkJywgJzEnOiAnZ3JlZW4nLCAnMic6ICdibHVlJ31cbn07XG5cbmNvbnN0IFJFRCA9IFsyNTUsIDAsIDBdO1xuY29uc3QgQkxVRSA9IFswLCAwLCAyNTVdO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcmNMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBjbGFzc2Rlc2NcbiAgICogQXJjTGF5ZXJcbiAgICpcbiAgICogQGNsYXNzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRzXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgc3Ryb2tlV2lkdGggPSAxLFxuICAgIGNvbG9yMCA9IFJFRCxcbiAgICBjb2xvcjEgPSBCTFVFLFxuICAgIC4uLm9wdHNcbiAgfSA9IHt9KSB7XG4gICAgc3VwZXIoe1xuICAgICAgc3Ryb2tlV2lkdGgsXG4gICAgICBjb2xvcjAsXG4gICAgICBjb2xvcjEsXG4gICAgICAuLi5vcHRzXG4gICAgfSk7XG4gIH1cblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgY29uc3Qge2dsLCBhdHRyaWJ1dGVNYW5hZ2VyfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBjb25zdCBtb2RlbCA9IHRoaXMuY3JlYXRlTW9kZWwoZ2wpO1xuICAgIG1vZGVsLnVzZXJEYXRhLnN0cm9rZVdpZHRoID0gdGhpcy5wcm9wcy5zdHJva2VXaWR0aDtcbiAgICB0aGlzLnNldFN0YXRlKHttb2RlbH0pO1xuXG4gICAgYXR0cmlidXRlTWFuYWdlci5hZGRJbnN0YW5jZWQoQVRUUklCVVRFUywge1xuICAgICAgaW5zdGFuY2VQb3NpdGlvbnM6IHt1cGRhdGU6IHRoaXMuY2FsY3VsYXRlSW5zdGFuY2VQb3NpdGlvbnN9LFxuICAgICAgaW5zdGFuY2VDb2xvcnM6IHt1cGRhdGU6IHRoaXMuY2FsY3VsYXRlSW5zdGFuY2VDb2xvcnN9XG4gICAgfSk7XG5cbiAgICB0aGlzLnVwZGF0ZUNvbG9ycygpO1xuICB9XG5cbiAgd2lsbFJlY2VpdmVQcm9wcyhvbGRQcm9wcywgbmV4dFByb3BzKSB7XG4gICAgc3VwZXIud2lsbFJlY2VpdmVQcm9wcyhvbGRQcm9wcywgbmV4dFByb3BzKTtcbiAgICB0aGlzLnN0YXRlLm1vZGVsLnVzZXJEYXRhLnN0cm9rZVdpZHRoID0gbmV4dFByb3BzLnN0cm9rZVdpZHRoO1xuICAgIHRoaXMudXBkYXRlQ29sb3JzKCk7XG4gIH1cblxuICBjcmVhdGVNb2RlbChnbCkge1xuICAgIGxldCBwb3NpdGlvbnMgPSBbXTtcbiAgICBjb25zdCBOVU1fU0VHTUVOVFMgPSA1MDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE5VTV9TRUdNRU5UUzsgaSsrKSB7XG4gICAgICBwb3NpdGlvbnMgPSBbLi4ucG9zaXRpb25zLCBpLCBpLCBpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IE1vZGVsKHtcbiAgICAgIHByb2dyYW06IG5ldyBQcm9ncmFtKGdsLCB7XG4gICAgICAgIHZzOiBnbHNsaWZ5KCcuL2FyYy1sYXllci12ZXJ0ZXguZ2xzbCcpLFxuICAgICAgICBmczogZ2xzbGlmeSgnLi9hcmMtbGF5ZXItZnJhZ21lbnQuZ2xzbCcpLFxuICAgICAgICBpZDogJ2FyYydcbiAgICAgIH0pLFxuICAgICAgZ2VvbWV0cnk6IG5ldyBHZW9tZXRyeSh7XG4gICAgICAgIGlkOiAnYXJjJyxcbiAgICAgICAgZHJhd01vZGU6ICdMSU5FX1NUUklQJyxcbiAgICAgICAgcG9zaXRpb25zOiBuZXcgRmxvYXQzMkFycmF5KHBvc2l0aW9ucylcbiAgICAgIH0pLFxuICAgICAgaXNJbnN0YW5jZWQ6IHRydWUsXG4gICAgICBvbkJlZm9yZVJlbmRlcigpIHtcbiAgICAgICAgdGhpcy51c2VyRGF0YS5vbGRTdHJva2VXaWR0aCA9IGdsLmdldFBhcmFtZXRlcihnbC5MSU5FX1dJRFRIKTtcbiAgICAgICAgdGhpcy5wcm9ncmFtLmdsLmxpbmVXaWR0aCh0aGlzLnVzZXJEYXRhLnN0cm9rZVdpZHRoIHx8IDEpO1xuICAgICAgfSxcbiAgICAgIG9uQWZ0ZXJSZW5kZXIoKSB7XG4gICAgICAgIHRoaXMucHJvZ3JhbS5nbC5saW5lV2lkdGgodGhpcy51c2VyRGF0YS5vbGRTdHJva2VXaWR0aCB8fCAxKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZUNvbG9ycygpIHtcbiAgICB0aGlzLnNldFVuaWZvcm1zKHtcbiAgICAgIGNvbG9yMDogdGhpcy5wcm9wcy5jb2xvcjAsXG4gICAgICBjb2xvcjE6IHRoaXMucHJvcHMuY29sb3IxXG4gICAgfSk7XG4gIH1cblxuICBjYWxjdWxhdGVJbnN0YW5jZVBvc2l0aW9ucyhhdHRyaWJ1dGUpIHtcbiAgICBjb25zdCB7ZGF0YX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHt2YWx1ZSwgc2l6ZX0gPSBhdHRyaWJ1dGU7XG4gICAgbGV0IGkgPSAwO1xuICAgIGZvciAoY29uc3QgYXJjIG9mIGRhdGEpIHtcbiAgICAgIHZhbHVlW2kgKyAwXSA9IGFyYy5wb3NpdGlvbi54MDtcbiAgICAgIHZhbHVlW2kgKyAxXSA9IGFyYy5wb3NpdGlvbi55MDtcbiAgICAgIHZhbHVlW2kgKyAyXSA9IGFyYy5wb3NpdGlvbi54MTtcbiAgICAgIHZhbHVlW2kgKyAzXSA9IGFyYy5wb3NpdGlvbi55MTtcbiAgICAgIGkgKz0gc2l6ZTtcbiAgICB9XG4gIH1cblxuICBjYWxjdWxhdGVJbnN0YW5jZUNvbG9ycyhhdHRyaWJ1dGUpIHtcbiAgICBjb25zdCB7ZGF0YX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHt2YWx1ZSwgc2l6ZX0gPSBhdHRyaWJ1dGU7XG4gICAgbGV0IGkgPSAwO1xuICAgIGZvciAoY29uc3QgcG9pbnQgb2YgZGF0YSkge1xuICAgICAgdmFsdWVbaSArIDBdID0gcG9pbnQuY29sb3JbMF07XG4gICAgICB2YWx1ZVtpICsgMV0gPSBwb2ludC5jb2xvclsxXTtcbiAgICAgIHZhbHVlW2kgKyAyXSA9IHBvaW50LmNvbG9yWzJdO1xuICAgICAgaSArPSBzaXplO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=