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

var _earcut = require('earcut');

var _earcut2 = _interopRequireDefault(_earcut);

var _lodash = require('lodash.flattendeep');

var _lodash2 = _interopRequireDefault(_lodash);

var _geojsonNormalize = require('geojson-normalize');

var _geojsonNormalize2 = _interopRequireDefault(_geojsonNormalize);

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
  indices: { size: 1, '0': 'index', isIndexed: true },
  positions: { size: 3, '0': 'x', '1': 'y', '2': 'unused' },
  colors: { size: 3, '0': 'red', '1': 'green', '2': 'blue' },
  // Override picking colors to prevent auto allocation
  pickingColors: { size: 3, '0': 'pickRed', '1': 'pickGreen', '2': 'pickBlue' }
};

var ChoroplethLayer = function (_Layer) {
  _inherits(ChoroplethLayer, _Layer);

  /**
   * @classdesc
   * ChoroplethLayer
   *
   * @class
   * @param {object} props
   * @param {bool} props.drawContour - ? drawContour : drawArea
   * @param {function} props.onChoroplethHovered - provide proerties of the
   * selected choropleth, together with the mouse event when mouse hovered
   * @param {function} props.onChoroplethClicked - provide proerties of the
   * selected choropleth, together with the mouse event when mouse clicked
   */
  function ChoroplethLayer(props) {
    _classCallCheck(this, ChoroplethLayer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ChoroplethLayer).call(this, _extends({
      opacity: 1
    }, props)));
  }

  _createClass(ChoroplethLayer, [{
    key: 'initializeState',
    value: function initializeState() {
      var _state = this.state;
      var gl = _state.gl;
      var attributeManager = _state.attributeManager;


      attributeManager.addDynamic(ATTRIBUTES, {
        // Primtive attributes
        indices: { update: this.calculateIndices },
        positions: { update: this.calculatePositions },
        colors: { update: this.calculateColors },
        // Instanced attributes
        pickingColors: { update: this.calculatePickingColors, noAlloc: true }
      });

      this.setUniforms({ opacity: this.props.opacity });
      this.setState({
        numInstances: 0,
        model: this.getModel(gl)
      });

      this.extractChoropleths();
    }
  }, {
    key: 'willReceiveProps',
    value: function willReceiveProps(oldProps, newProps) {
      _get(Object.getPrototypeOf(ChoroplethLayer.prototype), 'willReceiveProps', this).call(this, oldProps, newProps);

      var _state2 = this.state;
      var dataChanged = _state2.dataChanged;
      var attributeManager = _state2.attributeManager;

      if (dataChanged) {
        this.extractChoropleths();

        attributeManager.invalidateAll();
      }

      if (oldProps.opacity !== newProps.opacity) {
        this.setUniforms({ opacity: newProps.opacity });
      }
    }
  }, {
    key: 'getModel',
    value: function getModel(gl) {
      return new _luma.Model({
        program: new _luma.Program(gl, {
          vs: '#define GLSLIFY 1\n// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* vertex shader for the choropleth-layer */\n#define SHADER_NAME choropleth-layer-vertex-shader\n\nconst float TILE_SIZE_1540259130 = 512.0;\nconst float PI = 3.1415926536;\nconst float WORLD_SCALE_1540259130 = TILE_SIZE_1540259130 / (PI * 2.0);\n\n// non-linear projection: lnglats => zoom 0 tile [0-512, 0-512] * scale\nvec2 mercatorProject(vec2 lnglat, float zoomScale) {\n  float scale = WORLD_SCALE_1540259130 * zoomScale;\n  return vec2(\n  \tscale * (radians(lnglat.x) + PI),\n  \tscale * (PI - log(tan(PI * 0.25 + radians(lnglat.y) * 0.5)))\n  );\n}\n\nuniform float mercatorScale;\n\nattribute vec3 positions;\nattribute vec3 colors;\nattribute vec3 pickingColors;\n\nuniform mat4 projectionMatrix;\nuniform mat4 worldMatrix;\n\nuniform float opacity;\nuniform float renderPickingBuffer;\nuniform vec3 selectedPickingColor;\n\nvarying vec4 vColor;\n\nvec4 getColor(vec4 color, float opacity, vec3 pickingColor, float renderPickingBuffer) {\n  vec4 color4 = vec4(color.xyz / 255., color.w / 255. * opacity);\n  vec4 pickingColor4 = vec4(pickingColor / 255., 1.);\n  return mix(color4, pickingColor4, renderPickingBuffer);\n}\n\nvoid main(void) {\n  vec2 pos = mercatorProject(positions.xy, mercatorScale);\n  // For some reason, need to add one to elevation to show up in untilted mode\n  vec3 p = vec3(pos.xy, positions.z + 1.);\n  gl_Position = projectionMatrix * vec4(p, 1.);\n\n  vec4 color = vec4(colors / 255., opacity);\n  vec4 pickingColor = vec4(pickingColors / 255., 1.);\n  vColor = mix(color, pickingColor, renderPickingBuffer);\n\n  // float alpha = pickingColors == selectedPickingColor ? 0.5 : opacity;\n  // vColor = vec4(mix(colors / 255., pickingColors / 255., renderPickingBuffer), alpha);\n}\n',
          fs: '// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* fragment shader for the choropleth-layer */\n\n#ifdef GL_ES\nprecision highp float;\n#define GLSLIFY 1\n#endif\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  gl_FragColor = vColor;\n}\n',
          id: 'choropleth'
        }),
        geometry: new _luma.Geometry({
          id: this.props.id,
          drawMode: this.props.drawContour ? 'LINES' : 'TRIANGLES'
        }),
        vertexCount: 0,
        isIndexed: true
      });
    }
  }, {
    key: 'calculatePositions',
    value: function calculatePositions(attribute) {
      var vertices = (0, _lodash2.default)(this.state.groupedVertices);
      attribute.value = new Float32Array(vertices);
    }
  }, {
    key: 'calculateIndices',
    value: function calculateIndices(attribute) {
      var _this2 = this;

      // adjust index offset for multiple choropleths
      var offsets = this.state.groupedVertices.reduce(function (acc, vertices) {
        return [].concat(_toConsumableArray(acc), [acc[acc.length - 1] + vertices.length]);
      }, [0]);

      var indices = this.state.groupedVertices.map(function (vertices, choroplethIndex) {
        return _this2.props.drawContour ?
        // 1. get sequentially ordered indices of each choropleth contour
        // 2. offset them by the number of indices in previous choropleths
        _this2.calculateContourIndices(vertices.length).map(function (index) {
          return index + offsets[choroplethIndex];
        }) :
        // 1. get triangulated indices for the internal areas
        // 2. offset them by the number of indices in previous choropleths
        (0, _earcut2.default)((0, _lodash2.default)(vertices), null, 3).map(function (index) {
          return index + offsets[choroplethIndex];
        });
      });

      attribute.value = new Uint16Array((0, _lodash2.default)(indices));
      attribute.target = this.state.gl.ELEMENT_ARRAY_BUFFER;
      this.state.model.setVertexCount(attribute.value.length / attribute.size);
    }
  }, {
    key: 'calculateColors',
    value: function calculateColors(attribute) {
      var _this3 = this;

      var colors = this.state.groupedVertices.map(function (vertices) {
        return vertices.map(function (vertex) {
          return _this3.props.drawContour ? [0, 0, 0] : [128, 128, 128];
        });
      });

      attribute.value = new Float32Array((0, _lodash2.default)(colors));
    }

    // Override the default picking colors calculation

  }, {
    key: 'calculatePickingColors',
    value: function calculatePickingColors(attribute) {
      var _this4 = this;

      var colors = this.state.groupedVertices.map(function (vertices, choroplethIndex) {
        return vertices.map(function (vertex) {
          return _this4.props.drawContour ? [-1, -1, -1] : [(choroplethIndex + 1) % 256, Math.floor((choroplethIndex + 1) / 256) % 256, Math.floor((choroplethIndex + 1) / 256 / 256) % 256];
        });
      });

      attribute.value = new Float32Array((0, _lodash2.default)(colors));
    }
  }, {
    key: 'extractChoropleths',
    value: function extractChoropleths() {
      var data = this.props.data;

      var normalizedGeojson = (0, _geojsonNormalize2.default)(data);

      this.state.choropleths = normalizedGeojson.features.map(function (choropleth) {
        var coordinates = choropleth.geometry.coordinates[0];
        // flatten nested polygons
        if (coordinates.length === 1 && coordinates[0].length > 2) {
          coordinates = coordinates[0];
        }
        return {
          properties: choropleth.properties,
          coordinates: coordinates
        };
      });

      this.state.groupedVertices = this.state.choropleths.map(function (choropleth) {
        return choropleth.coordinates.map(function (coordinate) {
          return [coordinate[0], coordinate[1], 0];
        });
      });
    }
  }, {
    key: 'calculateContourIndices',
    value: function calculateContourIndices(numVertices) {
      // use vertex pairs for gl.LINES => [0, 1, 1, 2, 2, ..., n-1, n-1, 0]
      var indices = [];
      for (var i = 1; i < numVertices - 1; i++) {
        indices = [].concat(_toConsumableArray(indices), [i, i]);
      }
      return [0].concat(_toConsumableArray(indices), [0]);
    }
  }, {
    key: 'onHover',
    value: function onHover(info) {
      var index = info.index;
      var data = this.props.data;

      var feature = data.features[index];
      this.props.onHover(_extends({}, info, { feature: feature }));
    }
  }, {
    key: 'onClick',
    value: function onClick(info) {
      var index = info.index;
      var data = this.props.data;

      var feature = data.features[index];
      this.props.onClick(_extends({}, info, { feature: feature }));
    }
  }]);

  return ChoroplethLayer;
}(_layer2.default);

exports.default = ChoroplethLayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvY2hvcm9wbGV0aC1sYXllci9jaG9yb3BsZXRoLWxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFvQkE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OzsrZUF4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBT0EsSUFBTSxVQUFVLFFBQVEsU0FBUixDQUFoQjs7QUFFQSxJQUFNLGFBQWE7QUFDakIsV0FBUyxFQUFDLE1BQU0sQ0FBUCxFQUFVLEtBQUssT0FBZixFQUF3QixXQUFXLElBQW5DLEVBRFE7QUFFakIsYUFBVyxFQUFDLE1BQU0sQ0FBUCxFQUFVLEtBQUssR0FBZixFQUFvQixLQUFLLEdBQXpCLEVBQThCLEtBQUssUUFBbkMsRUFGTTtBQUdqQixVQUFRLEVBQUMsTUFBTSxDQUFQLEVBQVUsS0FBSyxLQUFmLEVBQXNCLEtBQUssT0FBM0IsRUFBb0MsS0FBSyxNQUF6QyxFQUhTO0FBSWpCO0FBQ0EsaUJBQWUsRUFBQyxNQUFNLENBQVAsRUFBVSxLQUFLLFNBQWYsRUFBMEIsS0FBSyxXQUEvQixFQUE0QyxLQUFLLFVBQWpEO0FBTEUsQ0FBbkI7O0lBUXFCLGU7OztBQUNuQjs7Ozs7Ozs7Ozs7O0FBWUEsMkJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBO0FBRWYsZUFBUztBQUZNLE9BR1osS0FIWTtBQUtsQjs7OztzQ0FFaUI7QUFBQSxtQkFDZSxLQUFLLEtBRHBCO0FBQUEsVUFDVCxFQURTLFVBQ1QsRUFEUztBQUFBLFVBQ0wsZ0JBREssVUFDTCxnQkFESzs7O0FBR2hCLHVCQUFpQixVQUFqQixDQUE0QixVQUE1QixFQUF3QztBQUN0QztBQUNBLGlCQUFTLEVBQUMsUUFBUSxLQUFLLGdCQUFkLEVBRjZCO0FBR3RDLG1CQUFXLEVB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RkssR0FFRyxLQUFLLEtBRlIsQ0FFTCxJQUZLOztBQUdaLFVBQU0sVUFBVSxLQUFLLFFBQUwsQ0FBYyxLQUFkLENBQWhCO0FBQ0EsV0FBSyxLQUFMLENBQVcsT0FBWCxjQUF1QixJQUF2QixJQUE2QixnQkFBN0I7QUFDRDs7Ozs7O2tCQTVLa0IsZSIsImZpbGUiOiJjaG9yb3BsZXRoLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IExheWVyIGZyb20gJy4uLy4uL2xheWVyJztcbmltcG9ydCBlYXJjdXQgZnJvbSAnZWFyY3V0JztcbmltcG9ydCBmbGF0dGVuRGVlcCBmcm9tICdsb2Rhc2guZmxhdHRlbmRlZXAnO1xuaW1wb3J0IG5vcm1hbGl6ZSBmcm9tICdnZW9qc29uLW5vcm1hbGl6ZSc7XG5pbXBvcnQge01vZGVsLCBQcm9ncmFtLCBHZW9tZXRyeX0gZnJvbSAnbHVtYS5nbCc7XG5jb25zdCBnbHNsaWZ5ID0gcmVxdWlyZSgnZ2xzbGlmeScpO1xuXG5jb25zdCBBVFRSSUJVVEVTID0ge1xuICBpbmRpY2VzOiB7c2l6ZTogMSwgJzAnOiAnaW5kZXgnLCBpc0luZGV4ZWQ6IHRydWV9LFxuICBwb3NpdGlvbnM6IHtzaXplOiAzLCAnMCc6ICd4JywgJzEnOiAneScsICcyJzogJ3VudXNlZCd9LFxuICBjb2xvcnM6IHtzaXplOiAzLCAnMCc6ICdyZWQnLCAnMSc6ICdncmVlbicsICcyJzogJ2JsdWUnfSxcbiAgLy8gT3ZlcnJpZGUgcGlja2luZyBjb2xvcnMgdG8gcHJldmVudCBhdXRvIGFsbG9jYXRpb25cbiAgcGlja2luZ0NvbG9yczoge3NpemU6IDMsICcwJzogJ3BpY2tSZWQnLCAnMSc6ICdwaWNrR3JlZW4nLCAnMic6ICdwaWNrQmx1ZSd9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaG9yb3BsZXRoTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAY2xhc3NkZXNjXG4gICAqIENob3JvcGxldGhMYXllclxuICAgKlxuICAgKiBAY2xhc3NcbiAgICogQHBhcmFtIHtvYmplY3R9IHByb3BzXG4gICAqIEBwYXJhbSB7Ym9vbH0gcHJvcHMuZHJhd0NvbnRvdXIgLSA/IGRyYXdDb250b3VyIDogZHJhd0FyZWFcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gcHJvcHMub25DaG9yb3BsZXRoSG92ZXJlZCAtIHByb3ZpZGUgcHJvZXJ0aWVzIG9mIHRoZVxuICAgKiBzZWxlY3RlZCBjaG9yb3BsZXRoLCB0b2dldGhlciB3aXRoIHRoZSBtb3VzZSBldmVudCB3aGVuIG1vdXNlIGhvdmVyZWRcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gcHJvcHMub25DaG9yb3BsZXRoQ2xpY2tlZCAtIHByb3ZpZGUgcHJvZXJ0aWVzIG9mIHRoZVxuICAgKiBzZWxlY3RlZCBjaG9yb3BsZXRoLCB0b2dldGhlciB3aXRoIHRoZSBtb3VzZSBldmVudCB3aGVuIG1vdXNlIGNsaWNrZWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIoe1xuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIC4uLnByb3BzXG4gICAgfSk7XG4gIH1cblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgY29uc3Qge2dsLCBhdHRyaWJ1dGVNYW5hZ2VyfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBhdHRyaWJ1dGVNYW5hZ2VyLmFkZER5bmFtaWMoQVRUUklCVVRFUywge1xuICAgICAgLy8gUHJpbXRpdmUgYXR0cmlidXRlc1xuICAgICAgaW5kaWNlczoge3VwZGF0ZTogdGhpcy5jYWxjdWxhdGVJbmRpY2VzfSxcbiAgICAgIHBvc2l0aW9uczoge3VwZGF0ZTogdGhpcy5jYWxjdWxhdGVQb3NpdGlvbnN9LFxuICAgICAgY29sb3JzOiB7dXBkYXRlOiB0aGlzLmNhbGN1bGF0ZUNvbG9yc30sXG4gICAgICAvLyBJbnN0YW5jZWQgYXR0cmlidXRlc1xuICAgICAgcGlja2luZ0NvbG9yczoge3VwZGF0ZTogdGhpcy5jYWxjdWxhdGVQaWNraW5nQ29sb3JzLCBub0FsbG9jOiB0cnVlfVxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRVbmlmb3Jtcyh7b3BhY2l0eTogdGhpcy5wcm9wcy5vcGFjaXR5fSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBudW1JbnN0YW5jZXM6IDAsXG4gICAgICBtb2RlbDogdGhpcy5nZXRNb2RlbChnbClcbiAgICB9KTtcblxuICAgIHRoaXMuZXh0cmFjdENob3JvcGxldGhzKCk7XG4gIH1cblxuICB3aWxsUmVjZWl2ZVByb3BzKG9sZFByb3BzLCBuZXdQcm9wcykge1xuICAgIHN1cGVyLndpbGxSZWNlaXZlUHJvcHMob2xkUHJvcHMsIG5ld1Byb3BzKTtcblxuICAgIGNvbnN0IHtkYXRhQ2hhbmdlZCwgYXR0cmlidXRlTWFuYWdlcn0gPSB0aGlzLnN0YXRlO1xuICAgIGlmIChkYXRhQ2hhbmdlZCkge1xuICAgICAgdGhpcy5leHRyYWN0Q2hvcm9wbGV0aHMoKTtcblxuICAgICAgYXR0cmlidXRlTWFuYWdlci5pbnZhbGlkYXRlQWxsKCk7XG4gICAgfVxuXG4gICAgaWYgKG9sZFByb3BzLm9wYWNpdHkgIT09IG5ld1Byb3BzLm9wYWNpdHkpIHtcbiAgICAgIHRoaXMuc2V0VW5pZm9ybXMoe29wYWNpdHk6IG5ld1Byb3BzLm9wYWNpdHl9KTtcbiAgICB9XG4gIH1cblxuICBnZXRNb2RlbChnbCkge1xuICAgIHJldHVybiBuZXcgTW9kZWwoe1xuICAgICAgcHJvZ3JhbTogbmV3IFByb2dyYW0oZ2wsIHtcbiAgICAgICAgdnM6IGdsc2xpZnkoJy4vY2hvcm9wbGV0aC1sYXllci12ZXJ0ZXguZ2xzbCcpLFxuICAgICAgICBmczogZ2xzbGlmeSgnLi9jaG9yb3BsZXRoLWxheWVyLWZyYWdtZW50Lmdsc2wnKSxcbiAgICAgICAgaWQ6ICdjaG9yb3BsZXRoJ1xuICAgICAgfSksXG4gICAgICBnZW9tZXRyeTogbmV3IEdlb21ldHJ5KHtcbiAgICAgICAgaWQ6IHRoaXMucHJvcHMuaWQsXG4gICAgICAgIGRyYXdNb2RlOiB0aGlzLnByb3BzLmRyYXdDb250b3VyID8gJ0xJTkVTJyA6ICdUUklBTkdMRVMnXG4gICAgICB9KSxcbiAgICAgIHZlcnRleENvdW50OiAwLFxuICAgICAgaXNJbmRleGVkOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBjYWxjdWxhdGVQb3NpdGlvbnMoYXR0cmlidXRlKSB7XG4gICAgY29uc3QgdmVydGljZXMgPSBmbGF0dGVuRGVlcCh0aGlzLnN0YXRlLmdyb3VwZWRWZXJ0aWNlcyk7XG4gICAgYXR0cmlidXRlLnZhbHVlID0gbmV3IEZsb2F0MzJBcnJheSh2ZXJ0aWNlcyk7XG4gIH1cblxuICBjYWxjdWxhdGVJbmRpY2VzKGF0dHJpYnV0ZSkge1xuICAgIC8vIGFkanVzdCBpbmRleCBvZmZzZXQgZm9yIG11bHRpcGxlIGNob3JvcGxldGhzXG4gICAgY29uc3Qgb2Zmc2V0cyA9IHRoaXMuc3RhdGUuZ3JvdXBlZFZlcnRpY2VzLnJlZHVjZShcbiAgICAgIChhY2MsIHZlcnRpY2VzKSA9PiBbLi4uYWNjLCBhY2NbYWNjLmxlbmd0aCAtIDFdICsgdmVydGljZXMubGVuZ3RoXSxcbiAgICAgIFswXVxuICAgICk7XG5cbiAgICBjb25zdCBpbmRpY2VzID0gdGhpcy5zdGF0ZS5ncm91cGVkVmVydGljZXMubWFwKFxuICAgICAgKHZlcnRpY2VzLCBjaG9yb3BsZXRoSW5kZXgpID0+IHRoaXMucHJvcHMuZHJhd0NvbnRvdXIgP1xuICAgICAgICAvLyAxLiBnZXQgc2VxdWVudGlhbGx5IG9yZGVyZWQgaW5kaWNlcyBvZiBlYWNoIGNob3JvcGxldGggY29udG91clxuICAgICAgICAvLyAyLiBvZmZzZXQgdGhlbSBieSB0aGUgbnVtYmVyIG9mIGluZGljZXMgaW4gcHJldmlvdXMgY2hvcm9wbGV0aHNcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVDb250b3VySW5kaWNlcyh2ZXJ0aWNlcy5sZW5ndGgpLm1hcChcbiAgICAgICAgICBpbmRleCA9PiBpbmRleCArIG9mZnNldHNbY2hvcm9wbGV0aEluZGV4XVxuICAgICAgICApIDpcbiAgICAgICAgLy8gMS4gZ2V0IHRyaWFuZ3VsYXRlZCBpbmRpY2VzIGZvciB0aGUgaW50ZXJuYWwgYXJlYXNcbiAgICAgICAgLy8gMi4gb2Zmc2V0IHRoZW0gYnkgdGhlIG51bWJlciBvZiBpbmRpY2VzIGluIHByZXZpb3VzIGNob3JvcGxldGhzXG4gICAgICAgIGVhcmN1dChmbGF0dGVuRGVlcCh2ZXJ0aWNlcyksIG51bGwsIDMpLm1hcChcbiAgICAgICAgICBpbmRleCA9PiBpbmRleCArIG9mZnNldHNbY2hvcm9wbGV0aEluZGV4XVxuICAgICAgICApXG4gICAgKTtcblxuICAgIGF0dHJpYnV0ZS52YWx1ZSA9IG5ldyBVaW50MTZBcnJheShmbGF0dGVuRGVlcChpbmRpY2VzKSk7XG4gICAgYXR0cmlidXRlLnRhcmdldCA9IHRoaXMuc3RhdGUuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVI7XG4gICAgdGhpcy5zdGF0ZS5tb2RlbC5zZXRWZXJ0ZXhDb3VudChhdHRyaWJ1dGUudmFsdWUubGVuZ3RoIC8gYXR0cmlidXRlLnNpemUpO1xuICB9XG5cbiAgY2FsY3VsYXRlQ29sb3JzKGF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IGNvbG9ycyA9IHRoaXMuc3RhdGUuZ3JvdXBlZFZlcnRpY2VzLm1hcChcbiAgICAgIHZlcnRpY2VzID0+IHZlcnRpY2VzLm1hcChcbiAgICAgICAgdmVydGV4ID0+IHRoaXMucHJvcHMuZHJhd0NvbnRvdXIgPyBbMCwgMCwgMF0gOiBbMTI4LCAxMjgsIDEyOF1cbiAgICAgIClcbiAgICApO1xuXG4gICAgYXR0cmlidXRlLnZhbHVlID0gbmV3IEZsb2F0MzJBcnJheShmbGF0dGVuRGVlcChjb2xvcnMpKTtcbiAgfVxuXG4gIC8vIE92ZXJyaWRlIHRoZSBkZWZhdWx0IHBpY2tpbmcgY29sb3JzIGNhbGN1bGF0aW9uXG4gIGNhbGN1bGF0ZVBpY2tpbmdDb2xvcnMoYXR0cmlidXRlKSB7XG4gICAgY29uc3QgY29sb3JzID0gdGhpcy5zdGF0ZS5ncm91cGVkVmVydGljZXMubWFwKFxuICAgICAgKHZlcnRpY2VzLCBjaG9yb3BsZXRoSW5kZXgpID0+IHZlcnRpY2VzLm1hcChcbiAgICAgICAgdmVydGV4ID0+IHRoaXMucHJvcHMuZHJhd0NvbnRvdXIgPyBbLTEsIC0xLCAtMV0gOiBbXG4gICAgICAgICAgKGNob3JvcGxldGhJbmRleCArIDEpICUgMjU2LFxuICAgICAgICAgIE1hdGguZmxvb3IoKGNob3JvcGxldGhJbmRleCArIDEpIC8gMjU2KSAlIDI1NixcbiAgICAgICAgICBNYXRoLmZsb29yKChjaG9yb3BsZXRoSW5kZXggKyAxKSAvIDI1NiAvIDI1NikgJSAyNTZdXG4gICAgICApXG4gICAgKTtcblxuICAgIGF0dHJpYnV0ZS52YWx1ZSA9IG5ldyBGbG9hdDMyQXJyYXkoZmxhdHRlbkRlZXAoY29sb3JzKSk7XG4gIH1cblxuICBleHRyYWN0Q2hvcm9wbGV0aHMoKSB7XG4gICAgY29uc3Qge2RhdGF9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBub3JtYWxpemVkR2VvanNvbiA9IG5vcm1hbGl6ZShkYXRhKTtcblxuICAgIHRoaXMuc3RhdGUuY2hvcm9wbGV0aHMgPSBub3JtYWxpemVkR2VvanNvbi5mZWF0dXJlcy5tYXAoY2hvcm9wbGV0aCA9PiB7XG4gICAgICBsZXQgY29vcmRpbmF0ZXMgPSBjaG9yb3BsZXRoLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdO1xuICAgICAgLy8gZmxhdHRlbiBuZXN0ZWQgcG9seWdvbnNcbiAgICAgIGlmIChjb29yZGluYXRlcy5sZW5ndGggPT09IDEgJiYgY29vcmRpbmF0ZXNbMF0ubGVuZ3RoID4gMikge1xuICAgICAgICBjb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzWzBdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHJvcGVydGllczogY2hvcm9wbGV0aC5wcm9wZXJ0aWVzLFxuICAgICAgICBjb29yZGluYXRlc1xuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHRoaXMuc3RhdGUuZ3JvdXBlZFZlcnRpY2VzID0gdGhpcy5zdGF0ZS5jaG9yb3BsZXRocy5tYXAoXG4gICAgICBjaG9yb3BsZXRoID0+IGNob3JvcGxldGguY29vcmRpbmF0ZXMubWFwKFxuICAgICAgICBjb29yZGluYXRlID0+IFtjb29yZGluYXRlWzBdLCBjb29yZGluYXRlWzFdLCAwXVxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICBjYWxjdWxhdGVDb250b3VySW5kaWNlcyhudW1WZXJ0aWNlcykge1xuICAgIC8vIHVzZSB2ZXJ0ZXggcGFpcnMgZm9yIGdsLkxJTkVTID0+IFswLCAxLCAxLCAyLCAyLCAuLi4sIG4tMSwgbi0xLCAwXVxuICAgIGxldCBpbmRpY2VzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBudW1WZXJ0aWNlcyAtIDE7IGkrKykge1xuICAgICAgaW5kaWNlcyA9IFsuLi5pbmRpY2VzLCBpLCBpXTtcbiAgICB9XG4gICAgcmV0dXJuIFswLCAuLi5pbmRpY2VzLCAwXTtcblxuICB9XG5cbiAgb25Ib3ZlcihpbmZvKSB7XG4gICAgY29uc3Qge2luZGV4fSA9IGluZm87XG4gICAgY29uc3Qge2RhdGF9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBmZWF0dXJlID0gZGF0YS5mZWF0dXJlc1tpbmRleF07XG4gICAgdGhpcy5wcm9wcy5vbkhvdmVyKHsuLi5pbmZvLCBmZWF0dXJlfSk7XG4gIH1cblxuICBvbkNsaWNrKGluZm8pIHtcbiAgICBjb25zdCB7aW5kZXh9ID0gaW5mbztcbiAgICBjb25zdCB7ZGF0YX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGZlYXR1cmUgPSBkYXRhLmZlYXR1cmVzW2luZGV4XTtcbiAgICB0aGlzLnByb3BzLm9uQ2xpY2soey4uLmluZm8sIGZlYXR1cmV9KTtcbiAgfVxuXG59XG4iXX0=