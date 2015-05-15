/* global variables */
var imageLayout;                    

/* create the layout */
function initImageLayout () {
    console.log("laying out images");
}

/* load data file */
function loadData () {
    $.getJSON(path_to_data, function(data) {

        var properties = data.results.features;
        console.log("feature_type: " + feature_type);
        console.log("path_to_data: " + path_to_data);
        console.log(properties);

        if(feature_type === "sighting") {

            for (d in data.results.features) {
                var item = data.results.features[d];
                var images = item["properties"]["Images"];

                for (i in images) {
                    var image = images[i];
                    var imageUrl = image.Url;
                    console.log("image Url: " + imageUrl);
                    $("#images").append("<image class='image' src='" + imageUrl + "'/>");
                }
            }
            //layout images

        } else if (feature_type === "image") {

            for (d in data.results.features) {
                var item = data.results.features[d];
                var imageUrl = item["properties"]["Url"];
                console.log("image Url: " + imageUrl);
                $("#images").append("<image class='image' src='" + imageUrl + "'/>");
            }

        } else {
            console.log("no images for this feature");
        }

    }).error(function(e) { console.log("Failed to load " + path_to_data + ": " + e.statusText); });    
}


/* executes on load */
$(document).ready(function() {
    loadData();
    initImageLayout();
});

