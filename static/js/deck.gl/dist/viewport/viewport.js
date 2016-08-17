'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // View and Projection Matrix calculations for mapbox-js style
// map view properties

/* eslint-disable max-len */
// ATTRIBUTION: Matrix creation algos are based on mapbox-gl-js source code
// This is intentionally closely mapped to mapbox-gl-js implementation to
// ensure seamless interoperation with react-map-gl
// https://github.com/mapbox/mapbox-gl-js/blob/033043254d30a99a00b95660e296445a1ade2d01/js/geo/transform.js
/* elsint-enable */

// We define a couple of coordinate systems:
// ------
// LatLon             [lng, lat] = [-180 - 180, -81 - 81]
// World (zoom 0)     [x, y] = [0-512, y: 0-512]
// Zoomed (zoom N)    [x, y] = [0 - 512*2**N, 0 - 512*2**N]
// Translated         [x, y] = zero centered
// View (Camera)      unit cube around view
// ------

var _glMatrix = require('gl-matrix');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PI = Math.PI;
var PI_2 = PI / 2;
var PI_4 = PI / 4;
var DEGREES_TO_RADIANS = PI / 180;
var RADIANS_TO_DEGREES = 180 / PI;
var TILE_SIZE = 512;
var WORLD_SCALE = TILE_SIZE / PI_2;

var Viewport = function () {
  /* eslint-disable max-statements */
  function Viewport(_ref) {
    var _ref$width = _ref.width;
    var width = _ref$width === undefined ? 0 : _ref$width;
    var _ref$height = _ref.height;
    var height = _ref$height === undefined ? 0 : _ref$height;
    var _ref$latitude = _ref.latitude;
    var latitude = _ref$latitude === undefined ? 0 : _ref$latitude;
    var _ref$longitude = _ref.longitude;
    var longitude = _ref$longitude === undefined ? 0 : _ref$longitude;
    var _ref$zoom = _ref.zoom;
    var zoom = _ref$zoom === undefined ? 0 : _ref$zoom;
    var _ref$pitch = _ref.pitch;
    var pitch = _ref$pitch === undefined ? 0 : _ref$pitch;
    var _ref$bearing = _ref.bearing;
    var bearing = _ref$bearing === undefined ? 0 : _ref$bearing;
    var _ref$altitude = _ref.altitude;
    var altitude = _ref$altitude === undefined ? 1.5 : _ref$altitude;

    _classCallCheck(this, Viewport);

    // Viewport
    this.width = width;
    this.height = height;
    this.zoom = zoom;
    this.latitude = latitude;
    this.longitude = longitude;
    this.bearing = bearing;

    // Scale
    this.scale = Math.pow(2, zoom);
    this.worldSize = TILE_SIZE * this.scale;
    this.tileZoom = Math.floor(zoom);
    this.zoomFraction = zoom - Math.floor(zoom);

    // Bearing
    this.bearingRadians = bearing / 180 * Math.PI;
    this.bearingRotationMatrix = _glMatrix.mat2.create();
    _glMatrix.mat2.rotate(this.bearingRotationMatrix, this.bearingRotationMatrix, this.bearing);

    // Pitch
    this.originalPitch = pitch;
    this.pitch = Math.min(60, pitch);
    this.pitchRadians = Math.min(60, pitch) / 180 * Math.PI;

    // Altitude
    this.originalAltitude = altitude;
    this.altitude = Math.max(0.75, altitude);

    // Center x, y
    var y = 180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + latitude * Math.PI / 360));

    this.centerX0 = (180 + longitude) / 360 * TILE_SIZE;
    this.centerY0 = (180 - y) / 360 * TILE_SIZE;
    this.centerX = this.centerX0 * this.scale;
    this.centerY = this.centerY0 * this.scale;

    // Find the distance from the center point to the center top
    // in altitude units using law of sines.
    this.halfFov = Math.atan(0.5 / this.altitude);
    this.topHalfSurfaceDistance = Math.sin(this.halfFov) * this.altitude / Math.sin(Math.PI / 2 - this.pitchRadians - this.halfFov);

    // Calculate z value of the farthest fragment that should be rendered.
    this.farZ = Math.cos(Math.PI / 2 - this.pitchRadians) * this.topHalfSurfaceDistance + this.altitude;

    this._precomputeMatrices();
  }
  /* eslint-enable max-statements */

  _createClass(Viewport, [{
    key: 'project',
    value: function project(lngLatZ) {
      var _projectZoom = this.projectZoom0(lngLatZ);

      var _projectZoom2 = _slicedToArray(_projectZoom, 2);

      var x = _projectZoom2[0];
      var y = _projectZoom2[1];

      var v = _glMatrix.vec4.fromValues(x, y, lngLatZ[2] || 0, 1);
      _glMatrix.vec4.transformMat4(v, v, this.viewMatrix);
      _glMatrix.vec4.transformMat4(v, v, this.projectionMatrix);
      // vec4.transformMat4(v, v, this.viewportMatrix);
    }

    /**
     * Project [lng,lat] on sphere onto [x,y] on 512*512 Mercator Zoom 0 tile.
     * Performs the nonlinear part of the web mercator projection.
     * Remaining projection is done with 4x4 matrices which also handles
     * perspective.
     *
     * @param {Array} lngLat - [lng, lat] coordinates
     *   Specifies a point on the sphere to project onto the map.
     * @return {Array} [x,y] coordinates.
     */

  }, {
    key: 'projectZoom0',
    value: function projectZoom0(_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2);

      var lng = _ref3[0];
      var lat = _ref3[1];

      var lambda2 = lng * DEGREES_TO_RADIANS;
      var phi2 = lat * DEGREES_TO_RADIANS;
      var x = WORLD_SCALE * (lambda2 + PI);
      var y = WORLD_SCALE * (PI - Math.log(Math.tan(PI_4 + phi2 * 0.5)));
      return [x, y];
    }

    /**
     * Unproject point {x,y} on map onto {lat, lon} on sphere
     *
     * @param {object|Vector} xy - object with {x,y} members
     *  representing point on projected map plane
     * @return {GeoCoordinates} - object with {lat,lon} of point on sphere.
     *   Has toArray method if you need a GeoJSON Array.
     *   Per cartographic tradition, lat and lon are specified as degrees.
     */

  }, {
    key: 'unprojectZoom0',
    value: function unprojectZoom0(_ref4) {
      var _ref5 = _slicedToArray(_ref4, 2);

      var x = _ref5[0];
      var y = _ref5[1];

      var lambda2 = x / WORLD_SCALE - PI;
      var phi2 = 2 * (Math.atan(Math.exp(PI - y / WORLD_SCALE)) - PI_4);
      return [lambda2 * RADIANS_TO_DEGREES, phi2 * RADIANS_TO_DEGREES];
    }
  }, {
    key: 'getProjectionMatrix',
    value: function getProjectionMatrix() {
      return this._glProjectionMatrix;
    }

    // fitBounds(lnglatSE, lnglatNW, {padding = 0} = {}) {
    //   const bounds = new LngLatBounds(
    //     [_bounds[0].reverse(),
    //     _bounds[1].reverse()]
    //   );
    //   const offset = Point.convert([0, 0]);
    //   const nw = this.project(lnglatNW);
    //   const se = this.project(lnglatSE);
    //   const size = se.sub(nw);
    //   const scaleX =
    //     (this.width - padding * 2 - Math.abs(offset.x) * 2) / size.x;
    //   const scaleY =
    //     (this.height - padding * 2 - Math.abs(offset.y) * 2) / size.y;

    //   const center = this.unproject(nw.add(se).div(2));
    //   const zoom = this.scaleZoom(this.scale * Math.min(scaleX, scaleY));
    //   return {
    //     latitude: center.lat,
    //     longitude: center.lng,
    //     zoom
    //   };
    // }

  }, {
    key: '_precomputeMatrices',
    value: function _precomputeMatrices() {
      this._glProjectionMatrix = this._calculateGLProjectionMatrix();

      var m = _glMatrix.mat4.create();
      _glMatrix.mat4.translate(m, m, [0.5, 0.5, 0]);
      _glMatrix.mat4.scale(m, m, [this.width, this.height, 1]);
      _glMatrix.mat4.multiply(m, m, this._glProjectionMatrix);
      this._pixelProjectionMatrix = m;

      var mInverse = _glMatrix.mat4.clone(m);
      _glMatrix.mat4.invert(mInverse, mInverse);
    }

    // Transforms from Web Mercator Tile 0 [0-512,0-512] to "clip space"

  }, {
    key: '_calculateGLProjectionMatrix',
    value: function _calculateGLProjectionMatrix() {
      var m = _glMatrix.mat4.create();

      _glMatrix.mat4.perspective(m, 2 * Math.atan(this.height / 2 / this.altitude), this.width / this.height, 0.1, this.farZ);

      // Move camera to altitude
      _glMatrix.mat4.translate(m, m, [0, 0, -this.altitude]);

      // After the rotateX, z values are in pixel units. Convert them to
      // altitude units. 1 altitude unit = the screen height.
      _glMatrix.mat4.scale(m, m, [1, -1, 1 / this.height]);

      _glMatrix.mat4.rotateX(m, m, this.pitchRadians);
      _glMatrix.mat4.rotateZ(m, m, -this.bearingRadians);
      _glMatrix.mat4.translate(m, m, [-this.centerX, -this.centerY, 0]);
      // mat4.scale(m, m, [this.scale, this.scale, this.scale]);

      return m;
    }
  }]);

  return Viewport;
}();

/* xiaoji's shader
uniform mat4 projMatrix;
uniform float zoom;
// convert (lng, lat) to screen positions in clip space.
// mapbox-gl/js/geo/transform.js
vec2 project(vec2 pt) {
  float worldSize = 512.0 * pow(2.0, zoom);
  float lngX = (180.0 + pt.x) / 360.0  * worldSize;
  float latY = (180.0 - degrees(log(tan(radians(pt.y + 90.0)/2.0)))) / 360.0
  * worldSize;
  vec4 p = vec4(lngX, latY, 0, 1.0) * projMatrix;
  return vec2(p.x/p.z, p.y/p.z);
}
*/


exports.default = Viewport;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92aWV3cG9ydC92aWV3cG9ydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7cWpCQUFBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7QUFFQSxJQUFNLEtBQUssS0FBSyxFQUFoQjtBQUNBLElBQU0sT0FBTyxLQUFLLENBQWxCO0FBQ0EsSUFBTSxPQUFPLEtBQUssQ0FBbEI7QUFDQSxJQUFNLHFCQUFxQixLQUFLLEdBQWhDO0FBQ0EsSUFBTSxxQkFBcUIsTUFBTSxFQUFqQztBQUNBLElBQU0sWUFBWSxHQUFsQjtBQUNBLElBQU0sY0FBYyxZQUFZLElBQWhDOztJQUVxQixRO0FBQ25CO0FBQ0EsMEJBVUc7QUFBQSwwQkFSRCxLQVFDO0FBQUEsUUFSRCxLQVFDLDhCQVJPLENBUVA7QUFBQSwyQkFQRCxNQU9DO0FBQUEsUUFQRCxNQU9DLCtCQVBRLENBT1I7QUFBQSw2QkFORCxRQU1DO0FBQUEsUUFORCxRQU1DLGlDQU5VLENBTVY7QUFBQSw4QkFMRCxTQUtDO0FBQUEsUUFMRCxTQUtDLGtDQUxXLENBS1g7QUFBQSx5QkFKRCxJQUlDO0FBQUEsUUFKRCxJQUlDLDZCQUpNLENBSU47QUFBQSwwQkFIRCxLQUdDO0FBQUEsUUFIRCxLQUdDLDhCQUhPLENBR1A7QUFBQSw0QkFGRCxPQUVDO0FBQUEsUUFGRCxPQUVDLGdDQUZTLENBRVQ7QUFBQSw2QkFERCxRQUNDO0FBQUEsUUFERCxRQUNDLGlDQURVLEdBQ1Y7O0FBQUE7O0FBQ0Q7QUFDQSxTQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsU0FBSyxNQUFMLEdBQWMsTUFBZDtBQUNBLFNBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxTQUFLLFFBQUwsR0FBZ0IsUUFBaEI7QUFDQSxTQUFLLFNBQUwsR0FBaUIsU0FBakI7QUFDQSxTQUFLLE9BQUwsR0FBZSxPQUFmOztBQUVBO0FB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Ozs7bURBQytCO0FBQzdCLFVBQU0sSUFBSSxlQUFLLE1BQUwsRUFBVjs7QUFFQSxxQkFBSyxXQUFMLENBQWlCLENBQWpCLEVBQ0UsSUFBSSxLQUFLLElBQUwsQ0FBVyxLQUFLLE1BQUwsR0FBYyxDQUFmLEdBQW9CLEtBQUssUUFBbkMsQ0FETixFQUVFLEtBQUssS0FBTCxHQUFhLEtBQUssTUFGcEIsRUFHRSxHQUhGLEVBSUUsS0FBSyxJQUpQOztBQU9BO0FBQ0EscUJBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQUMsS0FBSyxRQUFiLENBQXJCOztBQUVBO0FBQ0E7QUFDQSxxQkFBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLENBQWQsRUFBaUIsQ0FBQyxDQUFELEVBQUksQ0FBQyxDQUFMLEVBQVEsSUFBSSxLQUFLLE1BQWpCLENBQWpCOztBQUVBLHFCQUFLLE9BQUwsQ0FBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLEtBQUssWUFBeEI7QUFDQSxxQkFBSyxPQUFMLENBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQixDQUFDLEtBQUssY0FBekI7QUFDQSxxQkFBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixDQUFsQixFQUFxQixDQUFDLENBQUMsS0FBSyxPQUFQLEVBQWdCLENBQUMsS0FBSyxPQUF0QixFQUErQixDQUEvQixDQUFyQjtBQUNBOztBQUVBLGFBQU8sQ0FBUDtBQUNEOzs7Ozs7QUFJSDs7Ozs7Ozs7Ozs7Ozs7OztrQkFoTHFCLFEiLCJmaWxlIjoidmlld3BvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBWaWV3IGFuZCBQcm9qZWN0aW9uIE1hdHJpeCBjYWxjdWxhdGlvbnMgZm9yIG1hcGJveC1qcyBzdHlsZVxuLy8gbWFwIHZpZXcgcHJvcGVydGllc1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG4vLyBBVFRSSUJVVElPTjogTWF0cml4IGNyZWF0aW9uIGFsZ29zIGFyZSBiYXNlZCBvbiBtYXBib3gtZ2wtanMgc291cmNlIGNvZGVcbi8vIFRoaXMgaXMgaW50ZW50aW9uYWxseSBjbG9zZWx5IG1hcHBlZCB0byBtYXBib3gtZ2wtanMgaW1wbGVtZW50YXRpb24gdG9cbi8vIGVuc3VyZSBzZWFtbGVzcyBpbnRlcm9wZXJhdGlvbiB3aXRoIHJlYWN0LW1hcC1nbFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL21hcGJveC9tYXBib3gtZ2wtanMvYmxvYi8wMzMwNDMyNTRkMzBhOTlhMDBiOTU2NjBlMjk2NDQ1YTFhZGUyZDAxL2pzL2dlby90cmFuc2Zvcm0uanNcbi8qIGVsc2ludC1lbmFibGUgKi9cblxuLy8gV2UgZGVmaW5lIGEgY291cGxlIG9mIGNvb3JkaW5hdGUgc3lzdGVtczpcbi8vIC0tLS0tLVxuLy8gTGF0TG9uICAgICAgICAgICAgIFtsbmcsIGxhdF0gPSBbLTE4MCAtIDE4MCwgLTgxIC0gODFdXG4vLyBXb3JsZCAoem9vbSAwKSAgICAgW3gsIHldID0gWzAtNTEyLCB5OiAwLTUxMl1cbi8vIFpvb21lZCAoem9vbSBOKSAgICBbeCwgeV0gPSBbMCAtIDUxMioyKipOLCAwIC0gNTEyKjIqKk5dXG4vLyBUcmFuc2xhdGVkICAgICAgICAgW3gsIHldID0gemVybyBjZW50ZXJlZFxuLy8gVmlldyAoQ2FtZXJhKSAgICAgIHVuaXQgY3ViZSBhcm91bmQgdmlld1xuLy8gLS0tLS0tXG5cbmltcG9ydCB7bWF0MiwgbWF0NCwgdmVjNH0gZnJvbSAnZ2wtbWF0cml4JztcblxuY29uc3QgUEkgPSBNYXRoLlBJO1xuY29uc3QgUElfMiA9IFBJIC8gMjtcbmNvbnN0IFBJXzQgPSBQSSAvIDQ7XG5jb25zdCBERUdSRUVTX1RPX1JBRElBTlMgPSBQSSAvIDE4MDtcbmNvbnN0IFJBRElBTlNfVE9fREVHUkVFUyA9IDE4MCAvIFBJO1xuY29uc3QgVElMRV9TSVpFID0gNTEyO1xuY29uc3QgV09STERfU0NBTEUgPSBUSUxFX1NJWkUgLyBQSV8yO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3cG9ydCB7XG4gIC8qIGVzbGludC1kaXNhYmxlIG1heC1zdGF0ZW1lbnRzICovXG4gIGNvbnN0cnVjdG9yKHtcbiAgICAvLyBNYXAgc3RhdGVcbiAgICB3aWR0aCA9IDAsXG4gICAgaGVpZ2h0ID0gMCxcbiAgICBsYXRpdHVkZSA9IDAsXG4gICAgbG9uZ2l0dWRlID0gMCxcbiAgICB6b29tID0gMCxcbiAgICBwaXRjaCA9IDAsXG4gICAgYmVhcmluZyA9IDAsXG4gICAgYWx0aXR1ZGUgPSAxLjVcbiAgfSkge1xuICAgIC8vIFZpZXdwb3J0XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIHRoaXMuem9vbSA9IHpvb207XG4gICAgdGhpcy5sYXRpdHVkZSA9IGxhdGl0dWRlO1xuICAgIHRoaXMubG9uZ2l0dWRlID0gbG9uZ2l0dWRlO1xuICAgIHRoaXMuYmVhcmluZyA9IGJlYXJpbmc7XG5cbiAgICAvLyBTY2FsZVxuICAgIHRoaXMuc2NhbGUgPSBNYXRoLnBvdygyLCB6b29tKTtcbiAgICB0aGlzLndvcmxkU2l6ZSA9IFRJTEVfU0laRSAqIHRoaXMuc2NhbGU7XG4gICAgdGhpcy50aWxlWm9vbSA9IE1hdGguZmxvb3Ioem9vbSk7XG4gICAgdGhpcy56b29tRnJhY3Rpb24gPSB6b29tIC0gTWF0aC5mbG9vcih6b29tKTtcblxuICAgIC8vIEJlYXJpbmdcbiAgICB0aGlzLmJlYXJpbmdSYWRpYW5zID0gYmVhcmluZyAvIDE4MCAqIE1hdGguUEk7XG4gICAgdGhpcy5iZWFyaW5nUm90YXRpb25NYXRyaXggPSBtYXQyLmNyZWF0ZSgpO1xuICAgIG1hdDIucm90YXRlKFxuICAgICAgdGhpcy5iZWFyaW5nUm90YXRpb25NYXRyaXgsIHRoaXMuYmVhcmluZ1JvdGF0aW9uTWF0cml4LCB0aGlzLmJlYXJpbmdcbiAgICApO1xuXG4gICAgLy8gUGl0Y2hcbiAgICB0aGlzLm9yaWdpbmFsUGl0Y2ggPSBwaXRjaDtcbiAgICB0aGlzLnBpdGNoID0gTWF0aC5taW4oNjAsIHBpdGNoKTtcbiAgICB0aGlzLnBpdGNoUmFkaWFucyA9IE1hdGgubWluKDYwLCBwaXRjaCkgLyAxODAgKiBNYXRoLlBJO1xuXG4gICAgLy8gQWx0aXR1ZGVcbiAgICB0aGlzLm9yaWdpbmFsQWx0aXR1ZGUgPSBhbHRpdHVkZTtcbiAgICB0aGlzLmFsdGl0dWRlID0gTWF0aC5tYXgoMC43NSwgYWx0aXR1ZGUpO1xuXG4gICAgLy8gQ2VudGVyIHgsIHlcbiAgICBjb25zdCB5ID0gMTgwIC8gTWF0aC5QSSAqXG4gICAgICBNYXRoLmxvZyhNYXRoLnRhbihNYXRoLlBJIC8gNCArIGxhdGl0dWRlICogTWF0aC5QSSAvIDM2MCkpO1xuXG4gICAgdGhpcy5jZW50ZXJYMCA9ICgxODAgKyBsb25naXR1ZGUpIC8gMzYwICogVElMRV9TSVpFO1xuICAgIHRoaXMuY2VudGVyWTAgPSAoMTgwIC0geSkgLyAzNjAgKiBUSUxFX1NJWkU7XG4gICAgdGhpcy5jZW50ZXJYID0gdGhpcy5jZW50ZXJYMCAqIHRoaXMuc2NhbGU7XG4gICAgdGhpcy5jZW50ZXJZID0gdGhpcy5jZW50ZXJZMCAqIHRoaXMuc2NhbGU7XG5cbiAgICAvLyBGaW5kIHRoZSBkaXN0YW5jZSBmcm9tIHRoZSBjZW50ZXIgcG9pbnQgdG8gdGhlIGNlbnRlciB0b3BcbiAgICAvLyBpbiBhbHRpdHVkZSB1bml0cyB1c2luZyBsYXcgb2Ygc2luZXMuXG4gICAgdGhpcy5oYWxmRm92ID0gTWF0aC5hdGFuKDAuNSAvIHRoaXMuYWx0aXR1ZGUpO1xuICAgIHRoaXMudG9wSGFsZlN1cmZhY2VEaXN0YW5jZSA9XG4gICAgICBNYXRoLnNpbih0aGlzLmhhbGZGb3YpICogdGhpcy5hbHRpdHVkZSAvXG4gICAgICBNYXRoLnNpbihNYXRoLlBJIC8gMiAtIHRoaXMucGl0Y2hSYWRpYW5zIC0gdGhpcy5oYWxmRm92KTtcblxuICAgIC8vIENhbGN1bGF0ZSB6IHZhbHVlIG9mIHRoZSBmYXJ0aGVzdCBmcmFnbWVudCB0aGF0IHNob3VsZCBiZSByZW5kZXJlZC5cbiAgICB0aGlzLmZhclogPSBNYXRoLmNvcyhNYXRoLlBJIC8gMiAtIHRoaXMucGl0Y2hSYWRpYW5zKSAqXG4gICAgICB0aGlzLnRvcEhhbGZTdXJmYWNlRGlzdGFuY2UgKyB0aGlzLmFsdGl0dWRlO1xuXG4gICAgdGhpcy5fcHJlY29tcHV0ZU1hdHJpY2VzKCk7XG4gIH1cbiAgLyogZXNsaW50LWVuYWJsZSBtYXgtc3RhdGVtZW50cyAqL1xuXG4gIHByb2plY3QobG5nTGF0Wikge1xuICAgIGNvbnN0IFt4LCB5XSA9IHRoaXMucHJvamVjdFpvb20wKGxuZ0xhdFopO1xuICAgIGNvbnN0IHYgPSB2ZWM0LmZyb21WYWx1ZXMoeCwgeSwgbG5nTGF0WlsyXSB8fCAwLCAxKTtcbiAgICB2ZWM0LnRyYW5zZm9ybU1hdDQodiwgdiwgdGhpcy52aWV3TWF0cml4KTtcbiAgICB2ZWM0LnRyYW5zZm9ybU1hdDQodiwgdiwgdGhpcy5wcm9qZWN0aW9uTWF0cml4KTtcbiAgICAvLyB2ZWM0LnRyYW5zZm9ybU1hdDQodiwgdiwgdGhpcy52aWV3cG9ydE1hdHJpeCk7XG4gIH1cblxuICAvKipcbiAgICogUHJvamVjdCBbbG5nLGxhdF0gb24gc3BoZXJlIG9udG8gW3gseV0gb24gNTEyKjUxMiBNZXJjYXRvciBab29tIDAgdGlsZS5cbiAgICogUGVyZm9ybXMgdGhlIG5vbmxpbmVhciBwYXJ0IG9mIHRoZSB3ZWIgbWVyY2F0b3IgcHJvamVjdGlvbi5cbiAgICogUmVtYWluaW5nIHByb2plY3Rpb24gaXMgZG9uZSB3aXRoIDR4NCBtYXRyaWNlcyB3aGljaCBhbHNvIGhhbmRsZXNcbiAgICogcGVyc3BlY3RpdmUuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGxuZ0xhdCAtIFtsbmcsIGxhdF0gY29vcmRpbmF0ZXNcbiAgICogICBTcGVjaWZpZXMgYSBwb2ludCBvbiB0aGUgc3BoZXJlIHRvIHByb2plY3Qgb250byB0aGUgbWFwLlxuICAgKiBAcmV0dXJuIHtBcnJheX0gW3gseV0gY29vcmRpbmF0ZXMuXG4gICAqL1xuICBwcm9qZWN0Wm9vbTAoW2xuZywgbGF0XSkge1xuICAgIGNvbnN0IGxhbWJkYTIgPSBsbmcgKiBERUdSRUVTX1RPX1JBRElBTlM7XG4gICAgY29uc3QgcGhpMiA9IGxhdCAqIERFR1JFRVNfVE9fUkFESUFOUztcbiAgICBjb25zdCB4ID0gV09STERfU0NBTEUgKiAobGFtYmRhMiArIFBJKTtcbiAgICBjb25zdCB5ID0gV09STERfU0NBTEUgKiAoUEkgLSBNYXRoLmxvZyhNYXRoLnRhbihQSV80ICsgcGhpMiAqIDAuNSkpKTtcbiAgICByZXR1cm4gW3gsIHldO1xuICB9XG5cbiAgLyoqXG4gICAqIFVucHJvamVjdCBwb2ludCB7eCx5fSBvbiBtYXAgb250byB7bGF0LCBsb259IG9uIHNwaGVyZVxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdHxWZWN0b3J9IHh5IC0gb2JqZWN0IHdpdGgge3gseX0gbWVtYmVyc1xuICAgKiAgcmVwcmVzZW50aW5nIHBvaW50IG9uIHByb2plY3RlZCBtYXAgcGxhbmVcbiAgICogQHJldHVybiB7R2VvQ29vcmRpbmF0ZXN9IC0gb2JqZWN0IHdpdGgge2xhdCxsb259IG9mIHBvaW50IG9uIHNwaGVyZS5cbiAgICogICBIYXMgdG9BcnJheSBtZXRob2QgaWYgeW91IG5lZWQgYSBHZW9KU09OIEFycmF5LlxuICAgKiAgIFBlciBjYXJ0b2dyYXBoaWMgdHJhZGl0aW9uLCBsYXQgYW5kIGxvbiBhcmUgc3BlY2lmaWVkIGFzIGRlZ3JlZXMuXG4gICAqL1xuICB1bnByb2plY3Rab29tMChbeCwgeV0pIHtcbiAgICBjb25zdCBsYW1iZGEyID0geCAvIFdPUkxEX1NDQUxFIC0gUEk7XG4gICAgY29uc3QgcGhpMiA9IDIgKiAoTWF0aC5hdGFuKE1hdGguZXhwKFBJIC0geSAvIFdPUkxEX1NDQUxFKSkgLSBQSV80KTtcbiAgICByZXR1cm4gW2xhbWJkYTIgKiBSQURJQU5TX1RPX0RFR1JFRVMsIHBoaTIgKiBSQURJQU5TX1RPX0RFR1JFRVNdO1xuICB9XG5cbiAgZ2V0UHJvamVjdGlvbk1hdHJpeCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2xQcm9qZWN0aW9uTWF0cml4O1xuICB9XG5cbiAgLy8gZml0Qm91bmRzKGxuZ2xhdFNFLCBsbmdsYXROVywge3BhZGRpbmcgPSAwfSA9IHt9KSB7XG4gIC8vICAgY29uc3QgYm91bmRzID0gbmV3IExuZ0xhdEJvdW5kcyhcbiAgLy8gICAgIFtfYm91bmRzWzBdLnJldmVyc2UoKSxcbiAgLy8gICAgIF9ib3VuZHNbMV0ucmV2ZXJzZSgpXVxuICAvLyAgICk7XG4gIC8vICAgY29uc3Qgb2Zmc2V0ID0gUG9pbnQuY29udmVydChbMCwgMF0pO1xuICAvLyAgIGNvbnN0IG53ID0gdGhpcy5wcm9qZWN0KGxuZ2xhdE5XKTtcbiAgLy8gICBjb25zdCBzZSA9IHRoaXMucHJvamVjdChsbmdsYXRTRSk7XG4gIC8vICAgY29uc3Qgc2l6ZSA9IHNlLnN1Yihudyk7XG4gIC8vICAgY29uc3Qgc2NhbGVYID1cbiAgLy8gICAgICh0aGlzLndpZHRoIC0gcGFkZGluZyAqIDIgLSBNYXRoLmFicyhvZmZzZXQueCkgKiAyKSAvIHNpemUueDtcbiAgLy8gICBjb25zdCBzY2FsZVkgPVxuICAvLyAgICAgKHRoaXMuaGVpZ2h0IC0gcGFkZGluZyAqIDIgLSBNYXRoLmFicyhvZmZzZXQueSkgKiAyKSAvIHNpemUueTtcblxuICAvLyAgIGNvbnN0IGNlbnRlciA9IHRoaXMudW5wcm9qZWN0KG53LmFkZChzZSkuZGl2KDIpKTtcbiAgLy8gICBjb25zdCB6b29tID0gdGhpcy5zY2FsZVpvb20odGhpcy5zY2FsZSAqIE1hdGgubWluKHNjYWxlWCwgc2NhbGVZKSk7XG4gIC8vICAgcmV0dXJuIHtcbiAgLy8gICAgIGxhdGl0dWRlOiBjZW50ZXIubGF0LFxuICAvLyAgICAgbG9uZ2l0dWRlOiBjZW50ZXIubG5nLFxuICAvLyAgICAgem9vbVxuICAvLyAgIH07XG4gIC8vIH1cblxuICBfcHJlY29tcHV0ZU1hdHJpY2VzKCkge1xuICAgIHRoaXMuX2dsUHJvamVjdGlvbk1hdHJpeCA9IHRoaXMuX2NhbGN1bGF0ZUdMUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gICAgY29uc3QgbSA9IG1hdDQuY3JlYXRlKCk7XG4gICAgbWF0NC50cmFuc2xhdGUobSwgbSwgWzAuNSwgMC41LCAwXSk7XG4gICAgbWF0NC5zY2FsZShtLCBtLCBbdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQsIDFdKTtcbiAgICBtYXQ0Lm11bHRpcGx5KG0sIG0sIHRoaXMuX2dsUHJvamVjdGlvbk1hdHJpeCk7XG4gICAgdGhpcy5fcGl4ZWxQcm9qZWN0aW9uTWF0cml4ID0gbTtcblxuICAgIGNvbnN0IG1JbnZlcnNlID0gbWF0NC5jbG9uZShtKTtcbiAgICBtYXQ0LmludmVydChtSW52ZXJzZSwgbUludmVyc2UpO1xuICB9XG5cbiAgLy8gVHJhbnNmb3JtcyBmcm9tIFdlYiBNZXJjYXRvciBUaWxlIDAgWzAtNTEyLDAtNTEyXSB0byBcImNsaXAgc3BhY2VcIlxuICBfY2FsY3VsYXRlR0xQcm9qZWN0aW9uTWF0cml4KCkge1xuICAgIGNvbnN0IG0gPSBtYXQ0LmNyZWF0ZSgpO1xuXG4gICAgbWF0NC5wZXJzcGVjdGl2ZShtLFxuICAgICAgMiAqIE1hdGguYXRhbigodGhpcy5oZWlnaHQgLyAyKSAvIHRoaXMuYWx0aXR1ZGUpLFxuICAgICAgdGhpcy53aWR0aCAvIHRoaXMuaGVpZ2h0LFxuICAgICAgMC4xLFxuICAgICAgdGhpcy5mYXJaXG4gICAgKTtcblxuICAgIC8vIE1vdmUgY2FtZXJhIHRvIGFsdGl0dWRlXG4gICAgbWF0NC50cmFuc2xhdGUobSwgbSwgWzAsIDAsIC10aGlzLmFsdGl0dWRlXSk7XG5cbiAgICAvLyBBZnRlciB0aGUgcm90YXRlWCwgeiB2YWx1ZXMgYXJlIGluIHBpeGVsIHVuaXRzLiBDb252ZXJ0IHRoZW0gdG9cbiAgICAvLyBhbHRpdHVkZSB1bml0cy4gMSBhbHRpdHVkZSB1bml0ID0gdGhlIHNjcmVlbiBoZWlnaHQuXG4gICAgbWF0NC5zY2FsZShtLCBtLCBbMSwgLTEsIDEgLyB0aGlzLmhlaWdodF0pO1xuXG4gICAgbWF0NC5yb3RhdGVYKG0sIG0sIHRoaXMucGl0Y2hSYWRpYW5zKTtcbiAgICBtYXQ0LnJvdGF0ZVoobSwgbSwgLXRoaXMuYmVhcmluZ1JhZGlhbnMpO1xuICAgIG1hdDQudHJhbnNsYXRlKG0sIG0sIFstdGhpcy5jZW50ZXJYLCAtdGhpcy5jZW50ZXJZLCAwXSk7XG4gICAgLy8gbWF0NC5zY2FsZShtLCBtLCBbdGhpcy5zY2FsZSwgdGhpcy5zY2FsZSwgdGhpcy5zY2FsZV0pO1xuXG4gICAgcmV0dXJuIG07XG4gIH1cblxufVxuXG4vKiB4aWFvamkncyBzaGFkZXJcbnVuaWZvcm0gbWF0NCBwcm9qTWF0cml4O1xudW5pZm9ybSBmbG9hdCB6b29tO1xuLy8gY29udmVydCAobG5nLCBsYXQpIHRvIHNjcmVlbiBwb3NpdGlvbnMgaW4gY2xpcCBzcGFjZS5cbi8vIG1hcGJveC1nbC9qcy9nZW8vdHJhbnNmb3JtLmpzXG52ZWMyIHByb2plY3QodmVjMiBwdCkge1xuICBmbG9hdCB3b3JsZFNpemUgPSA1MTIuMCAqIHBvdygyLjAsIHpvb20pO1xuICBmbG9hdCBsbmdYID0gKDE4MC4wICsgcHQueCkgLyAzNjAuMCAgKiB3b3JsZFNpemU7XG4gIGZsb2F0IGxhdFkgPSAoMTgwLjAgLSBkZWdyZWVzKGxvZyh0YW4ocmFkaWFucyhwdC55ICsgOTAuMCkvMi4wKSkpKSAvIDM2MC4wXG4gICogd29ybGRTaXplO1xuICB2ZWM0IHAgPSB2ZWM0KGxuZ1gsIGxhdFksIDAsIDEuMCkgKiBwcm9qTWF0cml4O1xuICByZXR1cm4gdmVjMihwLngvcC56LCBwLnkvcC56KTtcbn1cbiovXG4iXX0=