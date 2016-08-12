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

var LineLayer = function (_Layer) {
  _inherits(LineLayer, _Layer);

  /**
   * @classdesc
   * LineLayer
   *
   * @class
   * @param {object} opts
   */
  function LineLayer() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$strokeWidth = _ref.strokeWidth;
    var strokeWidth = _ref$strokeWidth === undefined ? 9 : _ref$strokeWidth;

    var opts = _objectWithoutProperties(_ref, ['strokeWidth']);

    _classCallCheck(this, LineLayer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(LineLayer).call(this, _extends({
      strokeWidth: strokeWidth
    }, opts)));
  }

  _createClass(LineLayer, [{
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
    }
  }, {
    key: 'willReceiveProps',
    value: function willReceiveProps(oldProps, nextProps) {
      _get(Object.getPrototypeOf(LineLayer.prototype), 'willReceiveProps', this).call(this, oldProps, nextProps);
      this.state.model.userData.strokeWidth = nextProps.strokeWidth;
    }
  }, {
    key: 'createModel',
    value: function createModel(gl) {
      var positions = [0, 0, 0, 1, 1, 1];

      return new _luma.Model({
        program: new _luma.Program(gl, {
          vs: '#define GLSLIFY 1\n// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* vertex shader for the line-layer */\n#define SHADER_NAME line-layer-vs\n\nconst float TILE_SIZE_1540259130 = 512.0;\nconst float PI = 3.1415926536;\nconst float WORLD_SCALE_1540259130 = TILE_SIZE_1540259130 / (PI * 2.0);\n\n// non-linear projection: lnglats => zoom 0 tile [0-512, 0-512] * scale\nvec2 mercatorProject(vec2 lnglat, float zoomScale) {\n  float scale = WORLD_SCALE_1540259130 * zoomScale;\n  return vec2(\n  \tscale * (radians(lnglat.x) + PI),\n  \tscale * (PI - log(tan(PI * 0.25 + radians(lnglat.y) * 0.5)))\n  );\n}\n\nuniform float mercatorScale;\n\nattribute vec3 positions;\nattribute vec3 instanceColors;\nattribute vec4 instancePositions;\nattribute vec3 instancePickingColors;\n\nuniform mat4 worldMatrix;\nuniform mat4 projectionMatrix;\nuniform float opacity;\nuniform float renderPickingBuffer;\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  vec2 source = mercatorProject(instancePositions.xy, mercatorScale);\n  vec2 target = mercatorProject(instancePositions.zw, mercatorScale);\n\n  float segmentIndex = positions.x;\n  vec3 p = vec3(\n    // xy: linear interpolation of source & target\n    mix(source, target, segmentIndex),\n    // As per similar comment in choropleth-layer-vertex.glsl\n    // For some reason, need to add one to elevation to show up in untilted mode\n    // This seems to be only a problem on a Mac and not in Windows.\n    1.0\n  );\n\n  gl_Position = projectionMatrix * vec4(p, 1.0);\n\n  vec4 color = vec4(instanceColors / 255.0, opacity);\n  vec4 pickingColor = vec4(instancePickingColors / 255.0, opacity);\n  vColor = mix(color, pickingColor, renderPickingBuffer);\n}\n',
          fs: '// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* fragment shader for the line-layer */\n#define SHADER_NAME line-layer-fs\n\n#ifdef GL_ES\nprecision highp float;\n#define GLSLIFY 1\n#endif\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  gl_FragColor = vColor;\n}\n',
          id: 'line'
        }),
        geometry: new _luma.Geometry({
          id: 'line',
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
          var line = _step.value;

          value[i + 0] = line.position.x0;
          value[i + 1] = line.position.y0;
          value[i + 2] = line.position.x1;
          value[i + 3] = line.position.y1;
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

  return LineLayer;
}(_layer2.default);

exports.default = LineLayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvbGluZS1sYXllci9saW5lLWxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFvQkE7Ozs7QUFDQTs7Ozs7Ozs7OzsrZUFyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBSUEsSUFBTSxVQUFVLFFBQVEsU0FBUixDQUFoQjs7QUFFQSxJQUFNLGFBQWE7QUFDakIscUJBQW1CLEVBQUMsTUFBTSxDQUFQLEVBQVUsS0FBSyxJQUFmLEVBQXFCLEtBQUssSUFBMUIsRUFBZ0MsS0FBSyxJQUFyQyxFQUEyQyxLQUFLLElBQWhELEVBREY7QUFFakIsa0JBQWdCLEVBQUMsTUFBTSxDQUFQLEVBQVUsS0FBSyxLQUFmLEVBQXNCLEtBQUssT0FBM0IsRUFBb0MsS0FBSyxNQUF6QztBQUZDLENBQW5COztJQUtxQixTOzs7QUFDbkI7Ozs7Ozs7QUFPQSx1QkFHUTtBQUFBLHFFQUFKLEVBQUk7O0FBQUEsZ0NBRk4sV0FFTTtBQUFBLFFBRk4sV0FFTSxvQ0FGUSxDQUVSOztBQUFBLFFBREgsSUFDRzs7QUFBQTs7QUFBQTtBQUVKO0FBRkksT0FHRCxJQUhDO0FBS1A7Ozs7c0NBRWlCO0FBQUEsbUJBQ2UsS0FBSyxLQURwQjtBQUFBLFVBQ1QsRUFEUyxVQUNULEVBRFM7QUFBQSxVQUNMLGdCQURLLFVBQ0wsZ0JBREs7OztBQUdoQixVQUFNLFFBQVEsS0FBSyxXQUFMLENBQWlCLEVBQWpCLENBQWQ7QUFDQSxZQUFNLFFBQU4sQ0FBZSxXQUFmLEdBQTZCLEtBQUssS0FBTCxDQUFXLFdBQXhDO0FBQ0EsV0FBSyxRQUFMLENBQWMsRUFBQyxZQUFELEVBQWQ7O0FBRUEsdUJBQWlCLFlBQWpCLENBQThCLFVBQTlCLEVBQTBDO0FBQ3hDLDJCQUFtQixFQUFDLFFBQVEsS0FBSywwQkFBZCxFQURx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eWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IExheWVyIGZyb20gJy4uLy4uL2xheWVyJztcbmltcG9ydCB7TW9kZWwsIFByb2dyYW0sIEdlb21ldHJ5fSBmcm9tICdsdW1hLmdsJztcbmNvbnN0IGdsc2xpZnkgPSByZXF1aXJlKCdnbHNsaWZ5Jyk7XG5cbmNvbnN0IEFUVFJJQlVURVMgPSB7XG4gIGluc3RhbmNlUG9zaXRpb25zOiB7c2l6ZTogNCwgJzAnOiAneDAnLCAnMSc6ICd5MCcsICcyJzogJ3gxJywgJzMnOiAneTEnfSxcbiAgaW5zdGFuY2VDb2xvcnM6IHtzaXplOiAzLCAnMCc6ICdyZWQnLCAnMSc6ICdncmVlbicsICcyJzogJ2JsdWUnfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluZUxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQGNsYXNzZGVzY1xuICAgKiBMaW5lTGF5ZXJcbiAgICpcbiAgICogQGNsYXNzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRzXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgc3Ryb2tlV2lkdGggPSA5LFxuICAgIC4uLm9wdHNcbiAgfSA9IHt9KSB7XG4gICAgc3VwZXIoe1xuICAgICAgc3Ryb2tlV2lkdGgsXG4gICAgICAuLi5vcHRzXG4gICAgfSk7XG4gIH1cblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgY29uc3Qge2dsLCBhdHRyaWJ1dGVNYW5hZ2VyfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBjb25zdCBtb2RlbCA9IHRoaXMuY3JlYXRlTW9kZWwoZ2wpO1xuICAgIG1vZGVsLnVzZXJEYXRhLnN0cm9rZVdpZHRoID0gdGhpcy5wcm9wcy5zdHJva2VXaWR0aDtcbiAgICB0aGlzLnNldFN0YXRlKHttb2RlbH0pO1xuXG4gICAgYXR0cmlidXRlTWFuYWdlci5hZGRJbnN0YW5jZWQoQVRUUklCVVRFUywge1xuICAgICAgaW5zdGFuY2VQb3NpdGlvbnM6IHt1cGRhdGU6IHRoaXMuY2FsY3VsYXRlSW5zdGFuY2VQb3NpdGlvbnN9LFxuICAgICAgaW5zdGFuY2VDb2xvcnM6IHt1cGRhdGU6IHRoaXMuY2FsY3VsYXRlSW5zdGFuY2VDb2xvcnN9XG4gICAgfSk7XG4gIH1cblxuICB3aWxsUmVjZWl2ZVByb3BzKG9sZFByb3BzLCBuZXh0UHJvcHMpIHtcbiAgICBzdXBlci53aWxsUmVjZWl2ZVByb3BzKG9sZFByb3BzLCBuZXh0UHJvcHMpO1xuICAgIHRoaXMuc3RhdGUubW9kZWwudXNlckRhdGEuc3Ryb2tlV2lkdGggPSBuZXh0UHJvcHMuc3Ryb2tlV2lkdGg7XG4gIH1cblxuICBjcmVhdGVNb2RlbChnbCkge1xuICAgIGxldCBwb3NpdGlvbnMgPSBbMCwgMCwgMCwgMSwgMSwgMV07XG5cbiAgICByZXR1cm4gbmV3IE1vZGVsKHtcbiAgICAgIHByb2dyYW06IG5ldyBQcm9ncmFtKGdsLCB7XG4gICAgICAgIHZzOiBnbHNsaWZ5KCcuL2xpbmUtbGF5ZXItdmVydGV4Lmdsc2wnKSxcbiAgICAgICAgZnM6IGdsc2xpZnkoJy4vbGluZS1sYXllci1mcmFnbWVudC5nbHNsJyksXG4gICAgICAgIGlkOiAnbGluZSdcbiAgICAgIH0pLFxuICAgICAgZ2VvbWV0cnk6IG5ldyBHZW9tZXRyeSh7XG4gICAgICAgIGlkOiAnbGluZScsXG4gICAgICAgIGRyYXdNb2RlOiAnTElORV9TVFJJUCcsXG4gICAgICAgIHBvc2l0aW9uczogbmV3IEZsb2F0MzJBcnJheShwb3NpdGlvbnMpXG4gICAgICB9KSxcbiAgICAgIGlzSW5zdGFuY2VkOiB0cnVlLFxuICAgICAgb25CZWZvcmVSZW5kZXIoKSB7XG4gICAgICAgIHRoaXMudXNlckRhdGEub2xkU3Ryb2tlV2lkdGggPSBnbC5nZXRQYXJhbWV0ZXIoZ2wuTElORV9XSURUSCk7XG4gICAgICAgIHRoaXMucHJvZ3JhbS5nbC5saW5lV2lkdGgodGhpcy51c2VyRGF0YS5zdHJva2VXaWR0aCB8fCAxKTtcbiAgICAgIH0sXG4gICAgICBvbkFmdGVyUmVuZGVyKCkge1xuICAgICAgICB0aGlzLnByb2dyYW0uZ2wubGluZVdpZHRoKHRoaXMudXNlckRhdGEub2xkU3Ryb2tlV2lkdGggfHwgMSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBjYWxjdWxhdGVJbnN0YW5jZVBvc2l0aW9ucyhhdHRyaWJ1dGUpIHtcbiAgICBjb25zdCB7ZGF0YX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHt2YWx1ZSwgc2l6ZX0gPSBhdHRyaWJ1dGU7XG4gICAgbGV0IGkgPSAwO1xuICAgIGZvciAoY29uc3QgbGluZSBvZiBkYXRhKSB7XG4gICAgICB2YWx1ZVtpICsgMF0gPSBsaW5lLnBvc2l0aW9uLngwO1xuICAgICAgdmFsdWVbaSArIDFdID0gbGluZS5wb3NpdGlvbi55MDtcbiAgICAgIHZhbHVlW2kgKyAyXSA9IGxpbmUucG9zaXRpb24ueDE7XG4gICAgICB2YWx1ZVtpICsgM10gPSBsaW5lLnBvc2l0aW9uLnkxO1xuICAgICAgaSArPSBzaXplO1xuICAgIH1cbiAgfVxuXG4gIGNhbGN1bGF0ZUluc3RhbmNlQ29sb3JzKGF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IHtkYXRhfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge3ZhbHVlLCBzaXplfSA9IGF0dHJpYnV0ZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChjb25zdCBwb2ludCBvZiBkYXRhKSB7XG4gICAgICB2YWx1ZVtpICsgMF0gPSBwb2ludC5jb2xvclswXTtcbiAgICAgIHZhbHVlW2kgKyAxXSA9IHBvaW50LmNvbG9yWzFdO1xuICAgICAgdmFsdWVbaSArIDJdID0gcG9pbnQuY29sb3JbMl07XG4gICAgICBpICs9IHNpemU7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==