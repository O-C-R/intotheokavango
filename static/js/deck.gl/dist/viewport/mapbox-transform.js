'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable max-len */
// Paired down version of https://github.com/mapbox/mapbox-gl-js/blob/033043254d30a99a00b95660e296445a1ade2d01/js/geo/transform.js

var _glMatrix = require('gl-matrix');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Create a longitude, latitude object from a given longitude and latitude
 * pair in degrees.
 * Mapbox GL uses Longitude, Latitude coordinate order to match GeoJSON.
 *
 * Note that any Mapbox GL method that accepts a `LngLat` object can also
 * accept an `Array` and will perform an implicit conversion.
 * The following lines are equivalent:
 ```
 map.setCenter([-73.9749, 40.7736]);
 map.setCenter( new mapboxgl.LngLat(-73.9749, 40.7736) );
 ```
 *
 * @class LngLat
 * @classdesc A representation of a longitude, latitude point, in degrees.
 * @param {number} lng longitude
 * @param {number} lat latitude
 * @example
 * var ll = new mapboxgl.LngLat(-73.9749, 40.7736);
 */
function LngLat(lng, lat) {
  if (isNaN(lng) || isNaN(lat)) {
    throw new Error('Invalid LngLat object: (' + lng + ', ' + lat + ')');
  }
  this.lng = Number(lng);
  this.lat = Number(lat);
  if (this.lat > 90 || this.lat < -90) {
    throw new Error('Invalid LngLat latitude value: must be between -90 and 90');
  }
}

/**
 * A single transform, generally used for a single tile to be
 * scaled, rotated, and zoomed.
 */

var MapboxTransform = function () {

  /* eslint-disable max-statements */
  function MapboxTransform(_ref) {
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
    var _ref$altitude = _ref.altitude;
    var altitude = _ref$altitude === undefined ? 1.5 : _ref$altitude;
    var _ref$pitch = _ref.pitch;
    var pitch = _ref$pitch === undefined ? 0 : _ref$pitch;
    var _ref$bearing = _ref.bearing;
    var bearing = _ref$bearing === undefined ? 0 : _ref$bearing;

    _classCallCheck(this, MapboxTransform);

    // constant
    this.tileSize = 512;

    this.width = 0;
    this.height = 0;
    this._center = new LngLat(0, 0);
    this.zoom = 0;
    this.angle = 0;
    this._altitude = 1.5;
    this._pitch = 0;

    this.width = width;
    this.height = height;
    this.zoom = zoom;
    this.center = new LngLat(longitude, latitude);
    this.altitude = altitude;
    this.pitch = pitch;
    this.bearing = bearing;
    this._calcProjMatrix();
  }
  /* eslint-enable */

  _createClass(MapboxTransform, [{
    key: 'zoomScale',
    value: function zoomScale(zoom) {
      return Math.pow(2, zoom);
    }
  }, {
    key: 'lngX',


    /**
     * latitude to absolute x coord
     * @param {number} lon
     * @param {number} [worldSize=this.worldSize]
     * @returns {number} pixel coordinate
     * @private
     */
    value: function lngX(lng, worldSize) {
      return (180 + lng) * (worldSize || this.worldSize) / 360;
    }
    /**
     * latitude to absolute y coord
     * @param {number} lat
     * @param {number} [worldSize=this.worldSize]
     * @returns {number} pixel coordinate
     * @private
     */

  }, {
    key: 'latY',
    value: function latY(lat, worldSize) {
      var y = 180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
      return (180 - y) * (worldSize || this.worldSize) / 360;
    }
  }, {
    key: '_calcProjMatrix',
    value: function _calcProjMatrix() {
      var m = new Float32Array(16);

      // Find the distance from the center point to the center top in altitude units using law of sines.
      var halfFov = Math.atan(0.5 / this.altitude);
      var topHalfSurfaceDistance = Math.sin(halfFov) * this.altitude / Math.sin(Math.PI / 2 - this._pitch - halfFov);

      // Calculate z value of the farthest fragment that should be rendered.
      var farZ = Math.cos(Math.PI / 2 - this._pitch) * topHalfSurfaceDistance + this.altitude;

      _glMatrix.mat4.perspective(m, 2 * Math.atan(this.height / 2 / this.altitude), this.width / this.height, 0.1, farZ);

      _glMatrix.mat4.translate(m, m, [0, 0, -this.altitude]);

      // After the rotateX, z values are in pixel units. Convert them to
      // altitude units. 1 altitude unit = the screen height.
      _glMatrix.mat4.scale(m, m, [1, -1, 1 / this.height]);

      _glMatrix.mat4.rotateX(m, m, this._pitch);
      _glMatrix.mat4.rotateZ(m, m, this.angle);
      _glMatrix.mat4.translate(m, m, [-this.x, -this.y, 0]);

      this.projMatrix = m;
    }
  }, {
    key: 'worldSize',
    get: function get() {
      return this.tileSize * this.scale;
    }
  }, {
    key: 'bearing',
    get: function get() {
      return -this.angle / Math.PI * 180;
    },
    set: function set(bearing) {
      // TODO: Bounds check
      // var b =
      var b = -bearing * Math.PI / 180;
      if (this.angle === b) return;
      this.angle = b;

      // 2x2 matrix for rotating points
      this.rotationMatrix = _glMatrix.mat2.create();
      _glMatrix.mat2.rotate(this.rotationMatrix, this.rotationMatrix, this.angle);
    }
  }, {
    key: 'pitch',
    get: function get() {
      return this._pitch / Math.PI * 180;
    },
    set: function set(pitch) {
      var p = Math.min(60, pitch) / 180 * Math.PI;
      if (this._pitch === p) return;
      this._pitch = p;
    }
  }, {
    key: 'altitude',
    get: function get() {
      return this._altitude;
    },
    set: function set(altitude) {
      var a = Math.max(0.75, altitude);
      if (this._altitude === a) return;
      this._altitude = a;
    }
  }, {
    key: 'zoom',
    get: function get() {
      return this._zoom;
    },
    set: function set(zoom) {
      var z = zoom;
      if (this._zoom === z) return;
      this._zoom = z;
      this.scale = this.zoomScale(z);
      this.tileZoom = Math.floor(z);
      this.zoomFraction = z - this.tileZoom;
    }
  }, {
    key: 'center',
    get: function get() {
      return this._center;
    },
    set: function set(center) {
      if (center.lat === this._center.lat && center.lng === this._center.lng) return;
      this._center = center;
    }
  }, {
    key: 'x',
    get: function get() {
      return this.lngX(this.center.lng);
    }
  }, {
    key: 'y',
    get: function get() {
      return this.latY(this.center.lat);
    }
  }]);

  return MapboxTransform;
}();

exports.default = MapboxTransform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92aWV3cG9ydC9tYXBib3gtdHJhbnNmb3JtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7cWpCQUFBO0FBQ0E7O0FBRUE7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsU0FBUyxNQUFULENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLEVBQTBCO0FBQ3hCLE1BQUksTUFBTSxHQUFOLEtBQWMsTUFBTSxHQUFOLENBQWxCLEVBQThCO0FBQzVCLFVBQU0sSUFBSSxLQUFKLENBQVUsNkJBQTZCLEdBQTdCLEdBQW1DLElBQW5DLEdBQTBDLEdBQTFDLEdBQWdELEdBQTFELENBQU47QUFDRDtBQUNELE9BQUssR0FBTCxHQUFXLE9BQU8sR0FBUCxDQUFYO0FBQ0EsT0FBSyxHQUFMLEdBQVcsT0FBTyxHQUFQLENBQVg7QUFDQSxNQUFJLEtBQUssR0FBTCxHQUFXLEVBQVgsSUFBaUIsS0FBSyxHQUFMLEdBQVcsQ0FBQyxFQUFqQyxFQUFxQztBQUNuQyxVQUFNLElBQUksS0FBSixDQUFVLDJEQUFWLENBQU47QUFDRDtBQUNGOztBQUVEOzs7OztJQUlxQixlOztBQUVuQjtBQUNBLGlDQVNHO0FBQUEsMEJBUkQsS0FRQztBQUFBLFFBUkQsS0FRQyw4QkFSTyxDQVFQO0FBQUEsMkJBUEQsTUFPQztBQUFBLFFBUEQsTUFPQywrQkFQUSxDQU9SO0FBQUEsNkJBTkQsUUFNQztBQUFBLFFBTkQsUUFNQyxpQ0FOVSxDQU1WO0FBQUEsOEJBTEQsU0FLQztBQUFBLFFBTEQsU0FLQyxrQ0FMVyxDQUtYO0FBQUEseUJBSkQsSUFJQztBQUFBLFFBSkQsSUFJQyw2QkFKTSxDQUlOO0FBQUEsNkJBSEQsUUFHQztBQUFBLFFBSEQsUUFHQyxpQ0FIVSxHQUdWO0FBQUEsMEJBRkQsS0FFQztBQUFBLFFBRkQsS0FFQyw4QkFGTyxDQUVQO0FBQUEsNEJBREQsT0FDQztBQUFBLFFBREQsT0FDQyxnQ0FEUyxDQUNUOztBQUFBOztBQUNEO0FBQ0EsU0FBSyxR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TCxHQUFhLEtBQUssU0FBTCxDQUFlLENBQWYsQ0FBYjtBQUNBLFdBQUssUUFBTCxHQUFnQixLQUFLLEtBQUwsQ0FBVyxDQUFYLENBQWhCO0FBQ0EsV0FBSyxZQUFMLEdBQW9CLElBQUksS0FBSyxRQUE3QjtBQUNEOzs7d0JBRVk7QUFBRSxhQUFPLEtBQUssT0FBWjtBQUFzQixLO3NCQUMxQixNLEVBQVE7QUFDakIsVUFBSSxPQUFPLEdBQVAsS0FBZSxLQUFLLE9BQUwsQ0FBYSxHQUE1QixJQUFtQyxPQUFPLEdBQVAsS0FBZSxLQUFLLE9BQUwsQ0FBYSxHQUFuRSxFQUF3RTtBQUN4RSxXQUFLLE9BQUwsR0FBZSxNQUFmO0FBQ0Q7Ozt3QkFJTztBQUFFLGFBQU8sS0FBSyxJQUFMLENBQVUsS0FBSyxNQUFMLENBQVksR0FBdEIsQ0FBUDtBQUFvQzs7O3dCQUN0QztBQUFFLGFBQU8sS0FBSyxJQUFMLENBQVUsS0FBSyxNQUFMLENBQVksR0FBdEIsQ0FBUDtBQUFvQzs7Ozs7O2tCQTNGM0IsZSIsImZpbGUiOiJtYXBib3gtdHJhbnNmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuLy8gUGFpcmVkIGRvd24gdmVyc2lvbiBvZiBodHRwczovL2dpdGh1Yi5jb20vbWFwYm94L21hcGJveC1nbC1qcy9ibG9iLzAzMzA0MzI1NGQzMGE5OWEwMGI5NTY2MGUyOTY0NDVhMWFkZTJkMDEvanMvZ2VvL3RyYW5zZm9ybS5qc1xuXG5pbXBvcnQge21hdDIsIG1hdDR9IGZyb20gJ2dsLW1hdHJpeCc7XG5cbi8qKlxuICogQ3JlYXRlIGEgbG9uZ2l0dWRlLCBsYXRpdHVkZSBvYmplY3QgZnJvbSBhIGdpdmVuIGxvbmdpdHVkZSBhbmQgbGF0aXR1ZGVcbiAqIHBhaXIgaW4gZGVncmVlcy5cbiAqIE1hcGJveCBHTCB1c2VzIExvbmdpdHVkZSwgTGF0aXR1ZGUgY29vcmRpbmF0ZSBvcmRlciB0byBtYXRjaCBHZW9KU09OLlxuICpcbiAqIE5vdGUgdGhhdCBhbnkgTWFwYm94IEdMIG1ldGhvZCB0aGF0IGFjY2VwdHMgYSBgTG5nTGF0YCBvYmplY3QgY2FuIGFsc29cbiAqIGFjY2VwdCBhbiBgQXJyYXlgIGFuZCB3aWxsIHBlcmZvcm0gYW4gaW1wbGljaXQgY29udmVyc2lvbi5cbiAqIFRoZSBmb2xsb3dpbmcgbGluZXMgYXJlIGVxdWl2YWxlbnQ6XG4gYGBgXG4gbWFwLnNldENlbnRlcihbLTczLjk3NDksIDQwLjc3MzZdKTtcbiBtYXAuc2V0Q2VudGVyKCBuZXcgbWFwYm94Z2wuTG5nTGF0KC03My45NzQ5LCA0MC43NzM2KSApO1xuIGBgYFxuICpcbiAqIEBjbGFzcyBMbmdMYXRcbiAqIEBjbGFzc2Rlc2MgQSByZXByZXNlbnRhdGlvbiBvZiBhIGxvbmdpdHVkZSwgbGF0aXR1ZGUgcG9pbnQsIGluIGRlZ3JlZXMuXG4gKiBAcGFyYW0ge251bWJlcn0gbG5nIGxvbmdpdHVkZVxuICogQHBhcmFtIHtudW1iZXJ9IGxhdCBsYXRpdHVkZVxuICogQGV4YW1wbGVcbiAqIHZhciBsbCA9IG5ldyBtYXBib3hnbC5MbmdMYXQoLTczLjk3NDksIDQwLjc3MzYpO1xuICovXG5mdW5jdGlvbiBMbmdMYXQobG5nLCBsYXQpIHtcbiAgaWYgKGlzTmFOKGxuZykgfHwgaXNOYU4obGF0KSkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBMbmdMYXQgb2JqZWN0OiAoJyArIGxuZyArICcsICcgKyBsYXQgKyAnKScpO1xuICB9XG4gIHRoaXMubG5nID0gTnVtYmVyKGxuZyk7XG4gIHRoaXMubGF0ID0gTnVtYmVyKGxhdCk7XG4gIGlmICh0aGlzLmxhdCA+IDkwIHx8IHRoaXMubGF0IDwgLTkwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIExuZ0xhdCBsYXRpdHVkZSB2YWx1ZTogbXVzdCBiZSBiZXR3ZWVuIC05MCBhbmQgOTAnKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgc2luZ2xlIHRyYW5zZm9ybSwgZ2VuZXJhbGx5IHVzZWQgZm9yIGEgc2luZ2xlIHRpbGUgdG8gYmVcbiAqIHNjYWxlZCwgcm90YXRlZCwgYW5kIHpvb21lZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwYm94VHJhbnNmb3JtIHtcblxuICAvKiBlc2xpbnQtZGlzYWJsZSBtYXgtc3RhdGVtZW50cyAqL1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgd2lkdGggPSAwLFxuICAgIGhlaWdodCA9IDAsXG4gICAgbGF0aXR1ZGUgPSAwLFxuICAgIGxvbmdpdHVkZSA9IDAsXG4gICAgem9vbSA9IDAsXG4gICAgYWx0aXR1ZGUgPSAxLjUsXG4gICAgcGl0Y2ggPSAwLFxuICAgIGJlYXJpbmcgPSAwXG4gIH0pIHtcbiAgICAvLyBjb25zdGFudFxuICAgIHRoaXMudGlsZVNpemUgPSA1MTI7XG5cbiAgICB0aGlzLndpZHRoID0gMDtcbiAgICB0aGlzLmhlaWdodCA9IDA7XG4gICAgdGhpcy5fY2VudGVyID0gbmV3IExuZ0xhdCgwLCAwKTtcbiAgICB0aGlzLnpvb20gPSAwO1xuICAgIHRoaXMuYW5nbGUgPSAwO1xuICAgIHRoaXMuX2FsdGl0dWRlID0gMS41O1xuICAgIHRoaXMuX3BpdGNoID0gMDtcblxuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICB0aGlzLnpvb20gPSB6b29tO1xuICAgIHRoaXMuY2VudGVyID0gbmV3IExuZ0xhdChsb25naXR1ZGUsIGxhdGl0dWRlKTtcbiAgICB0aGlzLmFsdGl0dWRlID0gYWx0aXR1ZGU7XG4gICAgdGhpcy5waXRjaCA9IHBpdGNoO1xuICAgIHRoaXMuYmVhcmluZyA9IGJlYXJpbmc7XG4gICAgdGhpcy5fY2FsY1Byb2pNYXRyaXgoKTtcbiAgfVxuICAvKiBlc2xpbnQtZW5hYmxlICovXG5cbiAgZ2V0IHdvcmxkU2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy50aWxlU2l6ZSAqIHRoaXMuc2NhbGU7XG4gIH1cblxuICBnZXQgYmVhcmluZygpIHtcbiAgICByZXR1cm4gLXRoaXMuYW5nbGUgLyBNYXRoLlBJICogMTgwO1xuICB9XG4gIHNldCBiZWFyaW5nKGJlYXJpbmcpIHtcbiAgICAvLyBUT0RPOiBCb3VuZHMgY2hlY2tcbiAgICAvLyB2YXIgYiA9XG4gICAgY29uc3QgYiA9IC1iZWFyaW5nICogTWF0aC5QSSAvIDE4MDtcbiAgICBpZiAodGhpcy5hbmdsZSA9PT0gYikgcmV0dXJuO1xuICAgIHRoaXMuYW5nbGUgPSBiO1xuXG4gICAgLy8gMngyIG1hdHJpeCBmb3Igcm90YXRpbmcgcG9pbnRzXG4gICAgdGhpcy5yb3RhdGlvbk1hdHJpeCA9IG1hdDIuY3JlYXRlKCk7XG4gICAgbWF0Mi5yb3RhdGUodGhpcy5yb3RhdGlvbk1hdHJpeCwgdGhpcy5yb3RhdGlvbk1hdHJpeCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuICBnZXQgcGl0Y2goKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BpdGNoIC8gTWF0aC5QSSAqIDE4MDtcbiAgfVxuICBzZXQgcGl0Y2gocGl0Y2gpIHtcbiAgICBjb25zdCBwID0gTWF0aC5taW4oNjAsIHBpdGNoKSAvIDE4MCAqIE1hdGguUEk7XG4gICAgaWYgKHRoaXMuX3BpdGNoID09PSBwKSByZXR1cm47XG4gICAgdGhpcy5fcGl0Y2ggPSBwO1xuICB9XG5cbiAgZ2V0IGFsdGl0dWRlKCkge1xuICAgIHJldHVybiB0aGlzLl9hbHRpdHVkZTtcbiAgfVxuICBzZXQgYWx0aXR1ZGUoYWx0aXR1ZGUpIHtcbiAgICBjb25zdCBhID0gTWF0aC5tYXgoMC43NSwgYWx0aXR1ZGUpO1xuICAgIGlmICh0aGlzLl9hbHRpdHVkZSA9PT0gYSkgcmV0dXJuO1xuICAgIHRoaXMuX2FsdGl0dWRlID0gYTtcbiAgfVxuXG4gIGdldCB6b29tKCkgeyByZXR1cm4gdGhpcy5fem9vbTsgfVxuICBzZXQgem9vbSh6b29tKSB7XG4gICAgY29uc3QgeiA9IHpvb207XG4gICAgaWYgKHRoaXMuX3pvb20gPT09IHopIHJldHVybjtcbiAgICB0aGlzLl96b29tID0gejtcbiAgICB0aGlzLnNjYWxlID0gdGhpcy56b29tU2NhbGUoeik7XG4gICAgdGhpcy50aWxlWm9vbSA9IE1hdGguZmxvb3Ioeik7XG4gICAgdGhpcy56b29tRnJhY3Rpb24gPSB6IC0gdGhpcy50aWxlWm9vbTtcbiAgfVxuXG4gIGdldCBjZW50ZXIoKSB7IHJldHVybiB0aGlzLl9jZW50ZXI7IH1cbiAgc2V0IGNlbnRlcihjZW50ZXIpIHtcbiAgICBpZiAoY2VudGVyLmxhdCA9PT0gdGhpcy5fY2VudGVyLmxhdCAmJiBjZW50ZXIubG5nID09PSB0aGlzLl9jZW50ZXIubG5nKSByZXR1cm47XG4gICAgdGhpcy5fY2VudGVyID0gY2VudGVyO1xuICB9XG5cbiAgem9vbVNjYWxlKHpvb20pIHsgcmV0dXJuIE1hdGgucG93KDIsIHpvb20pOyB9XG5cbiAgZ2V0IHgoKSB7IHJldHVybiB0aGlzLmxuZ1godGhpcy5jZW50ZXIubG5nKTsgfVxuICBnZXQgeSgpIHsgcmV0dXJuIHRoaXMubGF0WSh0aGlzLmNlbnRlci5sYXQpOyB9XG5cbiAgLyoqXG4gICAqIGxhdGl0dWRlIHRvIGFic29sdXRlIHggY29vcmRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGxvblxuICAgKiBAcGFyYW0ge251bWJlcn0gW3dvcmxkU2l6ZT10aGlzLndvcmxkU2l6ZV1cbiAgICogQHJldHVybnMge251bWJlcn0gcGl4ZWwgY29vcmRpbmF0ZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgbG5nWChsbmcsIHdvcmxkU2l6ZSkge1xuICAgIHJldHVybiAoMTgwICsgbG5nKSAqICh3b3JsZFNpemUgfHwgdGhpcy53b3JsZFNpemUpIC8gMzYwO1xuICB9XG4gIC8qKlxuICAgKiBsYXRpdHVkZSB0byBhYnNvbHV0ZSB5IGNvb3JkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBsYXRcbiAgICogQHBhcmFtIHtudW1iZXJ9IFt3b3JsZFNpemU9dGhpcy53b3JsZFNpemVdXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IHBpeGVsIGNvb3JkaW5hdGVcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGxhdFkobGF0LCB3b3JsZFNpemUpIHtcbiAgICBjb25zdCB5ID0gMTgwIC8gTWF0aC5QSSAqIE1hdGgubG9nKE1hdGgudGFuKE1hdGguUEkgLyA0ICsgbGF0ICogTWF0aC5QSSAvIDM2MCkpO1xuICAgIHJldHVybiAoMTgwIC0geSkgKiAod29ybGRTaXplIHx8IHRoaXMud29ybGRTaXplKSAvIDM2MDtcbiAgfVxuXG4gIF9jYWxjUHJvak1hdHJpeCgpIHtcbiAgICBjb25zdCBtID0gbmV3IEZsb2F0MzJBcnJheSgxNik7XG5cbiAgICAvLyBGaW5kIHRoZSBkaXN0YW5jZSBmcm9tIHRoZSBjZW50ZXIgcG9pbnQgdG8gdGhlIGNlbnRlciB0b3AgaW4gYWx0aXR1ZGUgdW5pdHMgdXNpbmcgbGF3IG9mIHNpbmVzLlxuICAgIGNvbnN0IGhhbGZGb3YgPSBNYXRoLmF0YW4oMC41IC8gdGhpcy5hbHRpdHVkZSk7XG4gICAgY29uc3QgdG9wSGFsZlN1cmZhY2VEaXN0YW5jZSA9IE1hdGguc2luKGhhbGZGb3YpICogdGhpcy5hbHRpdHVkZSAvIE1hdGguc2luKE1hdGguUEkgLyAyIC0gdGhpcy5fcGl0Y2ggLSBoYWxmRm92KTtcblxuICAgIC8vIENhbGN1bGF0ZSB6IHZhbHVlIG9mIHRoZSBmYXJ0aGVzdCBmcmFnbWVudCB0aGF0IHNob3VsZCBiZSByZW5kZXJlZC5cbiAgICBjb25zdCBmYXJaID0gTWF0aC5jb3MoTWF0aC5QSSAvIDIgLSB0aGlzLl9waXRjaCkgKiB0b3BIYWxmU3VyZmFjZURpc3RhbmNlICsgdGhpcy5hbHRpdHVkZTtcblxuICAgIG1hdDQucGVyc3BlY3RpdmUobSwgMiAqIE1hdGguYXRhbigodGhpcy5oZWlnaHQgLyAyKSAvIHRoaXMuYWx0aXR1ZGUpLCB0aGlzLndpZHRoIC8gdGhpcy5oZWlnaHQsIDAuMSwgZmFyWik7XG5cbiAgICBtYXQ0LnRyYW5zbGF0ZShtLCBtLCBbMCwgMCwgLXRoaXMuYWx0aXR1ZGVdKTtcblxuICAgIC8vIEFmdGVyIHRoZSByb3RhdGVYLCB6IHZhbHVlcyBhcmUgaW4gcGl4ZWwgdW5pdHMuIENvbnZlcnQgdGhlbSB0b1xuICAgIC8vIGFsdGl0dWRlIHVuaXRzLiAxIGFsdGl0dWRlIHVuaXQgPSB0aGUgc2NyZWVuIGhlaWdodC5cbiAgICBtYXQ0LnNjYWxlKG0sIG0sIFsxLCAtMSwgMSAvIHRoaXMuaGVpZ2h0XSk7XG5cbiAgICBtYXQ0LnJvdGF0ZVgobSwgbSwgdGhpcy5fcGl0Y2gpO1xuICAgIG1hdDQucm90YXRlWihtLCBtLCB0aGlzLmFuZ2xlKTtcbiAgICBtYXQ0LnRyYW5zbGF0ZShtLCBtLCBbLXRoaXMueCwgLXRoaXMueSwgMF0pO1xuXG4gICAgdGhpcy5wcm9qTWF0cml4ID0gbTtcbiAgfVxuXG59XG4iXX0=