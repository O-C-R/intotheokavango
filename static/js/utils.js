Math.map = function(value, start1, stop1, start2, stop2) {
  return parseFloat(start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1)));
}
Math.constrain = function(value, min, max) {
  return parseFloat(Math.min(Math.max(value,min),max));
}
Math.lerp = function(value, target, ratio) {
  return parseFloat(value + (target-value)*ratio);
}
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

function initMapLabels(map){
	L.CircleMarker.include({
	    bindLabel: function (content, options) {
	        if (!this._label || this._label.options !== options) {
	            this._label = new L.Label(options, this);
	        }
	        if (!this.label || this.label.options !== options) {
	            this.label = new L.Label(options, this);
	        }
	        this._map = map;
	        this.label.setContent(content);
	        this._labelNoHide = options && options.noHide;
	        if (!this._showLabelAdded) {
	            if (this._labelNoHide) {
	                this
	                    .on('remove', this.hideLabel, this)
	                    .on('move', this._moveLabel, this);
	                this._showLabel({latlng: this.getLatLng()});
	            } else {
	                this
	                    .on('mouseover', this._showLabel, this)
	                    .on('mousemove', this._moveLabel, this)
	                    .on('mouseout remove', this._hideLabel, this);
	                if (L.Browser.touch) {
	                    this.on('click', this._showLabel, this);
	                }
	            }
	            this._showLabelAdded = true;
	        }
	        return this;
	    },
	    unbindLabel: function () {
	        if (this._label) {
	            this._hideLabel();
	            this._label = null;
	            this._showLabelAdded = false;
	            if (this._labelNoHide) {
	                this
	                    .off('remove', this._hideLabel, this)
	                    .off('move', this._moveLabel, this);
	            } else {
	                this
	                    .off('mouseover', this._showLabel, this)
	                    .off('mousemove', this._moveLabel, this)
	                    .off('mouseout remove', this._hideLabel, this);
	            }
	        }
	        return this;
	    }
	});
}
