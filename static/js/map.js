/* global variables */
var map;                     // the map object
var center;
var featureGroup;

/* create the map */
function initMap () {
    //console.log("center: " + center);
    map = new L.map('map', {
        layers: new L.TileLayer("http://a.tiles.mapbox.com/v3/" + mapbox_username + ".map-" + mapbox_map_id + "/{z}/{x}/{y}.png"),
        center: new L.LatLng(-19.003049, 22.414856), //was -17.003049, 20.414856; Menongue is -14.645009, 17.674752
        //center: center,
        zoomControl: true,
        attributionControl: false,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        boxZoom: true,
        touchZoom: false,
        dragging: true,
        keyboard: true,
        zoom: 7,
        minZoom: 1,                    
        maxZoom: 20
    });    

    zoomLevel = map.getZoom();
    //console.log("zoom level: " + zoomLevel); 
}

function initMapLabels(map) {
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
        unbindLabel: function() {
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

var geojsonMarkerOptions = {
    radius: 5,
    fillColor: "#4BFF87",
    color: "#fff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8
};

/* load data file */
function loadData () {

    //console.log("loadData");
    try {
        //console.log(path_to_data);

        initMap();

        var url = "http://data.intotheokavango.org" + path_to_data;
        //console.log(url);
        $.getJSON(url, function(data) {
            var featureCollection = data['results'];
            //console.log(featureCollection);
            var sightingsWithGeoLoc = [];
            
            for (d in featureCollection.features) {
                var item = featureCollection.features[d];
                if(item.geometry === null) {
                    //console.log("sighting has no geometry");
                } else {
                    //console.log("sighting with geometry");
                    sightingsWithGeoLoc.push(item);
                }
            }
            //console.log(sightingsWithGeoLoc);
            filteredFeatureCollection = {};
            filteredFeatureCollection.features = sightingsWithGeoLoc;
            filteredFeatureCollection.type = "FeatureCollection";

            featureGroup = L.geoJson(filteredFeatureCollection, {
                pointToLayer: function (feature, latlng) {
                    if (!feature.properties.SpeciesName) {
                        var name = feature.properties.FeatureType;
                    } else {
                        var name = feature.properties.SpeciesName;
                    } 
                    var timestamp = feature.properties.t_utc;
                    var marker = L.circleMarker(latlng, geojsonMarkerOptions);
                    var coords = feature.geometry.coordinates;
                    return marker;
                },
                onEachFeature: function (feature, layer) {
                    if (!feature.properties.SpeciesName) {
                        var name = feature.properties.FeatureType;
                        layer.bindPopup("<h3>" + name + "</h3><p>" + feature['properties']['DateTime'] + "</p>");
                    } else {
                        var name = feature.properties.SpeciesName;
                        var count = feature.properties.Count;
                        layer.bindPopup("<h3>" + name + "</h3><p>" + "Count: " + count + "</p><p>" + feature['properties']['DateTime'] + "</p>");
                    } 
                    
                }
            }).addTo(map);
            L.control.scale().addTo(map);
            map.fitBounds(featureGroup.getBounds());
            initMapLabels(map);
        }).error(function(e) { console.log("Failed to load " + path_to_data + ": " + e.statusText); });  
    } 
    catch (e) {
        // console.log(e);
        // console.log("no path_to_data");
    }
}


/* executes on load */
$(document).ready(function() {
    //console.log("LOADING MAP");
    loadData();
    //initMap();
});