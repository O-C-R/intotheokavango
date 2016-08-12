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
/* eslint-disable func-style */

var glslify = require('glslify');

var ATTRIBUTES = {
  instancePositions: { size: 2, '0': 'x', '1': 'y' },
  instanceElevations: { size: 1, '0': 'z' },
  instanceColors: { size: 3, '0': 'red', '1': 'green', '2': 'blue' }
};

var _getCentroid = function _getCentroid(x) {
  return x.centroid;
};
var _getElevation = function _getElevation(x) {
  return x.elevation || 0;
};
var _getColor = function _getColor(x) {
  return x.color || [255, 0, 0];
};
var _getVertices = function _getVertices(x) {
  return x.vertices;
};

var HexagonLayer = function (_Layer) {
  _inherits(HexagonLayer, _Layer);

  /**
   * @classdesc
   * HexagonLayer
   *
   * @class
   * @param {object} opts
   *
   * @param {number} opts.dotRadius - hexagon radius
   * @param {number} opts.elevation - hexagon height
   *
   * @param {function} opts.onHexagonHovered(index, e) - popup selected index
   * @param {function} opts.onHexagonClicked(index, e) - popup selected index
   */
  function HexagonLayer() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$id = _ref.id;
    var id = _ref$id === undefined ? 'hexagon-layer' : _ref$id;
    var _ref$dotRadius = _ref.dotRadius;
    var dotRadius = _ref$dotRadius === undefined ? 10 : _ref$dotRadius;
    var _ref$elevation = _ref.elevation;
    var elevation = _ref$elevation === undefined ? 100 : _ref$elevation;
    var vertices = _ref.vertices;
    var _ref$getCentroid = _ref.getCentroid;
    var getCentroid = _ref$getCentroid === undefined ? _getCentroid : _ref$getCentroid;
    var _ref$getElevation = _ref.getElevation;
    var getElevation = _ref$getElevation === undefined ? _getElevation : _ref$getElevation;
    var _ref$getColor = _ref.getColor;
    var getColor = _ref$getColor === undefined ? _getColor : _ref$getColor;
    var _ref$getVertices = _ref.getVertices;
    var getVertices = _ref$getVertices === undefined ? _getVertices : _ref$getVertices;

    var opts = _objectWithoutProperties(_ref, ['id', 'dotRadius', 'elevation', 'vertices', 'getCentroid', 'getElevation', 'getColor', 'getVertices']);

    _classCallCheck(this, HexagonLayer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(HexagonLayer).call(this, _extends({
      id: id,
      dotRadius: dotRadius,
      elevation: elevation,
      vertices: vertices,
      getCentroid: getCentroid,
      getElevation: getElevation,
      getColor: getColor,
      getVertices: getVertices
    }, opts)));
  }

  _createClass(HexagonLayer, [{
    key: 'initializeState',
    value: function initializeState() {
      var _state = this.state;
      var gl = _state.gl;
      var attributeManager = _state.attributeManager;


      this.setState({
        model: this.getModel(gl)
      });

      attributeManager.addInstanced(ATTRIBUTES, {
        instancePositions: { update: this.calculateInstancePositions },
        instanceElevations: { update: this.calculateInstanceElevations },
        instanceColors: { update: this.calculateInstanceColors }
      });

      this.calculateRadiusAndAngle();

      this.setUniforms({
        elevation: this.props.elevation
      });
    }
  }, {
    key: 'willReceiveProps',
    value: function willReceiveProps(oldProps, newProps) {
      _get(Object.getPrototypeOf(HexagonLayer.prototype), 'willReceiveProps', this).call(this, oldProps, newProps);

      var _state2 = this.state;
      var dataChanged = _state2.dataChanged;
      var viewportChanged = _state2.viewportChanged;
      var attributeManager = _state2.attributeManager;


      if (dataChanged || viewportChanged) {
        this.calculateRadiusAndAngle();
      }
      if (dataChanged) {
        attributeManager.invalidateAll();
      }

      this.setUniforms({
        elevation: this.props.elevation
      });
    }
  }, {
    key: 'getModel',
    value: function getModel(gl) {
      var geometry = new _luma.CylinderGeometry({
        radius: 1,
        topRadius: 1,
        bottomRadius: 1,
        topCap: true,
        bottomCap: true,
        height: 1,
        nradial: 6,
        nvertical: 1
      });

      // const NUM_SEGMENTS = 6;
      // const PI2 = Math.PI * 2;

      // let vertices = [];
      // for (let i = 0; i < NUM_SEGMENTS; i++) {
      //   vertices = [
      //     ...vertices,
      //     Math.cos(PI2 * i / NUM_SEGMENTS),
      //     Math.sin(PI2 * i / NUM_SEGMENTS),
      //     0
      //   ];
      // }

      // const geometry = new Geometry({
      //   id: this.props.id,
      //   drawMode: 'TRIANGLE_FAN',
      //   vertices: new Float32Array(vertices)
      // });

      return new _luma.Model({
        id: this.props.id,
        program: new _luma.Program(gl, {
          vs: '#define GLSLIFY 1\n// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* fragment shader for the hexagon-layer */\n#define SHADER_NAME hexagon-layer-vs\n\nconst float TILE_SIZE_1540259130 = 512.0;\nconst float PI = 3.1415926536;\nconst float WORLD_SCALE_1540259130 = TILE_SIZE_1540259130 / (PI * 2.0);\n\n// non-linear projection: lnglats => zoom 0 tile [0-512, 0-512] * scale\nvec2 mercatorProject(vec2 lnglat, float zoomScale) {\n  float scale = WORLD_SCALE_1540259130 * zoomScale;\n  return vec2(\n  \tscale * (radians(lnglat.x) + PI),\n  \tscale * (PI - log(tan(PI * 0.25 + radians(lnglat.y) * 0.5)))\n  );\n}\n\nuniform float mercatorScale;\n\nattribute vec3 positions;\n\nattribute vec2 instancePositions;\nattribute float instanceElevations;\nattribute vec3 instanceColors;\nattribute vec3 instancePickingColors;\n\nuniform mat4 worldMatrix;\nuniform mat4 projectionMatrix;\n\nuniform float radius;\nuniform float opacity;\nuniform float angle;\nuniform float elevation;\n\nuniform float renderPickingBuffer;\nuniform vec3 selected;\nvarying vec4 vColor;\n\nvoid main(void) {\n  mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));\n  vec4 rotatedPosition = vec4(\n    vec2(rotationMatrix * positions.xz * radius),\n    0.,\n    1.\n  );\n\n  vec2 pos = mercatorProject(instancePositions.xy, mercatorScale);\n\n  vec4 centroidPosition =\n    vec4(pos.xy, instanceElevations * (positions.y + 0.5) * elevation, 0.0);\n  vec3 p = centroidPosition.xyz + rotatedPosition.xyz;\n  gl_Position = projectionMatrix * vec4(p, 1.0);\n\n  vec4 color = vec4(instanceColors / 255.0, opacity);\n  vec4 pickingColor = vec4(instancePickingColors / 255.0, 1.);\n  vColor = mix(color, pickingColor, renderPickingBuffer);\n}\n',
          fs: '// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* fragment shader for the hexagon-layer */\n#define SHADER_NAME hexagon-layer-fs\n\n#ifdef GL_ES\nprecision highp float;\n#define GLSLIFY 1\n#endif\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  gl_FragColor = vColor;\n}\n',
          id: 'hexagon'
        }),
        geometry: geometry,
        isInstanced: true
      });
    }
  }, {
    key: 'calculateInstancePositions',
    value: function calculateInstancePositions(attribute) {
      var _props = this.props;
      var data = _props.data;
      var getCentroid = _props.getCentroid;
      var value = attribute.value;
      var size = attribute.size;

      var i = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var hexagon = _step.value;

          var centroid = getCentroid(hexagon);
          value[i + 0] = centroid[0];
          value[i + 1] = centroid[1];
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
    key: 'calculateInstanceElevations',
    value: function calculateInstanceElevations(attribute) {
      var _props2 = this.props;
      var data = _props2.data;
      var getElevation = _props2.getElevation;
      var value = attribute.value;
      var size = attribute.size;

      var i = 0;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var hexagon = _step2.value;

          var elevation = getElevation(hexagon) || 0;
          value[i + 0] = elevation;
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
    key: 'calculateInstanceColors',
    value: function calculateInstanceColors(attribute) {
      var _props3 = this.props;
      var data = _props3.data;
      var getColor = _props3.getColor;
      var value = attribute.value;

      var i = 0;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var hexagon = _step3.value;

          var color = getColor(hexagon);
          value[i + 0] = color[0];
          value[i + 1] = color[1];
          value[i + 2] = color[2];
          i += 3;
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
    }

    // TODO this is the only place that uses hexagon vertices
    // consider move radius and angle calculation to the shader

  }, {
    key: 'calculateRadiusAndAngle',
    value: function calculateRadiusAndAngle() {
      var _props4 = this.props;
      var data = _props4.data;
      var getVertices = _props4.getVertices;

      if (!data || data.length === 0) {
        return;
      }

      // Either get vertices from prop, or from first hexagon
      var vertices = this.props.vertices;

      if (!vertices) {
        var firstHexagon = this.getFirstObject();
        vertices = getVertices(firstHexagon);
      }
      var vertex0 = vertices[0];
      var vertex3 = vertices[3];

      // transform to space coordinates
      var spaceCoord0 = this.project({ lat: vertex0[1], lon: vertex0[0] });
      var spaceCoord3 = this.project({ lat: vertex3[1], lon: vertex3[0] });

      // distance between two close centroids
      var dx = spaceCoord0.x - spaceCoord3.x;
      var dy = spaceCoord0.y - spaceCoord3.y;
      var dxy = Math.sqrt(dx * dx + dy * dy);

      this.setUniforms({
        // Calculate angle that the perpendicular hexagon vertex axis is tilted
        angle: Math.acos(dx / dxy) * -Math.sign(dy) + Math.PI / 2,
        // Allow user to fine tune radius
        radius: dxy / 2 * Math.min(1, this.props.dotRadius)
      });
    }
  }]);

  return HexagonLayer;
}(_layer2.default);

exports.default = HexagonLayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvaGV4YWdvbi1sYXllci9oZXhhZ29uLWxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFxQkE7Ozs7QUFDQTs7Ozs7Ozs7OzsrZUF0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFJQSxJQUFNLFVBQVUsUUFBUSxTQUFSLENBQWhCOztBQUVBLElBQU0sYUFBYTtBQUNqQixxQkFBbUIsRUFBQyxNQUFNLENBQVAsRUFBVSxLQUFLLEdBQWYsRUFBb0IsS0FBSyxHQUF6QixFQURGO0FBRWpCLHNCQUFvQixFQUFDLE1BQU0sQ0FBUCxFQUFVLEtBQUssR0FBZixFQUZIO0FBR2pCLGtCQUFnQixFQUFDLE1BQU0sQ0FBUCxFQUFVLEtBQUssS0FBZixFQUFzQixLQUFLLE9BQTNCLEVBQW9DLEtBQUssTUFBekM7QUFIQyxDQUFuQjs7QUFNQSxJQUFNLGVBQWUsU0FBZixZQUFlO0FBQUEsU0FBSyxFQUFFLFFBQVA7QUFBQSxDQUFyQjtBQUNBLElBQU0sZ0JBQWdCLFNBQWhCLGFBQWdCO0FBQUEsU0FBSyxFQUFFLFNBQUYsSUFBZSxDQUFwQjtBQUFBLENBQXRCO0FBQ0EsSUFBTSxZQUFZLFNBQVosU0FBWTtBQUFBLFNBQUssRUFBRSxLQUFGLElBQVcsQ0FBQyxHQUFELEVBQU0sQ0FBTixFQUFTLENBQVQsQ0FBaEI7QUFBQSxDQUFsQjtBQUNBLElBQU0sZUFBZSxTQUFmLFlBQWU7QUFBQSxTQUFLLEVBQUUsUUFBUDtBQUFBLENBQXJCOztJQUVxQixZOzs7QUFDbkI7Ozs7Ozs7Ozs7Ozs7QUFhQSwwQkFVUTtBQUFBLHFFQUFKLEVBQUk7O0FBQUEsdUJBVE4sRUFTTTtBQUFBLFFBVE4sRUFTTSwyQkFURCxlQVNDO0FBQUEsOEJBUk4sU0FRTTtBQUFBLFFBUk4sU0FRTSxr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QUFLLEVBQXpCLENBQVo7O0FBRUEsV0FBSyxXQUFMLENBQWlCO0FBQ2Y7QUFDQSxlQUFPLEtBQUssSUFBTCxDQUFVLEtBQUssR0FBZixJQUFzQixDQUFDLEtBQUssSUFBTCxDQUFVLEVBQVYsQ0FBdkIsR0FBdUMsS0FBSyxFQUFMLEdBQVUsQ0FGekM7QUFHZjtBQUNBLGdCQUFRLE1BQU0sQ0FBTixHQUFVLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxLQUFLLEtBQUwsQ0FBVyxTQUF2QjtBQUpILE9BQWpCO0FBTUQ7Ozs7OztrQkExTGtCLFkiLCJmaWxlIjoiaGV4YWdvbi1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG4vKiBlc2xpbnQtZGlzYWJsZSBmdW5jLXN0eWxlICovXG5cbmltcG9ydCBMYXllciBmcm9tICcuLi8uLi9sYXllcic7XG5pbXBvcnQge01vZGVsLCBQcm9ncmFtLCBDeWxpbmRlckdlb21ldHJ5fSBmcm9tICdsdW1hLmdsJztcbmNvbnN0IGdsc2xpZnkgPSByZXF1aXJlKCdnbHNsaWZ5Jyk7XG5cbmNvbnN0IEFUVFJJQlVURVMgPSB7XG4gIGluc3RhbmNlUG9zaXRpb25zOiB7c2l6ZTogMiwgJzAnOiAneCcsICcxJzogJ3knfSxcbiAgaW5zdGFuY2VFbGV2YXRpb25zOiB7c2l6ZTogMSwgJzAnOiAneid9LFxuICBpbnN0YW5jZUNvbG9yczoge3NpemU6IDMsICcwJzogJ3JlZCcsICcxJzogJ2dyZWVuJywgJzInOiAnYmx1ZSd9XG59O1xuXG5jb25zdCBfZ2V0Q2VudHJvaWQgPSB4ID0+IHguY2VudHJvaWQ7XG5jb25zdCBfZ2V0RWxldmF0aW9uID0geCA9PiB4LmVsZXZhdGlvbiB8fCAwO1xuY29uc3QgX2dldENvbG9yID0geCA9PiB4LmNvbG9yIHx8IFsyNTUsIDAsIDBdO1xuY29uc3QgX2dldFZlcnRpY2VzID0geCA9PiB4LnZlcnRpY2VzO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZXhhZ29uTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAY2xhc3NkZXNjXG4gICAqIEhleGFnb25MYXllclxuICAgKlxuICAgKiBAY2xhc3NcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdHNcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IG9wdHMuZG90UmFkaXVzIC0gaGV4YWdvbiByYWRpdXNcbiAgICogQHBhcmFtIHtudW1iZXJ9IG9wdHMuZWxldmF0aW9uIC0gaGV4YWdvbiBoZWlnaHRcbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gb3B0cy5vbkhleGFnb25Ib3ZlcmVkKGluZGV4LCBlKSAtIHBvcHVwIHNlbGVjdGVkIGluZGV4XG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdHMub25IZXhhZ29uQ2xpY2tlZChpbmRleCwgZSkgLSBwb3B1cCBzZWxlY3RlZCBpbmRleFxuICAgKi9cbiAgY29uc3RydWN0b3Ioe1xuICAgIGlkID0gJ2hleGFnb24tbGF5ZXInLFxuICAgIGRvdFJhZGl1cyA9IDEwLFxuICAgIGVsZXZhdGlvbiA9IDEwMCxcbiAgICB2ZXJ0aWNlcyxcbiAgICBnZXRDZW50cm9pZCA9IF9nZXRDZW50cm9pZCxcbiAgICBnZXRFbGV2YXRpb24gPSBfZ2V0RWxldmF0aW9uLFxuICAgIGdldENvbG9yID0gX2dldENvbG9yLFxuICAgIGdldFZlcnRpY2VzID0gX2dldFZlcnRpY2VzLFxuICAgIC4uLm9wdHNcbiAgfSA9IHt9KSB7XG4gICAgc3VwZXIoe1xuICAgICAgaWQsXG4gICAgICBkb3RSYWRpdXMsXG4gICAgICBlbGV2YXRpb24sXG4gICAgICB2ZXJ0aWNlcyxcbiAgICAgIGdldENlbnRyb2lkLFxuICAgICAgZ2V0RWxldmF0aW9uLFxuICAgICAgZ2V0Q29sb3IsXG4gICAgICBnZXRWZXJ0aWNlcyxcbiAgICAgIC4uLm9wdHNcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICBjb25zdCB7Z2wsIGF0dHJpYnV0ZU1hbmFnZXJ9ID0gdGhpcy5zdGF0ZTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9kZWw6IHRoaXMuZ2V0TW9kZWwoZ2wpXG4gICAgfSk7XG5cbiAgICBhdHRyaWJ1dGVNYW5hZ2VyLmFkZEluc3RhbmNlZChBVFRSSUJVVEVTLCB7XG4gICAgICBpbnN0YW5jZVBvc2l0aW9uczoge3VwZGF0ZTogdGhpcy5jYWxjdWxhdGVJbnN0YW5jZVBvc2l0aW9uc30sXG4gICAgICBpbnN0YW5jZUVsZXZhdGlvbnM6IHt1cGRhdGU6IHRoaXMuY2FsY3VsYXRlSW5zdGFuY2VFbGV2YXRpb25zfSxcbiAgICAgIGluc3RhbmNlQ29sb3JzOiB7dXBkYXRlOiB0aGlzLmNhbGN1bGF0ZUluc3RhbmNlQ29sb3JzfVxuICAgIH0pO1xuXG4gICAgdGhpcy5jYWxjdWxhdGVSYWRpdXNBbmRBbmdsZSgpO1xuXG4gICAgdGhpcy5zZXRVbmlmb3Jtcyh7XG4gICAgICBlbGV2YXRpb246IHRoaXMucHJvcHMuZWxldmF0aW9uXG4gICAgfSk7XG4gIH1cblxuICB3aWxsUmVjZWl2ZVByb3BzKG9sZFByb3BzLCBuZXdQcm9wcykge1xuICAgIHN1cGVyLndpbGxSZWNlaXZlUHJvcHMob2xkUHJvcHMsIG5ld1Byb3BzKTtcblxuICAgIGNvbnN0IHtkYXRhQ2hhbmdlZCwgdmlld3BvcnRDaGFuZ2VkLCBhdHRyaWJ1dGVNYW5hZ2VyfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAoZGF0YUNoYW5nZWQgfHwgdmlld3BvcnRDaGFuZ2VkKSB7XG4gICAgICB0aGlzLmNhbGN1bGF0ZVJhZGl1c0FuZEFuZ2xlKCk7XG4gICAgfVxuICAgIGlmIChkYXRhQ2hhbmdlZCkge1xuICAgICAgYXR0cmlidXRlTWFuYWdlci5pbnZhbGlkYXRlQWxsKCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRVbmlmb3Jtcyh7XG4gICAgICBlbGV2YXRpb246IHRoaXMucHJvcHMuZWxldmF0aW9uXG4gICAgfSk7XG4gIH1cblxuICBnZXRNb2RlbChnbCkge1xuICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IEN5bGluZGVyR2VvbWV0cnkoe1xuICAgICAgcmFkaXVzOiAxLFxuICAgICAgdG9wUmFkaXVzOiAxLFxuICAgICAgYm90dG9tUmFkaXVzOiAxLFxuICAgICAgdG9wQ2FwOiB0cnVlLFxuICAgICAgYm90dG9tQ2FwOiB0cnVlLFxuICAgICAgaGVpZ2h0OiAxLFxuICAgICAgbnJhZGlhbDogNixcbiAgICAgIG52ZXJ0aWNhbDogMVxuICAgIH0pO1xuXG4gICAgLy8gY29uc3QgTlVNX1NFR01FTlRTID0gNjtcbiAgICAvLyBjb25zdCBQSTIgPSBNYXRoLlBJICogMjtcblxuICAgIC8vIGxldCB2ZXJ0aWNlcyA9IFtdO1xuICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgTlVNX1NFR01FTlRTOyBpKyspIHtcbiAgICAvLyAgIHZlcnRpY2VzID0gW1xuICAgIC8vICAgICAuLi52ZXJ0aWNlcyxcbiAgICAvLyAgICAgTWF0aC5jb3MoUEkyICogaSAvIE5VTV9TRUdNRU5UUyksXG4gICAgLy8gICAgIE1hdGguc2luKFBJMiAqIGkgLyBOVU1fU0VHTUVOVFMpLFxuICAgIC8vICAgICAwXG4gICAgLy8gICBdO1xuICAgIC8vIH1cblxuICAgIC8vIGNvbnN0IGdlb21ldHJ5ID0gbmV3IEdlb21ldHJ5KHtcbiAgICAvLyAgIGlkOiB0aGlzLnByb3BzLmlkLFxuICAgIC8vICAgZHJhd01vZGU6ICdUUklBTkdMRV9GQU4nLFxuICAgIC8vICAgdmVydGljZXM6IG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpXG4gICAgLy8gfSk7XG5cbiAgICByZXR1cm4gbmV3IE1vZGVsKHtcbiAgICAgIGlkOiB0aGlzLnByb3BzLmlkLFxuICAgICAgcHJvZ3JhbTogbmV3IFByb2dyYW0oZ2wsIHtcbiAgICAgICAgdnM6IGdsc2xpZnkoJy4vaGV4YWdvbi1sYXllci12ZXJ0ZXguZ2xzbCcpLFxuICAgICAgICBmczogZ2xzbGlmeSgnLi9oZXhhZ29uLWxheWVyLWZyYWdtZW50Lmdsc2wnKSxcbiAgICAgICAgaWQ6ICdoZXhhZ29uJ1xuICAgICAgfSksXG4gICAgICBnZW9tZXRyeSxcbiAgICAgIGlzSW5zdGFuY2VkOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBjYWxjdWxhdGVJbnN0YW5jZVBvc2l0aW9ucyhhdHRyaWJ1dGUpIHtcbiAgICBjb25zdCB7ZGF0YSwgZ2V0Q2VudHJvaWR9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7dmFsdWUsIHNpemV9ID0gYXR0cmlidXRlO1xuICAgIGxldCBpID0gMDtcbiAgICBmb3IgKGNvbnN0IGhleGFnb24gb2YgZGF0YSkge1xuICAgICAgY29uc3QgY2VudHJvaWQgPSBnZXRDZW50cm9pZChoZXhhZ29uKTtcbiAgICAgIHZhbHVlW2kgKyAwXSA9IGNlbnRyb2lkWzBdO1xuICAgICAgdmFsdWVbaSArIDFdID0gY2VudHJvaWRbMV07XG4gICAgICBpICs9IHNpemU7XG4gICAgfVxuICB9XG5cbiAgY2FsY3VsYXRlSW5zdGFuY2VFbGV2YXRpb25zKGF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IHtkYXRhLCBnZXRFbGV2YXRpb259ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7dmFsdWUsIHNpemV9ID0gYXR0cmlidXRlO1xuICAgIGxldCBpID0gMDtcbiAgICBmb3IgKGNvbnN0IGhleGFnb24gb2YgZGF0YSkge1xuICAgICAgY29uc3QgZWxldmF0aW9uID0gZ2V0RWxldmF0aW9uKGhleGFnb24pIHx8IDA7XG4gICAgICB2YWx1ZVtpICsgMF0gPSBlbGV2YXRpb247XG4gICAgICBpICs9IHNpemU7XG4gICAgfVxuICB9XG5cbiAgY2FsY3VsYXRlSW5zdGFuY2VDb2xvcnMoYXR0cmlidXRlKSB7XG4gICAgY29uc3Qge2RhdGEsIGdldENvbG9yfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge3ZhbHVlfSA9IGF0dHJpYnV0ZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChjb25zdCBoZXhhZ29uIG9mIGRhdGEpIHtcbiAgICAgIGNvbnN0IGNvbG9yID0gZ2V0Q29sb3IoaGV4YWdvbik7XG4gICAgICB2YWx1ZVtpICsgMF0gPSBjb2xvclswXTtcbiAgICAgIHZhbHVlW2kgKyAxXSA9IGNvbG9yWzFdO1xuICAgICAgdmFsdWVbaSArIDJdID0gY29sb3JbMl07XG4gICAgICBpICs9IDM7XG4gICAgfVxuICB9XG5cbiAgLy8gVE9ETyB0aGlzIGlzIHRoZSBvbmx5IHBsYWNlIHRoYXQgdXNlcyBoZXhhZ29uIHZlcnRpY2VzXG4gIC8vIGNvbnNpZGVyIG1vdmUgcmFkaXVzIGFuZCBhbmdsZSBjYWxjdWxhdGlvbiB0byB0aGUgc2hhZGVyXG4gIGNhbGN1bGF0ZVJhZGl1c0FuZEFuZ2xlKCkge1xuICAgIGNvbnN0IHtkYXRhLCBnZXRWZXJ0aWNlc30gPSB0aGlzLnByb3BzO1xuICAgIGlmICghZGF0YSB8fCBkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEVpdGhlciBnZXQgdmVydGljZXMgZnJvbSBwcm9wLCBvciBmcm9tIGZpcnN0IGhleGFnb25cbiAgICBsZXQge3ZlcnRpY2VzfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKCF2ZXJ0aWNlcykge1xuICAgICAgY29uc3QgZmlyc3RIZXhhZ29uID0gdGhpcy5nZXRGaXJzdE9iamVjdCgpO1xuICAgICAgdmVydGljZXMgPSBnZXRWZXJ0aWNlcyhmaXJzdEhleGFnb24pO1xuICAgIH1cbiAgICBjb25zdCB2ZXJ0ZXgwID0gdmVydGljZXNbMF07XG4gICAgY29uc3QgdmVydGV4MyA9IHZlcnRpY2VzWzNdO1xuXG4gICAgLy8gdHJhbnNmb3JtIHRvIHNwYWNlIGNvb3JkaW5hdGVzXG4gICAgY29uc3Qgc3BhY2VDb29yZDAgPSB0aGlzLnByb2plY3Qoe2xhdDogdmVydGV4MFsxXSwgbG9uOiB2ZXJ0ZXgwWzBdfSk7XG4gICAgY29uc3Qgc3BhY2VDb29yZDMgPSB0aGlzLnByb2plY3Qoe2xhdDogdmVydGV4M1sxXSwgbG9uOiB2ZXJ0ZXgzWzBdfSk7XG5cbiAgICAvLyBkaXN0YW5jZSBiZXR3ZWVuIHR3byBjbG9zZSBjZW50cm9pZHNcbiAgICBjb25zdCBkeCA9IHNwYWNlQ29vcmQwLnggLSBzcGFjZUNvb3JkMy54O1xuICAgIGNvbnN0IGR5ID0gc3BhY2VDb29yZDAueSAtIHNwYWNlQ29vcmQzLnk7XG4gICAgY29uc3QgZHh5ID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcblxuICAgIHRoaXMuc2V0VW5pZm9ybXMoe1xuICAgICAgLy8gQ2FsY3VsYXRlIGFuZ2xlIHRoYXQgdGhlIHBlcnBlbmRpY3VsYXIgaGV4YWdvbiB2ZXJ0ZXggYXhpcyBpcyB0aWx0ZWRcbiAgICAgIGFuZ2xlOiBNYXRoLmFjb3MoZHggLyBkeHkpICogLU1hdGguc2lnbihkeSkgKyBNYXRoLlBJIC8gMixcbiAgICAgIC8vIEFsbG93IHVzZXIgdG8gZmluZSB0dW5lIHJhZGl1c1xuICAgICAgcmFkaXVzOiBkeHkgLyAyICogTWF0aC5taW4oMSwgdGhpcy5wcm9wcy5kb3RSYWRpdXMpXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==