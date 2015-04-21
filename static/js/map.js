/* global variables */
var map;                     // the map object

/* create the map */
function initMap () {
    map = new L.map('map', {
        layers: new L.TileLayer("http://a.tiles.mapbox.com/v3/" + mapbox_username + ".map-" + mapbox_map_id + "/{z}/{x}/{y}.png"),
        center: new L.LatLng(-19.003049, 22.414856),
        zoomControl: true,
        attributionControl: false,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        boxZoom: true,
        touchZoom: false,
        dragging: true,
        keyboard: true,
        zoom: 10,
        minZoom: 1,                    
        maxZoom: 20
    });     
}

var geojsonMarkerOptions = {
    radius: 5,
    fillColor: "#ff7800",
    color: "#000",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8
};

/* load data file */
function loadData () {
    $.getJSON(path_to_data, function(data) {
        var featureCollection = data['results'];
        L.geoJson(featureCollection, {
            pointToLayer: function (feature, latlng) {
               return L.circleMarker(latlng, geojsonMarkerOptions);
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(feature['properties']['FeatureType'] + "<br />" + feature['properties']['DateTime'] + "<br />" + feature['properties']['t_utc']);
            }
        }).addTo(map);
    }).error(function(e) { console.log("Failed to load " + path_to_data + ": " + e.statusText); });    
}


/* executes on load */
$(document).ready(function() {
    loadData();
    initMap();
});

