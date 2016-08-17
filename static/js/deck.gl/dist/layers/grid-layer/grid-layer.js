'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
  instanceColors: { size: 4, '0': 'red', '1': 'green', '2': 'blue', '3': 'alpha' }
};

var GridLayer = function (_Layer) {
  _inherits(GridLayer, _Layer);

  _createClass(GridLayer, null, [{
    key: 'attributes',
    get: function get() {
      return ATTRIBUTES;
    }

    /**
     * @classdesc
     * GridLayer
     *
     * @class
     * @param {object} opts
     * @param {number} opts.unitWidth - width of the unit rectangle
     * @param {number} opts.unitHeight - height of the unit rectangle
     */

  }]);

  function GridLayer(opts) {
    _classCallCheck(this, GridLayer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(GridLayer).call(this, _extends({
      unitWidth: 100,
      unitHeight: 100
    }, opts)));
  }

  _createClass(GridLayer, [{
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
        instanceColors: { update: this.calculateInstanceColors }
      });

      this.updateCell();
    }
  }, {
    key: 'willReceiveProps',
    value: function willReceiveProps(oldProps, newProps) {
      _get(Object.getPrototypeOf(GridLayer.prototype), 'willReceiveProps', this).call(this, oldProps, newProps);

      var cellSizeChanged = newProps.unitWidth !== oldProps.unitWidth || newProps.unitHeight !== oldProps.unitHeight;

      if (cellSizeChanged || this.state.viewportChanged) {
        this.updateCell();
      }
    }
  }, {
    key: 'getModel',
    value: function getModel(gl) {
      return new _luma.Model({
        program: new _luma.Program(gl, {
          vs: '#define GLSLIFY 1\n// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* vertex shader for the grid-layer */\n#define SHADER_NAME grid-layer-vs\n\nattribute vec3 vertices;\nattribute vec3 instancePositions;\nattribute vec4 instanceColors;\nattribute vec3 instancePickingColors;\n\nuniform float mercatorScale;\n\nuniform float maxCount;\nuniform float opacity;\nuniform float renderPickingBuffer;\nuniform vec3 scale;\nuniform vec3 selectedPickingColor;\n\nuniform mat4 worldMatrix;\nuniform mat4 projectionMatrix;\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  float alpha = instancePickingColors == selectedPickingColor ? 1.5 * instanceColors.w : instanceColors.w;\n  vColor = vec4(mix(instanceColors.xyz / maxCount, instancePickingColors / 255., renderPickingBuffer), alpha);\n\n  vec3 p = instancePositions + vertices * scale / mercatorScale;\n  gl_Position = projectionMatrix * worldMatrix * vec4(p, 1.0);\n}\n',
          fs: '// Copyright (c) 2015 Uber Technologies, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n// THE SOFTWARE.\n\n/* fragment shader for the grid-layer */\n#define SHADER_NAME grid-layer-fs\n\n#ifdef GL_ES\nprecision highp float;\n#define GLSLIFY 1\n#endif\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  gl_FragColor = vColor;\n}\n',
          id: 'grid'
        }),
        geometry: new _luma.Geometry({
          id: this.props.id,
          drawMode: 'TRIANGLE_FAN',
          vertices: new Float32Array([0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0])
        }),
        isInstanced: true
      });
    }
  }, {
    key: 'updateCell',
    value: function updateCell() {
      var _props = this.props;
      var width = _props.width;
      var height = _props.height;
      var unitWidth = _props.unitWidth;
      var unitHeight = _props.unitHeight;


      var numCol = Math.ceil(width * 2 / unitWidth);
      var numRow = Math.ceil(height * 2 / unitHeight);
      this.setState({
        numCol: numCol,
        numRow: numRow,
        numInstances: numCol * numRow
      });

      var attributeManager = this.state.attributeManager;

      attributeManager.invalidateAll();

      var MARGIN = 2;
      var scale = new Float32Array([unitWidth - MARGIN * 2, unitHeight - MARGIN * 2, 1]);
      this.setUniforms({ scale: scale });
    }
  }, {
    key: 'calculateInstancePositions',
    value: function calculateInstancePositions(attribute, numInstances) {
      var _props2 = this.props;
      var unitWidth = _props2.unitWidth;
      var unitHeight = _props2.unitHeight;
      var width = _props2.width;
      var height = _props2.height;
      var numCol = this.state.numCol;
      var value = attribute.value;
      var size = attribute.size;


      for (var i = 0; i < numInstances; i++) {
        var x = i % numCol;
        var y = Math.floor(i / numCol);
        value[i * size + 0] = x * unitWidth - width;
        value[i * size + 1] = y * unitHeight - height;
        value[i * size + 2] = 0;
      }
    }
  }, {
    key: 'calculateInstanceColors',
    value: function calculateInstanceColors(attribute) {
      var _props3 = this.props;
      var data = _props3.data;
      var unitWidth = _props3.unitWidth;
      var unitHeight = _props3.unitHeight;
      var width = _props3.width;
      var height = _props3.height;
      var _state2 = this.state;
      var numCol = _state2.numCol;
      var numRow = _state2.numRow;
      var value = attribute.value;
      var size = attribute.size;


      value.fill(0.0);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var point = _step.value;

          var pixel = this.project([point.position.y, point.position.x]);
          var colId = Math.floor((pixel.x + width) / unitWidth);
          var rowId = Math.floor((pixel.y + height) / unitHeight);
          if (colId < numCol && rowId < numRow) {
            var i4 = (colId + rowId * numCol) * size;
            value[i4 + 2] = value[i4 + 0] += 1;
            value[i4 + 1] += 5;
            value[i4 + 3] = 0.6;
          }
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

      this.setUniforms({ maxCount: Math.max.apply(Math, _toConsumableArray(value)) });
    }
  }]);

  return GridLayer;
}(_layer2.default);

exports.default = GridLayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvZ3JpZC1sYXllci9ncmlkLWxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFvQkE7Ozs7QUFDQTs7Ozs7Ozs7OzsrZUFyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBSUEsSUFBTSxVQUFVLFFBQVEsU0FBUixDQUFoQjs7QUFFQSxJQUFNLGFBQWE7QUFDakIscUJBQW1CLEVBQUMsTUFBTSxDQUFQLEVBQVUsS0FBSyxHQUFmLEVBQW9CLEtBQUssR0FBekIsRUFBOEIsS0FBSyxRQUFuQyxFQURGO0FBRWpCLGtCQUFnQixFQUFDLE1BQU0sQ0FBUCxFQUFVLEtBQUssS0FBZixFQUFzQixLQUFLLE9BQTNCLEVBQW9DLEtBQUssTUFBekMsRUFBaUQsS0FBSyxPQUF0RDtBQUZDLENBQW5COztJQUtxQixTOzs7Ozt3QkFFSztBQUN0QixhQUFPLFVBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7O0FBU0EscUJBQVksSUFBWixFQUFrQjtBQUFBOztBQUFBO0FBRWQsaUJBQVcsR0FGRztBQUdkLGtCQUFZO0FBSEUsT0FJWCxJQUpXO0FBTWpCOzs7O3NDQUVpQjtBQUFBLG1CQUNlLEtBQUssS0FEcEI7QUFBQSxVQUNULEVBRFMsVUFDVCxFQURTO0FBQUEsVUFDTCxnQkFESyxVQUNMLGdCQURLOzs7QUFHaEIsV0FBSyxRQUFMLENBQWM7QUFDWixlQUFPLEtBQUssUUFBTCxDQUFjLEVBQWQ7QUFESyxPQUFkOztBQUlBLHVCQUFpQixZQUFqQixDQUE4QixVQUE5QixFQUEwQztBQUN4QywyQkFBbUIsRUFBQyxRQUFRLEtBQUssMEJBQWQsRUFEcUI7QUFFeEMsd0JBQWdCLEVBQUMsUUFBUSxLQUFLLHVCQUFkO0FBRndCLE9BQTFDOztBQUtBLFdBQUssVUFBTDtBQUNEOzs7cUNBRWdC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VUFBVSxLQUFLLEdBQUwsZ0NBQVksS0FBWixFQUFYLEVBQWpCO0FBQ0Q7Ozs7OztrQkE1SGtCLFMiLCJmaWxlIjoiZ3JpZC1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBMYXllciBmcm9tICcuLi8uLi9sYXllcic7XG5pbXBvcnQge01vZGVsLCBQcm9ncmFtLCBHZW9tZXRyeX0gZnJvbSAnbHVtYS5nbCc7XG5jb25zdCBnbHNsaWZ5ID0gcmVxdWlyZSgnZ2xzbGlmeScpO1xuXG5jb25zdCBBVFRSSUJVVEVTID0ge1xuICBpbnN0YW5jZVBvc2l0aW9uczoge3NpemU6IDMsICcwJzogJ3gnLCAnMSc6ICd5JywgJzInOiAndW51c2VkJ30sXG4gIGluc3RhbmNlQ29sb3JzOiB7c2l6ZTogNCwgJzAnOiAncmVkJywgJzEnOiAnZ3JlZW4nLCAnMic6ICdibHVlJywgJzMnOiAnYWxwaGEnfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZExheWVyIGV4dGVuZHMgTGF5ZXIge1xuXG4gIHN0YXRpYyBnZXQgYXR0cmlidXRlcygpIHtcbiAgICByZXR1cm4gQVRUUklCVVRFUztcbiAgfVxuXG4gIC8qKlxuICAgKiBAY2xhc3NkZXNjXG4gICAqIEdyaWRMYXllclxuICAgKlxuICAgKiBAY2xhc3NcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdHNcbiAgICogQHBhcmFtIHtudW1iZXJ9IG9wdHMudW5pdFdpZHRoIC0gd2lkdGggb2YgdGhlIHVuaXQgcmVjdGFuZ2xlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBvcHRzLnVuaXRIZWlnaHQgLSBoZWlnaHQgb2YgdGhlIHVuaXQgcmVjdGFuZ2xlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgc3VwZXIoe1xuICAgICAgdW5pdFdpZHRoOiAxMDAsXG4gICAgICB1bml0SGVpZ2h0OiAxMDAsXG4gICAgICAuLi5vcHRzXG4gICAgfSk7XG4gIH1cblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgY29uc3Qge2dsLCBhdHRyaWJ1dGVNYW5hZ2VyfSA9IHRoaXMuc3RhdGU7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vZGVsOiB0aGlzLmdldE1vZGVsKGdsKVxuICAgIH0pO1xuXG4gICAgYXR0cmlidXRlTWFuYWdlci5hZGRJbnN0YW5jZWQoQVRUUklCVVRFUywge1xuICAgICAgaW5zdGFuY2VQb3NpdGlvbnM6IHt1cGRhdGU6IHRoaXMuY2FsY3VsYXRlSW5zdGFuY2VQb3NpdGlvbnN9LFxuICAgICAgaW5zdGFuY2VDb2xvcnM6IHt1cGRhdGU6IHRoaXMuY2FsY3VsYXRlSW5zdGFuY2VDb2xvcnN9XG4gICAgfSk7XG5cbiAgICB0aGlzLnVwZGF0ZUNlbGwoKTtcbiAgfVxuXG4gIHdpbGxSZWNlaXZlUHJvcHMob2xkUHJvcHMsIG5ld1Byb3BzKSB7XG4gICAgc3VwZXIud2lsbFJlY2VpdmVQcm9wcyhvbGRQcm9wcywgbmV3UHJvcHMpO1xuXG4gICAgY29uc3QgY2VsbFNpemVDaGFuZ2VkID1cbiAgICAgIG5ld1Byb3BzLnVuaXRXaWR0aCAhPT0gb2xkUHJvcHMudW5pdFdpZHRoIHx8XG4gICAgICBuZXdQcm9wcy51bml0SGVpZ2h0ICE9PSBvbGRQcm9wcy51bml0SGVpZ2h0O1xuXG4gICAgaWYgKGNlbGxTaXplQ2hhbmdlZCB8fCB0aGlzLnN0YXRlLnZpZXdwb3J0Q2hhbmdlZCkge1xuICAgICAgdGhpcy51cGRhdGVDZWxsKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0TW9kZWwoZ2wpIHtcbiAgICByZXR1cm4gbmV3IE1vZGVsKHtcbiAgICAgIHByb2dyYW06IG5ldyBQcm9ncmFtKGdsLCB7XG4gICAgICAgIHZzOiBnbHNsaWZ5KCcuL2dyaWQtbGF5ZXItdmVydGV4Lmdsc2wnKSxcbiAgICAgICAgZnM6IGdsc2xpZnkoJy4vZ3JpZC1sYXllci1mcmFnbWVudC5nbHNsJyksXG4gICAgICAgIGlkOiAnZ3JpZCdcbiAgICAgIH0pLFxuICAgICAgZ2VvbWV0cnk6IG5ldyBHZW9tZXRyeSh7XG4gICAgICAgIGlkOiB0aGlzLnByb3BzLmlkLFxuICAgICAgICBkcmF3TW9kZTogJ1RSSUFOR0xFX0ZBTicsXG4gICAgICAgIHZlcnRpY2VzOiBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAwLCAxLCAwLCAwLCAxLCAxLCAwLCAwLCAxLCAwXSlcbiAgICAgIH0pLFxuICAgICAgaXNJbnN0YW5jZWQ6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZUNlbGwoKSB7XG4gICAgY29uc3Qge3dpZHRoLCBoZWlnaHQsIHVuaXRXaWR0aCwgdW5pdEhlaWdodH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgbnVtQ29sID0gTWF0aC5jZWlsKHdpZHRoICogMiAvIHVuaXRXaWR0aCk7XG4gICAgY29uc3QgbnVtUm93ID0gTWF0aC5jZWlsKGhlaWdodCAqIDIgLyB1bml0SGVpZ2h0KTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG51bUNvbCxcbiAgICAgIG51bVJvdyxcbiAgICAgIG51bUluc3RhbmNlczogbnVtQ29sICogbnVtUm93XG4gICAgfSk7XG5cbiAgICBjb25zdCB7YXR0cmlidXRlTWFuYWdlcn0gPSB0aGlzLnN0YXRlO1xuICAgIGF0dHJpYnV0ZU1hbmFnZXIuaW52YWxpZGF0ZUFsbCgpO1xuXG4gICAgY29uc3QgTUFSR0lOID0gMjtcbiAgICBjb25zdCBzY2FsZSA9IG5ldyBGbG9hdDMyQXJyYXkoW1xuICAgICAgdW5pdFdpZHRoIC0gTUFSR0lOICogMixcbiAgICAgIHVuaXRIZWlnaHQgLSBNQVJHSU4gKiAyLFxuICAgICAgMVxuICAgIF0pO1xuICAgIHRoaXMuc2V0VW5pZm9ybXMoe3NjYWxlfSk7XG5cbiAgfVxuXG4gIGNhbGN1bGF0ZUluc3RhbmNlUG9zaXRpb25zKGF0dHJpYnV0ZSwgbnVtSW5zdGFuY2VzKSB7XG4gICAgY29uc3Qge3VuaXRXaWR0aCwgdW5pdEhlaWdodCwgd2lkdGgsIGhlaWdodH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtudW1Db2x9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCB7dmFsdWUsIHNpemV9ID0gYXR0cmlidXRlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1JbnN0YW5jZXM7IGkrKykge1xuICAgICAgY29uc3QgeCA9IGkgJSBudW1Db2w7XG4gICAgICBjb25zdCB5ID0gTWF0aC5mbG9vcihpIC8gbnVtQ29sKTtcbiAgICAgIHZhbHVlW2kgKiBzaXplICsgMF0gPSB4ICogdW5pdFdpZHRoIC0gd2lkdGg7XG4gICAgICB2YWx1ZVtpICogc2l6ZSArIDFdID0geSAqIHVuaXRIZWlnaHQgLSBoZWlnaHQ7XG4gICAgICB2YWx1ZVtpICogc2l6ZSArIDJdID0gMDtcbiAgICB9XG4gIH1cblxuICBjYWxjdWxhdGVJbnN0YW5jZUNvbG9ycyhhdHRyaWJ1dGUpIHtcbiAgICBjb25zdCB7ZGF0YSwgdW5pdFdpZHRoLCB1bml0SGVpZ2h0LCB3aWR0aCwgaGVpZ2h0fSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge251bUNvbCwgbnVtUm93fSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qge3ZhbHVlLCBzaXplfSA9IGF0dHJpYnV0ZTtcblxuICAgIHZhbHVlLmZpbGwoMC4wKTtcblxuICAgIGZvciAoY29uc3QgcG9pbnQgb2YgZGF0YSkge1xuICAgICAgY29uc3QgcGl4ZWwgPSB0aGlzLnByb2plY3QoW3BvaW50LnBvc2l0aW9uLnksIHBvaW50LnBvc2l0aW9uLnhdKTtcbiAgICAgIGNvbnN0IGNvbElkID0gTWF0aC5mbG9vcigocGl4ZWwueCArIHdpZHRoKSAvIHVuaXRXaWR0aCk7XG4gICAgICBjb25zdCByb3dJZCA9IE1hdGguZmxvb3IoKHBpeGVsLnkgKyBoZWlnaHQpIC8gdW5pdEhlaWdodCk7XG4gICAgICBpZiAoY29sSWQgPCBudW1Db2wgJiYgcm93SWQgPCBudW1Sb3cpIHtcbiAgICAgICAgY29uc3QgaTQgPSAoY29sSWQgKyByb3dJZCAqIG51bUNvbCkgKiBzaXplO1xuICAgICAgICB2YWx1ZVtpNCArIDJdID0gdmFsdWVbaTQgKyAwXSArPSAxO1xuICAgICAgICB2YWx1ZVtpNCArIDFdICs9IDU7XG4gICAgICAgIHZhbHVlW2k0ICsgM10gPSAwLjY7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZXRVbmlmb3Jtcyh7bWF4Q291bnQ6IE1hdGgubWF4KC4uLnZhbHVlKX0pO1xuICB9XG5cbn1cbiJdfQ==