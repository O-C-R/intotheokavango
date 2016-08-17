'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateLayers = updateLayers;
exports.layersNeedRedraw = layersNeedRedraw;

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// IMLEMENTATION NOTES: Why new layers are created on every render
//
// The key here is to understand the declarative / functional
// programming nature of React.
//
// - In React, the a representation of the entire "UI tree" is re-rendered
//   every time something changes.
// - React then diffs the rendered tree of "ReactElements" against the
// previous tree and makes optimized changes to the DOM.
//
// - Due the difficulty of making non-DOM elements in React 14, our Layers
// are a "pseudo-react" construct. So, the render function will indeed create
// new layers every render call, however the new layers are immediately
// matched against existing layers using layer index/layer id.
// A new layers only has a props field pointing to the unmodified props
// object supplied by the app on creation.
// All calculated state (programs, attributes etc) are stored in a state object
// and this state object is moved forward to the new layer every render.
// The new layer ends up with the state of the old layer but the props of
// the new layer, while the old layer is discarded.

/* eslint-disable no-try-catch */
/* eslint-disable no-console */
/* global console */
function updateLayers(_ref) {
  var oldLayers = _ref.oldLayers;
  var newLayers = _ref.newLayers;
  var gl = _ref.gl;
  var scene = _ref.scene;

  // Match all layers, checking for caught errors
  var error1 = matchLayers(oldLayers, newLayers);
  var error2 = finalizeOldLayers(oldLayers);
  var error3 = updateMatchedLayers(newLayers);
  var error4 = initializeNewLayers(newLayers, { gl: gl });
  addLayersToScene(newLayers, scene);
  // Throw first error found, if any
  var error = error1 || error2 || error3 || error4;
  if (error) {
    throw error;
  }
}

function layersNeedRedraw(layers) {
  var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref2$clearRedrawFlag = _ref2.clearRedrawFlags;
  var clearRedrawFlags = _ref2$clearRedrawFlag === undefined ? false : _ref2$clearRedrawFlag;

  var redraw = false;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = layers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var layer = _step.value;

      redraw = redraw || layer.getNeedsRedraw({ clearRedrawFlags: clearRedrawFlags });
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

  return redraw;
}

function layerName(layer) {
  return layer ? layer.constructor.name + '{id:\'' + layer.props.id + '\'}' : 'null layer';
}

function matchLayers(oldLayers, newLayers) {
  var error = null;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = newLayers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var newLayer = _step2.value;

      try {
        // 1. given a new coming layer, find its matching layer
        var oldLayer = _findMatchingLayer(oldLayers, newLayer);

        // Only transfer state at this stage. We must not generate exceptions
        // until all layers' state have been transferred
        if (oldLayer) {
          (0, _log2.default)(3, 'matched ' + layerName(newLayer), oldLayer, '=>', newLayer);

          _transferLayerState(oldLayer, newLayer);
        }
      } catch (err) {
        console.error('deck.gl error during matching of ' + layerName(newLayer), err);
        // Save first error
        error = error || err;
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

  return error;
}

function _findMatchingLayer(oldLayers, newLayer) {
  var candidates = oldLayers.filter(function (l) {
    return l.props.id === newLayer.props.id;
  });
  if (candidates.length > 1) {
    throw new Error('deck.gl error layer has more than one match ' + layerName(newLayer));
  }
  return candidates.length > 0 && candidates[0];
}

function _transferLayerState(oldLayer, newLayer) {
  var state = oldLayer.state;
  var props = oldLayer.props;

  (0, _assert2.default)(state, 'Matching layer has no state');
  (0, _assert2.default)(oldLayer !== newLayer, 'Matching layer is same');
  // Move state
  newLayer.state = state;
  state.layer = newLayer;
  // Update model layer reference
  if (state.model) {
    state.model.userData.layer = newLayer;
  }
  // Keep a temporary ref to the old props, for prop comparison
  newLayer.oldProps = props;
  oldLayer.state = null;
}

// Note: Layers can't be initialized until gl context is available
// Therefore this method can be called repeatedly
// This is a hack and should be cleaned up in calling code
function initializeNewLayers(layers, _ref3) {
  var gl = _ref3.gl;

  if (!gl) {
    return null;
  }

  var error = null;
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = layers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var layer = _step3.value;

      // Check if new layer, and initialize it's state
      if (!layer.state) {
        (0, _log2.default)(1, 'initializing ' + layerName(layer));
        try {
          layer.initializeLayer({ gl: gl });
        } catch (err) {
          console.error('deck.gl error during initialization of ' + layerName(layer), err);
          // Save first error
          error = error || err;
        }
        // Set back pointer (used in picking)
        if (layer.state) {
          layer.state.layer = layer;
          // Save layer on model for picking purposes
          // TODO - store on model.userData rather than directly on model
        }
        if (layer.state && layer.state.model) {
          layer.state.model.userData.layer = layer;
        }
      }
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

  return error;
}

// Update the matched layers
function updateMatchedLayers(newLayers) {
  var error = null;
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = newLayers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var layer = _step4.value;
      var oldProps = layer.oldProps;
      var props = layer.props;

      if (oldProps) {
        try {
          layer.updateLayer(oldProps, props);
        } catch (err) {
          console.error('deck.gl error during update of ' + layerName(layer), err);
          // Save first error
          error = error || err;
        }
        (0, _log2.default)(2, 'updating ' + layerName(layer));
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  return error;
}

// Update the old layers that were matched
function finalizeOldLayers(oldLayers) {
  var error = null;
  // Unmatched layers still have state, it will be discarded
  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = oldLayers[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var layer = _step5.value;
      var state = layer.state;

      if (state) {
        try {
          layer.finalizeLayer();
        } catch (err) {
          console.error('deck.gl error during finalization of ' + layerName(layer), err);
          // Save first error
          error = error || err;
        }
        layer.state = null;
        (0, _log2.default)(1, 'finalizing ' + layerName(layer));
      }
    }
  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5.return) {
        _iterator5.return();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }

  return error;
}

function addLayersToScene(layers, scene) {
  if (!scene) {
    return;
  }
  // clear scene and repopulate based on new layers
  scene.removeAll();
  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    for (var _iterator6 = layers[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      var layer = _step6.value;

      // Add model to scene
      if (layer.state.model) {
        scene.add(layer.state.model);
      }
    }
  } catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion6 && _iterator6.return) {
        _iterator6.return();
      }
    } finally {
      if (_didIteratorError6) {
        throw _iteratorError6;
      }
    }
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sYXllci1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBNEJnQixZLEdBQUEsWTtRQWNBLGdCLEdBQUEsZ0I7O0FBakJoQjs7OztBQUNBOzs7Ozs7QUF6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFJTyxTQUFTLFlBQVQsT0FBeUQ7QUFBQSxNQUFsQyxTQUFrQyxRQUFsQyxTQUFrQztBQUFBLE1BQXZCLFNBQXVCLFFBQXZCLFNBQXVCO0FBQUEsTUFBWixFQUFZLFFBQVosRUFBWTtBQUFBLE1BQVIsS0FBUSxRQUFSLEtBQVE7O0FBQzlEO0FBQ0EsTUFBTSxTQUFTLFlBQVksU0FBWixFQUF1QixTQUF2QixDQUFmO0FBQ0EsTUFBTSxTQUFTLGtCQUFrQixTQUFsQixDQUFmO0FBQ0EsTUFBTSxTQUFTLG9CQUFvQixTQUFwQixDQUFmO0FBQ0EsTUFBTSxTQUFTLG9CQUFvQixTQUFwQixFQUErQixFQUFDLE1BQUQsRUFBL0IsQ0FBZjtBQUNBLG1CQUFpQixTQUFqQixFQUE0QixLQUE1QjtBQUNBO0FBQ0EsTUFBTSxRQUFRLFVBQVUsTUFBVixJQUFvQixNQUFwQixJQUE4QixNQUE1QztBQUNBLE1BQUksS0FBSixFQUFXO0FBQ1QsVUFBTSxLQUFOO0FBQ0Q7QUFDRjs7QUFFTSxTQUFTLGdCQUFULENBQTBCLE1BQTFCLEVBQW1FO0FBQUEsb0VBQUosRUFBSTs7QUFBQSxvQ0FBaEMsZ0JBQWdDO0FBQUEsTUFBaEMsZ0JBQWdDLHlDQUFiLEtBQWE7O0FBQ3hFLE1BQUksU0FBUyxLQUFiO0FBRHdFO0FBQUE7QUFBQTs7QUFBQTtBQUV4RSx5QkFBb0IsTUFBcEIsOEhBQTRCO0FBQUEsVUFBakIsS0FBaUI7O0FBQzFCLGVBQVMsVUFBVSxNQUFNLGNBQU4sQ0FBcUIsRUFB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QTtBQVl4QyIsImZpbGUiOiJsYXllci1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vLyBJTUxFTUVOVEFUSU9OIE5PVEVTOiBXaHkgbmV3IGxheWVycyBhcmUgY3JlYXRlZCBvbiBldmVyeSByZW5kZXJcbi8vXG4vLyBUaGUga2V5IGhlcmUgaXMgdG8gdW5kZXJzdGFuZCB0aGUgZGVjbGFyYXRpdmUgLyBmdW5jdGlvbmFsXG4vLyBwcm9ncmFtbWluZyBuYXR1cmUgb2YgUmVhY3QuXG4vL1xuLy8gLSBJbiBSZWFjdCwgdGhlIGEgcmVwcmVzZW50YXRpb24gb2YgdGhlIGVudGlyZSBcIlVJIHRyZWVcIiBpcyByZS1yZW5kZXJlZFxuLy8gICBldmVyeSB0aW1lIHNvbWV0aGluZyBjaGFuZ2VzLlxuLy8gLSBSZWFjdCB0aGVuIGRpZmZzIHRoZSByZW5kZXJlZCB0cmVlIG9mIFwiUmVhY3RFbGVtZW50c1wiIGFnYWluc3QgdGhlXG4vLyBwcmV2aW91cyB0cmVlIGFuZCBtYWtlcyBvcHRpbWl6ZWQgY2hhbmdlcyB0byB0aGUgRE9NLlxuLy9cbi8vIC0gRHVlIHRoZSBkaWZmaWN1bHR5IG9mIG1ha2luZyBub24tRE9NIGVsZW1lbnRzIGluIFJlYWN0IDE0LCBvdXIgTGF5ZXJzXG4vLyBhcmUgYSBcInBzZXVkby1yZWFjdFwiIGNvbnN0cnVjdC4gU28sIHRoZSByZW5kZXIgZnVuY3Rpb24gd2lsbCBpbmRlZWQgY3JlYXRlXG4vLyBuZXcgbGF5ZXJzIGV2ZXJ5IHJlbmRlciBjYWxsLCBob3dldmVyIHRoZSBuZXcgbGF5ZXJzIGFyZSBpbW1lZGlhdGVseVxuLy8gbWF0Y2hlZCBhZ2FpbnN0IGV4aXN0aW5nIGxheWVycyB1c2luZyBsYXllciBpbmRleC9sYXllciBpZC5cbi8vIEEgbmV3IGxheWVycyBvbmx5IGhhcyBhIHByb3BzIGZpZWxkIHBvaW50aW5nIHRvIHRoZSB1bm1vZGlmaWVkIHByb3BzXG4vLyBvYmplY3Qgc3VwcGxpZWQgYnkgdGhlIGFwcCBvbiBjcmVhdGlvbi5cbi8vIEFsbCBjYWxjdWxhdGVkIHN0YXRlIChwcm9ncmFtcywgYXR0cmlidXRlcyBldGMpIGFyZSBzdG9yZWQgaW4gYSBzdGF0ZSBvYmplY3Rcbi8vIGFuZCB0aGlzIHN0YXRlIG9iamVjdCBpcyBtb3ZlZCBmb3J3YXJkIHRvIHRoZSBuZXcgbGF5ZXIgZXZlcnkgcmVuZGVyLlxuLy8gVGhlIG5ldyBsYXllciBlbmRzIHVwIHdpdGggdGhlIHN0YXRlIG9mIHRoZSBvbGQgbGF5ZXIgYnV0IHRoZSBwcm9wcyBvZlxuLy8gdGhlIG5ldyBsYXllciwgd2hpbGUgdGhlIG9sZCBsYXllciBpcyBkaXNjYXJkZWQuXG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXRyeS1jYXRjaCAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuLyogZ2xvYmFsIGNvbnNvbGUgKi9cbmltcG9ydCBsb2cgZnJvbSAnLi9sb2cnO1xuaW1wb3J0IGFzc2VydCBmcm9tICdhc3NlcnQnO1xuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlTGF5ZXJzKHtvbGRMYXllcnMsIG5ld0xheWVycywgZ2wsIHNjZW5lfSkge1xuICAvLyBNYXRjaCBhbGwgbGF5ZXJzLCBjaGVja2luZyBmb3IgY2F1Z2h0IGVycm9yc1xuICBjb25zdCBlcnJvcjEgPSBtYXRjaExheWVycyhvbGRMYXllcnMsIG5ld0xheWVycyk7XG4gIGNvbnN0IGVycm9yMiA9IGZpbmFsaXplT2xkTGF5ZXJzKG9sZExheWVycyk7XG4gIGNvbnN0IGVycm9yMyA9IHVwZGF0ZU1hdGNoZWRMYXllcnMobmV3TGF5ZXJzKVxuICBjb25zdCBlcnJvcjQgPSBpbml0aWFsaXplTmV3TGF5ZXJzKG5ld0xheWVycywge2dsfSk7XG4gIGFkZExheWVyc1RvU2NlbmUobmV3TGF5ZXJzLCBzY2VuZSk7XG4gIC8vIFRocm93IGZpcnN0IGVycm9yIGZvdW5kLCBpZiBhbnlcbiAgY29uc3QgZXJyb3IgPSBlcnJvcjEgfHwgZXJyb3IyIHx8IGVycm9yMyB8fCBlcnJvcjQ7XG4gIGlmIChlcnJvcikge1xuICAgIHRocm93IGVycm9yO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXllcnNOZWVkUmVkcmF3KGxheWVycywge2NsZWFyUmVkcmF3RmxhZ3MgPSBmYWxzZX0gPSB7fSkge1xuICBsZXQgcmVkcmF3ID0gZmFsc2U7XG4gIGZvciAoY29uc3QgbGF5ZXIgb2YgbGF5ZXJzKSB7XG4gICAgcmVkcmF3ID0gcmVkcmF3IHx8IGxheWVyLmdldE5lZWRzUmVkcmF3KHtjbGVhclJlZHJhd0ZsYWdzfSk7XG4gIH1cbiAgcmV0dXJuIHJlZHJhdztcbn1cblxuZnVuY3Rpb24gbGF5ZXJOYW1lKGxheWVyKSB7XG4gIHJldHVybiBsYXllciA/XG4gICAgYCR7bGF5ZXIuY29uc3RydWN0b3IubmFtZX17aWQ6JyR7bGF5ZXIucHJvcHMuaWR9J31gIDpcbiAgICAnbnVsbCBsYXllcic7XG59XG5cbmZ1bmN0aW9uIG1hdGNoTGF5ZXJzKG9sZExheWVycywgbmV3TGF5ZXJzKSB7XG4gIGxldCBlcnJvciA9IG51bGw7XG4gIGZvciAoY29uc3QgbmV3TGF5ZXIgb2YgbmV3TGF5ZXJzKSB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIDEuIGdpdmVuIGEgbmV3IGNvbWluZyBsYXllciwgZmluZCBpdHMgbWF0Y2hpbmcgbGF5ZXJcbiAgICAgIGNvbnN0IG9sZExheWVyID0gX2ZpbmRNYXRjaGluZ0xheWVyKG9sZExheWVycywgbmV3TGF5ZXIpO1xuXG4gICAgICAvLyBPbmx5IHRyYW5zZmVyIHN0YXRlIGF0IHRoaXMgc3RhZ2UuIFdlIG11c3Qgbm90IGdlbmVyYXRlIGV4Y2VwdGlvbnNcbiAgICAgIC8vIHVudGlsIGFsbCBsYXllcnMnIHN0YXRlIGhhdmUgYmVlbiB0cmFuc2ZlcnJlZFxuICAgICAgaWYgKG9sZExheWVyKSB7XG4gICAgICAgIGxvZygzLCBgbWF0Y2hlZCAke2xheWVyTmFtZShuZXdMYXllcil9YCwgb2xkTGF5ZXIsICc9PicsIG5ld0xheWVyKTtcblxuICAgICAgICBfdHJhbnNmZXJMYXllclN0YXRlKG9sZExheWVyLCBuZXdMYXllcik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICBgZGVjay5nbCBlcnJvciBkdXJpbmcgbWF0Y2hpbmcgb2YgJHtsYXllck5hbWUobmV3TGF5ZXIpfWAsIGVycik7XG4gICAgICAvLyBTYXZlIGZpcnN0IGVycm9yXG4gICAgICBlcnJvciA9IGVycm9yIHx8IGVycjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVycm9yO1xufVxuXG5mdW5jdGlvbiBfZmluZE1hdGNoaW5nTGF5ZXIob2xkTGF5ZXJzLCBuZXdMYXllcikge1xuICBjb25zdCBjYW5kaWRhdGVzID0gb2xkTGF5ZXJzLmZpbHRlcihsID0+IGwucHJvcHMuaWQgPT09IG5ld0xheWVyLnByb3BzLmlkKTtcbiAgaWYgKGNhbmRpZGF0ZXMubGVuZ3RoID4gMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBkZWNrLmdsIGVycm9yIGxheWVyIGhhcyBtb3JlIHRoYW4gb25lIG1hdGNoICR7bGF5ZXJOYW1lKG5ld0xheWVyKX1gKTtcbiAgfVxuICByZXR1cm4gY2FuZGlkYXRlcy5sZW5ndGggPiAwICYmIGNhbmRpZGF0ZXNbMF07XG59XG5cbmZ1bmN0aW9uIF90cmFuc2ZlckxheWVyU3RhdGUob2xkTGF5ZXIsIG5ld0xheWVyKSB7XG4gIGNvbnN0IHtzdGF0ZSwgcHJvcHN9ID0gb2xkTGF5ZXI7XG4gIGFzc2VydChzdGF0ZSwgJ01hdGNoaW5nIGxheWVyIGhhcyBubyBzdGF0ZScpO1xuICBhc3NlcnQob2xkTGF5ZXIgIT09IG5ld0xheWVyLCAnTWF0Y2hpbmcgbGF5ZXIgaXMgc2FtZScpO1xuICAvLyBNb3ZlIHN0YXRlXG4gIG5ld0xheWVyLnN0YXRlID0gc3RhdGU7XG4gIHN0YXRlLmxheWVyID0gbmV3TGF5ZXI7XG4gIC8vIFVwZGF0ZSBtb2RlbCBsYXllciByZWZlcmVuY2VcbiAgaWYgKHN0YXRlLm1vZGVsKSB7XG4gICAgc3RhdGUubW9kZWwudXNlckRhdGEubGF5ZXIgPSBuZXdMYXllcjtcbiAgfVxuICAvLyBLZWVwIGEgdGVtcG9yYXJ5IHJlZiB0byB0aGUgb2xkIHByb3BzLCBmb3IgcHJvcCBjb21wYXJpc29uXG4gIG5ld0xheWVyLm9sZFByb3BzID0gcHJvcHM7XG4gIG9sZExheWVyLnN0YXRlID0gbnVsbDtcbn1cblxuXG4vLyBOb3RlOiBMYXllcnMgY2FuJ3QgYmUgaW5pdGlhbGl6ZWQgdW50aWwgZ2wgY29udGV4dCBpcyBhdmFpbGFibGVcbi8vIFRoZXJlZm9yZSB0aGlzIG1ldGhvZCBjYW4gYmUgY2FsbGVkIHJlcGVhdGVkbHlcbi8vIFRoaXMgaXMgYSBoYWNrIGFuZCBzaG91bGQgYmUgY2xlYW5lZCB1cCBpbiBjYWxsaW5nIGNvZGVcbmZ1bmN0aW9uIGluaXRpYWxpemVOZXdMYXllcnMobGF5ZXJzLCB7Z2x9KSB7XG4gIGlmICghZ2wpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGxldCBlcnJvciA9IG51bGw7XG4gIGZvciAoY29uc3QgbGF5ZXIgb2YgbGF5ZXJzKSB7XG4gICAgLy8gQ2hlY2sgaWYgbmV3IGxheWVyLCBhbmQgaW5pdGlhbGl6ZSBpdCdzIHN0YXRlXG4gICAgaWYgKCFsYXllci5zdGF0ZSkge1xuICAgICAgbG9nKDEsIGBpbml0aWFsaXppbmcgJHtsYXllck5hbWUobGF5ZXIpfWApO1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGF5ZXIuaW5pdGlhbGl6ZUxheWVyKHtnbH0pO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgYGRlY2suZ2wgZXJyb3IgZHVyaW5nIGluaXRpYWxpemF0aW9uIG9mICR7bGF5ZXJOYW1lKGxheWVyKX1gLCBlcnIpO1xuICAgICAgICAvLyBTYXZlIGZpcnN0IGVycm9yXG4gICAgICAgIGVycm9yID0gZXJyb3IgfHwgZXJyO1xuICAgICAgfVxuICAgICAgLy8gU2V0IGJhY2sgcG9pbnRlciAodXNlZCBpbiBwaWNraW5nKVxuICAgICAgaWYgKGxheWVyLnN0YXRlKSB7XG4gICAgICAgIGxheWVyLnN0YXRlLmxheWVyID0gbGF5ZXI7XG4gICAgICAgIC8vIFNhdmUgbGF5ZXIgb24gbW9kZWwgZm9yIHBpY2tpbmcgcHVycG9zZXNcbiAgICAgICAgLy8gVE9ETyAtIHN0b3JlIG9uIG1vZGVsLnVzZXJEYXRhIHJhdGhlciB0aGFuIGRpcmVjdGx5IG9uIG1vZGVsXG4gICAgICB9XG4gICAgICBpZiAobGF5ZXIuc3RhdGUgJiYgbGF5ZXIuc3RhdGUubW9kZWwpIHtcbiAgICAgICAgbGF5ZXIuc3RhdGUubW9kZWwudXNlckRhdGEubGF5ZXIgPSBsYXllcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVycm9yO1xufVxuXG4vLyBVcGRhdGUgdGhlIG1hdGNoZWQgbGF5ZXJzXG5mdW5jdGlvbiB1cGRhdGVNYXRjaGVkTGF5ZXJzKG5ld0xheWVycykge1xuICBsZXQgZXJyb3IgPSBudWxsO1xuICBmb3IgKGNvbnN0IGxheWVyIG9mIG5ld0xheWVycykge1xuICAgIGNvbnN0IHtvbGRQcm9wcywgcHJvcHN9ID0gbGF5ZXI7XG4gICAgaWYgKG9sZFByb3BzKSB7XG4gICAgICB0cnkge1xuICAgICAgICBsYXllci51cGRhdGVMYXllcihvbGRQcm9wcywgcHJvcHMpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgYGRlY2suZ2wgZXJyb3IgZHVyaW5nIHVwZGF0ZSBvZiAke2xheWVyTmFtZShsYXllcil9YCwgZXJyKTtcbiAgICAgICAgLy8gU2F2ZSBmaXJzdCBlcnJvclxuICAgICAgICBlcnJvciA9IGVycm9yIHx8IGVycjtcbiAgICAgIH1cbiAgICAgIGxvZygyLCBgdXBkYXRpbmcgJHtsYXllck5hbWUobGF5ZXIpfWApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZXJyb3I7XG59XG5cbi8vIFVwZGF0ZSB0aGUgb2xkIGxheWVycyB0aGF0IHdlcmUgbWF0Y2hlZFxuZnVuY3Rpb24gZmluYWxpemVPbGRMYXllcnMob2xkTGF5ZXJzKSB7XG4gIGxldCBlcnJvciA9IG51bGw7XG4gIC8vIFVubWF0Y2hlZCBsYXllcnMgc3RpbGwgaGF2ZSBzdGF0ZSwgaXQgd2lsbCBiZSBkaXNjYXJkZWRcbiAgZm9yIChjb25zdCBsYXllciBvZiBvbGRMYXllcnMpIHtcbiAgICBjb25zdCB7c3RhdGV9ID0gbGF5ZXI7XG4gICAgaWYgKHN0YXRlKSB7XG4gICAgICB0cnkge1xuICAgICAgICBsYXllci5maW5hbGl6ZUxheWVyKCk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICBgZGVjay5nbCBlcnJvciBkdXJpbmcgZmluYWxpemF0aW9uIG9mICR7bGF5ZXJOYW1lKGxheWVyKX1gLCBlcnIpO1xuICAgICAgICAvLyBTYXZlIGZpcnN0IGVycm9yXG4gICAgICAgIGVycm9yID0gZXJyb3IgfHwgZXJyO1xuICAgICAgfVxuICAgICAgbGF5ZXIuc3RhdGUgPSBudWxsO1xuICAgICAgbG9nKDEsIGBmaW5hbGl6aW5nICR7bGF5ZXJOYW1lKGxheWVyKX1gKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVycm9yO1xufVxuXG5mdW5jdGlvbiBhZGRMYXllcnNUb1NjZW5lKGxheWVycywgc2NlbmUpIHtcbiAgaWYgKCFzY2VuZSkge1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBjbGVhciBzY2VuZSBhbmQgcmVwb3B1bGF0ZSBiYXNlZCBvbiBuZXcgbGF5ZXJzXG4gIHNjZW5lLnJlbW92ZUFsbCgpO1xuICBmb3IgKGNvbnN0IGxheWVyIG9mIGxheWVycykge1xuICAgIC8vIEFkZCBtb2RlbCB0byBzY2VuZVxuICAgIGlmIChsYXllci5zdGF0ZS5tb2RlbCkge1xuICAgICAgc2NlbmUuYWRkKGxheWVyLnN0YXRlLm1vZGVsKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==