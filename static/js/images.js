/* global variables */
var imageLayout;                    

/* create the layout */
function initImageLayout () {
    console.log("laying out images");
}

/* load data file */
function loadData () {
    $.getJSON(path_to_data, function(data) {

        var featureCollection = data['results'];
        if(feature_type === "image" || feature_type === "sighting") {
            //layout images
        } else {
            console.log("no images for this feature");
        }
        console.log("feature_type: " + feature_type);
        console.log("path_to_data: " + path_to_data);
        console.log(featureCollection);
    }).error(function(e) { console.log("Failed to load " + path_to_data + ": " + e.statusText); });    
}


/* executes on load */
$(document).ready(function() {
    loadData();
    initImageLayout();
});

