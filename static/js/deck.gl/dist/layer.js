'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Copyright (c) 2015 Uber Technologies, Inc.
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

/* eslint-disable guard-for-in */


var _luma = require('luma.gl');

var _util = require('./util');

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _viewportMercatorProject = require('viewport-mercator-project');

var _viewportMercatorProject2 = _interopRequireDefault(_viewportMercatorProject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * @param {string} props.id - layer name
 * @param {array}  props.data - array of data instances
 * @param {number} props.width - viewport width, synced with MapboxGL
 * @param {number} props.height - viewport width, synced with MapboxGL
 * @param {bool} props.isPickable - whether layer response to mouse event
 * @param {bool} props.opacity - opacity of the layer
 */
var DEFAULT_PROPS = {
  key: 0,
  opacity: 0.8,
  numInstances: undefined,
  data: [],
  isPickable: false,
  deepCompare: false,
  getValue: function getValue(x) {
    return x;
  },
  onHover: function onHover() {},
  onClick: function onClick() {},
  // Update triggers: a key change detection mechanism in deck.gl
  //
  // The value of `updateTriggers` is a map with fields corresponding to
  // attribute names (or `all`). Each field has a value which is an object,
  // it can contain any amount of data. The data for each field is compared
  // shallowly, and if a change is detected, the attribute is invalidated
  // (all attributes are invalidated if the `all` key is used.)
  // Note: updateTriggers are ignored by normal shallow comparison, so it is
  // OK for the app to mint a new object on every render.
  updateTriggers: {}
};

var ATTRIBUTES = {
  instancePickingColors: { size: 3, '0': 'pickRed', '1': 'pickGreen', '2': 'pickBlue' }
};

var counter = 0;

var Layer = function () {
  _createClass(Layer, null, [{
    key: 'attributes',
    get: function get() {
      return ATTRIBUTES;
    }

    /**
     * @classdesc
     * Base Layer class
     *
     * @class
     * @param {object} props - See docs above
     */
    /* eslint-disable max-statements */

  }]);

  function Layer(props) {
    _classCallCheck(this, Layer);

    props = _extends({}, DEFAULT_PROPS, props);

    // Add iterator to objects
    // TODO - Modifying props is an anti-pattern
    if (props.data) {
      (0, _util.addIterator)(props.data);
      (0, _assert2.default)(props.data[Symbol.iterator], 'data prop must have an iterator');
    }

    this.props = props;

    this.checkProp(props.data, 'data');
    this.checkProp(props.id, 'id');
    this.checkProp(props.width, 'width');
    this.checkProp(props.height, 'height');

    this.checkProp(props.width, 'width');
    this.checkProp(props.height, 'height');
    this.checkProp(props.latitude, 'latitude');
    this.checkProp(props.longitude, 'longitude');
    this.checkProp(props.zoom, 'zoom');

    this.count = counter++;
  }
  /* eslint-enable max-statements */

  // //////////////////////////////////////////////////
  // LIFECYCLE METHODS, overridden by the layer subclasses

  // Called once to set up the initial state


  _createClass(Layer, [{
    key: 'initializeState',
    value: function initializeState() {}

    // gl context is now available

  }, {
    key: 'didMount',
    value: function didMount() {}
  }, {
    key: 'shouldUpdate',
    value: function shouldUpdate(oldProps, newProps) {
      // Check update triggers, and invalidate props accordingly
      if (this.checkUpdateTriggers(oldProps, newProps)) {
        return true;
      }
      // If any props have changed, ignoring updateTriggers objects
      // (updateTriggers are expected to be reminted on every update)
      var equalShallow = (0, _util.areEqualShallow)(newProps, oldProps, {
        ignore: { updateTriggers: true }
      });
      if (!equalShallow) {
        if (newProps.data !== oldProps.data) {
          this.setState({ dataChanged: true });
        }
        return true;
      }
      if (newProps.deepCompare && !(0, _lodash2.default)(newProps.data, oldProps.data)) {
        // Support optional deep compare of data
        // Note: this is quite inefficient, app should use buffer props instead
        this.setState({ dataChanged: true });
        return true;
      }
      return false;
    }

    // Default implementation, all attributeManager will be updated

  }, {
    key: 'willReceiveProps',
    value: function willReceiveProps(oldProps, newProps) {
      var attributeManager = this.state.attributeManager;

      if (this.state.dataChanged) {
        attributeManager.invalidateAll();
      }
    }

    // gl context still available

  }, {
    key: 'willUnmount',
    value: function willUnmount() {}

    // END LIFECYCLE METHODS
    // //////////////////////////////////////////////////

    // Public API

  }, {
    key: 'setNeedsRedraw',
    value: function setNeedsRedraw() {
      var redraw = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      if (this.state) {
        this.state.needsRedraw = redraw;
      }
    }

    // Checks state of attributes and model
    // TODO - is attribute manager needed? - Model should be enough.

  }, {
    key: 'getNeedsRedraw',
    value: function getNeedsRedraw() {
      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref$clearRedrawFlags = _ref.clearRedrawFlags;
      var clearRedrawFlags = _ref$clearRedrawFlags === undefined ? false : _ref$clearRedrawFlags;

      // this method may be called by the render loop as soon a the layer
      // has been created, so guard against uninitialized state
      if (!this.state) {
        return false;
      }

      var _state = this.state;
      var attributeManager = _state.attributeManager;
      var model = _state.model;

      var redraw = false;
      redraw = redraw || this.state.needsRedraw;
      this.state.needsRedraw = this.state.needsRedraw && !clearRedrawFlags;

      redraw = redraw || attributeManager.getNeedsRedraw({ clearRedrawFlags: clearRedrawFlags });
      redraw = redraw || model.getNeedsRedraw({ clearRedrawFlags: clearRedrawFlags });
      return redraw;
    }

    // Updates selected state members and marks the object for redraw

  }, {
    key: 'setState',
    value: function setState(updateObject) {
      Object.assign(this.state, updateObject);
      this.state.needsRedraw = true;
    }

    // Updates selected state members and marks the object for redraw

  }, {
    key: 'setUniforms',
    value: function setUniforms(uniformMap) {
      if (this.state.model) {
        this.state.model.setUniforms(uniformMap);
      }
      // TODO - set needsRedraw on the model?
      this.state.needsRedraw = true;
      (0, _log2.default)(3, 'layer.setUniforms', uniformMap);
    }

    // Use iteration (the only required capability on data) to get first element

  }, {
    key: 'getFirstObject',
    value: function getFirstObject() {
      var data = this.props.data;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var object = _step.value;

          return object;
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

      return null;
    }

    // INTERNAL METHODS

    // Deduces numer of instances. Intention is to support:
    // - Explicit setting of numInstances
    // - Auto-deduction for ES6 containers that define a size member
    // - Auto-deduction for Classic Arrays via the built-in length attribute
    // - Auto-deduction via arrays

  }, {
    key: 'getNumInstances',
    value: function getNumInstances(props) {
      props = props || this.props;

      // First check if the layer has set its own value
      if (this.state && this.state.numInstances !== undefined) {
        return this.state.numInstances;
      }

      // Check if app has provided an explicit value
      if (props.numInstances !== undefined) {
        return props.numInstances;
      }

      var _props = props;
      var data = _props.data;

      // Check if ES6 collection "count" function is available

      if (data && typeof data.count === 'function') {
        return data.count();
      }

      // Check if ES6 collection "size" attribute is set
      if (data && data.size !== undefined) {
        return data.size;
      }

      // Check if array length attribute is set
      // Note: checking this last since some ES6 collections (Immutable.js)
      // emit profuse warnings when trying to access `length` attribute
      if (data && data.length !== undefined) {
        return data.length;
      }

      throw new Error('Could not deduce numInstances');
    }

    // Internal Helpers

  }, {
    key: 'checkProps',
    value: function checkProps(oldProps, newProps) {
      // Note: dataChanged might already be set
      if (newProps.data !== oldProps.data) {
        // Figure out data length
        this.state.dataChanged = true;
      }

      var viewportChanged = newProps.width !== oldProps.width || newProps.height !== oldProps.height || newProps.latitude !== oldProps.latitude || newProps.longitude !== oldProps.longitude || newProps.zoom !== oldProps.zoom;

      this.setState({ viewportChanged: viewportChanged });
    }
  }, {
    key: 'updateAttributes',
    value: function updateAttributes(props) {
      var _state2 = this.state;
      var attributeManager = _state2.attributeManager;
      var model = _state2.model;

      var numInstances = this.getNumInstances(props);
      // Figure out data length
      attributeManager.update({
        numInstances: numInstances,
        bufferMap: props,
        context: this,
        // Don't worry about non-attribute props
        ignoreUnknownAttributes: true
      });
      if (model) {
        var changedAttributes = attributeManager.getChangedAttributes({ clearChangedFlags: true });
        model.setAttributes(changedAttributes);
      }
    }
  }, {
    key: 'updateBaseUniforms',
    value: function updateBaseUniforms() {
      this.setUniforms({
        // apply gamma to opacity to make it visually "linear"
        opacity: Math.pow(this.props.opacity || 0.8, 1 / 2.2)
      });
    }

    // Check if any update triggers have changed, and invalidate
    // attributes accordingly.

  }, {
    key: 'checkUpdateTriggers',
    value: function checkUpdateTriggers(oldProps, newProps) {
      var change = false;
      var attributeManager = this.state.attributeManager;

      for (var propName in newProps.updateTriggers) {
        var oldTriggers = oldProps.updateTriggers[propName];
        var newTriggers = newProps.updateTriggers[propName];
        if (!(0, _util.areEqualShallow)(oldTriggers, newTriggers)) {
          if (propName === 'all') {
            attributeManager.invalidateAll();
            change = true;
          } else {
            attributeManager.invalidate(propName);
            change = true;
          }
        }
      }
      return change;
    }

    // LAYER MANAGER API

    // Called by layer manager when a new layer is found
    /* eslint-disable max-statements */

  }, {
    key: 'initializeLayer',
    value: function initializeLayer(_ref2) {
      var gl = _ref2.gl;

      (0, _assert2.default)(gl);
      this.state = { gl: gl };

      // Initialize state only once
      this.setState({
        attributeManager: new _luma.AttributeManager({ id: this.props.id }),
        model: null,
        needsRedraw: true,
        dataChanged: true
      });

      var attributeManager = this.state.attributeManager;
      // All instanced layers get instancePickingColors attribute by default
      // Their shaders can use it to render a picking scene

      attributeManager.addInstanced(ATTRIBUTES, {
        instancePickingColors: { update: this.calculateInstancePickingColors }
      });

      this.setViewport();
      this.initializeState();
      (0, _assert2.default)(this.state.model, 'Model must be set in initializeState');
      this.setViewport();

      // TODO - the app must be able to override

      // Add any subclass attributes
      this.updateAttributes(this.props);
      this.updateBaseUniforms();

      var model = this.state.model;

      model.setInstanceCount(this.getNumInstances());
      model.id = this.props.id;
      model.program.id = this.props.id + '-program';
      model.geometry.id = this.props.id + '-geometry';

      // Create a model for the layer
      this._updateModel({ gl: gl });

      // Call life cycle method
      this.didMount();
    }
    /* eslint-enable max-statements */

    // Called by layer manager when existing layer is getting new props

  }, {
    key: 'updateLayer',
    value: function updateLayer(oldProps, newProps) {
      // Calculate standard change flags
      this.checkProps(oldProps, newProps);

      // Check if any props have changed
      if (this.shouldUpdate(oldProps, newProps)) {
        if (this.state.viewportChanged) {
          this.setViewport();
        }

        // Let the subclass mark what is needed for update
        this.willReceiveProps(oldProps, newProps);
        // Run the attribute updaters
        this.updateAttributes(newProps);
        // Update the uniforms
        this.updateBaseUniforms();

        if (this.state.model) {
          this.state.model.setInstanceCount(this.getNumInstances());
        }
      }

      this.state.dataChanged = false;
      this.state.viewportChanged = false;
    }

    // Called by manager when layer is about to be disposed
    // Note: not guaranteed to be called on application shutdown

  }, {
    key: 'finalizeLayer',
    value: function finalizeLayer() {
      this.willUnmount();
    }
  }, {
    key: 'calculateInstancePickingColors',
    value: function calculateInstancePickingColors(attribute, numInstances) {
      var value = attribute.value;
      var size = attribute.size;
      // add 1 to index to seperate from no selection

      for (var i = 0; i < numInstances; i++) {
        var pickingColor = this.encodePickingColor(i);
        value[i * size + 0] = pickingColor[0];
        value[i * size + 1] = pickingColor[1];
        value[i * size + 2] = pickingColor[2];
      }
    }
  }, {
    key: 'decodePickingColor',
    value: function decodePickingColor(color) {
      (0, _assert2.default)(color instanceof Uint8Array);

      var _color = _slicedToArray(color, 3);

      var i1 = _color[0];
      var i2 = _color[1];
      var i3 = _color[2];
      // 1 was added to seperate from no selection

      var index = i1 + i2 * 256 + i3 * 65536 - 1;
      return index;
    }
  }, {
    key: 'encodePickingColor',
    value: function encodePickingColor(i) {
      return [(i + 1) % 256, Math.floor((i + 1) / 256) % 256, Math.floor((i + 1) / 256 / 256) % 256];
    }

    // VIRTUAL METHOD - Override to add or modify `info` object in sublayer
    // The sublayer may know what object e.g. lat,lon corresponds to using math
    // etc even when picking does not work

  }, {
    key: 'onGetHoverInfo',
    value: function onGetHoverInfo(info) {
      var color = info.color;

      info.index = this.decodePickingColor(color);
      // If props.data is an indexable array, get the object
      if (Array.isArray(this.props.data)) {
        info.object = this.props.data[info.index];
      }
      info.geoCoords = this.unproject({ x: info.x, y: info.y });
      return info;
    }
  }, {
    key: 'onHover',
    value: function onHover(info) {
      var _info = info;
      var color = _info.color;


      var selectedPickingColor = new Float32Array(3);
      selectedPickingColor[0] = color[0];
      selectedPickingColor[1] = color[1];
      selectedPickingColor[2] = color[2];
      this.setUniforms({ selectedPickingColor: selectedPickingColor });

      info = this.onGetHoverInfo(info);
      return this.props.onHover(info);
    }
  }, {
    key: 'onClick',
    value: function onClick(info) {
      info = this.onGetHoverInfo(info);
      return this.props.onClick(info);
    }

    // INTERNAL METHODS

  }, {
    key: '_updateModel',
    value: function _updateModel(_ref3) {
      var gl = _ref3.gl;
      var _state3 = this.state;
      var model = _state3.model;
      var attributeManager = _state3.attributeManager;
      var uniforms = _state3.uniforms;


      (0, _assert2.default)(model);
      model.setAttributes(attributeManager.getAttributes());
      model.setUniforms(uniforms);
      // whether current layer responds to mouse events
      model.setPickable(this.props.isPickable);
    }
  }, {
    key: 'checkProp',
    value: function checkProp(property, propertyName) {
      if (property === undefined || property === null) {
        throw new Error('Property ' + propertyName + ' undefined in layer ' + this.props.id);
      }
    }

    // MAP LAYER FUNCTIONALITY

  }, {
    key: 'setViewport',
    value: function setViewport() {
      var _props2 = this.props;
      var width = _props2.width;
      var height = _props2.height;
      var latitude = _props2.latitude;
      var longitude = _props2.longitude;
      var zoom = _props2.zoom;

      this.setState({
        viewport: { x: 0, y: 0, width: width, height: height },
        mercator: (0, _viewportMercatorProject2.default)({
          width: width, height: height, latitude: latitude, longitude: longitude, zoom: zoom,
          tileSize: 512
        })
      });
      this.setUniforms({
        viewport: [0, 0, width, height],
        mercatorScale: Math.pow(2, zoom),
        mercatorCenter: [longitude, latitude]
      });
      (0, _log2.default)(3, this.state.viewport, latitude, longitude, zoom);
    }

    /**
     * Position conversion is done in shader, so in many cases there is no need
     * for this function
     * @param {Object|Array} latLng - Either [lat,lng] or {lat, lon}
     * @return {Object} - x, y
     */

  }, {
    key: 'project',
    value: function project(latLng) {
      var mercator = this.state.mercator;

      var _ref4 = Array.isArray(latLng) ? mercator.project([latLng[1], latLng[0]]) : mercator.project([latLng.lon, latLng.lat]);

      var _ref5 = _slicedToArray(_ref4, 2);

      var x = _ref5[0];
      var y = _ref5[1];

      return { x: x, y: y };
    }
  }, {
    key: 'unproject',
    value: function unproject(xy) {
      var mercator = this.state.mercator;

      var _ref6 = Array.isArray(xy) ? mercator.unproject(xy) : mercator.unproject([xy.x, xy.y]);

      var _ref7 = _slicedToArray(_ref6, 2);

      var lon = _ref7[0];
      var lat = _ref7[1];

      return { lat: lat, lon: lon };
    }
  }]);

  return Layer;
}();

exports.default = Layer;
//# sourceMappingURL=data:application/json;base64,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LEtBQUwsQ0FBVyxRQUFsQixFQUE0QixRQUE1QixFQUFzQyxTQUF0QyxFQUFpRCxJQUFqRDtBQUNEOztBQUVEOzs7Ozs7Ozs7NEJBTVEsTSxFQUFRO0FBQUEsVUFDUCxRQURPLEdBQ0ssS0FBSyxLQURWLENBQ1AsUUFETzs7QUFBQSxrQkFFQyxNQUFNLE9BQU4sQ0FBYyxNQUFkLElBQ2IsU0FBUyxPQUFULENBQWlCLENBQUMsT0FBTyxDQUFQLENBQUQsRUFBWSxPQUFPLENBQVAsQ0FBWixDQUFqQixDQURhLEdBRWIsU0FBUyxPQUFULENBQWlCLENBQUMsT0FBTyxHQUFSLEVBQWEsT0FBTyxHQUFwQixDQUFqQixDQUpZOztBQUFBOztBQUFBLFVBRVAsQ0FGTztBQUFBLFVBRUosQ0FGSTs7QUFLZCxhQUFPLEVBQUMsSUFBRCxFQUFJLElBQUosRUFBUDtBQUNEOzs7OEJBRVMsRSxFQUFJO0FBQUEsVUFDTCxRQURLLEdBQ08sS0FBSyxLQURaLENBQ0wsUUFESzs7QUFBQSxrQkFFTyxNQUFNLE9BQU4sQ0FBYyxFQUFkLElBQ2pCLFNBQVMsU0FBVCxDQUFtQixFQUFuQixDQURpQixHQUVqQixTQUFTLFNBQVQsQ0FBbUIsQ0FBQyxHQUFHLENBQUosRUFBTyxHQUFHLENBQVYsQ0FBbkIsQ0FKVTs7QUFBQTs7QUFBQSxVQUVMLEdBRks7QUFBQSxVQUVBLEdBRkE7O0FBS1osYUFBTyxFQUFDLFFBQUQsRUFBTSxRQUFOLEVBQVA7QUFDRDs7Ozs7O2tCQW5ja0IsSyIsImZpbGUiOiJsYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbi8qIGVzbGludC1kaXNhYmxlIGd1YXJkLWZvci1pbiAqL1xuaW1wb3J0IHtBdHRyaWJ1dGVNYW5hZ2VyfSBmcm9tICdsdW1hLmdsJztcbmltcG9ydCB7YXJlRXF1YWxTaGFsbG93fSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHthZGRJdGVyYXRvcn0gZnJvbSAnLi91dGlsJztcbmltcG9ydCBsb2cgZnJvbSAnLi9sb2cnO1xuaW1wb3J0IGlzRGVlcEVxdWFsIGZyb20gJ2xvZGFzaC5pc2VxdWFsJztcbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcbmltcG9ydCBWaWV3cG9ydE1lcmNhdG9yIGZyb20gJ3ZpZXdwb3J0LW1lcmNhdG9yLXByb2plY3QnO1xuXG4vKlxuICogQHBhcmFtIHtzdHJpbmd9IHByb3BzLmlkIC0gbGF5ZXIgbmFtZVxuICogQHBhcmFtIHthcnJheX0gIHByb3BzLmRhdGEgLSBhcnJheSBvZiBkYXRhIGluc3RhbmNlc1xuICogQHBhcmFtIHtudW1iZXJ9IHByb3BzLndpZHRoIC0gdmlld3BvcnQgd2lkdGgsIHN5bmNlZCB3aXRoIE1hcGJveEdMXG4gKiBAcGFyYW0ge251bWJlcn0gcHJvcHMuaGVpZ2h0IC0gdmlld3BvcnQgd2lkdGgsIHN5bmNlZCB3aXRoIE1hcGJveEdMXG4gKiBAcGFyYW0ge2Jvb2x9IHByb3BzLmlzUGlja2FibGUgLSB3aGV0aGVyIGxheWVyIHJlc3BvbnNlIHRvIG1vdXNlIGV2ZW50XG4gKiBAcGFyYW0ge2Jvb2x9IHByb3BzLm9wYWNpdHkgLSBvcGFjaXR5IG9mIHRoZSBsYXllclxuICovXG5jb25zdCBERUZBVUxUX1BST1BTID0ge1xuICBrZXk6IDAsXG4gIG9wYWNpdHk6IDAuOCxcbiAgbnVtSW5zdGFuY2VzOiB1bmRlZmluZWQsXG4gIGRhdGE6IFtdLFxuICBpc1BpY2thYmxlOiBmYWxzZSxcbiAgZGVlcENvbXBhcmU6IGZhbHNlLFxuICBnZXRWYWx1ZTogeCA9PiB4LFxuICBvbkhvdmVyOiAoKSA9PiB7fSxcbiAgb25DbGljazogKCkgPT4ge30sXG4gIC8vIFVwZGF0ZSB0cmlnZ2VyczogYSBrZXkgY2hhbmdlIGRldGVjdGlvbiBtZWNoYW5pc20gaW4gZGVjay5nbFxuICAvL1xuICAvLyBUaGUgdmFsdWUgb2YgYHVwZGF0ZVRyaWdnZXJzYCBpcyBhIG1hcCB3aXRoIGZpZWxkcyBjb3JyZXNwb25kaW5nIHRvXG4gIC8vIGF0dHJpYnV0ZSBuYW1lcyAob3IgYGFsbGApLiBFYWNoIGZpZWxkIGhhcyBhIHZhbHVlIHdoaWNoIGlzIGFuIG9iamVjdCxcbiAgLy8gaXQgY2FuIGNvbnRhaW4gYW55IGFtb3VudCBvZiBkYXRhLiBUaGUgZGF0YSBmb3IgZWFjaCBmaWVsZCBpcyBjb21wYXJlZFxuICAvLyBzaGFsbG93bHksIGFuZCBpZiBhIGNoYW5nZSBpcyBkZXRlY3RlZCwgdGhlIGF0dHJpYnV0ZSBpcyBpbnZhbGlkYXRlZFxuICAvLyAoYWxsIGF0dHJpYnV0ZXMgYXJlIGludmFsaWRhdGVkIGlmIHRoZSBgYWxsYCBrZXkgaXMgdXNlZC4pXG4gIC8vIE5vdGU6IHVwZGF0ZVRyaWdnZXJzIGFyZSBpZ25vcmVkIGJ5IG5vcm1hbCBzaGFsbG93IGNvbXBhcmlzb24sIHNvIGl0IGlzXG4gIC8vIE9LIGZvciB0aGUgYXBwIHRvIG1pbnQgYSBuZXcgb2JqZWN0IG9uIGV2ZXJ5IHJlbmRlci5cbiAgdXBkYXRlVHJpZ2dlcnM6IHt9XG59O1xuXG5jb25zdCBBVFRSSUJVVEVTID0ge1xuICBpbnN0YW5jZVBpY2tpbmdDb2xvcnM6XG4gICAge3NpemU6IDMsICcwJzogJ3BpY2tSZWQnLCAnMSc6ICdwaWNrR3JlZW4nLCAnMic6ICdwaWNrQmx1ZSd9XG59O1xuXG5sZXQgY291bnRlciA9IDA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExheWVyIHtcblxuICBzdGF0aWMgZ2V0IGF0dHJpYnV0ZXMoKSB7XG4gICAgcmV0dXJuIEFUVFJJQlVURVM7XG4gIH1cblxuICAvKipcbiAgICogQGNsYXNzZGVzY1xuICAgKiBCYXNlIExheWVyIGNsYXNzXG4gICAqXG4gICAqIEBjbGFzc1xuICAgKiBAcGFyYW0ge29iamVjdH0gcHJvcHMgLSBTZWUgZG9jcyBhYm92ZVxuICAgKi9cbiAgLyogZXNsaW50LWRpc2FibGUgbWF4LXN0YXRlbWVudHMgKi9cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgIHByb3BzID0ge1xuICAgICAgLi4uREVGQVVMVF9QUk9QUyxcbiAgICAgIC4uLnByb3BzXG4gICAgfTtcblxuICAgIC8vIEFkZCBpdGVyYXRvciB0byBvYmplY3RzXG4gICAgLy8gVE9ETyAtIE1vZGlmeWluZyBwcm9wcyBpcyBhbiBhbnRpLXBhdHRlcm5cbiAgICBpZiAocHJvcHMuZGF0YSkge1xuICAgICAgYWRkSXRlcmF0b3IocHJvcHMuZGF0YSk7XG4gICAgICBhc3NlcnQocHJvcHMuZGF0YVtTeW1ib2wuaXRlcmF0b3JdLCAnZGF0YSBwcm9wIG11c3QgaGF2ZSBhbiBpdGVyYXRvcicpO1xuICAgIH1cblxuICAgIHRoaXMucHJvcHMgPSBwcm9wcztcblxuICAgIHRoaXMuY2hlY2tQcm9wKHByb3BzLmRhdGEsICdkYXRhJyk7XG4gICAgdGhpcy5jaGVja1Byb3AocHJvcHMuaWQsICdpZCcpO1xuICAgIHRoaXMuY2hlY2tQcm9wKHByb3BzLndpZHRoLCAnd2lkdGgnKTtcbiAgICB0aGlzLmNoZWNrUHJvcChwcm9wcy5oZWlnaHQsICdoZWlnaHQnKTtcblxuICAgIHRoaXMuY2hlY2tQcm9wKHByb3BzLndpZHRoLCAnd2lkdGgnKTtcbiAgICB0aGlzLmNoZWNrUHJvcChwcm9wcy5oZWlnaHQsICdoZWlnaHQnKTtcbiAgICB0aGlzLmNoZWNrUHJvcChwcm9wcy5sYXRpdHVkZSwgJ2xhdGl0dWRlJyk7XG4gICAgdGhpcy5jaGVja1Byb3AocHJvcHMubG9uZ2l0dWRlLCAnbG9uZ2l0dWRlJyk7XG4gICAgdGhpcy5jaGVja1Byb3AocHJvcHMuem9vbSwgJ3pvb20nKTtcblxuICAgIHRoaXMuY291bnQgPSBjb3VudGVyKys7XG4gIH1cbiAgLyogZXNsaW50LWVuYWJsZSBtYXgtc3RhdGVtZW50cyAqL1xuXG4gIC8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vIExJRkVDWUNMRSBNRVRIT0RTLCBvdmVycmlkZGVuIGJ5IHRoZSBsYXllciBzdWJjbGFzc2VzXG5cbiAgLy8gQ2FsbGVkIG9uY2UgdG8gc2V0IHVwIHRoZSBpbml0aWFsIHN0YXRlXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgfVxuXG4gIC8vIGdsIGNvbnRleHQgaXMgbm93IGF2YWlsYWJsZVxuICBkaWRNb3VudCgpIHtcbiAgfVxuXG4gIHNob3VsZFVwZGF0ZShvbGRQcm9wcywgbmV3UHJvcHMpIHtcbiAgICAvLyBDaGVjayB1cGRhdGUgdHJpZ2dlcnMsIGFuZCBpbnZhbGlkYXRlIHByb3BzIGFjY29yZGluZ2x5XG4gICAgaWYgKHRoaXMuY2hlY2tVcGRhdGVUcmlnZ2VycyhvbGRQcm9wcywgbmV3UHJvcHMpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8gSWYgYW55IHByb3BzIGhhdmUgY2hhbmdlZCwgaWdub3JpbmcgdXBkYXRlVHJpZ2dlcnMgb2JqZWN0c1xuICAgIC8vICh1cGRhdGVUcmlnZ2VycyBhcmUgZXhwZWN0ZWQgdG8gYmUgcmVtaW50ZWQgb24gZXZlcnkgdXBkYXRlKVxuICAgIGNvbnN0IGVxdWFsU2hhbGxvdyA9IGFyZUVxdWFsU2hhbGxvdyhuZXdQcm9wcywgb2xkUHJvcHMsIHtcbiAgICAgIGlnbm9yZToge3VwZGF0ZVRyaWdnZXJzOiB0cnVlfVxuICAgIH0pO1xuICAgIGlmICghZXF1YWxTaGFsbG93KSB7XG4gICAgICBpZiAobmV3UHJvcHMuZGF0YSAhPT0gb2xkUHJvcHMuZGF0YSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtkYXRhQ2hhbmdlZDogdHJ1ZX0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChuZXdQcm9wcy5kZWVwQ29tcGFyZSAmJiAhaXNEZWVwRXF1YWwobmV3UHJvcHMuZGF0YSwgb2xkUHJvcHMuZGF0YSkpIHtcbiAgICAgIC8vIFN1cHBvcnQgb3B0aW9uYWwgZGVlcCBjb21wYXJlIG9mIGRhdGFcbiAgICAgIC8vIE5vdGU6IHRoaXMgaXMgcXVpdGUgaW5lZmZpY2llbnQsIGFwcCBzaG91bGQgdXNlIGJ1ZmZlciBwcm9wcyBpbnN0ZWFkXG4gICAgICB0aGlzLnNldFN0YXRlKHtkYXRhQ2hhbmdlZDogdHJ1ZX0pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIERlZmF1bHQgaW1wbGVtZW50YXRpb24sIGFsbCBhdHRyaWJ1dGVNYW5hZ2VyIHdpbGwgYmUgdXBkYXRlZFxuICB3aWxsUmVjZWl2ZVByb3BzKG9sZFByb3BzLCBuZXdQcm9wcykge1xuICAgIGNvbnN0IHthdHRyaWJ1dGVNYW5hZ2VyfSA9IHRoaXMuc3RhdGU7XG4gICAgaWYgKHRoaXMuc3RhdGUuZGF0YUNoYW5nZWQpIHtcbiAgICAgIGF0dHJpYnV0ZU1hbmFnZXIuaW52YWxpZGF0ZUFsbCgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGdsIGNvbnRleHQgc3RpbGwgYXZhaWxhYmxlXG4gIHdpbGxVbm1vdW50KCkge1xuICB9XG5cbiAgLy8gRU5EIExJRkVDWUNMRSBNRVRIT0RTXG4gIC8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgLy8gUHVibGljIEFQSVxuXG4gIHNldE5lZWRzUmVkcmF3KHJlZHJhdyA9IHRydWUpIHtcbiAgICBpZiAodGhpcy5zdGF0ZSkge1xuICAgICAgdGhpcy5zdGF0ZS5uZWVkc1JlZHJhdyA9IHJlZHJhdztcbiAgICB9XG4gIH1cblxuICAvLyBDaGVja3Mgc3RhdGUgb2YgYXR0cmlidXRlcyBhbmQgbW9kZWxcbiAgLy8gVE9ETyAtIGlzIGF0dHJpYnV0ZSBtYW5hZ2VyIG5lZWRlZD8gLSBNb2RlbCBzaG91bGQgYmUgZW5vdWdoLlxuICBnZXROZWVkc1JlZHJhdyh7Y2xlYXJSZWRyYXdGbGFncyA9IGZhbHNlfSA9IHt9KSB7XG4gICAgLy8gdGhpcyBtZXRob2QgbWF5IGJlIGNhbGxlZCBieSB0aGUgcmVuZGVyIGxvb3AgYXMgc29vbiBhIHRoZSBsYXllclxuICAgIC8vIGhhcyBiZWVuIGNyZWF0ZWQsIHNvIGd1YXJkIGFnYWluc3QgdW5pbml0aWFsaXplZCBzdGF0ZVxuICAgIGlmICghdGhpcy5zdGF0ZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHthdHRyaWJ1dGVNYW5hZ2VyLCBtb2RlbH0gPSB0aGlzLnN0YXRlO1xuICAgIGxldCByZWRyYXcgPSBmYWxzZTtcbiAgICByZWRyYXcgPSByZWRyYXcgfHwgdGhpcy5zdGF0ZS5uZWVkc1JlZHJhdztcbiAgICB0aGlzLnN0YXRlLm5lZWRzUmVkcmF3ID0gdGhpcy5zdGF0ZS5uZWVkc1JlZHJhdyAmJiAhY2xlYXJSZWRyYXdGbGFncztcblxuICAgIHJlZHJhdyA9IHJlZHJhdyB8fCBhdHRyaWJ1dGVNYW5hZ2VyLmdldE5lZWRzUmVkcmF3KHtjbGVhclJlZHJhd0ZsYWdzfSk7XG4gICAgcmVkcmF3ID0gcmVkcmF3IHx8IG1vZGVsLmdldE5lZWRzUmVkcmF3KHtjbGVhclJlZHJhd0ZsYWdzfSk7XG4gICAgcmV0dXJuIHJlZHJhdztcbiAgfVxuXG4gIC8vIFVwZGF0ZXMgc2VsZWN0ZWQgc3RhdGUgbWVtYmVycyBhbmQgbWFya3MgdGhlIG9iamVjdCBmb3IgcmVkcmF3XG4gIHNldFN0YXRlKHVwZGF0ZU9iamVjdCkge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5zdGF0ZSwgdXBkYXRlT2JqZWN0KTtcbiAgICB0aGlzLnN0YXRlLm5lZWRzUmVkcmF3ID0gdHJ1ZTtcbiAgfVxuXG4gIC8vIFVwZGF0ZXMgc2VsZWN0ZWQgc3RhdGUgbWVtYmVycyBhbmQgbWFya3MgdGhlIG9iamVjdCBmb3IgcmVkcmF3XG4gIHNldFVuaWZvcm1zKHVuaWZvcm1NYXApIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5tb2RlbCkge1xuICAgICAgdGhpcy5zdGF0ZS5tb2RlbC5zZXRVbmlmb3Jtcyh1bmlmb3JtTWFwKTtcbiAgICB9XG4gICAgLy8gVE9ETyAtIHNldCBuZWVkc1JlZHJhdyBvbiB0aGUgbW9kZWw/XG4gICAgdGhpcy5zdGF0ZS5uZWVkc1JlZHJhdyA9IHRydWU7XG4gICAgbG9nKDMsICdsYXllci5zZXRVbmlmb3JtcycsIHVuaWZvcm1NYXApO1xuICB9XG5cbiAgLy8gVXNlIGl0ZXJhdGlvbiAodGhlIG9ubHkgcmVxdWlyZWQgY2FwYWJpbGl0eSBvbiBkYXRhKSB0byBnZXQgZmlyc3QgZWxlbWVudFxuICBnZXRGaXJzdE9iamVjdCgpIHtcbiAgICBjb25zdCB7ZGF0YX0gPSB0aGlzLnByb3BzO1xuICAgIGZvciAoY29uc3Qgb2JqZWN0IG9mIGRhdGEpIHtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gSU5URVJOQUwgTUVUSE9EU1xuXG4gIC8vIERlZHVjZXMgbnVtZXIgb2YgaW5zdGFuY2VzLiBJbnRlbnRpb24gaXMgdG8gc3VwcG9ydDpcbiAgLy8gLSBFeHBsaWNpdCBzZXR0aW5nIG9mIG51bUluc3RhbmNlc1xuICAvLyAtIEF1dG8tZGVkdWN0aW9uIGZvciBFUzYgY29udGFpbmVycyB0aGF0IGRlZmluZSBhIHNpemUgbWVtYmVyXG4gIC8vIC0gQXV0by1kZWR1Y3Rpb24gZm9yIENsYXNzaWMgQXJyYXlzIHZpYSB0aGUgYnVpbHQtaW4gbGVuZ3RoIGF0dHJpYnV0ZVxuICAvLyAtIEF1dG8tZGVkdWN0aW9uIHZpYSBhcnJheXNcbiAgZ2V0TnVtSW5zdGFuY2VzKHByb3BzKSB7XG4gICAgcHJvcHMgPSBwcm9wcyB8fCB0aGlzLnByb3BzO1xuXG4gICAgLy8gRmlyc3QgY2hlY2sgaWYgdGhlIGxheWVyIGhhcyBzZXQgaXRzIG93biB2YWx1ZVxuICAgIGlmICh0aGlzLnN0YXRlICYmIHRoaXMuc3RhdGUubnVtSW5zdGFuY2VzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXRlLm51bUluc3RhbmNlcztcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiBhcHAgaGFzIHByb3ZpZGVkIGFuIGV4cGxpY2l0IHZhbHVlXG4gICAgaWYgKHByb3BzLm51bUluc3RhbmNlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcHJvcHMubnVtSW5zdGFuY2VzO1xuICAgIH1cblxuICAgIGNvbnN0IHtkYXRhfSA9IHByb3BzO1xuXG4gICAgLy8gQ2hlY2sgaWYgRVM2IGNvbGxlY3Rpb24gXCJjb3VudFwiIGZ1bmN0aW9uIGlzIGF2YWlsYWJsZVxuICAgIGlmIChkYXRhICYmIHR5cGVvZiBkYXRhLmNvdW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gZGF0YS5jb3VudCgpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIEVTNiBjb2xsZWN0aW9uIFwic2l6ZVwiIGF0dHJpYnV0ZSBpcyBzZXRcbiAgICBpZiAoZGF0YSAmJiBkYXRhLnNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGRhdGEuc2l6ZTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiBhcnJheSBsZW5ndGggYXR0cmlidXRlIGlzIHNldFxuICAgIC8vIE5vdGU6IGNoZWNraW5nIHRoaXMgbGFzdCBzaW5jZSBzb21lIEVTNiBjb2xsZWN0aW9ucyAoSW1tdXRhYmxlLmpzKVxuICAgIC8vIGVtaXQgcHJvZnVzZSB3YXJuaW5ncyB3aGVuIHRyeWluZyB0byBhY2Nlc3MgYGxlbmd0aGAgYXR0cmlidXRlXG4gICAgaWYgKGRhdGEgJiYgZGF0YS5sZW5ndGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGRhdGEubGVuZ3RoO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGRlZHVjZSBudW1JbnN0YW5jZXMnKTtcbiAgfVxuXG4gIC8vIEludGVybmFsIEhlbHBlcnNcblxuICBjaGVja1Byb3BzKG9sZFByb3BzLCBuZXdQcm9wcykge1xuICAgIC8vIE5vdGU6IGRhdGFDaGFuZ2VkIG1pZ2h0IGFscmVhZHkgYmUgc2V0XG4gICAgaWYgKG5ld1Byb3BzLmRhdGEgIT09IG9sZFByb3BzLmRhdGEpIHtcbiAgICAgIC8vIEZpZ3VyZSBvdXQgZGF0YSBsZW5ndGhcbiAgICAgIHRoaXMuc3RhdGUuZGF0YUNoYW5nZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IHZpZXdwb3J0Q2hhbmdlZCA9XG4gICAgICBuZXdQcm9wcy53aWR0aCAhPT0gb2xkUHJvcHMud2lkdGggfHxcbiAgICAgIG5ld1Byb3BzLmhlaWdodCAhPT0gb2xkUHJvcHMuaGVpZ2h0IHx8XG4gICAgICBuZXdQcm9wcy5sYXRpdHVkZSAhPT0gb2xkUHJvcHMubGF0aXR1ZGUgfHxcbiAgICAgIG5ld1Byb3BzLmxvbmdpdHVkZSAhPT0gb2xkUHJvcHMubG9uZ2l0dWRlIHx8XG4gICAgICBuZXdQcm9wcy56b29tICE9PSBvbGRQcm9wcy56b29tO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7dmlld3BvcnRDaGFuZ2VkfSk7XG4gIH1cblxuICB1cGRhdGVBdHRyaWJ1dGVzKHByb3BzKSB7XG4gICAgY29uc3Qge2F0dHJpYnV0ZU1hbmFnZXIsIG1vZGVsfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgbnVtSW5zdGFuY2VzID0gdGhpcy5nZXROdW1JbnN0YW5jZXMocHJvcHMpO1xuICAgIC8vIEZpZ3VyZSBvdXQgZGF0YSBsZW5ndGhcbiAgICBhdHRyaWJ1dGVNYW5hZ2VyLnVwZGF0ZSh7XG4gICAgICBudW1JbnN0YW5jZXMsXG4gICAgICBidWZmZXJNYXA6IHByb3BzLFxuICAgICAgY29udGV4dDogdGhpcyxcbiAgICAgIC8vIERvbid0IHdvcnJ5IGFib3V0IG5vbi1hdHRyaWJ1dGUgcHJvcHNcbiAgICAgIGlnbm9yZVVua25vd25BdHRyaWJ1dGVzOiB0cnVlXG4gICAgfSk7XG4gICAgaWYgKG1vZGVsKSB7XG4gICAgICBjb25zdCBjaGFuZ2VkQXR0cmlidXRlcyA9XG4gICAgICAgIGF0dHJpYnV0ZU1hbmFnZXIuZ2V0Q2hhbmdlZEF0dHJpYnV0ZXMoe2NsZWFyQ2hhbmdlZEZsYWdzOiB0cnVlfSk7XG4gICAgICBtb2RlbC5zZXRBdHRyaWJ1dGVzKGNoYW5nZWRBdHRyaWJ1dGVzKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVCYXNlVW5pZm9ybXMoKSB7XG4gICAgdGhpcy5zZXRVbmlmb3Jtcyh7XG4gICAgICAvLyBhcHBseSBnYW1tYSB0byBvcGFjaXR5IHRvIG1ha2UgaXQgdmlzdWFsbHkgXCJsaW5lYXJcIlxuICAgICAgb3BhY2l0eTogTWF0aC5wb3codGhpcy5wcm9wcy5vcGFjaXR5IHx8IDAuOCwgMSAvIDIuMilcbiAgICB9KTtcbiAgfVxuXG4gIC8vIENoZWNrIGlmIGFueSB1cGRhdGUgdHJpZ2dlcnMgaGF2ZSBjaGFuZ2VkLCBhbmQgaW52YWxpZGF0ZVxuICAvLyBhdHRyaWJ1dGVzIGFjY29yZGluZ2x5LlxuICBjaGVja1VwZGF0ZVRyaWdnZXJzKG9sZFByb3BzLCBuZXdQcm9wcykge1xuICAgIGxldCBjaGFuZ2UgPSBmYWxzZTtcbiAgICBjb25zdCB7YXR0cmlidXRlTWFuYWdlcn0gPSB0aGlzLnN0YXRlO1xuICAgIGZvciAoY29uc3QgcHJvcE5hbWUgaW4gbmV3UHJvcHMudXBkYXRlVHJpZ2dlcnMpIHtcbiAgICAgIGNvbnN0IG9sZFRyaWdnZXJzID0gb2xkUHJvcHMudXBkYXRlVHJpZ2dlcnNbcHJvcE5hbWVdO1xuICAgICAgY29uc3QgbmV3VHJpZ2dlcnMgPSBuZXdQcm9wcy51cGRhdGVUcmlnZ2Vyc1twcm9wTmFtZV07XG4gICAgICBpZiAoIWFyZUVxdWFsU2hhbGxvdyhvbGRUcmlnZ2VycywgbmV3VHJpZ2dlcnMpKSB7XG4gICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ2FsbCcpIHtcbiAgICAgICAgICBhdHRyaWJ1dGVNYW5hZ2VyLmludmFsaWRhdGVBbGwoKTtcbiAgICAgICAgICBjaGFuZ2UgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGF0dHJpYnV0ZU1hbmFnZXIuaW52YWxpZGF0ZShwcm9wTmFtZSk7XG4gICAgICAgICAgY2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2hhbmdlO1xuICB9XG5cbiAgLy8gTEFZRVIgTUFOQUdFUiBBUElcblxuICAvLyBDYWxsZWQgYnkgbGF5ZXIgbWFuYWdlciB3aGVuIGEgbmV3IGxheWVyIGlzIGZvdW5kXG4gIC8qIGVzbGludC1kaXNhYmxlIG1heC1zdGF0ZW1lbnRzICovXG4gIGluaXRpYWxpemVMYXllcih7Z2x9KSB7XG4gICAgYXNzZXJ0KGdsKTtcbiAgICB0aGlzLnN0YXRlID0ge2dsfTtcblxuICAgIC8vIEluaXRpYWxpemUgc3RhdGUgb25seSBvbmNlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBhdHRyaWJ1dGVNYW5hZ2VyOiBuZXcgQXR0cmlidXRlTWFuYWdlcih7aWQ6IHRoaXMucHJvcHMuaWR9KSxcbiAgICAgIG1vZGVsOiBudWxsLFxuICAgICAgbmVlZHNSZWRyYXc6IHRydWUsXG4gICAgICBkYXRhQ2hhbmdlZDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgY29uc3Qge2F0dHJpYnV0ZU1hbmFnZXJ9ID0gdGhpcy5zdGF0ZTtcbiAgICAvLyBBbGwgaW5zdGFuY2VkIGxheWVycyBnZXQgaW5zdGFuY2VQaWNraW5nQ29sb3JzIGF0dHJpYnV0ZSBieSBkZWZhdWx0XG4gICAgLy8gVGhlaXIgc2hhZGVycyBjYW4gdXNlIGl0IHRvIHJlbmRlciBhIHBpY2tpbmcgc2NlbmVcbiAgICBhdHRyaWJ1dGVNYW5hZ2VyLmFkZEluc3RhbmNlZChBVFRSSUJVVEVTLCB7XG4gICAgICBpbnN0YW5jZVBpY2tpbmdDb2xvcnM6IHt1cGRhdGU6IHRoaXMuY2FsY3VsYXRlSW5zdGFuY2VQaWNraW5nQ29sb3JzfVxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRWaWV3cG9ydCgpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZVN0YXRlKCk7XG4gICAgYXNzZXJ0KHRoaXMuc3RhdGUubW9kZWwsICdNb2RlbCBtdXN0IGJlIHNldCBpbiBpbml0aWFsaXplU3RhdGUnKTtcbiAgICB0aGlzLnNldFZpZXdwb3J0KCk7XG5cbiAgICAvLyBUT0RPIC0gdGhlIGFwcCBtdXN0IGJlIGFibGUgdG8gb3ZlcnJpZGVcblxuICAgIC8vIEFkZCBhbnkgc3ViY2xhc3MgYXR0cmlidXRlc1xuICAgIHRoaXMudXBkYXRlQXR0cmlidXRlcyh0aGlzLnByb3BzKTtcbiAgICB0aGlzLnVwZGF0ZUJhc2VVbmlmb3JtcygpO1xuXG4gICAgY29uc3Qge21vZGVsfSA9IHRoaXMuc3RhdGU7XG4gICAgbW9kZWwuc2V0SW5zdGFuY2VDb3VudCh0aGlzLmdldE51bUluc3RhbmNlcygpKTtcbiAgICBtb2RlbC5pZCA9IHRoaXMucHJvcHMuaWQ7XG4gICAgbW9kZWwucHJvZ3JhbS5pZCA9IGAke3RoaXMucHJvcHMuaWR9LXByb2dyYW1gO1xuICAgIG1vZGVsLmdlb21ldHJ5LmlkID0gYCR7dGhpcy5wcm9wcy5pZH0tZ2VvbWV0cnlgO1xuXG4gICAgLy8gQ3JlYXRlIGEgbW9kZWwgZm9yIHRoZSBsYXllclxuICAgIHRoaXMuX3VwZGF0ZU1vZGVsKHtnbH0pO1xuXG4gICAgLy8gQ2FsbCBsaWZlIGN5Y2xlIG1ldGhvZFxuICAgIHRoaXMuZGlkTW91bnQoKTtcbiAgfVxuICAvKiBlc2xpbnQtZW5hYmxlIG1heC1zdGF0ZW1lbnRzICovXG5cbiAgLy8gQ2FsbGVkIGJ5IGxheWVyIG1hbmFnZXIgd2hlbiBleGlzdGluZyBsYXllciBpcyBnZXR0aW5nIG5ldyBwcm9wc1xuICB1cGRhdGVMYXllcihvbGRQcm9wcywgbmV3UHJvcHMpIHtcbiAgICAvLyBDYWxjdWxhdGUgc3RhbmRhcmQgY2hhbmdlIGZsYWdzXG4gICAgdGhpcy5jaGVja1Byb3BzKG9sZFByb3BzLCBuZXdQcm9wcyk7XG5cbiAgICAvLyBDaGVjayBpZiBhbnkgcHJvcHMgaGF2ZSBjaGFuZ2VkXG4gICAgaWYgKHRoaXMuc2hvdWxkVXBkYXRlKG9sZFByb3BzLCBuZXdQcm9wcykpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLnZpZXdwb3J0Q2hhbmdlZCkge1xuICAgICAgICB0aGlzLnNldFZpZXdwb3J0KCk7XG4gICAgICB9XG5cbiAgICAgIC8vIExldCB0aGUgc3ViY2xhc3MgbWFyayB3aGF0IGlzIG5lZWRlZCBmb3IgdXBkYXRlXG4gICAgICB0aGlzLndpbGxSZWNlaXZlUHJvcHMob2xkUHJvcHMsIG5ld1Byb3BzKTtcbiAgICAgIC8vIFJ1biB0aGUgYXR0cmlidXRlIHVwZGF0ZXJzXG4gICAgICB0aGlzLnVwZGF0ZUF0dHJpYnV0ZXMobmV3UHJvcHMpO1xuICAgICAgLy8gVXBkYXRlIHRoZSB1bmlmb3Jtc1xuICAgICAgdGhpcy51cGRhdGVCYXNlVW5pZm9ybXMoKTtcblxuICAgICAgaWYgKHRoaXMuc3RhdGUubW9kZWwpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5tb2RlbC5zZXRJbnN0YW5jZUNvdW50KHRoaXMuZ2V0TnVtSW5zdGFuY2VzKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc3RhdGUuZGF0YUNoYW5nZWQgPSBmYWxzZTtcbiAgICB0aGlzLnN0YXRlLnZpZXdwb3J0Q2hhbmdlZCA9IGZhbHNlO1xuICB9XG5cbiAgLy8gQ2FsbGVkIGJ5IG1hbmFnZXIgd2hlbiBsYXllciBpcyBhYm91dCB0byBiZSBkaXNwb3NlZFxuICAvLyBOb3RlOiBub3QgZ3VhcmFudGVlZCB0byBiZSBjYWxsZWQgb24gYXBwbGljYXRpb24gc2h1dGRvd25cbiAgZmluYWxpemVMYXllcigpIHtcbiAgICB0aGlzLndpbGxVbm1vdW50KCk7XG4gIH1cblxuICBjYWxjdWxhdGVJbnN0YW5jZVBpY2tpbmdDb2xvcnMoYXR0cmlidXRlLCBudW1JbnN0YW5jZXMpIHtcbiAgICBjb25zdCB7dmFsdWUsIHNpemV9ID0gYXR0cmlidXRlO1xuICAgIC8vIGFkZCAxIHRvIGluZGV4IHRvIHNlcGVyYXRlIGZyb20gbm8gc2VsZWN0aW9uXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1JbnN0YW5jZXM7IGkrKykge1xuICAgICAgY29uc3QgcGlja2luZ0NvbG9yID0gdGhpcy5lbmNvZGVQaWNraW5nQ29sb3IoaSk7XG4gICAgICB2YWx1ZVtpICogc2l6ZSArIDBdID0gcGlja2luZ0NvbG9yWzBdO1xuICAgICAgdmFsdWVbaSAqIHNpemUgKyAxXSA9IHBpY2tpbmdDb2xvclsxXTtcbiAgICAgIHZhbHVlW2kgKiBzaXplICsgMl0gPSBwaWNraW5nQ29sb3JbMl07XG4gICAgfVxuICB9XG5cbiAgZGVjb2RlUGlja2luZ0NvbG9yKGNvbG9yKSB7XG4gICAgYXNzZXJ0KGNvbG9yIGluc3RhbmNlb2YgVWludDhBcnJheSk7XG4gICAgY29uc3QgW2kxLCBpMiwgaTNdID0gY29sb3I7XG4gICAgLy8gMSB3YXMgYWRkZWQgdG8gc2VwZXJhdGUgZnJvbSBubyBzZWxlY3Rpb25cbiAgICBjb25zdCBpbmRleCA9IGkxICsgaTIgKiAyNTYgKyBpMyAqIDY1NTM2IC0gMTtcbiAgICByZXR1cm4gaW5kZXg7XG4gIH1cblxuICBlbmNvZGVQaWNraW5nQ29sb3IoaSkge1xuICAgIHJldHVybiBbXG4gICAgICAoaSArIDEpICUgMjU2LFxuICAgICAgTWF0aC5mbG9vcigoaSArIDEpIC8gMjU2KSAlIDI1NixcbiAgICAgIE1hdGguZmxvb3IoKGkgKyAxKSAvIDI1NiAvIDI1NikgJSAyNTZcbiAgICBdO1xuICB9XG5cbiAgLy8gVklSVFVBTCBNRVRIT0QgLSBPdmVycmlkZSB0byBhZGQgb3IgbW9kaWZ5IGBpbmZvYCBvYmplY3QgaW4gc3VibGF5ZXJcbiAgLy8gVGhlIHN1YmxheWVyIG1heSBrbm93IHdoYXQgb2JqZWN0IGUuZy4gbGF0LGxvbiBjb3JyZXNwb25kcyB0byB1c2luZyBtYXRoXG4gIC8vIGV0YyBldmVuIHdoZW4gcGlja2luZyBkb2VzIG5vdCB3b3JrXG4gIG9uR2V0SG92ZXJJbmZvKGluZm8pIHtcbiAgICBjb25zdCB7Y29sb3J9ID0gaW5mbztcbiAgICBpbmZvLmluZGV4ID0gdGhpcy5kZWNvZGVQaWNraW5nQ29sb3IoY29sb3IpO1xuICAgIC8vIElmIHByb3BzLmRhdGEgaXMgYW4gaW5kZXhhYmxlIGFycmF5LCBnZXQgdGhlIG9iamVjdFxuICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMucHJvcHMuZGF0YSkpIHtcbiAgICAgIGluZm8ub2JqZWN0ID0gdGhpcy5wcm9wcy5kYXRhW2luZm8uaW5kZXhdO1xuICAgIH1cbiAgICBpbmZvLmdlb0Nvb3JkcyA9IHRoaXMudW5wcm9qZWN0KHt4OiBpbmZvLngsIHk6IGluZm8ueX0pO1xuICAgIHJldHVybiBpbmZvO1xuICB9XG5cbiAgb25Ib3ZlcihpbmZvKSB7XG4gICAgY29uc3Qge2NvbG9yfSA9IGluZm87XG5cbiAgICBjb25zdCBzZWxlY3RlZFBpY2tpbmdDb2xvciA9IG5ldyBGbG9hdDMyQXJyYXkoMyk7XG4gICAgc2VsZWN0ZWRQaWNraW5nQ29sb3JbMF0gPSBjb2xvclswXTtcbiAgICBzZWxlY3RlZFBpY2tpbmdDb2xvclsxXSA9IGNvbG9yWzFdO1xuICAgIHNlbGVjdGVkUGlja2luZ0NvbG9yWzJdID0gY29sb3JbMl07XG4gICAgdGhpcy5zZXRVbmlmb3Jtcyh7c2VsZWN0ZWRQaWNraW5nQ29sb3J9KTtcblxuICAgIGluZm8gPSB0aGlzLm9uR2V0SG92ZXJJbmZvKGluZm8pO1xuICAgIHJldHVybiB0aGlzLnByb3BzLm9uSG92ZXIoaW5mbyk7XG4gIH1cblxuICBvbkNsaWNrKGluZm8pIHtcbiAgICBpbmZvID0gdGhpcy5vbkdldEhvdmVySW5mbyhpbmZvKTtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5vbkNsaWNrKGluZm8pO1xuICB9XG5cbiAgLy8gSU5URVJOQUwgTUVUSE9EU1xuICBfdXBkYXRlTW9kZWwoe2dsfSkge1xuICAgIGNvbnN0IHttb2RlbCwgYXR0cmlidXRlTWFuYWdlciwgdW5pZm9ybXN9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGFzc2VydChtb2RlbCk7XG4gICAgbW9kZWwuc2V0QXR0cmlidXRlcyhhdHRyaWJ1dGVNYW5hZ2VyLmdldEF0dHJpYnV0ZXMoKSk7XG4gICAgbW9kZWwuc2V0VW5pZm9ybXModW5pZm9ybXMpO1xuICAgIC8vIHdoZXRoZXIgY3VycmVudCBsYXllciByZXNwb25kcyB0byBtb3VzZSBldmVudHNcbiAgICBtb2RlbC5zZXRQaWNrYWJsZSh0aGlzLnByb3BzLmlzUGlja2FibGUpO1xuICB9XG5cbiAgY2hlY2tQcm9wKHByb3BlcnR5LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICBpZiAocHJvcGVydHkgPT09IHVuZGVmaW5lZCB8fCBwcm9wZXJ0eSA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBQcm9wZXJ0eSAke3Byb3BlcnR5TmFtZX0gdW5kZWZpbmVkIGluIGxheWVyICR7dGhpcy5wcm9wcy5pZH1gKTtcbiAgICB9XG4gIH1cblxuICAvLyBNQVAgTEFZRVIgRlVOQ1RJT05BTElUWVxuXG4gIHNldFZpZXdwb3J0KCkge1xuICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0LCBsYXRpdHVkZSwgbG9uZ2l0dWRlLCB6b29tfSA9IHRoaXMucHJvcHM7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2aWV3cG9ydDoge3g6IDAsIHk6IDAsIHdpZHRoLCBoZWlnaHR9LFxuICAgICAgbWVyY2F0b3I6IFZpZXdwb3J0TWVyY2F0b3Ioe1xuICAgICAgICB3aWR0aCwgaGVpZ2h0LCBsYXRpdHVkZSwgbG9uZ2l0dWRlLCB6b29tLFxuICAgICAgICB0aWxlU2l6ZTogNTEyXG4gICAgICB9KVxuICAgIH0pO1xuICAgIHRoaXMuc2V0VW5pZm9ybXMoe1xuICAgICAgdmlld3BvcnQ6IFswLCAwLCB3aWR0aCwgaGVpZ2h0XSxcbiAgICAgIG1lcmNhdG9yU2NhbGU6IE1hdGgucG93KDIsIHpvb20pLFxuICAgICAgbWVyY2F0b3JDZW50ZXI6IFtsb25naXR1ZGUsIGxhdGl0dWRlXVxuICAgIH0pO1xuICAgIGxvZygzLCB0aGlzLnN0YXRlLnZpZXdwb3J0LCBsYXRpdHVkZSwgbG9uZ2l0dWRlLCB6b29tKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQb3NpdGlvbiBjb252ZXJzaW9uIGlzIGRvbmUgaW4gc2hhZGVyLCBzbyBpbiBtYW55IGNhc2VzIHRoZXJlIGlzIG5vIG5lZWRcbiAgICogZm9yIHRoaXMgZnVuY3Rpb25cbiAgICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGxhdExuZyAtIEVpdGhlciBbbGF0LGxuZ10gb3Ige2xhdCwgbG9ufVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IC0geCwgeVxuICAgKi9cbiAgcHJvamVjdChsYXRMbmcpIHtcbiAgICBjb25zdCB7bWVyY2F0b3J9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCBbeCwgeV0gPSBBcnJheS5pc0FycmF5KGxhdExuZykgP1xuICAgICAgbWVyY2F0b3IucHJvamVjdChbbGF0TG5nWzFdLCBsYXRMbmdbMF1dKSA6XG4gICAgICBtZXJjYXRvci5wcm9qZWN0KFtsYXRMbmcubG9uLCBsYXRMbmcubGF0XSk7XG4gICAgcmV0dXJuIHt4LCB5fTtcbiAgfVxuXG4gIHVucHJvamVjdCh4eSkge1xuICAgIGNvbnN0IHttZXJjYXRvcn0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IFtsb24sIGxhdF0gPSBBcnJheS5pc0FycmF5KHh5KSA/XG4gICAgICBtZXJjYXRvci51bnByb2plY3QoeHkpIDpcbiAgICAgIG1lcmNhdG9yLnVucHJvamVjdChbeHkueCwgeHkueV0pO1xuICAgIHJldHVybiB7bGF0LCBsb259O1xuICB9XG59XG4iXX0=