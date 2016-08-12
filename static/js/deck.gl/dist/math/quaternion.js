'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getQuaternion = getQuaternion;

var _glMatrix = require('gl-matrix');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getQuaternion(quaternion) {
  return quaternion.quat ? quaternion.quat : quaternion;
}

var Quaternion = function () {
  function Quaternion(glquat) {
    _classCallCheck(this, Quaternion);

    this.quat = glquat || new _glMatrix.quat();
  }

  // // Creates a new quat initialized with values from an existing quaternion
  // (static) clone(a) → {quat}

  // // Copy the values from one quat to another
  // (static) copy(out, a) → {quat}

  // // Creates a new identity quat
  // (static) create() → {quat}

  // // Set a quat to the identity quaternion
  // (static) identity(out) → {quat}

  _createClass(Quaternion, [{
    key: 'toString',
    value: function toString() {
      return _glMatrix.quat.str(this.quat);
    }
  }, {
    key: 'toArray',
    value: function toArray() {
      return this.quat;
    }
  }, {
    key: 'toFloat32Array',
    value: function toFloat32Array() {
      return this.quat;
    }
  }, {
    key: 'equals',
    value: function equals(quaternion) {
      return _glMatrix.quat.equals(this.quat, quaternion);
    }

    // Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)

  }, {
    key: 'exactEquals',
    value: function exactEquals(quaternion) {
      return _glMatrix.quat.exactEquals(this.quat, quaternion);
    }

    // Getters/setters

  }, {
    key: 'len',


    // Alias for quat.length
    value: function len() {
      return _glMatrix.quat.len(this.quat);
    }

    // Calculates the length of a quat

  }, {
    key: 'length',
    value: function length() {
      return _glMatrix.quat.length(this.quat);
    }

    // Calculates the squared length of a quat

  }, {
    key: 'squaredLength',
    value: function squaredLength(a) {}
    // Number


    // Alias for quat.squaredLength

  }, {
    key: 'sqrLen',
    value: function sqrLen() {}
    // Number


    // Sets a quaternion to represent the shortest rotation from one vector to another. Both vectors are assumed to be unit length.

  }, {
    key: 'rotationTo',
    value: function rotationTo(vectorA, vectorB) {
      _glMatrix.quat.rotationTo(this.quat, vectorA, vectorB);
    }

    // Sets the specified quaternion with values corresponding to the given axes. Each axis is a vec3 and is expected to be unit length and perpendicular to all other specified axes.

  }, {
    key: 'setAxes',
    value: function setAxes() {
      Number;
    }

    // Performs a spherical linear interpolation with two control points

  }, {
    key: 'sqlerp',
    value: function sqlerp() {
      Number;
    }

    // // Adds two quat's
    // add(a, b) → {quat}

    // // Calculates the W component of a quat from the X, Y, and Z components. Assumes that quaternion is 1 unit in length. Any existing W component will be ignored.
    // calculateW(out, a) → {quat}

    // // Calculates the conjugate of a quat If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
    // (static) conjugate(out, a) → {quat}

    // // Calculates the dot product of two quat's
    // (static) dot(a, b) → {Number}

    // // Creates a quaternion from the given 3x3 rotation matrix. NOTE: The resultant quaternion is not normalized, so you should be sure to renormalize the quaternion yourself where necessary.
    // (static) fromMat3(out, m) → {quat}

    // // Creates a new quat initialized with the given values
    // (static) fromValues(x, y, z, w) → {quat}

    // // Gets the rotation axis and angle for a given quaternion. If a quaternion is created with setAxisAngle, this method will return the same values as providied in the original parameter list OR functionally equivalent values. Example: The quaternion formed by axis [0, 0, 1] and angle -90 is the same as the quaternion formed by [0, 0, 1] and 270. This method favors the latter.
    // (static) getAxisAngle(out_axis, q) → {Number}

    // // Calculates the inverse of a quat
    // (static) invert(out, a) → {quat}

    // // Performs a linear interpolation between two quat's
    // (static) lerp(out, a, b, t) → {quat}

    // // Alias for quat.multiply
    // (static) mul()

    // // Multiplies two quat's
    // (static) multiply(out, a, b) → {quat}

    // // Normalize a quat
    // (static) normalize(out, a) → {quat}

    // // Rotates a quaternion by the given angle about the X axis
    // (static) rotateX(out, a, rad) → {quat}

    // // Rotates a quaternion by the given angle about the Y axis
    // (static) rotateY(out, a, rad) → {quat}

    // // Rotates a quaternion by the given angle about the Z axis
    // (static) rotateZ(out, a, rad) → {quat}

    // // Scales a quat by a scalar number
    // (static) scale(out, a, b) → {quat}

    // // Set the components of a quat to the given values
    // (static) set(out, x, y, z, w) → {quat}

    // // Sets a quat from the given angle and rotation axis, then returns it.
    // (static) setAxisAngle(out, axis, rad) → {quat}

    // // Performs a spherical linear interpolation between two quat
    // (static) slerp(out, a, b, t) → {quat}

  }, {
    key: 'x',
    get: function get() {
      return this.quat[0];
    },
    set: function set(value) {
      this.quat[0] = value;
      return this;
    }
  }, {
    key: 'y',
    get: function get() {
      return this.quat[1];
    },
    set: function set(value) {
      this.quat[1] = value;
      return this;
    }
  }, {
    key: 'z',
    get: function get() {
      return this.quat[2];
    },
    set: function set(value) {
      this.quat[2] = value;
      return this;
    }
  }, {
    key: 'w',
    get: function get() {
      return this.quat[2];
    },
    set: function set(value) {
      this.quat[2] = value;
      return this;
    }
  }]);

  return Quaternion;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYXRoL3F1YXRlcm5pb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7UUFFZ0IsYSxHQUFBLGE7O0FBRmhCOzs7O0FBRU8sU0FBUyxhQUFULENBQXVCLFVBQXZCLEVBQW1DO0FBQ3hDLFNBQU8sV0FBVyxJQUFYLEdBQWtCLFdBQVcsSUFBN0IsR0FBb0MsVUFBM0M7QUFDRDs7SUFFSyxVO0FBRUosc0JBQVksTUFBWixFQUFvQjtBQUFBOztBQUNsQixTQUFLLElBQUwsR0FBWSxVQUFVLG9CQUF0QjtBQUNEOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7K0JBRVc7QUFDVCxhQUFPLGVBQUssR0FBTCxDQUFTLEtBQUssSUFBZCxDQUFQO0FBQ0Q7Ozs4QkFFUztBQUNSLGFBQU8sS0FBSyxJQUFaO0FBQ0Q7OztxQ0FFZ0I7QUFDZixhQUFPLEtBQUssSUFBWjtBQUNEOzs7MkJBRU0sVSxFQUFZO0FBQ2pCLGFBQU8sZUFBSyxNQUFMLENBQVksS0FBSyxJQUFqQixFQUF1QixVQUF2QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Z0NBQ1ksVSxFQUFZO0FBQ3RCLGFBQU8sZUFBSyxXQUFMLENBQWlCLEtBQUssSUFBdEIsRUFBNEIsVUFBNUIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7QUFxQ0E7MEJBQ007QUFDSixhQUFPLGVBQUssR0FBTCxDQUFTLEtBQUssSUFBZCxDQUFQO0FBQ0Q7O0FBRUQ7Ozs7NkJBQ1M7QUFDUCxhQUFPLGVBQUssTUFBTCxDQUFZLEtBQUssSUFBakIsQ0FBUDtBQUNEOztBQUVEOzs7O2tDQUNjLEMsRUFBRyxDQUVoQjtBQURDOzs7QUFHRjs7Ozs2QkFDUyxDQUVSO0FBREM7OztBQUdGOzs7OytCQUNXLE8sRUFBUyxPLEVBQVM7QUFDM0IscUJBQUssVUFBTCxDQUFnQixLQUFLLElBQXJCLEVBQTJCLE9BQTNCLEVBQW9DLE9BQXBDO0FBQ0Q7O0FBRUQ7Ozs7OEJBQ1U7QUFDUjtBQUNEOztBQUVEOzs7OzZCQUNTO0FBQ1A7QUFDRDs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7O3dCQTlIUTtBQUNOLGFBQU8sS0FBSyxJQUFMLENBQVUsQ0FBVixDQUFQO0FBQ0QsSztzQkFFSyxLLEVBQU87QUFDWCxXQUFLLElBQUwsQ0FBVSxDQUFWLElBQWUsS0FBZjtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7d0JBRU87QUFDTixhQUFPLEtBQUssSUFBTCxDQUFVLENBQVYsQ0FBUDtBQUNELEs7c0JBRUssSyxFQUFPO0FBQ1gsV0FBSyxJQUFMLENBQVUsQ0FBVixJQUFlLEtBQWY7QUFDQSxhQUFPLElBQVA7QUFDRDs7O3dCQUVPO0FBQ04sYUFBTyxLQUFLLElBQUwsQ0FBVSxDQUFWLENBQVA7QUFDRCxLO3NCQUVLLEssRUFBTztBQUNYLFdBQUssSUFBTCxDQUFVLENBQVYsSUFBZSxLQUFmO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7Ozt3QkFFTztBQUNOLGFBQU8sS0FBSyxJQUFMLENBQVUsQ0FBVixDQUFQO0FBQ0QsSztzQkFFSyxLLEVBQU87QUFDWCxXQUFLLElBQUwsQ0FBVSxDQUFWLElBQWUsS0FBZjtBQUNBLGFBQU8sSUFBUDtBQUNEIiwiZmlsZSI6InF1YXRlcm5pb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3F1YXR9IGZyb20gJ2dsLW1hdHJpeCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRRdWF0ZXJuaW9uKHF1YXRlcm5pb24pIHtcbiAgcmV0dXJuIHF1YXRlcm5pb24ucXVhdCA/IHF1YXRlcm5pb24ucXVhdCA6IHF1YXRlcm5pb247XG59XG5cbmNsYXNzIFF1YXRlcm5pb24ge1xuXG4gIGNvbnN0cnVjdG9yKGdscXVhdCkge1xuICAgIHRoaXMucXVhdCA9IGdscXVhdCB8fCBuZXcgcXVhdCgpO1xuICB9XG5cbiAgLy8gLy8gQ3JlYXRlcyBhIG5ldyBxdWF0IGluaXRpYWxpemVkIHdpdGggdmFsdWVzIGZyb20gYW4gZXhpc3RpbmcgcXVhdGVybmlvblxuICAvLyAoc3RhdGljKSBjbG9uZShhKSDihpIge3F1YXR9XG5cbiAgLy8gLy8gQ29weSB0aGUgdmFsdWVzIGZyb20gb25lIHF1YXQgdG8gYW5vdGhlclxuICAvLyAoc3RhdGljKSBjb3B5KG91dCwgYSkg4oaSIHtxdWF0fVxuXG4gIC8vIC8vIENyZWF0ZXMgYSBuZXcgaWRlbnRpdHkgcXVhdFxuICAvLyAoc3RhdGljKSBjcmVhdGUoKSDihpIge3F1YXR9XG5cbiAgLy8gLy8gU2V0IGEgcXVhdCB0byB0aGUgaWRlbnRpdHkgcXVhdGVybmlvblxuICAvLyAoc3RhdGljKSBpZGVudGl0eShvdXQpIOKGkiB7cXVhdH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gcXVhdC5zdHIodGhpcy5xdWF0KTtcbiAgfVxuXG4gIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMucXVhdDtcbiAgfVxuXG4gIHRvRmxvYXQzMkFycmF5KCkge1xuICAgIHJldHVybiB0aGlzLnF1YXQ7XG4gIH1cblxuICBlcXVhbHMocXVhdGVybmlvbikge1xuICAgIHJldHVybiBxdWF0LmVxdWFscyh0aGlzLnF1YXQsIHF1YXRlcm5pb24pO1xuICB9XG5cbiAgLy8gUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgcXVhdGVybmlvbnMgaGF2ZSBleGFjdGx5IHRoZSBzYW1lIGVsZW1lbnRzIGluIHRoZSBzYW1lIHBvc2l0aW9uICh3aGVuIGNvbXBhcmVkIHdpdGggPT09KVxuICBleGFjdEVxdWFscyhxdWF0ZXJuaW9uKSB7XG4gICAgcmV0dXJuIHF1YXQuZXhhY3RFcXVhbHModGhpcy5xdWF0LCBxdWF0ZXJuaW9uKTtcbiAgfVxuXG4gIC8vIEdldHRlcnMvc2V0dGVyc1xuICBnZXQgeCgpIHtcbiAgICByZXR1cm4gdGhpcy5xdWF0WzBdO1xuICB9XG5cbiAgc2V0IHgodmFsdWUpIHtcbiAgICB0aGlzLnF1YXRbMF0gPSB2YWx1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGdldCB5KCkge1xuICAgIHJldHVybiB0aGlzLnF1YXRbMV07XG4gIH1cblxuICBzZXQgeSh2YWx1ZSkge1xuICAgIHRoaXMucXVhdFsxXSA9IHZhbHVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZ2V0IHooKSB7XG4gICAgcmV0dXJuIHRoaXMucXVhdFsyXTtcbiAgfVxuXG4gIHNldCB6KHZhbHVlKSB7XG4gICAgdGhpcy5xdWF0WzJdID0gdmFsdWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBnZXQgdygpIHtcbiAgICByZXR1cm4gdGhpcy5xdWF0WzJdO1xuICB9XG5cbiAgc2V0IHcodmFsdWUpIHtcbiAgICB0aGlzLnF1YXRbMl0gPSB2YWx1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIEFsaWFzIGZvciBxdWF0Lmxlbmd0aFxuICBsZW4oKSB7XG4gICAgcmV0dXJuIHF1YXQubGVuKHRoaXMucXVhdCk7XG4gIH1cblxuICAvLyBDYWxjdWxhdGVzIHRoZSBsZW5ndGggb2YgYSBxdWF0XG4gIGxlbmd0aCgpIHtcbiAgICByZXR1cm4gcXVhdC5sZW5ndGgodGhpcy5xdWF0KTtcbiAgfVxuXG4gIC8vIENhbGN1bGF0ZXMgdGhlIHNxdWFyZWQgbGVuZ3RoIG9mIGEgcXVhdFxuICBzcXVhcmVkTGVuZ3RoKGEpIHtcbiAgICAvLyBOdW1iZXJcbiAgfVxuXG4gIC8vIEFsaWFzIGZvciBxdWF0LnNxdWFyZWRMZW5ndGhcbiAgc3FyTGVuKCkge1xuICAgIC8vIE51bWJlclxuICB9XG5cbiAgLy8gU2V0cyBhIHF1YXRlcm5pb24gdG8gcmVwcmVzZW50IHRoZSBzaG9ydGVzdCByb3RhdGlvbiBmcm9tIG9uZSB2ZWN0b3IgdG8gYW5vdGhlci4gQm90aCB2ZWN0b3JzIGFyZSBhc3N1bWVkIHRvIGJlIHVuaXQgbGVuZ3RoLlxuICByb3RhdGlvblRvKHZlY3RvckEsIHZlY3RvckIpIHtcbiAgICBxdWF0LnJvdGF0aW9uVG8odGhpcy5xdWF0LCB2ZWN0b3JBLCB2ZWN0b3JCKTtcbiAgfVxuXG4gIC8vIFNldHMgdGhlIHNwZWNpZmllZCBxdWF0ZXJuaW9uIHdpdGggdmFsdWVzIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuIGF4ZXMuIEVhY2ggYXhpcyBpcyBhIHZlYzMgYW5kIGlzIGV4cGVjdGVkIHRvIGJlIHVuaXQgbGVuZ3RoIGFuZCBwZXJwZW5kaWN1bGFyIHRvIGFsbCBvdGhlciBzcGVjaWZpZWQgYXhlcy5cbiAgc2V0QXhlcygpIHtcbiAgICBOdW1iZXJcbiAgfVxuXG4gIC8vIFBlcmZvcm1zIGEgc3BoZXJpY2FsIGxpbmVhciBpbnRlcnBvbGF0aW9uIHdpdGggdHdvIGNvbnRyb2wgcG9pbnRzXG4gIHNxbGVycCgpIHtcbiAgICBOdW1iZXI7XG4gIH1cblxuICAvLyAvLyBBZGRzIHR3byBxdWF0J3NcbiAgLy8gYWRkKGEsIGIpIOKGkiB7cXVhdH1cblxuICAvLyAvLyBDYWxjdWxhdGVzIHRoZSBXIGNvbXBvbmVudCBvZiBhIHF1YXQgZnJvbSB0aGUgWCwgWSwgYW5kIFogY29tcG9uZW50cy4gQXNzdW1lcyB0aGF0IHF1YXRlcm5pb24gaXMgMSB1bml0IGluIGxlbmd0aC4gQW55IGV4aXN0aW5nIFcgY29tcG9uZW50IHdpbGwgYmUgaWdub3JlZC5cbiAgLy8gY2FsY3VsYXRlVyhvdXQsIGEpIOKGkiB7cXVhdH1cblxuICAvLyAvLyBDYWxjdWxhdGVzIHRoZSBjb25qdWdhdGUgb2YgYSBxdWF0IElmIHRoZSBxdWF0ZXJuaW9uIGlzIG5vcm1hbGl6ZWQsIHRoaXMgZnVuY3Rpb24gaXMgZmFzdGVyIHRoYW4gcXVhdC5pbnZlcnNlIGFuZCBwcm9kdWNlcyB0aGUgc2FtZSByZXN1bHQuXG4gIC8vIChzdGF0aWMpIGNvbmp1Z2F0ZShvdXQsIGEpIOKGkiB7cXVhdH1cblxuICAvLyAvLyBDYWxjdWxhdGVzIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gcXVhdCdzXG4gIC8vIChzdGF0aWMpIGRvdChhLCBiKSDihpIge051bWJlcn1cblxuICAvLyAvLyBDcmVhdGVzIGEgcXVhdGVybmlvbiBmcm9tIHRoZSBnaXZlbiAzeDMgcm90YXRpb24gbWF0cml4LiBOT1RFOiBUaGUgcmVzdWx0YW50IHF1YXRlcm5pb24gaXMgbm90IG5vcm1hbGl6ZWQsIHNvIHlvdSBzaG91bGQgYmUgc3VyZSB0byByZW5vcm1hbGl6ZSB0aGUgcXVhdGVybmlvbiB5b3Vyc2VsZiB3aGVyZSBuZWNlc3NhcnkuXG4gIC8vIChzdGF0aWMpIGZyb21NYXQzKG91dCwgbSkg4oaSIHtxdWF0fVxuXG4gIC8vIC8vIENyZWF0ZXMgYSBuZXcgcXVhdCBpbml0aWFsaXplZCB3aXRoIHRoZSBnaXZlbiB2YWx1ZXNcbiAgLy8gKHN0YXRpYykgZnJvbVZhbHVlcyh4LCB5LCB6LCB3KSDihpIge3F1YXR9XG5cbiAgLy8gLy8gR2V0cyB0aGUgcm90YXRpb24gYXhpcyBhbmQgYW5nbGUgZm9yIGEgZ2l2ZW4gcXVhdGVybmlvbi4gSWYgYSBxdWF0ZXJuaW9uIGlzIGNyZWF0ZWQgd2l0aCBzZXRBeGlzQW5nbGUsIHRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIHRoZSBzYW1lIHZhbHVlcyBhcyBwcm92aWRpZWQgaW4gdGhlIG9yaWdpbmFsIHBhcmFtZXRlciBsaXN0IE9SIGZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHZhbHVlcy4gRXhhbXBsZTogVGhlIHF1YXRlcm5pb24gZm9ybWVkIGJ5IGF4aXMgWzAsIDAsIDFdIGFuZCBhbmdsZSAtOTAgaXMgdGhlIHNhbWUgYXMgdGhlIHF1YXRlcm5pb24gZm9ybWVkIGJ5IFswLCAwLCAxXSBhbmQgMjcwLiBUaGlzIG1ldGhvZCBmYXZvcnMgdGhlIGxhdHRlci5cbiAgLy8gKHN0YXRpYykgZ2V0QXhpc0FuZ2xlKG91dF9heGlzLCBxKSDihpIge051bWJlcn1cblxuICAvLyAvLyBDYWxjdWxhdGVzIHRoZSBpbnZlcnNlIG9mIGEgcXVhdFxuICAvLyAoc3RhdGljKSBpbnZlcnQob3V0LCBhKSDihpIge3F1YXR9XG5cbiAgLy8gLy8gUGVyZm9ybXMgYSBsaW5lYXIgaW50ZXJwb2xhdGlvbiBiZXR3ZWVuIHR3byBxdWF0J3NcbiAgLy8gKHN0YXRpYykgbGVycChvdXQsIGEsIGIsIHQpIOKGkiB7cXVhdH1cblxuICAvLyAvLyBBbGlhcyBmb3IgcXVhdC5tdWx0aXBseVxuICAvLyAoc3RhdGljKSBtdWwoKVxuXG4gIC8vIC8vIE11bHRpcGxpZXMgdHdvIHF1YXQnc1xuICAvLyAoc3RhdGljKSBtdWx0aXBseShvdXQsIGEsIGIpIOKGkiB7cXVhdH1cblxuICAvLyAvLyBOb3JtYWxpemUgYSBxdWF0XG4gIC8vIChzdGF0aWMpIG5vcm1hbGl6ZShvdXQsIGEpIOKGkiB7cXVhdH1cblxuICAvLyAvLyBSb3RhdGVzIGEgcXVhdGVybmlvbiBieSB0aGUgZ2l2ZW4gYW5nbGUgYWJvdXQgdGhlIFggYXhpc1xuICAvLyAoc3RhdGljKSByb3RhdGVYKG91dCwgYSwgcmFkKSDihpIge3F1YXR9XG5cbiAgLy8gLy8gUm90YXRlcyBhIHF1YXRlcm5pb24gYnkgdGhlIGdpdmVuIGFuZ2xlIGFib3V0IHRoZSBZIGF4aXNcbiAgLy8gKHN0YXRpYykgcm90YXRlWShvdXQsIGEsIHJhZCkg4oaSIHtxdWF0fVxuXG4gIC8vIC8vIFJvdGF0ZXMgYSBxdWF0ZXJuaW9uIGJ5IHRoZSBnaXZlbiBhbmdsZSBhYm91dCB0aGUgWiBheGlzXG4gIC8vIChzdGF0aWMpIHJvdGF0ZVoob3V0LCBhLCByYWQpIOKGkiB7cXVhdH1cblxuICAvLyAvLyBTY2FsZXMgYSBxdWF0IGJ5IGEgc2NhbGFyIG51bWJlclxuICAvLyAoc3RhdGljKSBzY2FsZShvdXQsIGEsIGIpIOKGkiB7cXVhdH1cblxuICAvLyAvLyBTZXQgdGhlIGNvbXBvbmVudHMgb2YgYSBxdWF0IHRvIHRoZSBnaXZlbiB2YWx1ZXNcbiAgLy8gKHN0YXRpYykgc2V0KG91dCwgeCwgeSwgeiwgdykg4oaSIHtxdWF0fVxuXG4gIC8vIC8vIFNldHMgYSBxdWF0IGZyb20gdGhlIGdpdmVuIGFuZ2xlIGFuZCByb3RhdGlvbiBheGlzLCB0aGVuIHJldHVybnMgaXQuXG4gIC8vIChzdGF0aWMpIHNldEF4aXNBbmdsZShvdXQsIGF4aXMsIHJhZCkg4oaSIHtxdWF0fVxuXG4gIC8vIC8vIFBlcmZvcm1zIGEgc3BoZXJpY2FsIGxpbmVhciBpbnRlcnBvbGF0aW9uIGJldHdlZW4gdHdvIHF1YXRcbiAgLy8gKHN0YXRpYykgc2xlcnAob3V0LCBhLCBiLCB0KSDihpIge3F1YXR9XG59XG4iXX0=