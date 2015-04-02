

console.log('hello world');


/* global variables */
var map;                     // the map object

/* create the map */
function initMap () {
    map = new L.map('map', {
        layers: new L.TileLayer("http://a.tiles.mapbox.com/v3/" + mapbox_username + ".map-" + mapbox_map_id + "/{z}/{x}/{y}.png"),
        center: new L.LatLng(-19.003049, 22.414856),
        zoomControl: false,
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

/* executes on load */
$(document).ready(function() {
    initMap();
});

