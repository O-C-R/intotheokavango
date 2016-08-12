'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class; // Copyright (c) 2015 Uber Technologies, Inc.
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

/* global window */

// TODO move this to react-map-gl utility


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _webglRenderer = require('./webgl-renderer');

var _webglRenderer2 = _interopRequireDefault(_webglRenderer);

var _luma = require('luma.gl');

var _config = require('./config');

var _layerManager = require('./layer-manager');

var _viewport = require('./viewport');

var _viewport2 = _interopRequireDefault(_viewport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

// TODO - move default to WebGL renderer
var DEFAULT_PIXEL_RATIO = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

var PROP_TYPES = {
  width: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,
  layers: _react.PropTypes.array.isRequired,
  blending: _react.PropTypes.object,
  gl: _react.PropTypes.object,
  debug: _react.PropTypes.bool,
  camera: _react.PropTypes.instanceOf(_luma.Camera),
  pixelRatio: _react.PropTypes.number,
  onWebGLInitialized: _react.PropTypes.func
};

var DEFAULT_PROPS = {
  blending: _config.DEFAULT_BLENDING,
  camera: null,
  pixelRatio: DEFAULT_PIXEL_RATIO,
  gl: null,
  debug: false,
  onWebGLInitialized: function onWebGLInitialized() {}
};

var DeckGLOverlay = (_class = function (_React$Component) {
  _inherits(DeckGLOverlay, _React$Component);

  _createClass(DeckGLOverlay, null, [{
    key: 'propTypes',
    get: function get() {
      return PROP_TYPES;
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return DEFAULT_PROPS;
    }
  }]);

  function DeckGLOverlay(props) {
    _classCallCheck(this, DeckGLOverlay);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DeckGLOverlay).call(this, props));

    _this.state = {};
    _this.needsRedraw = true;
    return _this;
  }

  _createClass(DeckGLOverlay, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _state = this.state;
      var gl = _state.gl;
      var scene = _state.scene;

      (0, _layerManager.updateLayers)({
        oldLayers: this.props.layers,
        newLayers: nextProps.layers,
        gl: gl,
        scene: scene
      });
    }
  }, {
    key: '_onRendererInitialized',
    value: function _onRendererInitialized(_ref) {
      var gl = _ref.gl;

      this.props.onWebGLInitialized(gl);
      var scene = new _luma.Scene(gl, {
        lights: _config.DEFAULT_LIGHTING,
        backgroundColor: _config.DEFAULT_BACKGROUND_COLOR
      });
      // Note: Triggers React component update, rerending updated layers
      this.setState({
        gl: gl,
        scene: scene
      });
      // Note: throws on error, don't adjust state after this call
      (0, _layerManager.updateLayers)({
        oldLayers: [],
        newLayers: this.props.layers,
        gl: gl,
        scene: scene
      });
    }

    // Route events to layers

  }, {
    key: '_onClick',
    value: function _onClick(info) {
      var picked = info.picked;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = picked[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          if (item.model.userData.layer.onClick(_extends({ color: item.color }, info))) {
            return;
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
    }

    // Route events to layers

  }, {
    key: '_onMouseMove',
    value: function _onMouseMove(info) {
      var picked = info.picked;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = picked[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var item = _step2.value;

          if (item.model.userData.layer.onHover(_extends({ color: item.color }, info))) {
            return;
          }
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
    key: '_checkIfNeedRedraw',
    value: function _checkIfNeedRedraw() {
      var layers = this.props.layers;

      return (0, _layerManager.layersNeedRedraw)(layers, { clearRedrawFlags: true });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var width = _props.width;
      var height = _props.height;
      var layers = _props.layers;
      var blending = _props.blending;
      var pixelRatio = _props.pixelRatio;
      var latitude = _props.latitude;
      var longitude = _props.longitude;
      var zoom = _props.zoom;
      var pitch = _props.pitch;
      var bearing = _props.bearing;
      var altitude = _props.altitude;
      var gl = _props.gl;
      var debug = _props.debug;

      var otherProps = _objectWithoutProperties(_props, ['width', 'height', 'layers', 'blending', 'pixelRatio', 'latitude', 'longitude', 'zoom', 'pitch', 'bearing', 'altitude', 'gl', 'debug']);

      var camera = this.props.camera;
      var scene = this.state.scene;


      function convertToMat4(toMatrix, fromMatrix) {
        for (var i = 0; i < fromMatrix.length; ++i) {
          toMatrix[i] = fromMatrix[i];
        }
      }

      // Create a "disposable" camera and overwrite matrices
      if (!camera) {
        var viewport = new _viewport2.default({
          width: width, height: height, latitude: latitude, longitude: longitude, zoom: zoom, pitch: pitch, bearing: bearing, altitude: altitude
        });

        camera = new _luma.PerspectiveCamera();
        camera.view = new _luma.Mat4().id();
        convertToMat4(camera.projection, viewport.getProjectionMatrix());
      }

      return _react2.default.createElement(_webglRenderer2.default, _extends({}, otherProps, {

        width: width,
        height: height,

        gl: gl,
        debug: debug,
        viewport: { x: 0, y: 0, width: width, height: height },
        camera: camera,
        scene: scene,
        blending: blending,
        pixelRatio: pixelRatio,

        onRendererInitialized: this._onRendererInitialized,
        onNeedRedraw: this._checkIfNeedRedraw,
        onMouseMove: this._onMouseMove,
        onClick: this._onClick }));
    }
  }]);

  return DeckGLOverlay;
}(_react2.default.Component), (_applyDecoratedDescriptor(_class.prototype, '_onRendererInitialized', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onRendererInitialized'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onClick', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onClick'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onMouseMove', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseMove'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_checkIfNeedRedraw', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_checkIfNeedRedraw'), _class.prototype)), _class);
exports.default = DeckGLOverlay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kZWNrZ2wtb3ZlcmxheS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzsyQkFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFTQTs7O0FBUkE7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtBQUNBLElBQU0sc0JBQ0osT0FBTyxNQUFQLEtBQWtCLFdBQWxCLEdBQWdDLE9BQU8sZ0JBQXZDLEdBQTBELENBRDVEOztBQUdBLElBQU0sYUFBYTtBQUNqQixTQUFPLGlCQUFVLE1BQVYsQ0FBaUIsVUFEUDtBQUVqQixVQUFRLGlCQUFVLE1BQVYsQ0FBaUIsVUFGUjtBQUdqQixVQUFRLGlCQUFVLEtBQVYsQ0FBZ0IsVUFIUDtBQUlqQixZQUFVLGlCQUFVLE1BSkg7QUFLakIsTUFBSSxpQkFBVSxNQUxHO0FBTWpCLFNBQU8saUJBQVUsSUFOQTtBQU9qQixVQUFRLGlCQUFVLFVBQVYsY0FQUztBQVFqQixjQUFZLGlCQUFVLE1BUkw7QUFTakIsc0JBQW9CLGlCQUFVO0FBVGIsQ0FBbkI7O0FBWUEsSUFBTSxnQkFBZ0I7QUFDcEIsb0NBRG9CO0FBRXBCLFVBQVEsSUFGWTtBQUdwQixjQUFZLG1CQUhRO0FBSXBCLE1BQUksSUFKZ0I7QUFLcEIsU0FBTyxLQUxhO0FBTXBCLHNCQUFvQiw4QkFBTSxDQUFFO0FBTlIsQ0FBdEI7O0lBU3FCLGE7Ozs7O3dCQUVJO0FBQ3JCLGFBQU8sVUFBUDtBQUNEOzs7d0JBRXlCO0FBQ3hCLGFBQU8sYUFBUDtBQUNEOzs7QUFFRCx5QkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsaUdBQ1gsS0FEVzs7QUFFakIsVUFBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLFVB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SSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxXQUFXLE1BQS9CLEVBQXVDLEVBQUUsQ0FBekMsRUFBNEM7QUFDMUMsbUJBQVMsQ0FBVCxJQUFjLFdBQVcsQ0FBWCxDQUFkO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBLFVBQUksQ0FBQyxNQUFMLEVBQWE7QUFDWCxZQUFNLFdBQVcsdUJBQWE7QUFDNUIsc0JBRDRCLEVBQ3JCLGNBRHFCLEVBQ2Isa0JBRGEsRUFDSCxvQkFERyxFQUNRLFVBRFIsRUFDYyxZQURkLEVBQ3FCLGdCQURyQixFQUM4QjtBQUQ5QixTQUFiLENBQWpCOztBQUlBLGlCQUFTLDZCQUFUO0FBQ0EsZUFBTyxJQUFQLEdBQWMsaUJBQVcsRUFBWCxFQUFkO0FBQ0Esc0JBQWMsT0FBTyxVQUFyQixFQUFpQyxTQUFTLG1CQUFULEVBQWpDO0FBQ0Q7O0FBRUQsYUFDRSxvRUFDTyxVQURQOztBQUdFLGVBQVEsS0FIVjtBQUlFLGdCQUFTLE1BSlg7O0FBTUUsWUFBSyxFQU5QO0FBT0UsZUFBUSxLQVBWO0FBUUUsa0JBQVcsRUFBQyxHQUFHLENBQUosRUFBTyxHQUFHLENBQVYsRUFBYSxZQUFiLEVBQW9CLGNBQXBCLEVBUmI7QUFTRSxnQkFBUyxNQVRYO0FBVUUsZUFBUSxLQVZWO0FBV0Usa0JBQVcsUUFYYjtBQVlFLG9CQUFhLFVBWmY7O0FBY0UsK0JBQXdCLEtBQUssc0JBZC9CO0FBZUUsc0JBQWUsS0FBSyxrQkFmdEI7QUFnQkUscUJBQWMsS0FBSyxZQWhCckI7QUFpQkUsaUJBQVUsS0FBSyxRQWpCakIsSUFERjtBQW9CRDs7OztFQXRId0MsZ0JBQU0sUztrQkFBNUIsYSIsImZpbGUiOiJkZWNrZ2wtb3ZlcmxheS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbi8qIGdsb2JhbCB3aW5kb3cgKi9cbmltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGF1dG9iaW5kIGZyb20gJ2F1dG9iaW5kLWRlY29yYXRvcic7XG5cbmltcG9ydCBXZWJHTFJlbmRlcmVyIGZyb20gJy4vd2ViZ2wtcmVuZGVyZXInO1xuaW1wb3J0IHtTY2VuZSwgQ2FtZXJhLCBQZXJzcGVjdGl2ZUNhbWVyYSwgTWF0NH0gZnJvbSAnbHVtYS5nbCc7XG5pbXBvcnQge0RFRkFVTFRfTElHSFRJTkcsIERFRkFVTFRfQkxFTkRJTkcsIERFRkFVTFRfQkFDS0dST1VORF9DT0xPUn1cbiAgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHt1cGRhdGVMYXllcnMsIGxheWVyc05lZWRSZWRyYXd9IGZyb20gJy4vbGF5ZXItbWFuYWdlcic7XG4vLyBUT0RPIG1vdmUgdGhpcyB0byByZWFjdC1tYXAtZ2wgdXRpbGl0eVxuaW1wb3J0IFZpZXdwb3J0IGZyb20gJy4vdmlld3BvcnQnO1xuXG4vLyBUT0RPIC0gbW92ZSBkZWZhdWx0IHRvIFdlYkdMIHJlbmRlcmVyXG5jb25zdCBERUZBVUxUX1BJWEVMX1JBVElPID1cbiAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA6IDE7XG5cbmNvbnN0IFBST1BfVFlQRVMgPSB7XG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBsYXllcnM6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICBibGVuZGluZzogUHJvcFR5cGVzLm9iamVjdCxcbiAgZ2w6IFByb3BUeXBlcy5vYmplY3QsXG4gIGRlYnVnOiBQcm9wVHlwZXMuYm9vbCxcbiAgY2FtZXJhOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihDYW1lcmEpLFxuICBwaXhlbFJhdGlvOiBQcm9wVHlwZXMubnVtYmVyLFxuICBvbldlYkdMSW5pdGlhbGl6ZWQ6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5jb25zdCBERUZBVUxUX1BST1BTID0ge1xuICBibGVuZGluZzogREVGQVVMVF9CTEVORElORyxcbiAgY2FtZXJhOiBudWxsLFxuICBwaXhlbFJhdGlvOiBERUZBVUxUX1BJWEVMX1JBVElPLFxuICBnbDogbnVsbCxcbiAgZGVidWc6IGZhbHNlLFxuICBvbldlYkdMSW5pdGlhbGl6ZWQ6ICgpID0+IHt9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWNrR0xPdmVybGF5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgZ2V0IHByb3BUeXBlcygpIHtcbiAgICByZXR1cm4gUFJPUF9UWVBFUztcbiAgfVxuXG4gIHN0YXRpYyBnZXQgZGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiBERUZBVUxUX1BST1BTO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xuICAgIHRoaXMubmVlZHNSZWRyYXcgPSB0cnVlO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBjb25zdCB7Z2wsIHNjZW5lfSA9IHRoaXMuc3RhdGU7XG4gICAgdXBkYXRlTGF5ZXJzKHtcbiAgICAgIG9sZExheWVyczogdGhpcy5wcm9wcy5sYXllcnMsXG4gICAgICBuZXdMYXllcnM6IG5leHRQcm9wcy5sYXllcnMsXG4gICAgICBnbCxcbiAgICAgIHNjZW5lXG4gICAgfSk7XG4gIH1cblxuICBAYXV0b2JpbmQgX29uUmVuZGVyZXJJbml0aWFsaXplZCh7Z2x9KSB7XG4gICAgdGhpcy5wcm9wcy5vbldlYkdMSW5pdGlhbGl6ZWQoZ2wpO1xuICAgIGNvbnN0IHNjZW5lID0gbmV3IFNjZW5lKGdsLCB7XG4gICAgICBsaWdodHM6IERFRkFVTFRfTElHSFRJTkcsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IERFRkFVTFRfQkFDS0dST1VORF9DT0xPUlxuICAgIH0pO1xuICAgIC8vIE5vdGU6IFRyaWdnZXJzIFJlYWN0IGNvbXBvbmVudCB1cGRhdGUsIHJlcmVuZGluZyB1cGRhdGVkIGxheWVyc1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZ2wsXG4gICAgICBzY2VuZVxuICAgIH0pO1xuICAgIC8vIE5vdGU6IHRocm93cyBvbiBlcnJvciwgZG9uJ3QgYWRqdXN0IHN0YXRlIGFmdGVyIHRoaXMgY2FsbFxuICAgIHVwZGF0ZUxheWVycyh7XG4gICAgICBvbGRMYXllcnM6IFtdLFxuICAgICAgbmV3TGF5ZXJzOiB0aGlzLnByb3BzLmxheWVycyxcbiAgICAgIGdsLFxuICAgICAgc2NlbmVcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFJvdXRlIGV2ZW50cyB0byBsYXllcnNcbiAgQGF1dG9iaW5kIF9vbkNsaWNrKGluZm8pIHtcbiAgICBjb25zdCB7cGlja2VkfSA9IGluZm87XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHBpY2tlZCkge1xuICAgICAgaWYgKGl0ZW0ubW9kZWwudXNlckRhdGEubGF5ZXIub25DbGljayh7Y29sb3I6IGl0ZW0uY29sb3IsIC4uLmluZm99KSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgICAvLyBSb3V0ZSBldmVudHMgdG8gbGF5ZXJzXG4gIEBhdXRvYmluZCBfb25Nb3VzZU1vdmUoaW5mbykge1xuICAgIGNvbnN0IHtwaWNrZWR9ID0gaW5mbztcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgcGlja2VkKSB7XG4gICAgICBpZiAoaXRlbS5tb2RlbC51c2VyRGF0YS5sYXllci5vbkhvdmVyKHtjb2xvcjogaXRlbS5jb2xvciwgLi4uaW5mb30pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBAYXV0b2JpbmQgX2NoZWNrSWZOZWVkUmVkcmF3KCkge1xuICAgIGNvbnN0IHtsYXllcnN9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gbGF5ZXJzTmVlZFJlZHJhdyhsYXllcnMsIHtjbGVhclJlZHJhd0ZsYWdzOiB0cnVlfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgd2lkdGgsIGhlaWdodCwgbGF5ZXJzLCBibGVuZGluZywgcGl4ZWxSYXRpbyxcbiAgICAgIGxhdGl0dWRlLCBsb25naXR1ZGUsIHpvb20sIHBpdGNoLCBiZWFyaW5nLCBhbHRpdHVkZSxcbiAgICAgIGdsLCBkZWJ1ZyxcbiAgICAgIC4uLm90aGVyUHJvcHNcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBsZXQge2NhbWVyYX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtzY2VuZX0gPSB0aGlzLnN0YXRlO1xuXG4gICAgZnVuY3Rpb24gY29udmVydFRvTWF0NCh0b01hdHJpeCwgZnJvbU1hdHJpeCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcm9tTWF0cml4Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHRvTWF0cml4W2ldID0gZnJvbU1hdHJpeFtpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgYSBcImRpc3Bvc2FibGVcIiBjYW1lcmEgYW5kIG92ZXJ3cml0ZSBtYXRyaWNlc1xuICAgIGlmICghY2FtZXJhKSB7XG4gICAgICBjb25zdCB2aWV3cG9ydCA9IG5ldyBWaWV3cG9ydCh7XG4gICAgICAgIHdpZHRoLCBoZWlnaHQsIGxhdGl0dWRlLCBsb25naXR1ZGUsIHpvb20sIHBpdGNoLCBiZWFyaW5nLCBhbHRpdHVkZVxuICAgICAgfSk7XG5cbiAgICAgIGNhbWVyYSA9IG5ldyBQZXJzcGVjdGl2ZUNhbWVyYSgpO1xuICAgICAgY2FtZXJhLnZpZXcgPSBuZXcgTWF0NCgpLmlkKCk7XG4gICAgICBjb252ZXJ0VG9NYXQ0KGNhbWVyYS5wcm9qZWN0aW9uLCB2aWV3cG9ydC5nZXRQcm9qZWN0aW9uTWF0cml4KCkpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8V2ViR0xSZW5kZXJlclxuICAgICAgICB7IC4uLm90aGVyUHJvcHMgfVxuXG4gICAgICAgIHdpZHRoPXsgd2lkdGggfVxuICAgICAgICBoZWlnaHQ9eyBoZWlnaHQgfVxuXG4gICAgICAgIGdsPXsgZ2wgfVxuICAgICAgICBkZWJ1Zz17IGRlYnVnIH1cbiAgICAgICAgdmlld3BvcnQ9eyB7eDogMCwgeTogMCwgd2lkdGgsIGhlaWdodH0gfVxuICAgICAgICBjYW1lcmE9eyBjYW1lcmEgfVxuICAgICAgICBzY2VuZT17IHNjZW5lIH1cbiAgICAgICAgYmxlbmRpbmc9eyBibGVuZGluZyB9XG4gICAgICAgIHBpeGVsUmF0aW89eyBwaXhlbFJhdGlvIH1cblxuICAgICAgICBvblJlbmRlcmVySW5pdGlhbGl6ZWQ9eyB0aGlzLl9vblJlbmRlcmVySW5pdGlhbGl6ZWQgfVxuICAgICAgICBvbk5lZWRSZWRyYXc9eyB0aGlzLl9jaGVja0lmTmVlZFJlZHJhdyB9XG4gICAgICAgIG9uTW91c2VNb3ZlPXsgdGhpcy5fb25Nb3VzZU1vdmUgfVxuICAgICAgICBvbkNsaWNrPXsgdGhpcy5fb25DbGljayB9Lz5cbiAgICApO1xuICB9XG5cbn1cbiJdfQ==