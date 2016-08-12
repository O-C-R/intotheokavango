'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _layer = require('../../layer');

var _layer2 = _interopRequireDefault(_layer);

var _luma = require('luma.gl');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
  instanceColors: { size: 3, '0': 'red', '1': 'green', '2': 'blue' },
  instanceRadius: { size: 1, '0': 'radius' }
};

var ScatterplotLayer = function (_Layer) {
  _inherits(ScatterplotLayer, _Layer);

  _createClass(ScatterplotLayer, null, [{
    key: 'attributes',
    get: function get() {
      return ATTRIBUTES;
    }

    /*
     * @classdesc
     * ScatterplotLayer
     *
     * @class
     * @param {object} props
     * @param {number} props.radius - point radius
     */

  }]);

  function ScatterplotLayer(props) {
    _classCallCheck(this, ScatterplotLayer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ScatterplotLayer).call(this, props));
  }

  _createClass(ScatterplotLayer, [{
    key: 'initializeState',
    value: function initializeState() {
      var gl = this.state.gl;
      var attributeManager = this.state.attributeManager;


      this.setState({
        model: this.getModel(gl)
      });

      attributeManager.addInstanced(ATTRIBUTES, {
        instancePositions: { update: this.calculateInstancePositions },
        instanceColors: { update: this.calculateInstanceColors },
        instanceRadius: { update: this.calculateInstanceRadius}
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
      _get(Object.getPrototypeOf(ScatterplotLayer.prototype), 'willReceiveProps', this).call(this, oldProps, newProps);
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
          vs: '#define GLSLIFY 1\n// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* vertex shader for the scatterplot-layer */\n#define SHADER_NAME scatterplot-layer-vs\n\nhighp float random(vec2 co) {\n  highp float a = 12.9898;\n  highp float b = 78.233;\n  highp float c = 43758.5453;\n  highp float dt= dot(co.xy ,vec2(a,b));\n  highp float sn= mod(dt,3.14);\n  return fract(sin(sn) / c) - .5;\n}\n\nconst float TILE_SIZE_1604150559 = 512.0;\nconst float PI = 3.1415926536;\nconst float WORLD_SCALE_1604150559 = TILE_SIZE_1604150559 / (PI * 2.0);\n\n// non-linear projection: lnglats => zoom 0 tile [0-512, 0-512] * scale\nvec2 mercatorProject(vec2 lnglat, float zoomScale) {\n  float scale = WORLD_SCALE_1604150559 * zoomScale;\n  return vec2(\n  \tscale * (radians(lnglat.x) + PI),\n  \tscale * (PI - log(tan(PI * 0.25 + radians(lnglat.y) * 0.5)))\n  );\n}\n\nuniform float mercatorScale;\n\nattribute vec3 positions;\nattribute vec3 instancePositions;\nattribute vec3 instanceColors;\nattribute vec3 instancePickingColors;\n\nattribute float instanceRadius;\nuniform float opacity;\n\nuniform mat4 worldMatrix;\nuniform mat4 projectionMatrix;\n\nvarying vec4 vColor;\nuniform float renderPickingBuffer;\n\nvoid main(void) {\n  // vec2 pos = mercatorProject(instancePositions.xy);\n  // vec3 p = vec3(pos, instancePositions.z) + positions * instanceRadius;\n  // // gl_Position = projectionMatrix * vec4(p, 1.0);\n  // // float rand = random(pos);\n  // // gl_Position = vec4(rand, rand, 0, 1.);\n\n  // vec4 color = vec4(instanceColors / 255.0, 1.);\n  // vec4 pickingColor = vec4(instancePickingColors / 255.0, 1.);\n  // vColor = mix(color, pickingColor, renderPickingBuffer);\n\n  vec2 pos = mercatorProject(instancePositions.xy, mercatorScale);\n  // For some reason, need to add one to elevation to show up in untilted mode\n  vec3 p = vec3(pos, instancePositions.z + 1.) + positions * instanceRadius;\n  gl_Position = projectionMatrix * vec4(p, 1.0);\n\n  vec4 color = vec4(instanceColors / 255.0, 1.);\n  vec4 pickingColor = vec4(instancePickingColors / 255.0, 1.);\n  vColor = mix(color, pickingColor, renderPickingBuffer);\n}\n',
          fs: '// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* fragment shader for the scatterplot-layer */\n#define SHADER_NAME scatterplot-layer-fs\n\n#ifdef GL_ES\nprecision highp float;\n#define GLSLIFY 1\n#endif\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  gl_FragColor = vColor;\n}\n',
          id: 'scatterplot'
        }),
        geometry: new _luma.Geometry({
          drawMode: 'TRIANGLE_FAN',
          positions: new Float32Array(positions)
        }),
        isInstanced: true
      });
    }
  }, {
    key: 'updateUniforms',
    value: function updateUniforms() {
      // this.calculateRadius();
      // var radius = this.state.radius;

      // this.setUniforms({
        // radius: radius
      // });
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
          var point = _step.value;

          value[i + 0] = point.position.x;
          value[i + 1] = point.position.y;
          value[i + 2] = point.position.z;
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
    key: 'calculateInstanceRadius',
    value: function calculateInstanceRadius(attribute) {
      var data = this.props.data;
      var value = attribute.value;
      var size = attribute.size;

      var i = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var point = _step.value;

          value[i + 0] = point.radius;
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
  }, 
  // {
  //   key: 'calculateRadius',
  //   value: function calculateRadius() {
  //     // use radius if specified
  //     if (this.props.radius) {
  //       this.state.radius = this.props.radius;
  //       return;
  //     }

  //     var pixel0 = this.project({ lon: -122, lat: 37.5 });
  //     var pixel1 = this.project({ lon: -122, lat: 37.5002 });

  //     var dx = pixel0.x - pixel1.x;
  //     var dy = pixel0.y - pixel1.y;

  //     this.state.radius = Math.max(Math.sqrt(dx * dx + dy * dy), 2.0);
  //   }
  // }
  ]);

  return ScatterplotLayer;
}(_layer2.default);

exports.default = ScatterplotLayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvc2NhdHRlcnBsb3QtbGF5ZXIvc2NhdHRlcnBsb3QtbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFvQkE7Ozs7QUFDQTs7Ozs7Ozs7OzsrZUFyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBSUEsSUFBTSxVQUFVLFFBQVEsU0FBUixDQUFoQjs7QUFFQSxJQUFNLGFBQWE7QUFDakIscUJBQW1CLEVBQUMsTUFBTSxDQUFQLEVBQVUsS0FBSyxHQUFmLEVBQW9CLEtBQUssR0FBekIsRUFBOEIsS0FBSyxRQUFuQyxFQURGO0FBRWpCLGtCQUFnQixFQUFDLE1BQU0sQ0FBUCxFQUFVLEtBQUssS0FBZixFQUFzQixLQUFLLE9BQTNCLEVBQW9DLEtBQUssTUFBekM7QUFGQyxDQUFuQjs7SUFLcUIsZ0I7Ozs7O3dCQUVLO0FBQ3RCLGFBQU8sVUFBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7OztBQVFBLDRCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSwrRkFDWCxLQURXO0FBRWxCOzs7O3NDQUVpQjtBQUFBLFVBQ1QsRUFEUyxHQUNILEtBQUssS0FERixDQUNULEVBRFM7QUFBQSxVQUVULGdCQUZTLEdBRVcsS0FBSyxLQUZoQixDQUVULGdCQUZTOzs7QUFJaEIsV0FBSyxRQUFMLENBQWM7QUFDWixlQUFPLEtBQUssUUFBTCxDQUFjLEVBQWQ7QUFESyxPQUFkOztBQUlBLHVCQUFpQixZQUFqQixDQUE4QixVQUE5QixFQUEwQztBQUN4QywyQkFBbUIsRUFBQyxRQUFRLEtBQUssMEJBQWQsRUFEcUI7QUFFeEMsd0JBQWdCLEVBQUMsUUFBUSxLQUFLLHVCQUFkO0FBRndCLE9BQTFDO0FBSUQ7OzsrQkFFVTtBQUNULFdBQUssY0FBTDtBQUNEOzs7cUNBRWdCLFEsRUFBVSxRLEVBQVU7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QUssT0FBTCxDQUFhLEVBQUMsS0FBSyxDQUFDLEdBQVAsRUFBWSxLQUFLLE9BQWpCLEVBQWIsQ0FBZjs7QUFFQSxVQUFNLEtBQUssT0FBTyxDQUFQLEdBQVcsT0FBTyxDQUE3QjtBQUNBLFVBQU0sS0FBSyxPQUFPLENBQVAsR0FBVyxPQUFPLENBQTdCOztBQUVBLFdBQUssS0FBTCxDQUFXLE1BQVgsR0FBb0IsS0FBSyxHQUFMLENBQVMsS0FBSyxJQUFMLENBQVUsS0FBSyxFQUFMLEdBQVUsS0FBSyxFQUF6QixDQUFULEVBQXVDLEdBQXZDLENBQXBCO0FBQ0Q7Ozs7OztrQkFuSGtCLGdCIiwiZmlsZSI6InNjYXR0ZXJwbG90LWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IExheWVyIGZyb20gJy4uLy4uL2xheWVyJztcbmltcG9ydCB7TW9kZWwsIFByb2dyYW0sIEdlb21ldHJ5fSBmcm9tICdsdW1hLmdsJztcbmNvbnN0IGdsc2xpZnkgPSByZXF1aXJlKCdnbHNsaWZ5Jyk7XG5cbmNvbnN0IEFUVFJJQlVURVMgPSB7XG4gIGluc3RhbmNlUG9zaXRpb25zOiB7c2l6ZTogMywgJzAnOiAneCcsICcxJzogJ3knLCAnMic6ICd1bnVzZWQnfSxcbiAgaW5zdGFuY2VDb2xvcnM6IHtzaXplOiAzLCAnMCc6ICdyZWQnLCAnMSc6ICdncmVlbicsICcyJzogJ2JsdWUnfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NhdHRlcnBsb3RMYXllciBleHRlbmRzIExheWVyIHtcblxuICBzdGF0aWMgZ2V0IGF0dHJpYnV0ZXMoKSB7XG4gICAgcmV0dXJuIEFUVFJJQlVURVM7XG4gIH1cblxuICAvKlxuICAgKiBAY2xhc3NkZXNjXG4gICAqIFNjYXR0ZXJwbG90TGF5ZXJcbiAgICpcbiAgICogQGNsYXNzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wc1xuICAgKiBAcGFyYW0ge251bWJlcn0gcHJvcHMucmFkaXVzIC0gcG9pbnQgcmFkaXVzXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICBjb25zdCB7Z2x9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCB7YXR0cmlidXRlTWFuYWdlcn0gPSB0aGlzLnN0YXRlO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb2RlbDogdGhpcy5nZXRNb2RlbChnbClcbiAgICB9KTtcblxuICAgIGF0dHJpYnV0ZU1hbmFnZXIuYWRkSW5zdGFuY2VkKEFUVFJJQlVURVMsIHtcbiAgICAgIGluc3RhbmNlUG9zaXRpb25zOiB7dXBkYXRlOiB0aGlzLmNhbGN1bGF0ZUluc3RhbmNlUG9zaXRpb25zfSxcbiAgICAgIGluc3RhbmNlQ29sb3JzOiB7dXBkYXRlOiB0aGlzLmNhbGN1bGF0ZUluc3RhbmNlQ29sb3JzfVxuICAgIH0pO1xuICB9XG5cbiAgZGlkTW91bnQoKSB7XG4gICAgdGhpcy51cGRhdGVVbmlmb3JtcygpO1xuICB9XG5cbiAgd2lsbFJlY2VpdmVQcm9wcyhvbGRQcm9wcywgbmV3UHJvcHMpIHtcbiAgICBzdXBlci53aWxsUmVjZWl2ZVByb3BzKG9sZFByb3BzLCBuZXdQcm9wcyk7XG4gICAgdGhpcy51cGRhdGVVbmlmb3JtcygpO1xuICB9XG5cbiAgZ2V0TW9kZWwoZ2wpIHtcbiAgICBjb25zdCBOVU1fU0VHTUVOVFMgPSAxNjtcbiAgICBjb25zdCBQSTIgPSBNYXRoLlBJICogMjtcblxuICAgIGxldCBwb3NpdGlvbnMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE5VTV9TRUdNRU5UUzsgaSsrKSB7XG4gICAgICBwb3NpdGlvbnMgPSBbXG4gICAgICAgIC4uLnBvc2l0aW9ucyxcbiAgICAgICAgTWF0aC5jb3MoUEkyICogaSAvIE5VTV9TRUdNRU5UUyksXG4gICAgICAgIE1hdGguc2luKFBJMiAqIGkgLyBOVU1fU0VHTUVOVFMpLFxuICAgICAgICAwXG4gICAgICBdO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgTW9kZWwoe1xuICAgICAgcHJvZ3JhbTogbmV3IFByb2dyYW0oZ2wsIHtcbiAgICAgICAgdnM6IGdsc2xpZnkoJy4vc2NhdHRlcnBsb3QtbGF5ZXItdmVydGV4Lmdsc2wnKSxcbiAgICAgICAgZnM6IGdsc2xpZnkoJy4vc2NhdHRlcnBsb3QtbGF5ZXItZnJhZ21lbnQuZ2xzbCcpLFxuICAgICAgICBpZDogJ3NjYXR0ZXJwbG90J1xuICAgICAgfSksXG4gICAgICBnZW9tZXRyeTogbmV3IEdlb21ldHJ5KHtcbiAgICAgICAgZHJhd01vZGU6ICdUUklBTkdMRV9GQU4nLFxuICAgICAgICBwb3NpdGlvbnM6IG5ldyBGbG9hdDMyQXJyYXkocG9zaXRpb25zKVxuICAgICAgfSksXG4gICAgICBpc0luc3RhbmNlZDogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlVW5pZm9ybXMoKSB7XG4gICAgdGhpcy5jYWxjdWxhdGVSYWRpdXMoKTtcbiAgICBjb25zdCB7cmFkaXVzfSA9IHRoaXMuc3RhdGU7XG4gICAgdGhpcy5zZXRVbmlmb3Jtcyh7XG4gICAgICByYWRpdXNcbiAgICB9KTtcbiAgfVxuXG4gIGNhbGN1bGF0ZUluc3RhbmNlUG9zaXRpb25zKGF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IHtkYXRhfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge3ZhbHVlLCBzaXplfSA9IGF0dHJpYnV0ZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChjb25zdCBwb2ludCBvZiBkYXRhKSB7XG4gICAgICB2YWx1ZVtpICsgMF0gPSBwb2ludC5wb3NpdGlvbi54O1xuICAgICAgdmFsdWVbaSArIDFdID0gcG9pbnQucG9zaXRpb24ueTtcbiAgICAgIHZhbHVlW2kgKyAyXSA9IHBvaW50LnBvc2l0aW9uLno7XG4gICAgICBpICs9IHNpemU7XG4gICAgfVxuICB9XG5cbiAgY2FsY3VsYXRlSW5zdGFuY2VDb2xvcnMoYXR0cmlidXRlKSB7XG4gICAgY29uc3Qge2RhdGF9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7dmFsdWUsIHNpemV9ID0gYXR0cmlidXRlO1xuICAgIGxldCBpID0gMDtcbiAgICBmb3IgKGNvbnN0IHBvaW50IG9mIGRhdGEpIHtcbiAgICAgIHZhbHVlW2kgKyAwXSA9IHBvaW50LmNvbG9yWzBdO1xuICAgICAgdmFsdWVbaSArIDFdID0gcG9pbnQuY29sb3JbMV07XG4gICAgICB2YWx1ZVtpICsgMl0gPSBwb2ludC5jb2xvclsyXTtcbiAgICAgIGkgKz0gc2l6ZTtcbiAgICB9XG4gIH1cblxuICBjYWxjdWxhdGVSYWRpdXMoKSB7XG4gICAgLy8gdXNlIHJhZGl1cyBpZiBzcGVjaWZpZWRcbiAgICBpZiAodGhpcy5wcm9wcy5yYWRpdXMpIHtcbiAgICAgIHRoaXMuc3RhdGUucmFkaXVzID0gdGhpcy5wcm9wcy5yYWRpdXM7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGl4ZWwwID0gdGhpcy5wcm9qZWN0KHtsb246IC0xMjIsIGxhdDogMzcuNX0pO1xuICAgIGNvbnN0IHBpeGVsMSA9IHRoaXMucHJvamVjdCh7bG9uOiAtMTIyLCBsYXQ6IDM3LjUwMDJ9KTtcblxuICAgIGNvbnN0IGR4ID0gcGl4ZWwwLnggLSBwaXhlbDEueDtcbiAgICBjb25zdCBkeSA9IHBpeGVsMC55IC0gcGl4ZWwxLnk7XG5cbiAgICB0aGlzLnN0YXRlLnJhZGl1cyA9IE1hdGgubWF4KE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSksIDIuMCk7XG4gIH1cblxufVxuIl19