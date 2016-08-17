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

/* eslint-disable no-console, no-try-catch */
/* global console */


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

var _luma = require('luma.gl');

var _lodash = require('lodash.throttle');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

var PROP_TYPES = {
  id: _react.PropTypes.string,

  width: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,

  pixelRatio: _react.PropTypes.number,
  viewport: _react.PropTypes.object.isRequired,
  camera: _react.PropTypes.instanceOf(_luma.Camera).isRequired,
  scene: _react.PropTypes.instanceOf(_luma.Scene),
  blending: _react.PropTypes.object,
  events: _react.PropTypes.object,
  gl: _react.PropTypes.object,
  debug: _react.PropTypes.bool,

  onRendererInitialized: _react.PropTypes.func.isRequired,
  onInitializationFailed: _react.PropTypes.func,
  onError: _react.PropTypes.func,

  onBeforeRenderFrame: _react.PropTypes.func,
  onAfterRenderFrame: _react.PropTypes.func,
  onBeforeRenderPickingScene: _react.PropTypes.func,
  onAfterRenderPickingScene: _react.PropTypes.func,

  onNeedRedraw: _react.PropTypes.func,
  onMouseMove: _react.PropTypes.func,
  onClick: _react.PropTypes.func
};

var DEFAULT_PROPS = {
  id: 'webgl-canvas',
  scene: null,

  gl: null,
  debug: false,

  onRendererInitialized: function onRendererInitialized() {},
  onInitializationFailed: function onInitializationFailed(error) {
    return console.error(error);
  },
  onError: function onError(error) {
    throw error;
  },
  onBeforeRenderFrame: function onBeforeRenderFrame() {},
  onAfterRenderFrame: function onAfterRenderFrame() {},
  onBeforeRenderPickingScene: function onBeforeRenderPickingScene() {},
  onAfterRenderPickingScene: function onAfterRenderPickingScene() {},

  onNeedRedraw: function onNeedRedraw() {
    return true;
  },
  onMouseMove: function onMouseMove() {},
  onClick: function onClick() {}
};

var WebGLRenderer = (_class = function (_React$Component) {
  _inherits(WebGLRenderer, _React$Component);

  _createClass(WebGLRenderer, null, [{
    key: 'propTypes',
    get: function get() {
      return PROP_TYPES;
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return DEFAULT_PROPS;
    }

    /**
     * @classdesc
     * Small react component that uses Luma.GL to initialize a WebGL context.
     *
     * Returns a canvas, creates a basic WebGL context, a camera and a scene,
     * sets up a renderloop, and registers some basic event handlers
     *
     * @class
     * @param {Object} props - see propTypes documentation
     */

  }]);

  function WebGLRenderer(props) {
    _classCallCheck(this, WebGLRenderer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WebGLRenderer).call(this, props));

    _this.state = {
      gl: null
    };
    return _this;
  }

  _createClass(WebGLRenderer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var canvas = this.refs.overlay;
      this._initWebGL(canvas);
    }

    /**
     * Initialize LumaGL library and through it WebGL
     * @param {string} canvas
     */

  }, {
    key: '_initWebGL',
    value: function _initWebGL(canvas) {
      var debug = this.props.debug;
      var gl = this.props.gl;

      if (!gl) {
        try {
          gl = (0, _luma.createGLContext)({
            canvas: canvas,
            debug: debug,
            preserveDrawingBuffer: true
          });
        } catch (error) {
          this.props.onInitializationFailed(error);
          return;
        }
      }

      var events = (0, _luma.addEvents)(canvas, {
        cacheSize: false,
        cachePosition: false,
        centerOrigin: false,
        onClick: this._onClick,
        onMouseMove: (0, _lodash2.default)(this._onMouseMove, 100)
      });

      this.setState({ gl: gl, events: events });

      this._animationLoop();

      // Call callback last, in case it throws
      this.props.onRendererInitialized({ gl: gl });
    }

    // TODO - move this back to luma.gl/scene.js
    /* eslint-disable max-statements */

  }, {
    key: '_pick',
    value: function _pick(x, y) {
      var gl = this.state.gl;
      var _props = this.props;
      var camera = _props.camera;
      var scene = _props.scene;
      var pixelRatio = _props.pixelRatio;


      var pickedModels = scene.pickModels(gl, {
        camera: camera,
        x: x * pixelRatio,
        y: y * pixelRatio
      });

      return pickedModels;
    }
  }, {
    key: '_onClick',
    value: function _onClick(event) {
      var picked = this._pick(event.x, event.y);
      this.props.onClick(_extends({}, event, { picked: picked }));
    }
  }, {
    key: '_onMouseMove',
    value: function _onMouseMove(event) {
      var picked = this._pick(event.x, event.y);
      this.props.onMouseMove(_extends({}, event, { picked: picked }));
    }
  }, {
    key: '_renderFrame',
    value: function _renderFrame() {
      var _props2 = this.props;
      var _props2$viewport = _props2.viewport;
      var x = _props2$viewport.x;
      var y = _props2$viewport.y;
      var width = _props2$viewport.width;
      var height = _props2$viewport.height;
      var _props2$blending = _props2.blending;
      var enable = _props2$blending.enable;
      var blendFunc = _props2$blending.blendFunc;
      var blendEquation = _props2$blending.blendEquation;
      var pixelRatio = _props2.pixelRatio;
      var camera = _props2.camera;
      var scene = _props2.scene;
      var gl = this.state.gl;

      if (!gl || !scene) {
        return;
      }

      // Note: Do this after gl check, in case onNeedRedraw clears flags
      if (!this.props.onNeedRedraw()) {
        return;
      }

      // clear depth and color buffers
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // update viewport to latest props
      // (typically changed by app on browser resize etc)
      gl.viewport(x * pixelRatio, y * pixelRatio, width * pixelRatio, height * pixelRatio);

      // setup bledning
      if (enable) {
        gl.enable(gl.BLEND);
        gl.blendFunc.apply(gl, _toConsumableArray(blendFunc.map(function (s) {
          return (0, _luma.glGet)(gl, s);
        })));
        gl.blendEquation((0, _luma.glGet)(gl, blendEquation));
      } else {
        gl.disable(gl.BLEND);
      }

      this.props.onBeforeRenderFrame();
      scene.render({ camera: camera });
      this.props.onAfterRenderFrame();
    }

    /**
     * Main WebGL animation loop
     */

  }, {
    key: '_animationLoop',
    value: function _animationLoop() {
      this._renderFrame();
      // Keep registering ourselves for the next animation frame
      _luma.Fx.requestAnimationFrame(this._animationLoop);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props;
      var id = _props3.id;
      var width = _props3.width;
      var height = _props3.height;
      var pixelRatio = _props3.pixelRatio;

      return _react2.default.createElement('canvas', {
        ref: 'overlay',
        id: id,
        width: width * pixelRatio || 1,
        height: height * pixelRatio || 1,
        style: { width: width, height: height } });
    }
  }]);

  return WebGLRenderer;
}(_react2.default.Component), (_applyDecoratedDescriptor(_class.prototype, '_onClick', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onClick'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_onMouseMove', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_onMouseMove'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_animationLoop', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_animationLoop'), _class.prototype)), _class);
exports.default = WebGLRenderer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93ZWJnbC1yZW5kZXJlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzsyQkFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNLGFBQWE7QUFDakIsTUFBSSxpQkFBVSxNQURHOztBQUdqQixTQUFPLGlCQUFVLE1BQVYsQ0FBaUIsVUFIUDtBQUlqQixVQUFRLGlCQUFVLE1BQVYsQ0FBaUIsVUFKUjs7QUFNakIsY0FBWSxpQkFBVSxNQU5MO0FBT2pCLFlBQVUsaUJBQVUsTUFBVixDQUFpQixVQVBWO0FBUWpCLFVBQVEsaUJBQVUsVUFBVixlQUE2QixVQVJwQjtBQVNqQixTQUFPLGlCQUFVLFVBQVYsYUFUVTtBQVVqQixZQUFVLGlCQUFVLE1BVkg7QUFXakIsVUFBUSxpQkFBVSxNQVhEO0FBWWpCLE1BQUksaUJBQVUsTUFaRztBQWFqQixTQUFPLGlCQUFVLElBYkE7O0FBZWpCLHlCQUF1QixpQkFBVSxJQUFWLENBQWUsVUFmckI7QUFnQmpCLDBCQUF3QixpQkFBVSxJQWhCakI7QUFpQmpCLFdBQVMsaUJBQVUsSUFqQkY7O0FBbUJqQix1QkFBcUIsaUJBQVUsSUFuQmQ7QUFvQmpCLHNCQUFvQixpQkFBVSxJQXBCYjtBQXFCakIsOEJBQTRCLGlCQUFVLElBckJyQjtBQXNCakIsNkJBQTJCLGlCQUFVLElBdEJwQjs7QUF3QmpCLGdCQUFjLGlCQUFVLElBeEJQO0FBeUJqQixlQUFhLGlCQUFVLElBekJOO0FBMEJqQixXQUFTLGlCQUFVO0FBMUJGLENBQW5COztBQTZCQSxJQUFNLGdCQUFnQjtBQUNwQixNQUFJLGNBRGdCO0FBRXBCLFNBQU8sSUFGYTs7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QUNBLFlBQU0sTUFBTixDQUFhLEVBQUMsY0FBRCxFQUFiO0FBQ0EsV0FBSyxLQUFMLENBQVcsa0JBQVg7QUFDRDs7QUFFRDs7Ozs7O3FDQUlpQjtBQUNmLFdBQUssWUFBTDtBQUNBO0FBQ0EsZUFBRyxxQkFBSCxDQUF5QixLQUFLLGNBQTlCO0FBQ0Q7Ozs2QkFFUTtBQUFBLG9CQUNpQyxLQUFLLEtBRHRDO0FBQUEsVUFDQSxFQURBLFdBQ0EsRUFEQTtBQUFBLFVBQ0ksS0FESixXQUNJLEtBREo7QUFBQSxVQUNXLE1BRFgsV0FDVyxNQURYO0FBQUEsVUFDbUIsVUFEbkIsV0FDbUIsVUFEbkI7O0FBRVAsYUFDRTtBQUNFLGFBQU0sU0FEUjtBQUVFLFlBQUssRUFGUDtBQUdFLGVBQVEsUUFBUSxVQUFSLElBQXNCLENBSGhDO0FBSUUsZ0JBQVMsU0FBUyxVQUFULElBQXVCLENBSmxDO0FBS0UsZUFBUSxFQUFDLFlBQUQsRUFBUSxjQUFSLEVBTFYsR0FERjtBQVFEOzs7O0VBaEt3QyxnQkFBTSxTO2tCQUE1QixhIiwiZmlsZSI6IndlYmdsLXJlbmRlcmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSwgbm8tdHJ5LWNhdGNoICovXG4vKiBnbG9iYWwgY29uc29sZSAqL1xuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgYXV0b2JpbmQgZnJvbSAnYXV0b2JpbmQtZGVjb3JhdG9yJztcbmltcG9ydCB7Y3JlYXRlR0xDb250ZXh0LCBDYW1lcmEsIFNjZW5lLCBhZGRFdmVudHMsIEZ4LCBnbEdldH0gZnJvbSAnbHVtYS5nbCc7XG5pbXBvcnQgdGhyb3R0bGUgZnJvbSAnbG9kYXNoLnRocm90dGxlJztcblxuY29uc3QgUFJPUF9UWVBFUyA9IHtcbiAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG5cbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG5cbiAgcGl4ZWxSYXRpbzogUHJvcFR5cGVzLm51bWJlcixcbiAgdmlld3BvcnQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgY2FtZXJhOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihDYW1lcmEpLmlzUmVxdWlyZWQsXG4gIHNjZW5lOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihTY2VuZSksXG4gIGJsZW5kaW5nOiBQcm9wVHlwZXMub2JqZWN0LFxuICBldmVudHM6IFByb3BUeXBlcy5vYmplY3QsXG4gIGdsOiBQcm9wVHlwZXMub2JqZWN0LFxuICBkZWJ1ZzogUHJvcFR5cGVzLmJvb2wsXG5cbiAgb25SZW5kZXJlckluaXRpYWxpemVkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBvbkluaXRpYWxpemF0aW9uRmFpbGVkOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25FcnJvcjogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgb25CZWZvcmVSZW5kZXJGcmFtZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uQWZ0ZXJSZW5kZXJGcmFtZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uQmVmb3JlUmVuZGVyUGlja2luZ1NjZW5lOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25BZnRlclJlbmRlclBpY2tpbmdTY2VuZTogUHJvcFR5cGVzLmZ1bmMsXG5cbiAgb25OZWVkUmVkcmF3OiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Nb3VzZU1vdmU6IFByb3BUeXBlcy5mdW5jLFxuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuY29uc3QgREVGQVVMVF9QUk9QUyA9IHtcbiAgaWQ6ICd3ZWJnbC1jYW52YXMnLFxuICBzY2VuZTogbnVsbCxcblxuICBnbDogbnVsbCxcbiAgZGVidWc6IGZhbHNlLFxuXG4gIG9uUmVuZGVyZXJJbml0aWFsaXplZDogKCkgPT4ge30sXG4gIG9uSW5pdGlhbGl6YXRpb25GYWlsZWQ6IGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpLFxuICBvbkVycm9yOiBlcnJvciA9PiB7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH0sXG4gIG9uQmVmb3JlUmVuZGVyRnJhbWU6ICgpID0+IHt9LFxuICBvbkFmdGVyUmVuZGVyRnJhbWU6ICgpID0+IHt9LFxuICBvbkJlZm9yZVJlbmRlclBpY2tpbmdTY2VuZTogKCkgPT4ge30sXG4gIG9uQWZ0ZXJSZW5kZXJQaWNraW5nU2NlbmU6ICgpID0+IHt9LFxuXG4gIG9uTmVlZFJlZHJhdzogKCkgPT4gdHJ1ZSxcbiAgb25Nb3VzZU1vdmU6ICgpID0+IHt9LFxuICBvbkNsaWNrOiAoKSA9PiB7fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViR0xSZW5kZXJlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIGdldCBwcm9wVHlwZXMoKSB7XG4gICAgcmV0dXJuIFBST1BfVFlQRVM7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGRlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4gREVGQVVMVF9QUk9QUztcbiAgfVxuXG4gIC8qKlxuICAgKiBAY2xhc3NkZXNjXG4gICAqIFNtYWxsIHJlYWN0IGNvbXBvbmVudCB0aGF0IHVzZXMgTHVtYS5HTCB0byBpbml0aWFsaXplIGEgV2ViR0wgY29udGV4dC5cbiAgICpcbiAgICogUmV0dXJucyBhIGNhbnZhcywgY3JlYXRlcyBhIGJhc2ljIFdlYkdMIGNvbnRleHQsIGEgY2FtZXJhIGFuZCBhIHNjZW5lLFxuICAgKiBzZXRzIHVwIGEgcmVuZGVybG9vcCwgYW5kIHJlZ2lzdGVycyBzb21lIGJhc2ljIGV2ZW50IGhhbmRsZXJzXG4gICAqXG4gICAqIEBjbGFzc1xuICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgLSBzZWUgcHJvcFR5cGVzIGRvY3VtZW50YXRpb25cbiAgICovXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBnbDogbnVsbFxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLnJlZnMub3ZlcmxheTtcbiAgICB0aGlzLl9pbml0V2ViR0woY2FudmFzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIEx1bWFHTCBsaWJyYXJ5IGFuZCB0aHJvdWdoIGl0IFdlYkdMXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYW52YXNcbiAgICovXG4gIF9pbml0V2ViR0woY2FudmFzKSB7XG4gICAgY29uc3Qge2RlYnVnfSA9IHRoaXMucHJvcHM7XG4gICAgbGV0IHtnbH0gPSB0aGlzLnByb3BzO1xuICAgIGlmICghZ2wpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGdsID0gY3JlYXRlR0xDb250ZXh0KHtcbiAgICAgICAgICBjYW52YXMsXG4gICAgICAgICAgZGVidWcsXG4gICAgICAgICAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5vbkluaXRpYWxpemF0aW9uRmFpbGVkKGVycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50cyA9IGFkZEV2ZW50cyhjYW52YXMsIHtcbiAgICAgIGNhY2hlU2l6ZTogZmFsc2UsXG4gICAgICBjYWNoZVBvc2l0aW9uOiBmYWxzZSxcbiAgICAgIGNlbnRlck9yaWdpbjogZmFsc2UsXG4gICAgICBvbkNsaWNrOiB0aGlzLl9vbkNsaWNrLFxuICAgICAgb25Nb3VzZU1vdmU6IHRocm90dGxlKHRoaXMuX29uTW91c2VNb3ZlLCAxMDApXG4gICAgfSk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtnbCwgZXZlbnRzfSk7XG5cbiAgICB0aGlzLl9hbmltYXRpb25Mb29wKCk7XG5cbiAgICAvLyBDYWxsIGNhbGxiYWNrIGxhc3QsIGluIGNhc2UgaXQgdGhyb3dzXG4gICAgdGhpcy5wcm9wcy5vblJlbmRlcmVySW5pdGlhbGl6ZWQoe2dsfSk7XG4gIH1cblxuICAvLyBUT0RPIC0gbW92ZSB0aGlzIGJhY2sgdG8gbHVtYS5nbC9zY2VuZS5qc1xuICAvKiBlc2xpbnQtZGlzYWJsZSBtYXgtc3RhdGVtZW50cyAqL1xuICBfcGljayh4LCB5KSB7XG4gICAgY29uc3Qge2dsfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qge2NhbWVyYSwgc2NlbmUsIHBpeGVsUmF0aW99ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IHBpY2tlZE1vZGVscyA9IHNjZW5lLnBpY2tNb2RlbHMoZ2wsIHtcbiAgICAgIGNhbWVyYSxcbiAgICAgIHg6IHggKiBwaXhlbFJhdGlvLFxuICAgICAgeTogeSAqIHBpeGVsUmF0aW9cbiAgICB9KTtcblxuICAgIHJldHVybiBwaWNrZWRNb2RlbHM7XG4gIH1cblxuICBAYXV0b2JpbmRcbiAgX29uQ2xpY2soZXZlbnQpIHtcbiAgICBjb25zdCBwaWNrZWQgPSB0aGlzLl9waWNrKGV2ZW50LngsIGV2ZW50LnkpO1xuICAgIHRoaXMucHJvcHMub25DbGljayh7Li4uZXZlbnQsIHBpY2tlZH0pO1xuICB9XG5cbiAgQGF1dG9iaW5kXG4gIF9vbk1vdXNlTW92ZShldmVudCkge1xuICAgIGNvbnN0IHBpY2tlZCA9IHRoaXMuX3BpY2soZXZlbnQueCwgZXZlbnQueSk7XG4gICAgdGhpcy5wcm9wcy5vbk1vdXNlTW92ZSh7Li4uZXZlbnQsIHBpY2tlZH0pO1xuICB9XG5cbiAgX3JlbmRlckZyYW1lKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHZpZXdwb3J0OiB7eCwgeSwgd2lkdGgsIGhlaWdodH0sXG4gICAgICBibGVuZGluZzoge2VuYWJsZSwgYmxlbmRGdW5jLCBibGVuZEVxdWF0aW9ufSxcbiAgICAgIHBpeGVsUmF0aW8sXG4gICAgICBjYW1lcmEsXG4gICAgICBzY2VuZVxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3Qge2dsfSA9IHRoaXMuc3RhdGU7XG4gICAgaWYgKCFnbCB8fCAhc2NlbmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBOb3RlOiBEbyB0aGlzIGFmdGVyIGdsIGNoZWNrLCBpbiBjYXNlIG9uTmVlZFJlZHJhdyBjbGVhcnMgZmxhZ3NcbiAgICBpZiAoIXRoaXMucHJvcHMub25OZWVkUmVkcmF3KCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBjbGVhciBkZXB0aCBhbmQgY29sb3IgYnVmZmVyc1xuICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKTtcblxuICAgIC8vIHVwZGF0ZSB2aWV3cG9ydCB0byBsYXRlc3QgcHJvcHNcbiAgICAvLyAodHlwaWNhbGx5IGNoYW5nZWQgYnkgYXBwIG9uIGJyb3dzZXIgcmVzaXplIGV0YylcbiAgICBnbC52aWV3cG9ydChcbiAgICAgIHggKiBwaXhlbFJhdGlvLFxuICAgICAgeSAqIHBpeGVsUmF0aW8sXG4gICAgICB3aWR0aCAqIHBpeGVsUmF0aW8sXG4gICAgICBoZWlnaHQgKiBwaXhlbFJhdGlvXG4gICAgKTtcblxuICAgIC8vIHNldHVwIGJsZWRuaW5nXG4gICAgaWYgKGVuYWJsZSkge1xuICAgICAgZ2wuZW5hYmxlKGdsLkJMRU5EKTtcbiAgICAgIGdsLmJsZW5kRnVuYyguLi5ibGVuZEZ1bmMubWFwKHMgPT4gZ2xHZXQoZ2wsIHMpKSk7XG4gICAgICBnbC5ibGVuZEVxdWF0aW9uKGdsR2V0KGdsLCBibGVuZEVxdWF0aW9uKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuICAgIH1cblxuICAgIHRoaXMucHJvcHMub25CZWZvcmVSZW5kZXJGcmFtZSgpO1xuICAgIHNjZW5lLnJlbmRlcih7Y2FtZXJhfSk7XG4gICAgdGhpcy5wcm9wcy5vbkFmdGVyUmVuZGVyRnJhbWUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWluIFdlYkdMIGFuaW1hdGlvbiBsb29wXG4gICAqL1xuICBAYXV0b2JpbmRcbiAgX2FuaW1hdGlvbkxvb3AoKSB7XG4gICAgdGhpcy5fcmVuZGVyRnJhbWUoKTtcbiAgICAvLyBLZWVwIHJlZ2lzdGVyaW5nIG91cnNlbHZlcyBmb3IgdGhlIG5leHQgYW5pbWF0aW9uIGZyYW1lXG4gICAgRngucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX2FuaW1hdGlvbkxvb3ApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtpZCwgd2lkdGgsIGhlaWdodCwgcGl4ZWxSYXRpb30gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiAoXG4gICAgICA8Y2FudmFzXG4gICAgICAgIHJlZj17ICdvdmVybGF5JyB9XG4gICAgICAgIGlkPXsgaWQgfVxuICAgICAgICB3aWR0aD17IHdpZHRoICogcGl4ZWxSYXRpbyB8fCAxIH1cbiAgICAgICAgaGVpZ2h0PXsgaGVpZ2h0ICogcGl4ZWxSYXRpbyB8fCAxIH1cbiAgICAgICAgc3R5bGU9eyB7d2lkdGgsIGhlaWdodH0gfS8+XG4gICAgKTtcbiAgfVxuXG59XG4iXX0=