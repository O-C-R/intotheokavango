
window.FEATURES_DATA = [{
    featureType: "ambit",
    total: 13000,
    title: "Ambit Readings"
}, {
    featureType: "ambit_geo",
    total: 2111,
    title: "Ambit-Geo Readings"
}, {
    featureType: "audio",
    total: 57,
    title: "Audio Recordings"
}, {
    featureType: "beacon",
    total: 141,
    title: "Beacon Readings"
}, {
    featureType: "blog",
    total: 4,
    title: "Blog Posts"
},{
    featureType: "image",
    total: 842,
    title: "Images"
}, {
    featureType: "sensor",
    total: 1931,
    title: "Sensor Readings"
}, {
    featureType: "sighting",
    total: 413,
    title: "Sightings"
}, {
    featureType: "tweet",
    total: 264,
    title: "Tweets"
}, ];;// path_to_data = "{{ query }}";
// feature_type = "{{ feature_type }}";

var d3Graph = function(timelineVizID, totalsVizID){
    // if(timelineVizDiv){

    // }
    console.log("divIDs: " + timelineVizID + ", " + totalsVizID);
    var timelineVizDiv = d3.select("timelineVizID");
    var totalsVizDiv = d3.select("totalsVizID");
    console.log("D3 GRAPH");
    console.log(totalsVizDiv);

    $("totalsViz").hide("slow", function() {
        console.log("HIDING totalsVizDiv");
    });
    totalsVizDiv.style("opacity", 0);
   // d3.select(totalsVizDiv).style("opacity", 0);
    // console.log(totalsVizDiv);
    // var public_path = 'http://dev.intotheokavango.org' + path_to_data;
    // console.log(public_path);

    var features = ["ambit","ambit_geo","audio","beacon","image","sensor",'sighting','tweet'];
    var index = 0;    
    var featuresCountArray = [];
    var parsedSpeciesSighting = [];
    var parsedAmbitHR = [];
    var parsedAmbitEnergy = [];
    var parsedAmbitSpeed = [];
    var speciesSightingsTotals = [];
    // var path_to_data = "/api/features?FeatureType=sighting&BirdName=Hippo";

var parseSpeciesSighting = function(item) {
    if(item["properties"].hasOwnProperty("SpeciesName")) {
        var speciesSighting = {};
        speciesSighting.count = item["properties"]["Count"];
        speciesSighting.time = new Date(+item["properties"]["t_utc"] * 1000);
        //console.log(speciesSighting.time + ", " + speciesSighting.count);
        return speciesSighting;
    }
}

var parseAmbitHeartRate = function(item) {
    //parse for heart rate
    var ambitData = {};
    ambitData.heartRate = item["properties"]["HR"] * 60; //convert beats per sec to beats per min
    ambitData.time = new Date(+item["properties"]["t_utc"] * 1000);
    // console.log("HR: " + ambitData.time + ", " + ambitData.heartRate);
    return ambitData;
}

var parseAmbitEnergy = function(item) {
    //parse for energy consumption
    var ambitData = {};
    ambitData.energy = item["properties"]["EnergyConsumption"];
    ambitData.time = new Date(+item["properties"]["t_utc"] * 1000);
    // console.log("Energy: " + ambitData.time + ", " + ambitData.energy);
    return ambitData;
}

var parseAmbitSpeed = function(item) {
    //parse for rate (speed?) by dividing Distance by Time
    var ambitData = {};
    if (item["properties"]["Time"] === 0) {
        ambitData.speed = 0;
    } else {
        ambitData.speed = item["properties"]["Distance"] / item["properties"]["Time"];
    }
    
    ambitData.time = new Date(+item["properties"]["t_utc"] * 1000);
    console.log("Speed: " + ambitData.time + ", " + ambitData.speed);
    return ambitData;
}

var makeHistogramPlot = function(parsedData, feature_type, subTitle) {
    //HISTOGRAM VIZ
    var margin = {top: 70.5, right: 30, bottom: 40, left: 60.5},
    width = ($('body').width())*0.82 - margin.left - margin.right,
    height = 525 - margin.top - margin.bottom,
    left_width = 100;
    console.log("WIDTH: " + width);

    var dateRange = d3.extent(parsedData, function(d) { 
        return d.time; 
    });
    var parseDate = d3.time.format("%m %d").parse;
    var  date_format = d3.time.format("%d %b");
    var xScale = d3.time.scale()
        .range([0, width]);

    var yScale = d3.scale.linear()
        .rangeRound([height, 0]);

    var svg = d3.select("#timelineViz").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "vizContainer")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if (feature_type === "sighting") {
        yAxisLabel = "Count";
        graphTitle = subTitle + " Sightings";

        //var barWidth = width / parsedData.length * 0.75;
        var barWidth = 1;

        xScale.domain(d3.extent(parsedData, function(d) { 
            return d.time; }));

        var max = d3.max(parsedData, function(d) {
            return d.count;
        });
        
        yScale.domain([0, max]);

        xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

        var y_max = yScale.domain().slice(-1)[0];
        
        yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .tickValues(d3.range(y_max +1)) //to get integer y-axis values 
            .tickFormat(d3.format(",.0f"));

        var bar = svg.selectAll("g")
                .data(parsedData)
            .enter().append("g")
                .attr("transform", function(d) { return "translate(" + xScale(d.time) + ",0)"; });

        bar.append("rect")
            .attr("y", function(d) { return yScale(d.count); })
            .attr("class", "rect")
            .attr("height", function(d) { return height - yScale(d.count); })
            .attr("width", barWidth);
    }

    svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

    svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("class", "label")
          // .attr("transform", "rotate(-90)")
          .attr("y", -10)
          .attr("x", -20)
          // .attr("dy", ".71em")
          // .attr("text-align", "right")
          .text(yAxisLabel);

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - 0.8*(margin.top / 2))
        .attr("text-anchor", "middle") 
        .attr("class", "title") 
        .style("font-size", "16px")  
        .text(graphTitle); 

}

var makeTimeSeriesViz = function(parsedData,feature_type) {
    //TIMESERIES VIZ
    var margin = {top: 70.5, right: 30, bottom: 60, left: 40.5},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    left_width = 100;

    var yAxisLabel = "";
    var xAxisLabel = "";
    var graphTitle = "";

    console.log(feature_type);

    var parseDate = d3.time.format("%m %d").parse;

    var xScale = d3.time.scale.utc()
        //.nice(d3.time.week)
        .range([0, width]);

    var yScale = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis();

    var yAxis = d3.svg.axis();

    var svg = d3.select("#timelineViz").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "vizContainer")
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if (feature_type === "ambit") {
        console.log("feature_type is ambit");
        console.log(parsedData);
        for (var i = 0; i < parsedData.length; i++) {
            if (parsedData[i].hasOwnProperty("heartRate")) {
                yAxisLabel = "Beats per Minute";
                graphTitle = "Heart Rate";
                var line = d3.svg.line()
                    .x(function(d) { return xScale(d.time); })
                    .y(function(d) { return yScale(d.heartRate); });

               var dateRange = d3.extent(parsedData, function(d) { 
                    return d.time; 
                });
                console.log("dateRange: " + dateRange);

                xScale.domain(dateRange);
                yScale.domain(d3.extent(parsedData, function(d) { return d.heartRate; }));
                var dateFormat = d3.time.format.utc("%B %d %Y");
                var timeFormat = d3.time.format.utc("%I:%M:%S");
                xAxisLabel = dateFormat(dateRange[0]) + ", " + timeFormat(dateRange[0]) + " - " + timeFormat(dateRange[1]);

            } else if (parsedData[i].hasOwnProperty("energy")) {
                yAxisLabel = "Average Calories Burned";
                graphTitle = "Energy Consumption";
                var line = d3.svg.line()
                    .x(function(d) { return xScale(d.time); })
                    .y(function(d) { return yScale(d.energy); });

                var dateRange = d3.extent(parsedData, function(d) { 
                    return d.time; 
                });
                console.log("dateRange: " + dateRange);

                xScale.domain(dateRange);
                yScale.domain(d3.extent(parsedData, function(d) { return d.energy; }));
                var dateFormat = d3.time.format.utc("%B %d %Y");
                var timeFormat = d3.time.format.utc("%I:%M:%S");
                xAxisLabel = dateFormat(dateRange[0]) + ", " + timeFormat(dateRange[0]) + " - " + timeFormat(dateRange[1]);

            } else if (parsedData[i].hasOwnProperty("speed")) {
                console.log("data has speed key");
                yAxisLabel = "Meters per Second";
                graphTitle = "Speed";
                var line = d3.svg.line()
                    .x(function(d) { return xScale(d.time); })
                    .y(function(d) { return yScale(d.speed); });

                var dateRange = d3.extent(parsedData, function(d) { 
                    return d.time; 
                });
                console.log("dateRange: " + dateRange);

                xScale.domain(dateRange);
                yScale.domain(d3.extent(parsedData, function(d) { return d.speed; }));
                var dateFormat = d3.time.format.utc("%B %d %Y");
                var timeFormat = d3.time.format.utc("%I:%M:%S");
                xAxisLabel = dateFormat(dateRange[0]) + ", " + timeFormat(dateRange[0]) + " - " + timeFormat(dateRange[1]);
            }
        }

        xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");
    }

    svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .append("text")
          .attr("class", "label")
          .attr("y", 40)
          .attr("x", width/2)
          .attr("text-anchor", "middle") 
          .text(xAxisLabel);

    svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("class", "label")
          // .attr("transform", "rotate(-90)")
          .attr("y", -10)
          .attr("x", -20)
          // .attr("text-align", "right")
          // .attr("y", 6)
          // .attr("dy", ".71em")
          .text(yAxisLabel);

    svg.append("path")
          .data([parsedData])
          .attr("class", "line")
          .attr("d", line);

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - 0.8*(margin.top / 2))
        .attr("text-anchor", "middle") 
        .attr("class", "title") 
        .style("font-size", "16px")  
        .text(graphTitle); 

}

var makeTotalsViz = function(data) {
    console.log("MAKE TOTALS VIZ");

    sortArrOfObjectsByParam(data, "total", false);

    var margin = {top: 20.5, right: 30, bottom: 30, left: 40.5},
        width = 800 - margin.left - margin.right,
        barHeight = 20,
        height = barHeight * data.length,
        left_width = 300;

    var xScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.total; })])
        .range([0, width - left_width]);
        console.log(data);
        
    var yScale = d3.scale.ordinal()
        .domain(data, function(d) { 
            return d.type; 
            console.log(d.type); //hmm it doesn't console anything
        })
        .rangeBands([0, height]);
    console.log(yScale.range());
    var svg = d3.select("#totalsViz").append("svg")
        .attr("width", width)
        .attr("height", height);
    
    var bar = svg.selectAll("g")
            .data(data)
        .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

    bar.append("rect")
        .attr("x", left_width)
        .attr("y", yScale)
        .attr("width", function(d) { return xScale(d.total); })
        .attr("height", barHeight - 1);

    bar.append("text")
        .attr("x", function(d) { return xScale(d.total) - 5 + left_width; })
        //.attr("y", function(d) { return yScale(d) + yScale.rangeBand()/2; })
        .attr("y", barHeight / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "beginning")
        .text(function(d) { return d.total; });

    bar.append("text")
        .attr("x", left_width * 0.92)
        //.attr("y", function(d) { return yScale(d) + yScale.rangeBand()/2; })
        .attr("y", barHeight / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.type; });
}

function sortArrOfObjectsByParam(arrToSort, strObjParamToSortBy, sortAscending) {
    if(sortAscending == undefined) sortAscending = true;  // default to true
    
    if(sortAscending) {
        arrToSort.sort(function (a, b) {
            return a[strObjParamToSortBy] - b[strObjParamToSortBy];
        });
    }
    else {
        arrToSort.sort(function (a, b) {
            return b[strObjParamToSortBy] - a[strObjParamToSortBy];
        });
    }
}

//get the totals for all sightings, or species and counts - then draw a totals bar chart viz
//first get the array of species names from the api
var species = [];
var getSpeciesSightingsTotals = function() {
    var speciesUrl = "http://intotheokavango.org/api/species";
    d3.json(speciesUrl, function(error, data) {
        
    })
}

//get the totals for all features, recursively - then draw a totals bar chart viz
var getFeatureTotalData = function(featureType) {
    var url = "http://intotheokavango.org/api/features?FeatureType=" + featureType + "";
    d3.json(url, function(error, data) {
        console.log(featureType + " data");
        var featuresCountObj = {};
        featuresCountObj.type = featureType;
        featuresCountObj.total = data.total;
        featuresCountArray.push(featuresCountObj);
        
        if(index < features.length -1){
            index++;
            setTimeout(getFeatureTotalData(features[index], 100));
        }
        else{
            //totalsVizDiv.fadeIn();
            makeTotalsViz(featuresCountArray);
        }
    });
}


//show the viz div
function show(){
    //totalsVizDiv.fadeIn();
    //timelineVizDiv.fadeIn();
}

//hide the viz div
function hide(){
    //totalsVizDiv.hide();
    //timelineVizDiv.hide();
}

//load the data again or redraw
function refresh() {}

function loadData(path_to_data, feature_type) {
    
    var url = "http://intotheokavango.org" + path_to_data;
    
    console.log(url);
    //totalsVizDiv.hide();
    //timelineVizDiv.hide();
//     this.feature_type = feature_type;
// console.log(this.feature_type);
    d3.json(url, function(error, data) {

        console.log(feature_type);
        if(error) {
            console.error("Failed to load " + path_to_data   );
            console.log(error);
            return error;
        } else {
            console.log("Initial Data", data);

            //parse item differently based on feature_type
            if (feature_type === "None" && path_to_data.indexOf("features") != -1 ) { //top level features
                //make features viz - totals of all the feature types?
                //if api call is expeditions or members, get from query string?
                //totalsVizDiv.show();
                getFeatureTotalData(features[index])

                console.log("these are the features"); //do we need a viz for members or expeditions?
            }

            if(feature_type === "None" && path_to_data.indexOf("species") != -1 ) { //list of all species with totals
                console.log("these are the species");
                for(species in data.results) {
                    
                    var count = data.results[species];
                    console.log(species + ": " + count);

                    var sightingCount = {};
                    sightingCount.type = species;
                    sightingCount.total = count;
                    speciesSightingsTotals.push(sightingCount);
                }
                console.log(speciesSightingsTotals);
                //totalsVizDiv.fadeIn();
                makeTotalsViz(speciesSightingsTotals);
            }
            
            if (feature_type === "ambit") {
                console.log("HERE");
                //make heart rate viz or energy consumption viz - heart rate for now.
                for (d in data.results.features) {
                    
                    if(d == "max" || d == "min" ){
                        continue;
                    }
                    var item = data.results.features[d];
                    //console.log("ITEMS: ");
                    //console.log(item);
                        

                        if (item["properties"].hasOwnProperty("HR")) {
                            f = parseAmbitHeartRate(item);
                            parsedAmbitHR.push(f);
                        }
                        if (item["properties"].hasOwnProperty("EnergyConsumption")) {
                            f = parseAmbitEnergy(item);
                            parsedAmbitEnergy.push(f);
                        }
                        if (item["properties"].hasOwnProperty("Speed") && item["properties"].hasOwnProperty("Distance")) {
                            f = parseAmbitSpeed(item);
                            parsedAmbitSpeed.push(f);
                        }
                    }
                        //timelineVizDiv.fadeIn();
                        //totalsVizDiv.hide();
                        makeTimeSeriesViz(parsedAmbitHR,feature_type)   ;
                        makeTimeSeriesViz(parsedAmbitEnergy,feature_type);
                        makeTimeSeriesViz(parsedAmbitSpeed,feature_type);
            }
            if (feature_type === "sighting") {
                //make sightings viz - totals of all the SpeciesNames sightings
                console.log("SIGHTING");
                //if it only asks for sightings and not species??

                if(path_to_data.indexOf("SpeciesName") != -1) { //if query asks for species name
                    //console.log("SpeciesName: " + path_to_data);
                    var speciesString = path_to_data.split("SpeciesName=");
                    //console.log("speciesName: " + speciesString[1]);
                    var speciesNameClean = speciesString[1].split("&");
                    //console.log("speciesNameClean: " + speciesNameClean[0]);
                    var speciesName = speciesNameClean[0];
                    //make species sightings timeline viz - SpeciesNames Counts over time
                    for (d in data.results.features) {

                        if(d == "max" || d == "min" ){ //d is max or min sometimes now, to keep it to integers
                            continue;
                        }
                        item = data.results.features[d];
                        f = parseSpeciesSighting(item);
                        parsedSpeciesSighting.push(f);
                    }
                    //timelineVizDiv.fadeIn();
                    //totalsVizDiv.hide();
                    makeHistogramPlot(parsedSpeciesSighting, feature_type, speciesName);
                }
            }
            if (feature_type === "tweet") {
                //layout tweets
                //TO DO: figure out how many tweets to lay out? viz for tweets?
            }
            if (feature_type === "image") {

            }
        }
    });
    
}
    return{
        loadData: loadData,
        show: show,
        hide: hide
    };
};

/* executes on load */
// $(document).ready(function() {
//     console.log("READY");
    
//     var totalsVizDiv = $("#totalsViz");
//     var timelineVizDiv = $("#timelineViz");
//     totalsVizDiv.hide();
//     timelineVizDiv.hide();
    
//     //var d3Page = d3Graph(timelineVizDiv);
//     // // console.log(Object.keys(d3Page));
//     //d3Page.loadData("http://dev.intotheokavango.org/api/features/?FeatureType=ambit")
//     //loadData(public _path);
// });;

/*
	API Explorer, Genevieve's turf.
	Please note I have been using the following javascript pattern: 
	http://radar.oreilly.com/2014/03/javascript-without-the-this.html
	UI Built out with Ractive.js: http://www.ractivejs.org/
*/


function DataPage(id){
console.warn('DATA PAGE', id);
    var ractive, page;
	/* 	Extends Page in layout.js
		Which among others gives you access to the following methods:
		- page.getNode()
		- page.show()
		- page.hide()	*/
    page = Page(id);
    page._show = page.show.bind(page);
    page._hide = page.hide.bind(page);
    
    page.show = show;
    page.hide = hide;

    function show(){
        console.warn('WE ARE SHOWING');
        page._show();
    }

    function hide(){
        console.warn('WE ARE HIDING');
        page._hide();
    }



	///////////////////
    // DATA & VARS
    ///////////////////
    var sections = {
            'documentation': { nav_title: 'Documentation' , view_title: 'API Documentation', pageActive: false, content: "This is where we have information about the API" },
            'overview': { nav_title: 'Overview' , view_title: 'API Overview', pageActive: true, content: "This is where we embed a few interesting endpoint visualizations" },
            'explorer': { nav_title: 'Explorer' , view_title: 'API Explorer', pageActive: false, content: "This is where we have UI elements to explore the API" },
    };

    var index = 0;
    var featuresCountArray = [];
    var speciesList = [];
    
    //get features totals
    //get the totals for all features, recursively draw?
    var featureTotals = window.FEATURES_DATA;
    var features = ["ambit", "ambit_geo", "audio", "beacon", "blog", "image", "sensor", 'sighting', 'tweet'];
    var featureTitles = ["Ambit Readings", "Ambit-Geo Readings", "Audio Recordings", "Beacon Readings", "Blog Entries", "Images", "Sensor Readings", "Sightings", "Tweets"];
    
    //how to update query string based on text input
    var queryString = "";
    var viewString = "";
    var apiUrl = "http://intotheokavango.org/api/";
    ///////////////////

    /*
    #####################
    ### Tag Component ###
    #####################
    */

    (function(Template){
        var Tag = Template.extend({
            isolated: true,
            template: '#tagTemplate',
            data: function() {
                return {
                    message: 'No message specified, using the default',
                    queryTag: '',
                    queryTags: [] //try to pass in as an argument on initializiation 
                };
            }
        });

        Template.components.Tag = Tag;
    })(Ractive);


    /*
    ################################
    ### RactiveDropdownComponent ###
    ################################
    */
    (function(Template){
        var RactiveDropdownComponent = Template.extend({

            isolated: false,

            template: '#RactiveDropdownComponentTemplate',

            // configuration
            data: function() {
                return {
                    selectorClass: 'ractive-dropdown',
                    keycode: null,
                    selectedIndex: -1,
                    isOpened: false,
                    liHeight: 40,
                    padding: 20,
                    show: 2,
                    limit: 100,
                    selector: 'Nothing',
                    selectedText: 'Select from dropdown',
                    items2: ['apples', 'oranges', 'nada'],
                    items: [] // should be passed as an argument on object initialization
                };
            },

            // the onrender function will be called as soon as the instance has finished rendering
            oninit: function() {

                var self = this;

                var defaultText = self.get('selectedText');

                self.observe('items', function() {
                    self.set('selectedText', defaultText);
                });

                // save the items in a object variable
                self.items = self.get('items');

                self.selector = self.get('selector');

                // set the active item
                self.setActiveItem = function(index) {

                    // set the explicit index if it has been passed
                    if (typeof(index) != 'undefined') {
                        self.set('selectedIndex', index);
                    }

                    var currentIndex = self.get('selectedIndex');
                    var items = self.get('items');
                    var defaultText = self.get('selectedText');

                    if (currentIndex > -1 && currentIndex <= items.length) {
                        self.set({
                            selectedIndex: currentIndex,
                            selectedText: items[currentIndex]
                        });
                    } else {
                        self.set('selectedText', defaultText);
                    }

                };

                // open/close the dropdown
                self.toggleDropdown = function() {
                    self.toggle('isOpened');
                };

                // tagging the toggling
                self.on('toggleDropdown', function() {
                    self.toggleDropdown();
                });

                // event to select the item
                self.on('selectItem', function(event, index) {

                    self.setActiveItem(index);

                    self.toggleDropdown();

                    var items = self.get('items');

                    // fire a onSelect event to the ractive object where the component is being used
                    // pass the selected item
                    self.fire('onSelect', items[self.get('selectedIndex')], self.selector);

                });

                // move up/down through the list using the arrow keys
                self.on('move', function(event, direction) {

                    var currentIndex = self.get('selectedIndex'),
                        items = self.get('items');

                    if (direction == 'down') {
                        if (currentIndex < items.length - 1) {
                            self.set('selectedIndex', currentIndex + 1);

                            // scroll the list upwards
                            this.ul.scrollTop = this.ul.scrollTop + this.liHeight;
                        }
                    } else if (direction == 'up') {
                        if (currentIndex > 0) {
                            self.set('selectedIndex', currentIndex - 1);

                            // scroll the list downwards
                            this.ul.scrollTop = this.ul.scrollTop - this.liHeight;
                        }
                    }

                    self.setActiveItem();

                });
            },

            oncomplete: function() {

                var self = this;

                // calculate item height
                self.resizeList = function() {

                    var visibleElements = self.get('show'),
                        selectorClass = self.get('selectorClass'),
                        ul = self.find('.' + selectorClass + ' ul'),
                        li = self.find('.' + selectorClass + ' ul li'),
                        ulHeight,
                        liHeight;

                    // get the height of the li
                    ul.style.display = 'block';
                    ul.style.visibility = 'hidden';
                    liHeight = li.offsetHeight;
                    ulHeight = ul.offsetHeight;
                    ul.style.height = ulHeight - liHeight * visibleElements;
                    ul.style.display = 'none';
                    ul.style.visibility = 'visible';


                    // save them in object variables to make them accessible for external usage
                    self.liHeight = liHeight;
                    self.ulHeight = ulHeight;
                    self.ul = ul;

                    self.set('liHeight', liHeight);
                };
                self.observe('selectedText', function(newValue, oldValue, keypath) {
                    //console.info('new value:', newValue);
                    //console.info('key path:', keypath);
                });

                self.observe('show', function(newValue, oldValue, event) {
                    console.info('new value:', newValue);
                    console.info('ul', self.ul);
                });

            }

        });
        
        Template.components.RactiveDropdownComponent = RactiveDropdownComponent;
    })(Ractive);

    /*
    ################################
    ### QueryComponent ###
    ################################
    */
    (function(Template){
        var QueryComponent = Template.extend({
            el: "#query-area",
            template: "#query-template",
            // components: {
            //     RactiveDropdownComponent: RactiveDropdownComponent,
            //     Tag: Tag
            // },

            oninit: function() {
                var self = this;

                self.observe('*', this.parseQuery.bind(this));

                self.set('dropDownDisplay', 'none');
                self.set('dropDownGrandchild', 'none');

                self.on('RactiveDropdownComponent.onSelect', function(item, selector) {



                    self.set('selectedItem', item);
                    console.info('callback fired!', selector, item);
                    //console.log('queryTag: ' + this.get('queryTag'));

                    switch (selector) {
                        case "items":
                            var items2 = self.get('itemsKeys.' + item);
                            self.set('categoriesItems', items2);

                            self.set('dropDownDisplay', 'visible');
                            self.set('dropDownGrandchild', 'none');
                            // $("#dropdown-grandchild").hide();

                            this.set('queryObj.filter', item);
                            //Not updating tags on top filter - uncomment if you want to
                            // this.set('queryTag', queryObj["filter"]);
                            // console.log("query filter: " + this.get('queryTag')); 
                            break

                        case "categories":
                            var items2 = self.get('categoriesKeys.' + item);
                            //console.log("items2: " + items2);
                            self.set('modelsItems', items2);
                            //console.log('modelsItems: ' + self.get('modelsItems'));

                            //trying to update label, not working yet
                            //console.log("selectedText: " + self.get('selectedText'));
                            var state = 'none';
                            if (items2 && items2.length > 1) state = 'visible';

                            self.set('dropDownGrandchild', state);

                            if (this.get('queryObj.filter') === 'expeditions') {
                                this.set('queryObj.expedition', 'Expedition=' + item);

                            } else if (this.get('queryObj.filter') === 'members') {
                                this.set('queryObj.member', 'Member=' + item);

                            } else if (this.get('queryObj.filter') === 'features') {
                                this.set('queryObj.featureType', 'FeatureType=' + item);

                                console.log('QUERY SENSORTYPE: ' + this.get('queryObj.sensor'));
                                console.log('QUERY IMAGETYPE: ' + this.get('queryObj.image'));
                                console.log('QUERY SPECIES: ' + this.get('queryObj.species'));
                            }

                            break

                        case "models":
                            //console.log('in models');
                            //console.log(queryObj);
                            if (this.get('queryObj.featureType') === 'FeatureType=image') {
                                this.set('queryObj.image', 'ImageType=' + item);

                            } else if (this.get('queryObj.featureType') === 'FeatureType=sensor') {
                                this.set('queryObj.sensor', 'SensorName=' + item);

                            } else if (this.get('queryObj.featureType') === 'FeatureType=sighting') {

                                if (item.indexOf(' ') > -1) {
                                    //TODO: get rid of space?? - not here in parser?
                                }
                                this.set('queryObj.species', 'SpeciesName=' + item); //TODO: change to SpeciesName for OK15
                            }
                            break
                    }
                });
                ///
                //send new query on button press
                this.on({
                    runQuery: function() {
                        console.log(this.get('renderedURL'));
                        window.open(this.get('renderedURL'), '_blank');
                    }
                });

                this.on({
                    heartRateQuery: function() {
                        this.set('queryObj.filter', 'features');
                        this.set('queryObj.featureType', 'FeatureType=ambit');
                        this.set('queryObj.output', 'output=viz');
                        this.set('mapChecked', false);
                        this.set('vizChecked', true);
                        this.set('jsonChecked', false);
                        
                        var updatedUrl = "http://intotheokavango.org/api/features/viz";
                            //this.set('queryObj.output', "features/" + newValue);
                        this.set('apiUrl', updatedUrl);

                    }
                });

                this.on({
                    hippoSighting: function() {
                        this.set('queryObj.filter', 'features');
                        this.set('queryObj.featureType', 'FeatureType=sighting');
                        this.set('queryObj.species', 'SpeciesName=Hippo');
                        this.set('queryObj.output', 'output=map');
                        this.set('mapChecked', true);
                        this.set('vizChecked', false);
                        this.set('jsonChecked', false);
                        var updatedUrl = "http://intotheokavango.org/api/features/map";
                        this.set('apiUrl', updatedUrl);
                    }
                })

                this.observe('output', function(newValue, oldValue) {
                    //console.log('output: ' + newValue);
                    if (newValue != undefined) {
                        this.set('queryObj.output', 'output=' + newValue);
                    }

                    //TODO: take output/url parsing out of output, so that if you delete tag, the URL updates too
                    //console.log('output: ' + newValue);
                    var updatedUrl = '';
                    if (newValue === 'map' || newValue === 'viz') {
                        updatedUrl = "http://intotheokavango.org/api/features/" + newValue;
                        //this.set('queryObj.output', "features/" + newValue);
                    } else {
                        updatedUrl = "http://intotheokavango.org/api/features/";
                    }
                    //console.log(updatedUrl);
                    this.set('apiUrl', updatedUrl);
                });

                this.observe('limit', function(newValue, oldValue) {
                    //console.log('limit newValue: ' + newValue + ', oldValue: ' + oldValue);
                    if (oldValue != undefined && newValue != undefined) {
                        this.set('queryObj.limit', 'limit=' + newValue);
                        //console.log(this.get('query')); //try and make query string
                    }
                });

                this.observe('order', function(newValue, oldValue) {
                    //console.log('order: ' + newValue);
                    if (newValue != undefined) {
                        var val;
                        if (newValue === 'ascending') {
                            val = 1;
                        } else {
                            val = -1;
                        }
                        this.set('queryObj.order', 'order=' + val);
                        //this.set('query', this.get('queryTag')); 
                    }
                });

                this.observe('expeditionDay', function(newValue, oldValue) {
                    console.log('expeditionDay newValue: ' + newValue + ', oldValue: ' + oldValue);
                    if (oldValue != undefined && newValue != undefined) {
                        this.set('queryObj.expeditionDay', 'expeditionDay=' + newValue);
                        //console.log(this.get('query')); //try and make query string
                    }
                });

                this.observe('startDate', function(newValue, oldValue) {
                    console.log('startDate newValue: ' + newValue + ', oldValue: ' + oldValue);
                    if (oldValue != undefined && newValue != undefined) {
                        this.set('queryObj.startDate', 'startDate=' + newValue);
                        //console.log(this.get('query')); //try and make query string
                    }
                });

                this.observe('endDate', function(newValue, oldValue) {
                    console.log('endDate newValue: ' + newValue + ', oldValue: ' + oldValue);
                    if (oldValue != undefined && newValue != undefined) {
                        this.set('queryObj.endDate', 'endDate=' + newValue);
                        //console.log(this.get('query')); //try and make query string
                    }
                });

                this.observe('queryTags.length', function(n, o, k) {
                    console.log('array length', k, 'changed from', o, 'to', n);

                    if (n === 0) {
                        console.log("array is empty, so reset apiUrl");
                        this.set('apiUrl', "http://intotheokavango.org/api/features/");
                        this.set('dropDownDisplay', 'none');
                        this.set('dropDownGrandchild', 'none');
                    }
                });

                this.observe('queryTags.*', function(newValue, oldValue, event) {
                    console.log(this.get('queryTags'));
                    console.log('queryTags newValue: ' + newValue + ', oldValue: ' + oldValue);

                });

                this.observe('queryObj.*', function(newValue, oldValue, keypath) {
                    console.log('object key', keypath, 'changed from', oldValue, 'to', newValue);

                    var tagArrayLength = this.get('queryTags.length');

                    if (newValue) { //if the value is not undefined or an empty string

                        var splitNew = newValue.split('=');

                        switch (keypath) {
                            case 'queryObj.limit':
                                //iterate through array, either splice or push new limit

                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break

                            case 'queryObj.order':
                                //iterate through array, either splice or push new order

                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break

                            case 'queryObj.output':
                                //iterate through array, either splice or push new output

                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break

                            case 'queryObj.startDate':

                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break

                            case 'queryObj.endDate':

                            if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break

                            case 'queryObj.expeditionDay':

                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break

                            case 'queryObj.filter':

                                //don't add tag for first dropdown filter

                                break

                            case 'queryObj.expedition':

                                //iterate through array, either splice or push new expedition

                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break

                            case 'queryObj.member':
                                //iterate through array, either splice or push new member
                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break

                            case 'queryObj.featureType':

                                //iterate through array, either splice or push new featureType
                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    //this.addElement(tagArrayLength, splitNew[0], newValue);

                                    console.log("ARRAY HAS ELEMENTS");
                                    //splice if old and new are the same
                                    for (var i = 0; i < tagArrayLength; i++) {
                                        var item = this.get('queryTags[' + i + ']');
                                        console.log("ITEM: " + item);

                                        //if array item is a FeatureType
                                        if (item.indexOf(splitNew[0]) > -1) {

                                            //before you splice remove the other element???
                                            for (var j = 0; j < tagArrayLength; j++) {
                                                var item2 = this.get('queryTags[' + j + ']');
                                                console.log("ITEM2: " + item2);

                                                if (item2 != undefined) {
                                                    if (item2.indexOf('SpeciesName') > -1 || item2.indexOf('SensorType') > -1 || item2.indexOf('ImageType') > -1) {
                                                        console.log('item: ' + item2 + ' is a subcategory');
                                                        this.splice('queryTags', j, 1);
                                                        console.log('STATE OF THE ARRAY: ' + this.get('queryTags'));
                                                        var arrayState = this.get('queryTags');
                                                        //this.set('queryTags', arrayState);
                                                    }
                                                }

                                            }

                                            console.log("SPLICE THE NEW VALUE AT: " + item);
                                            this.splice('queryTags', i, 1, newValue);

                                            break
                                        }
                                        if (i === tagArrayLength - 1) { //only push it if checked against whole array
                                            console.log("PUSH " + newValue);
                                            this.push('queryTags', newValue);
                                        }
                                    }

                                    if (this.get('queryObj.sensor').indexOf('SensorName') > -1) {

                                    }
                                }

                                break

                            case 'queryObj.sensor':
                                //iterate through array, either splice or push new sensor
                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break

                            case 'queryObj.image':

                                //iterate through array, either splice or push new sensor
                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break

                            case 'queryObj.species':

                                //iterate through array, either splice or push new sensor
                                if (this.get('queryTags.length') === 0) {
                                    this.push('queryTags', newValue);
                                    console.log("PUSH : " + newValue);
                                } else {

                                    this.addElement(tagArrayLength, splitNew[0], newValue);
                                }

                                break
                        }
                    }
                });
                ///
            },
            addElement: function (arrayLength, splitValue, newVal) {
                console.log("ARRAY HAS ELEMENTS");
                //splice if old and new are the same
                for (var i = 0; i < arrayLength; i++) {
                    var item = this.get('queryTags[' + i + ']');
                    console.log("ITEM: " + item);

                    if (item.indexOf(splitValue) > -1) {
                        console.log("SPLICE THE NEW VALUE AT: " + item);
                        this.splice('queryTags', i, 1, newVal);
                        return
                    }
                    if (i === arrayLength - 1) { //only push it if checked against whole array
                        console.log("PUSH " + newVal);
                        this.push('queryTags', newVal);
                    }
                }
            },
            parseQuery: function() {
                var serializeTags = function(obj) {
                    if (!obj) return ''; //reset URL here? to account for deleting output?
                    var str = [];
                    for (var p in obj)
                        if (obj.hasOwnProperty(p)) {
                            //console.log('serialize obj[p]: '+ obj[p]);
                            if (obj[p].indexOf('output') > -1) {
                                //console.log('dont add output to query as tag');
                            } else {
                                str.push(obj[p]);
                            }
                        }
                    if (!str.length) return '';
                    return '?' + str.join("&");
                };
                var url = this.get('apiUrl');
                var path = this.get('query');
                var query = serializeTags(this.get('queryTags'));
                if (path) url += path;
                if (query) url += query;

                this.set('renderedURL', url);
                //console.log(this.get('queryTags.*'));
                //console.log(this.get('queryTags.length'));
            },
            data: function() {
                return {
                    apiUrl: "http://intotheokavango.org/api/features",
                    mapChecked: false,
                    vizChecked: false,
                    jsonChecked: true,
                    queryObj: {
                        filter: "",
                        featureType: "",
                        member: "",
                        expedition: "",
                        species: "",
                        image: "",
                        sensor: "",
                        output: "",
                        order: "",
                        limit: "",
                        startDate: "",
                        endDate: "",
                        expeditionDay: ""
                    },
                    queryTags: [],
                    items: ['expeditions', 'members', 'features'],
                    categoriesItems: [],
                    modelsItems: [],

                    itemsKeys: {
                        expeditions: ['okavango_13', 'okavango_14', 'okavango_15'],
                        members: ["Alex", "Asher", "Brian", "Chaps", "Chris", "GB", "Giles", "Gotz", "Greg", "James", "Jer", "John", "KG", "Maans", "Markymarl", "Shah", "Tom", "null"],
                        features: ["ambit", "ambit_geo", "audio", "beacon", "blog", "image", "sensor", 'sighting', 'tweet'],
                    },
                    categoriesKeys: {
                        ambit: [],
                        ambit_geo: [],
                        audio: [],
                        beacon: [],
                        blog:[],
                        image: ['GoPro', 'documentary', 'specimen'],
                        sensor: ['databoat1', 'sensor2', 'databoat'],
                        sighting: speciesList,
                        
                        tweet: []
                    },
                    selectedItem: '',
                    show: 3,
                    limit: 100,
                    expeditionDay: 1
                }
            }
        });
        Template.components.QueryComponent = QueryComponent;
    })(Ractive);
    
    /*
    ################################
    ### D3Component ###
    ################################
    */
    (function(Template){
        var d3Page = d3Graph("#totalsViz", "#timelineViz");
        var D3View = Template.extend({
            template:"#d3-template",
            oninit:function(){
                // d3Graph("#d3-content")
                console.log("d3 ractive");
                d3Page.show();
                d3Page.loadData("/api/features/?FeatureType=sighting&SpeciesName=African Jacana&limit=40", "sighting");
            },
            onteardown:function(){
                d3Page.hide();
            }
        });

        Template.components.D3View = D3View;
    })(Ractive);


   /*
    ################################
    ### FeaturesComponent ###
    ################################
    */
    (function(Template){
        var FeaturesWidget = Template.extend({
            template:"#featuresTemplate",
            data: function() {
                return {
                    featuresArray: featureTotals
                };
            }
        });
        Template.components.FeaturesWidget = FeaturesWidget;
    })(Ractive);
    
    /*

    #############
    ### USAGE ###/*
    #############
    ### USAGE ###
    #############
    */

    //need this ractive to update data from server (won't go to widget)
    var ractive_features = new Ractive({
        el: "#features-totals",
        template: "#featuresTemplate",
        data: {
            featuresArray: featureTotals
        }
    });

    ////////////////////

    page.getSpeciesList = function() {
        d3.json("http://intotheokavango.org/api/species", function(error, data) {
            if(error) {
                console.error("Failed to load " + url);
                console.log(error);
                return error;
            } else {
                for (species in data.results) {
                    var count = data.results[species];
                    //console.log(species + ": " + count);
                    if(species.indexOf("quote") != -1 || species.indexOf("test") != -1 || species.indexOf("Test") != -1) {
                        console.log("not a species");
                    } else {
                        speciesList.push(species);
                    }
                }
                speciesList.sort();
                console.log(speciesList);
            }
        });
        return speciesList;
    }


	page.getFeatureTotalData = function(featureType) {
        var url = "http://intotheokavango.org/api/features?FeatureType=" + featureType + "";
        d3.json(url, function(error, data) {
            //console.log(featureType + " data");

            var featuresCountObj = {};
            featuresCountObj.featureType = featureType;
            featuresCountObj.total = data.total;
            featuresCountArray.push(featuresCountObj);

            // console.log("index: " + index);
            // console.log(ractive_features.get("featuresArray[" + index + "].total"));
            ractive_features.set("featuresArray[" + index + "].total", featuresCountObj.total);

            if (index < features.length - 1) {
                index++;
                setTimeout(page.getFeatureTotalData(features[index], 100));
            } else {
                // console.log("featuresCountArray");
                // console.log(featuresCountArray);
                // console.log("featuresArray at index: " + index);
                // console.log(ractive_features.get("featuresArray"));

                // totalsVizDiv.fadeIn();
                // makeTotalsViz(featuresCountArray);
            }
        });
	};

	page.loadRactive = function() {
		console.warn("loading ractive!!!");
		ractive = new Ractive({
	      	el: '#data-content',
	      	// We could pass in a string, but for the sake of convenience
	      	// we're passing the ID of the <script> tag above.
	      	// template: '#navTemplate',
	      	template: '#content-template',
            oninit:function(){
                console.warn('ON INIT')
                this.setActive('overview');
            },
            setActive: function(id){
                console.warn('ID', id);
                this.set('section', id);
                d3.select('#data-navigation li.documentation').classed('active', false);
                d3.select('#data-navigation li.overview').classed('active', false);
                d3.select('#data-navigation li.explorer').classed('active', false);
                
                var button = d3.select('#data-navigation li.' + id);
                button.classed('active', true);
                var activeSection = this.get('sections.'+id);
                this.set('activeSection', activeSection);
            },	     	
            // delimiters: [ '{[{', '}]}' ], //dont' need delimiters if using {% raw %} and {% endraw %}
	      	// Here, we're passing in some initial data
	      	data: { 
                'section': 'overview',
                'sections': {
                    'documentation': {  nav_title: 'Documentation' , view_title: 'API Documentation', pageActive: false, content: "This is where we have information about the API" },
                    'overview': {  nav_title: 'Overview' , view_title: 'API Overview', pageActive: true, content: "This is where we embed a few interesting endpoint visualizations" },
                    'explorer': {  nav_title: 'Explorer' , view_title: 'API Explorer', pageActive: false, content: "This is where we have UI elements to explore the API" },
                }
			}
		});
		
		window.ra = ractive;
	}



	page.loadRactive();
    page.getFeatureTotalData(features[index]);
    page.getSpeciesList();
    
    
    // var D3View = Ractive.extend({
    //     el:'#d3-content',
    //     template:"#d3-template",
    //     oninit:function(){
    //         // d3Graph("#d3-content")
    //         console.log("d3 ractive");
    //         d3Page.show();
    //         d3Page.loadData("api/features/?FeatureType=ambit", "ambit");
    //     },
    //     onteardown:function(){
    //         d3Page.hide();
    //     }
    // });
    //console.log(Object.keys(d3Page));
    
	return page;
}

;

/*
	Describes the journal page's feed.
*/


function Feed(){

	var node = d3.select('#feed');
	node.on('mousewheel', scroll);
	var templates = {
		tweet: node.select('div.post.tweet').remove().html(),
		photo: node.select('div.post.photo').remove().html(),
		blog: node.select('div.post.blog').remove().html()
	}
	var postsByDay = [];
	var allPosts = [];
	var postCursor = 0;


	function init(day){
		var monthNames = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
		var w = node.style('width');
		w = parseFloat(+w.slice(0,w.length-2));

		// Definitely not optimized
		var newPosts = [];
		newPosts = newPosts.concat(loader.getTweets()[day]);
		newPosts = newPosts.concat(loader.getBlogs()[day]);
		var photos = loader.getPhotos()[day];
		for(var i=0; i<photos.length; i++){
			if(photos[i].getMember() != null) newPosts.push(photos[i]);
		}
		newPosts.sort(function(a, b){
			return a.getData().date.getTime() - b.getData().date.getTime();
		});
		postsByDay[day] = newPosts;
		allPosts = allPosts.concat(newPosts);
		allPosts.sort(function(a, b){
			return a.getData().date.getTime() - b.getData().date.getTime();
		});

		var posts = node.selectAll('div.post')
	        .data(allPosts, function(d){ 
	        	d = d.getData();
	        	return d.date.getTime() + '-' + d.latLng.lat;
	        })

	    posts.enter()
	        .append('div')
	        .attr("class", function(d) { return ' post ' + d.getData().type; })
	        .html(function(d){ return templates[d.getData().type] })
	        .each(function(d,i){
	        	d = d.getData();
	        	var t = new Date(offsetTimezone(d.date.getTime()));
	        	t = ((parseInt(t.getDate())) + monthNames[t.getMonth()] + ' ' + ((t.getHours()+'').length==1?'0':'') + t.getHours() + ':'+ ((t.getMinutes()+'').length==1?'0':'') +t.getMinutes());
	        	d3.select(this).select('div.meta div.timestamp')
	        		.html(t);
	        	
	        	if(d.type == 'tweet'){
		        	d3.select(this).select('p.message')
		        		.html(function(){
		        			var urls = d.message.match(/http[^\s]*/gi);
		        			if(urls){
			        			for(var i=0; i<urls.length; i++){
			        				d.message = d.message.replace(urls[i],'<a href="'+urls[i]+'" target="_blank">'+urls[i]+'</a>');
			        			}
			        		}
			        		var handles = d.message.match(/@[^\s]*/gi);
		        			if(handles){
			        			for(var i=0; i<handles.length; i++){
			        				d.message = d.message.replace(handles[i],'<a href="http://twitter.com/'+handles[i].slice(1,handles[i].length-1)+'" target="_blank">'+handles[i]+'</a>');
			        			}
			        		}
		        			return d.message
		        		});
		        	if(d.photoUrl){
			        	d3.select(this).select('div.photo')
			        		.append('img')
			        		.attr('src',d.photoUrl)
			        		.attr('alt','Photo taken on ' + t)
			        		.attr('width', w)
			        		.attr('height', d.size[1]*w/d.size[0]);
		        	}
	        	} else if(d.type == 'photo'){
		        	d3.select(this).select('div.photo')
		        		.append('img')
		        		.attr('src','http://intotheokavango.org'+d.photoUrl)
		        		.attr('alt','Photo taken on ' + t)
		        		.attr('width', w)
		        		.attr('height', d.size[1]*w/d.size[0]);
	        	} else if(d.type == 'blog'){
		        	d3.select(this).select('h3.title')
		        		.html(d.title);
	        		d3.select(this).select('p.message')
		        		.html(function(){
		        			return '"' + d.message + ' [...]"<br/><a href="'+d.url+'" target="_blank">Read the full on Medium</a>'
		        		});
	        	}
	        });

		posts.order();

		requestAnimationFrame(function(){
			posts.each(function(d){
				d.setFeedPos(this.offsetTop, this.clientHeight);
			});
			if(pages.active.id == 'journal'){
				jump(timeline.getTimeCursor());
			}
		});

	}

	function scroll(){
		var day = timeline.getTimeCursor().day;
		var y = node.node().parentNode.scrollTop;
		var forward = d3.event.wheelDeltaY <= 0;
		var fw = forward ? 1:-1;

		var len = allPosts.length;
		for(var i=Math.constrain(postCursor-fw,0,len-1); forward?(i<len-1):(i>=0); i+=fw){
			var post = allPosts[i];
			var d1 = post.getData();
			if(y >= d1.feedPos && y < d1.feedPos+d1.height + 70){
				var nextPost = allPosts[i+1];
				var t;
				if(nextPost){
					var d2 = nextPost.getData();
					t = Math.round(Math.map(y,d1.feedPos,d1.feedPos+d1.height+70,d1.date.getTime(),d2.date.getTime())/1000);
				} else{
					t = Math.round(Math.map(y,d1.feedPos,d1.feedPos+d1.height+70,d1.date.getTime(),d1.date.getTime()+1)/1000);
				}
				// if(Math.abs(t-timeline.getTimeCursor().current) > 3600*24) timeline.jumpTo(t);
				// else timeline.navigateJournal(t);
				timeline.navigateJournal(t);
				postCursor = i;
				return;
			}
		}
	}


	function jump(t){

		var day = t.day;
		var len = postsByDay[day].length;
		for(var i=0; i<len; i++){
			if(!postsByDay[day][i+1] && !postsByDay[day+1]) break;
			var post = postsByDay[day][i];
			var nextPost = postsByDay[day][i+1] || postsByDay[day+1][0];
			var t1 = post.getData().date.getTime()/1000;
			var t2 = nextPost.getData().date.getTime()/1000;
			if(t.current >= t1 && t.current < t2){
				var d = post.getData();
				node.node().parentNode.scrollTop = Math.map(t.current,t1,t2,d.feedPos,d.feedPos + d.height);
				var id = 0;
				for(var j=0; j<day; j++){
					if(postsByDay[j]) id += postsByDay[j].length
				}
				id += i;
				postCursor = id;
				break;
			}
		}
	}
	

	return{
		init: init,
		jump: jump
	};
}

;

/*
	Describes every features as displayed on the map and journal's page.
*/


function Sighting(feature, m){

	var date = new Date(Math.round(parseFloat((feature.properties.t_utc+timeOffsets[expeditionYear].photo)*1000)));
	var latLng = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
	var name = feature.properties.SpeciesName;
	var visible = true;
	var marker = m;

	function getData(){
		return {
			type: 'sighting',
			date: date,
			latLng: latLng,
			name: name
		}
	}

	function getLatLng(){
		return latLng;
	}

	function setVisible(v){
		if(v != visible){
			if(marker){
				if(v) sightingLayer.addLayer(marker);
				else sightingLayer.removeLayer(marker);
				visible = v;
			}
		}
	}

	return{
		getData: getData,
		getLatLng: getLatLng,
		marker: marker,
		setVisible: setVisible
	};
}


function Beacon(feature, m){

	var date = new Date(Math.round(parseFloat((feature.properties.t_utc+timeOffsets[expeditionYear].photo)*1000)));
	var latLng = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
	var visible = true;
	var marker = m;

	function getData(){
		return {
			type: 'beacon',
			date: date,
			latLng: latLng
		}
	}

	function getLatLng(){
		return latLng;
	}

	function setVisible(v){
		if(v != visible){
			if(marker){
				if(v) sightingLayer.addLayer(marker);
				else sightingLayer.removeLayer(marker);
				visible = v;
			}
		}
	}

	return{
		getData: getData,
		getLatLng: getLatLng,
		marker: marker,
		setVisible: setVisible
	};
}


function PhotoPost(feature, m){
	var feedPos = 0;
	var height = 0;
	// var date = new Date(Math.round(parseFloat(feature.properties.t_utc*1000)));
	var date = new Date(Math.round(parseFloat((feature.properties.t_utc+timeOffsets[expeditionYear].photo)*1000)));
	var latLng = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
	var photoUrl = feature.properties.Url;
	var size = feature.properties.Dimensions;
	var visible = true;
	var marker = m;
	var member = feature.properties.Member;
	// console.log(member);

	function getData(){
		return {
			type: 'photo',
			date: date,
			latLng: latLng,
			photoUrl: photoUrl,
			feedPos: feedPos,
			size: size,
			setFeedPos: setFeedPos,
			height: height,
		}
	}


	function getLatLng(){
		return latLng;
	}


	function setFeedPos(y, h){
		feedPos = y;
		height = h;
	}


	function getFeedPos(){
		return{
			feedPos: feedPos,
			height: height,
			index: i
		};
	}

	function setVisible(v){
		if(v != visible){
			if(marker){
				if(v) photoLayer.addLayer(marker);
				else photoLayer.removeLayer(marker);
				visible = v;
			}
		}
	}

	function getMember(){
		return member;
	}

	return{
		getData: getData,
		getLatLng: getLatLng,
		getFeedPos: getFeedPos,
		setFeedPos: setFeedPos,
		marker: marker,
		setVisible: setVisible,
		getMember: getMember
	};
}




function TweetPost(feature, m){

	var tweetProperties = expeditionYear == '15' ? feature.properties : feature.properties.Tweet;

	var feedPos = 0;
	var height = 0;
	var message = expeditionYear == '15' ? tweetProperties.Text : tweetProperties.text;
	if(message.substring(0,2).toLowerCase() == 'rt') return null;
	var date = new Date(Math.round(parseFloat((feature.properties.t_utc+timeOffsets[expeditionYear].tweet)*1000)));
	var visible = true;
	var marker = m;

	var latLng = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
	var id = feature.id;
	var url = feature.properties.Url
	var photoUrl;
	var size = [];
	try{
		if(tweetProperties.extended_entities.media[0].type == 'photo'){
			photoUrl = tweetProperties.extended_entities.media[0].media_url;
			size[0] = tweetProperties.extended_entities.media[0].sizes.large.w;
			size[1] = tweetProperties.extended_entities.media[0].sizes.large.h;
		}
	} catch(e){}


	function getData(){
		return {
			type: 'tweet',
			message: message,
			date: date,
			latLng: latLng,
			id: id,
			photoUrl: photoUrl,
			size: size,
			feedPos: feedPos,
			setFeedPos: setFeedPos,
			height: height
		}
	}


	function getLatLng(){
		return latLng;
	}


	function setFeedPos(y, h){
		feedPos = y;
		height = h;
	}


	function getFeedPos(){
		return{
			feedPos: feedPos,
			height: height
		};
	}

	function setVisible(v){
		if(v != visible){
			if(marker){
				if(v) tweetLayer.addLayer(marker);
				else tweetLayer.removeLayer(marker);
				visible = v;
			}
		}
	}

	return{
		getData: getData,
		getLatLng: getLatLng,
		getFeedPos: getFeedPos,
		setFeedPos: setFeedPos,
		marker: marker,
		setVisible: setVisible
	};
}


function BlogPost(feature, m){


	var feedPos = 0;
	var height = 0;
	var title = feature.properties.Title;
	var message = feature.properties.Summary;
	var member = feature.properties.Member;
	var date = new Date(Math.round(parseFloat((feature.properties.t_utc+timeOffsets[expeditionYear].tweet)*1000)));
	var visible = true;
	var marker = m;
	var latLng;
	if(feature.geometry != null) latLng = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
	else latLng = new L.LatLng(0,0);
	var id = feature.id;
	var url = feature.properties.Url


	function getData(){
		return {
			type: 'blog',
			message: message,
			title: title,
			date: date,
			latLng: latLng,
			id: id,
			feedPos: feedPos,
			setFeedPos: setFeedPos,
			height: height,
			url: url
		}
	}


	function getLatLng(){
		return latLng;
	}


	function setFeedPos(y, h){
		feedPos = y;
		height = h;
	}


	function getFeedPos(){
		return{
			feedPos: feedPos,
			height: height
		};
	}

	function setVisible(v){
		if(v != visible){
			if(marker){
				if(v) tweetLayer.addLayer(marker);
				else tweetLayer.removeLayer(marker);
				visible = v;
			}
		}
	}

	return{
		getData: getData,
		getLatLng: getLatLng,
		getFeedPos: getFeedPos,
		setFeedPos: setFeedPos,
		marker: marker,
		setVisible: setVisible
	};
}



function SoundPost(feature, m){

	// "properties": {
 //        "t_utc": 1431839602,
 //        "Expedition": "okavango_15",
 //        "FeatureType": "audio",
 //        "Time": "12:00",
 //        "t_created": 1431840040.998817,
 //        "Date": "2015-05-16",
 //        "Notes": "Field recording from the bustling covered market in Menongue, Angola.",
 //        "DateTime": "2015-05-17T07:13:22+0200",
 //        "SoundCloudURL": "http://soundcloud.com/intotheokavango/jer-field-recording-from-the",
 //        "CoreExpedition": true,
 //        "EstimatedGeometry": "beacon",
 //        "SoundType": "Field Recording",
 //        "Member": "Jer",
 //        "ResourceURLs": [
 //            "MenongueMarket_0516.wav"
 //        ]
 //    },
 //    "type": "Feature",
 //    "geometry": {
 //        "coordinates": [
 //            17.665418389490604,
 //            -14.66285528680308
 //        ],
 //        "type": "Point"
 //    },
 //    "id": "55582528b9a21411ed7ddf69"

	var feedPos = 0;
	var height = 0;
	var title = feature.properties.Title;
	var message = feature.properties.Summary;
	var member = feature.properties.Member;
	var date = new Date(Math.round(parseFloat((feature.properties.t_utc+timeOffsets[expeditionYear].tweet)*1000)));
	var visible = true;
	var marker = m;
	var latLng;
	if(feature.geometry != null) latLng = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
	else latLng = new L.LatLng(0,0);
	var id = feature.id;
	var url = feature.properties.Url


	function getData(){
		return {
			type: 'blog',
			message: message,
			title: title,
			date: date,
			latLng: latLng,
			id: id,
			feedPos: feedPos,
			setFeedPos: setFeedPos,
			height: height,
			url: url
		}
	}


	function getLatLng(){
		return latLng;
	}


	function setFeedPos(y, h){
		feedPos = y;
		height = h;
	}


	function getFeedPos(){
		return{
			feedPos: feedPos,
			height: height
		};
	}

	function setVisible(v){
		if(v != visible){
			if(marker){
				if(v) tweetLayer.addLayer(marker);
				else tweetLayer.removeLayer(marker);
				visible = v;
			}
		}
	}

	return{
		getData: getData,
		getLatLng: getLatLng,
		getFeedPos: getFeedPos,
		setFeedPos: setFeedPos,
		marker: marker,
		setVisible: setVisible
	};
}

;

/*
	Several classes handling website's pages and tabs/panes
*/


function AboutPage(){

	// Extends Page
	var page = Page('about');
	(function switchBackground(){
		if(pages.active && pages.active.id == 'about'){
			
			page.node.select('#team div.slides img:first-child')
				.transition()
				.style('opacity',0)
				.each('end',function(){
					d3.select(this).remove().style('opacity',1);
					page.node.select('#team div.slides').node().appendChild(this)
				});
		}
		setTimeout(switchBackground,10000);
	})();	

	page.hide = function(){
		page.node.classed('hidden',true);
		page.button.classed('active',false);
		pauseVimeoPlayer();
	}

	return page;
}




function Page(i){

	var id = i;
	var button = d3.select('#navigation li.' + i);
	var node = d3.select('#'+ id + 'Page');
	var header = d3.select('#header');

	var show = function(){
		node.classed('hidden',false);
		button.classed('active',true);
		pages.active = this;
		offsetHeader(id=='about' || id=='data');
		map.setZoom(id == 'journal' ? 15 : 17);
		header.classed('dark',false);
		d3.select('#night').style('display',(id != 'journal' && id != 'map' ? 'none':'block'));
	}


	var hide = function(){
		node.classed('hidden',true);
		button.classed('active',false);
	}


	var offsetHeader = function(isPageRelative){
		
		if(!isPageRelative){
			header.style('width','97.2%')
				.style('padding-right','1.4%');
		} else {
			var containerWidth = header.node().clientWidth;
			header.style('width',(97.2 + (15/d3.select('body').node().clientWidth)*100) + '%')
				.style('padding-right',0);
		}
	}


	function getNode(){
		return node;
	}


	return{
		id: id,
		button: button,
		getNode: getNode,
		show: show,
		hide: hide,
		offsetHeader: offsetHeader,
		node: node,
		header: header
	};
}




function MapPage(){

	// Extends Page
	var page = Page('map');


	page.show = function(){
		var lastActive = pages.active;
		page.getNode().classed('hidden',false);
		page.button.classed('active',true);
		pages.active = this;
		page.offsetHeader(page.id=='about');
		if(pages.journal){
			for(var i=0; i<pages.journal.panes.length; i++){
				pages.journal.panes[i].hide();
			}
		}
		if(timeline) {
			if(lastActive.id != 'journal') timeline.togglePause('pause');
			setTimeout(function(){timeline.togglePause('resume');},lastActive.id == 'journal' ? 1000 : 2000);
		}
		map.setZoom(page.id == 'journal' ? 15 : 17);
		page.header.classed('dark',true);
		d3.select('#contentContainer').classed('map',true);
		d3.select('#night').style('display',(page.id != 'journal' && page.id != 'map' ? 'none':'block'));
		d3.select('#mapPage div.logos').classed('hidden',false);
	}

	page.hide = function(){
		page.getNode().classed('hidden',true);
		page.button.classed('active',false);
		d3.select('#contentContainer').classed('map',false);
	}


	return page;
}




function JournalPage(){

	// Extends Page
	var page = Page('map');

	page.id = 'journal';
	page.button = d3.select('#navigation li.' + page.id);
	page.panes = [];
	for(var i=0; i<3; i++){
		var p = PagePane(i);
		page.panes.push(p);
	}


	page.show = function(){
		page.getNode().classed('hidden',false);
		page.button.classed('active',true);
		pages.active = this;
		page.offsetHeader(page.id=='about');
		for(var i=0; i<3; i++){
			page.panes[i].show();
		}
		if(timeline) timeline.togglePause('pause');
		map.setZoom(page.id == 'journal' ? 15 : 17);
		feed.jump(timeline.getTimeCursor());
		page.header.classed('dark',false);

		page.node.select('.controls').classed('hidden',true);
		d3.select('#night').style('display',(page.id != 'journal' && page.id != 'map' ? 'none':'block'));
		d3.select('#mapPage div.logos').classed('hidden',true);
	}


	page.hide = function(){
		page.getNode().classed('hidden',true);
		page.button.classed('active',false);
		page.node.select('.controls').classed('hidden',false);
	}

	return page;
}




function PagePane(i){

	var node = d3.select('#mapPage div.pane:nth-child(' + (i+1) + ')');


	var show = function(){
		node.classed(i==0?'dimmed':'hidden',false);
	}


	var hide = function(){
		node.classed(i==0?'dimmed':'hidden',true);
	}


	function getNode(){
		return node;
	}


	return {
		getNode: getNode,
		show: show,
		hide: hide
	};
}

;

/*
	Loads all features day by day and stores them .
*/

function Loader(){

	var loading = [];
	var tweets = [];
	var photos = [];
	var sightings = [];
	var beacons = [];
	var blogs = [];
	var sounds = [];
	var members = {};	
	var loadedDays = [];


	function getDayCount(callback){
		var query = 'http://intotheokavango.org/api/expeditions';
		d3.json(query, function(error, data){
			if(error) return console.log("Failed to load " + query + ": " + error.statusText);
			data = data.results;
			var d = data['okavango_'+expeditionYear].StartDate.split(' ')[0];
			query = 'http://intotheokavango.org/api/features/?FeatureType=ambit&expedition=okavango_'+expeditionYear+'&startDate='+d+'&endDate=2016-09-17&limit=0&resolution=86400';
			d3.json(query, function(error, data){
				if(error) return console.log("Failed to load " + query + ": " + error.statusText);
				data = data.results;
				var len = data.features.length+1;
				callback(len, d);
			});
		});
	}

	function loadDay(day, callback) {
		console.log('loading data for day #' + day);
		var toBeCompleted = 5;
		function checkForCompletion(){
			// console.log(toBeCompleted);
			toBeCompleted --;
			if(toBeCompleted == 0) {
				console.log('loading completed for day #' + day);
				loadedDays[day] = true;
				callback(day);
			}
		}

		tweets[day] = [];
		photos[day] = [];
		sightings[day] = [];
		beacons[day] = [];
		blogs[day] = [];
		sounds[day] = [];

		loadPath(day, checkForCompletion);
		loadTweets(day, checkForCompletion);
		loadPhotos(day, checkForCompletion);
		loadSightings(day, checkForCompletion);
		loadBlogPosts(day, checkForCompletion);
		// loadSoundPosts(day, checkForCompletion);
		// loadBeacons(day, checkForCompletion);
	}


	function loadPath(day, callback){
		loading[day] = true;
		var query = 'http://intotheokavango.org/api/features?FeatureType=ambit_geo&Expedition=okavango_'+expeditionYear+'&expeditionDay='+(day+timeOffsets[expeditionYear].query)+'&limit=0'
		d3.json(query, function(error, data) {
			if(error) return console.log("Failed to load " + query + ": " + error.statusText);
			data = data.results;		
		    L.geoJson(data, {
		        filter: function(feature, layer) {
			        return (feature.geometry.coordinates[0] != 0);
			    },
			    pointToLayer: function (feature, latLng) {
			    	var name = feature.properties.Member;
			    	var timestamp = feature.properties.t_utc;
			        var marker = L.circleMarker(latLng);
			        return marker;
			    },
			    onEachFeature: function(feature){
			    	var name = feature.properties.Member;
			    	var latLng = L.latLng(feature.geometry.coordinates[1],feature.geometry.coordinates[0]);
			    	var time = feature.properties.t_utc + timeOffsets[expeditionYear].timeAmbit + timeOffsets[expeditionYear].dateAmbit;
			    	var core = feature.properties.CoreExpedition;
			        if(!members[name]) {
			        	// latLng = L.latLng(-12.811059+((Math.random()*2)-1)*0.0005, 18.175099+((Math.random()*2)-1)*0.0005);
			        	members[name] = Member(name, latLng, day);
			        }
			        // members[name].addAmbitGeo(day, latLng, time, core, time < new Date('2015-05-19'));
			        members[name].addAmbitGeo(day, latLng, time, core);
			    }
			});
			var activityInterval = [0, 10000000000];
			for(m in members){
				var member = members[m];
				var pathQueue = member.getPathQueueByDay(day);
				if(!pathQueue){
					// member.fillEmptyPathQueue(day);
				} else {
					if(activityInterval[0] < pathQueue[0].time) activityInterval[0] = pathQueue[0].time;
					if(activityInterval[1] > pathQueue[pathQueue.length-1].time) activityInterval[1] = pathQueue[pathQueue.length-1].time;
				}
			}
			activityInterval[0]+(10*60);
			activityInterval[1]-(10*60);
			// console.log(day, new Date(activityInterval[0]*1000),new Date(activityInterval[1]*1000));
			for(m in members) members[m].initPathQueue();
			timeline.setNightTime(day, activityInterval);
			callback();
		});   
	}


	function loadTweets(day, callback){

		var markerIcon = L.icon({
	        iconUrl: '../static/img/quote.png',
	        shadowUrl: '../static/img/quoteShadow.png',
	        iconSize:     [40,40],
	        shadowSize:   [40,40],
	        iconAnchor:   [15,35],
	        shadowAnchor: [15,35],
	        popupAnchor:  [10,-40]
	    });

	    var markerOptions = {
	        icon:markerIcon,
	        iconSize:[20,20]
	    };

		var query = 'http://intotheokavango.org/api/features?FeatureType=tweet&Expedition=okavango_'+expeditionYear+'&expeditionDay='+(day+timeOffsets[expeditionYear].query)+'&limit=0'
		d3.json(query, function(error, data) {
			if(error) return console.log("Failed to load " + query + ": " + error.statusText);
			data = data.results;	
		    L.geoJson(data.features, {
		        filter: function(feature, layer) {
		        	if(expeditionYear == '15') return (feature.geometry.coordinates[0] != 0 && feature.properties.Text.substring(0,2).toLowerCase() != 'rt');
		        	else return (feature.geometry.coordinates[0] != 0 && feature.properties.Tweet.text.substring(0,2).toLowerCase() != 'rt');
		        },
		        pointToLayer: function (feature, latlng) {
                    var marker = L.marker(latlng, markerOptions);
                    tweetLayer.addLayer(marker);
                    var tweet = TweetPost(feature, marker);
		        	if(tweet) tweets[day].push(tweet);
                    return marker;
                }
		    });
		    callback();
		});
	}

	
	function loadBlogPosts(day, callback){

		var markerIcon = L.icon({
	        iconUrl: '../static/img/quote.png',
	        shadowUrl: '../static/img/quoteShadow.png',
	        iconSize:     [40,40],
	        shadowSize:   [40,40],
	        iconAnchor:   [15,35],
	        shadowAnchor: [15,35],
	        popupAnchor:  [10,-40]
	    });

	    var markerOptions = {
	        icon:markerIcon,
	        iconSize:[20,20]
	    };

		var query = 'http://intotheokavango.org/api/features?FeatureType=blog&Expedition=okavango_'+expeditionYear+'&expeditionDay='+(day+timeOffsets[expeditionYear].query)+'&limit=0';
		d3.json(query, function(error, data) {
			if(error) return console.log("Failed to load " + query + ": " + error.statusText);
			data = data.results;	
		    L.geoJson(data.features, {
		        filter: function(feature, layer) {
		        	if(feature.geometry == null){
			            var blog = BlogPost(feature);
		        		if(blog) blogs[day].push(blog);
				        return false;
		            } else return true;
		        },
		        pointToLayer: function (feature, latlng) {
                    var marker = L.marker(latlng, markerOptions);
                    blogLayer.addLayer(marker);
                    var blog = BlogPost(feature, marker);
		        	if(blog) blogs[day].push(blog);
                    return marker;
                }
		    });
		    callback();
		});
	}


	function loadSoundPosts(day, callback){

		var markerIcon = L.icon({
	        iconUrl: '../static/img/quote.png',
	        shadowUrl: '../static/img/quoteShadow.png',
	        iconSize:     [40,40],
	        shadowSize:   [40,40],
	        iconAnchor:   [15,35],
	        shadowAnchor: [15,35],
	        popupAnchor:  [10,-40]
	    });

	    var markerOptions = {
	        icon:markerIcon,
	        iconSize:[20,20]
	    };

		var query = 'http://intotheokavango.org/api/features?FeatureType=audio&Expedition=okavango_'+expeditionYear+'&expeditionDay='+(day+timeOffsets[expeditionYear].query)+'&limit=0';
		d3.json(query, function(error, data) {
			if(error) return console.log("Failed to load " + query + ": " + error.statusText);
			data = data.results;	
		    L.geoJson(data.features, {
		        filter: function(feature, layer) {
		        	return feature.geometry != null;
		        },
		        pointToLayer: function (feature, latlng) {
                    var marker = L.marker(latlng, markerOptions);
                    soundLayer.addLayer(marker);
                    var sound = SoundPost(feature, marker);
		        	if(sound) sounds[day].push(sound);
                    return marker;
                }
		    });
		    callback();
		});
	}


	function loadPhotos(day, callback){

		var markerIcon = L.icon({
	        iconUrl: '../static/img/picIcon.png',
	        shadowUrl: '../static/img/quoteShadow.png',
	        iconSize:     [30,30],
	        shadowSize:   [30,30],
	        iconAnchor:   [15,35],
	        shadowAnchor: [15,35],
	        popupAnchor:  [10,-40]
	    });

	    var markerOptions = {
	        icon:markerIcon,
	        iconSize:[20,20]
	    };

		var query = 'http://intotheokavango.org/api/features?FeatureType=image&Expedition=okavango_'+expeditionYear+'&expeditionDay='+(day+timeOffsets[expeditionYear].query)+'&limit=0'
		d3.json(query, function(error, data) {
			if(error) return console.log("Failed to load " + query + ": " + error.statusText);
			data = data.results;	
		    L.geoJson(data.features, {
		        filter: function(feature, layer) {
		            if(feature.properties.Member == null){
			            var photo = PhotoPost(feature);
				        if(photo) photos[day].push(photo);
				        return false;
		            } else return true;
		        },
		        pointToLayer: function (feature, latlng) {
	                    var marker = L.marker(latlng, markerOptions);
	                    tweetLayer.addLayer(marker);
	                    var photo = PhotoPost(feature, marker);
				        if(photo) photos[day].push(photo);
	                    return marker;
                }
		    });
		    callback();
		});
	}

	function loadSightings(day, callback){

		var colorMap = [];

		var quoteIcon = L.icon({
		    iconUrl: '../static/img/quote.png',
		    shadowUrl: '../static/img/quoteShadow.png',

		    iconSize:     [40,40],
		    shadowSize:   [40,40],
		    iconAnchor:   [15,35],
		    shadowAnchor: [15,35],
		    popupAnchor:  [10,-40]
		});

		var sightingOptions = {
		    radius: 2,
		    fillColor: "#FFF",
		    color: "#78BD52",
		    weight: 0,
		    opacity: 0.3,
		    fillOpacity: 0.7,
		};

		var query = 'http://intotheokavango.org/api/features?FeatureType=sighting&Expedition=okavango_'+expeditionYear+'&expeditionDay='+(day+timeOffsets[expeditionYear].query)+'&limit=0'
		d3.json(query, function(error, data) {
			if(error) return console.log("Failed to load " + query + ": " + error.statusText);
			data = data.results;	
			
		    L.geoJson(data.features, {
		        filter: function(feature, layer) {
		        	if(feature.geometry == 'null') return false;
		            return (feature.geometry.coordinates[0] != 0);
		        },
		        pointToLayer: function (feature, latlng) {
                    var scatterX = ((Math.random() * 2) - 1) * 0.0005;
                    var scatterY = ((Math.random() * 2) - 1) * 0.0005;
                    var latlng2 = L.latLng(latlng.lat + scatterY, latlng.lng + scatterX);
			        var marker = L.circleMarker(latlng2, sightingOptions);
		        	sightingLayer.addLayer(marker);			        
			        var sighting = Sighting(feature, marker);
		            if(sighting) sightings[day].push(sighting);
			        return marker;
                },
			    style: function(feature) {
			    	var c = Math.sqrt(feature.properties["Count"]);
			    	var so = {radius: 2 + (c * 2)};
			    	if (feature.properties.SpeciesName.indexOf("quote.") != -1) {
			 
			    	} else {
			    		var bn = feature.properties.SpeciesName;
			    		if (colorMap[bn] == undefined) {
			    			var c = new RColor().get(true);
			    			so.fillColor = c;
			    			colorMap[bn] = c;
			    		} else {
			    			so.fillColor = colorMap[bn];
			    		}
			    	}
			        return so;
			    }
		    });
		    callback();
		});

	}


	function loadBeacons(day, callback){

		var starIcon = L.icon({
		    iconUrl: '../static/img/star2.png',
		    shadowUrl: '../static/img/starShadow2.png',

		    iconSize:     [20,20],
		    shadowSize:   [20,20],
		    iconAnchor:   [10,10],
		    shadowAnchor: [10,10],
		    popupAnchor:  [0,-10]
		});

		var beaconOptions = {
			icon:starIcon,
			iconSize:[20,20]
		};

		var beaconCoords = [];

		var query = 'http://intotheokavango.org/api/features?FeatureType=beacon&Expedition=okavango_'+expeditionYear+'&expeditionDay='+(day+timeOffsets[expeditionYear].query)+'&limit=0'
		d3.json(query, function(error, data) {
			if(error) return console.log("Failed to load " + query + ": " + error.statusText);
			data = data.results;	
			
		    L.geoJson(data.features, {
		        filter: function(feature, layer) {
		        	// set a minimum distance of 200m between each beacon
		        	if(beacons[day].length>0){
		        		var coords = [];
		        		coords[0] = beacons[day][beacons[day].length-1].getLatLng();
		        		coords[1] = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
		        		if(coords[0].distanceTo(coords[1]) < 200) return false; 
					}
		        	if(feature.geometry == 'null') return false;
		        	if(feature.geometry.coordinates[0] == 0) return false;
		        	return true;
		        },
		        pointToLayer: function (feature, latlng) {
		        	var marker = L.marker(latlng, beaconOptions);
		        	var beacon = Beacon(feature, marker);
		            if(beacon) beacons[day].push(beacon);
			        beaconLayer.addLayer(marker);
			        beaconCoords.push([latlng.lng, latlng.lat]);
			        return marker;
                }
		    });

			if (beacons.length > 0 && beacons[0].length>0) {
				var paths = [{
					"type":"Feature",
					"properties":{
						"test":"yes"
					},
					"geometry":{
						"type":"LineString",
						"coordinates":beaconCoords
					}
				}];

				var pathStyle = {
				    fillColor: "#fff",
				    color: "#AEB1FF",
				    weight: 3,
				    opacity: 0.25
				};
							
				var beaconPath = L.geoJson(paths, {	style:pathStyle	});
				beaconPathLayer.addLayer(beaconPath);
	        }

		    callback();
		});


		

	}


	function getTweets(){
		return tweets;
	}


	function getPhotos(){
		return photos;
	}

	function getLoading(){
		return loading;
	}

	function getLoadedDays(){
		return loadedDays;
	}

	function getFeatures(){
		return {
			sightings: sightings,
			tweets: tweets,
			photos: photos,
			beacons: beacons,
			blogs: blogs
		}
	}

	function getBlogs(){
		return blogs;
	}

	return {
		loadDay: loadDay,
		members: members,
		getBlogs: getBlogs,
		getTweets: getTweets,
		getPhotos: getPhotos,
		getLoading: getLoading,
		getDayCount: getDayCount,
		getLoadedDays: getLoadedDays,
		getFeatures: getFeatures,
		expeditionYear: expeditionYear	
	};
}

;

/*
	Describes members' markers on the map
*/


function Member(n, l, d){

	var name = n;
	var pathQueueByDay = [];
	var pathQueue = [];
	var timeCursor = 0;
	var dayCursor = d;
	var latLng = l;
	var tLatLng = new L.LatLng(l.lat,l.lng);
	var icon = L.divIcon({
		className: 'memberMarker', 
		html: '<img src="static/img/beacon.svg"/><p>' + name.charAt(0) + '<span>'+ name.slice(1,name.length) +'</span></p>', 
		iconSize:['50px','40px']});
	var marker = L.marker(latLng, {icon: icon}).addTo(map);


	// (function init(){
	// 	var l = L.latLng(-12.811059,18.175099);
	// 	var t = feature.properties.t_utc + timeOffsets[expeditionYear].timeAmbit + timeOffsets[expeditionYear].dateAmbit;
	// 	var c = true;
	// 	pathQueueByDay[0].push({latLng:l, time:t, core:c})
	// })();


	function addAmbitGeo(d, l, t, c, origin){
		if(!pathQueueByDay[d]) pathQueueByDay[d] = [];
	    // pathQueueByDay[d].push({latLng:origin? l:latLng, time:t, core:c});
	    pathQueueByDay[d].push({latLng:l, time:t, core:c});
	}

	function teleport(time){
		var interval = [];
		var len = pathQueue.length;
		for(var i = 1; i<len-1; i++){
			if((time >= pathQueue[i].time && time < pathQueue[i+1].time) || (time < pathQueue[i].time && i==1) || (time > pathQueue[i+1].time && i==len-2)){
				interval = [pathQueue[i], pathQueue[i+1]];
				timeCursor = i;
				break;
			}
		}
		if(interval.length == 2){
			var lat = Math.map(time, interval[0].time, interval[1].time, interval[0].latLng.lat, interval[1].latLng.lat);
			var lng = Math.map(time, interval[0].time, interval[1].time, interval[0].latLng.lng, interval[1].latLng.lng);
			latLng = new L.LatLng(lat,lng);
		} else {}

		marker.setLatLng(latLng);
	}


	function move(time){
		if(!time) return;
		var forward = time.current >= time.last;
		var fw = forward ? 1:-1;
		time = time.current;
		var interval = [];
		var len = pathQueue.length;


		// UGLY

		var aga = new Date().getTime();

		if(timeCursor > -1){
			for(var i = Math.constrain(timeCursor-fw,0,len-1); forward?(i<len-1):(i>0); i+=fw){
				if(time >= pathQueue[i + (forward?0:-1)].time && time < pathQueue[i + (forward?1:0)].time){
					interval = [pathQueue[i + (forward?0:-1)], pathQueue[i + (forward?1:0)]];
					timeCursor = i;
					break;
				}
			}
		} else {
			for(var i = 1; i<len-1; i++){
				if(time >= pathQueue[i + (forward?0:-1)].time && time < pathQueue[i + (forward?1:0)].time){
					interval = [pathQueue[i + (forward?0:-1)], pathQueue[i + (forward?1:0)]];
					timeCursor = i;
					break;
				}
			}
		}

		if(interval.length == 2){
			var lat = Math.map(time, interval[0].time, interval[1].time, interval[0].latLng.lat, interval[1].latLng.lat);
			var lng = Math.map(time, interval[0].time, interval[1].time, interval[0].latLng.lng, interval[1].latLng.lng);
			tLatLng = new L.LatLng(lat,lng);
		} else {
			// console.log('could not find path: ' + name);
		}

		// if(latLng.distanceTo(tLatLng) > 1000){
		// 	latLng.lat = tLatLng.lat;
		// 	latLng.lng = tLatLng.lng;
		// } else {
			latLng.lat = Math.lerp(latLng.lat,tLatLng.lat,0.3);
			latLng.lng = Math.lerp(latLng.lng,tLatLng.lng,0.3);
		// }
		marker.setLatLng(latLng);

		if(interval.length==2) return interval[0].core;
		else return true;

	}


	function getLatLng(){
		return latLng;
	}

	function getPathQueue(){
		return pathQueue;
	}

	function getPathQueueByDay(i){
		return pathQueueByDay[i];
	}

	function initPathQueue(){
		pathQueue = [];
	    var len = pathQueueByDay.length;
	    for(var i=0; i<len; i++){
	    	if(pathQueueByDay[i]){
	    		if(i >= 1 && pathQueueByDay[i-1]) pathQueueByDay[i][0].latLng = pathQueueByDay[i-1][pathQueueByDay[i-1].length-1].latLng;
		    	if(pathQueue.length == 0) pathQueue = pathQueueByDay[i];
		    	else pathQueue = pathQueue.concat(pathQueueByDay[i]);
		    }
	    }
	    timeCursor = -1;
	}

	function fillEmptyPathQueue(d){
		// pathQueueByDay[d].push({latLng:l, time:t, core:c});
	}


	return{
		addAmbitGeo: addAmbitGeo,
		getLatLng: getLatLng,
		name: name,
		marker: marker,
		move: move,
		getPathQueue: getPathQueue,
		getPathQueueByDay: getPathQueueByDay,
		timeCursor: timeCursor,
		initPathQueue: initPathQueue,
		teleport: teleport,
		fillEmptyPathQueue: fillEmptyPathQueue
	}
}

;

/*
	Interactive timeline on the map and journal page. Also handles all time related interactions.
*/


function Timeline(){

	var timeFrame = [100000000000000,0];
	var totalTimeFrame = [0,new Date().getTime()];
	var node = d3.select('#timeline');
	var height;
	var controlNode = d3.select('div.controls div.control-playback');
	var lastControlState = 'Pause';
	var dayCursor = 0;
	var timeCursor = -1;
	var prevTimeCursor = -1;

	var autoSpeed = 2;
	var speed = autoSpeed;
	var tSpeed = autoSpeed;
	var wheelDelta = 0;
	var paused = false;
	var isNightTime = false;
	var nightTime = [];

	var dayCount = 16;
	var graphicsInitialized = false;
	var dates = [];
	var dayRad = 2.5;
	var margin = 10;
	var cursor;
	var cursorY = 0;
	var cursorTY = 0;
	var cursorHovered = false;
	var cursorDate = new Date();


	node.append('line')
		.attr('x1','80%')
		.attr('y1',margin)
		.attr('x2','80%')
		.attr('y2','100%')
		.attr('stroke','#FFFFFF')
		.style('pointer-events','none');

	var nightNode = d3.select('#map').append('div').attr('id','night');

	function setDates(count,start){
		dates = [];
		dayCount = count;
		var t = new Date(start).getTime()/1000-3600*24;
		totalTimeFrame[0] = t -4*3600;
		for(var i=0; i<=dayCount; i++){
			var d = new Date((t+(24*3600*(i)))*1000);
			dates.push(d);
			totalTimeFrame[1] = t+(24*3600*(i)-1) -4*3600;
		}
	}

	function init(day, lastDay){
		for(var i=day-1; i<day+2; i+=2){
			if(i >= 0 && !loader.getLoading()[i]){
				if(i>=0 && i<dayCount){
					loader.loadDay(i,function(day){
						// day = day that was just loaded
						feed.init(day);
						setTimeFrame();
					});
				}
			}
		}
	}	

	function initGraphics(){

		node.selectAll('circle.day')
			.data(dates)
			.enter()
			.append('circle')
			.attr('class','day')
			.attr('cx','80%')
			.attr('r',dayRad)
			.attr('fill','rgb(255,255,255)')
			.style('pointer-events','none');

		cursor = node.append('g')
			.style('pointer-events','none')
			.attr('class','cursor')
			.each(function(){
				d3.select(this)
					.append('text')
					.each(function(){
						d3.select(this)
							.append('tspan')
							.attr('x','66%')
							.attr('dy','-0.8em')
							.text('jun 05');
						d3.select(this)
							.append('tspan')
							.attr('x','66%')
							.attr('dy','1.6em')
							.text('05:05');
					})

				d3.select(this)
					.append('line')
					.attr('x1','90%')
					.attr('x2','100%')
					.attr('stroke','#FFFFFF');

				d3.select(this)
					.append('line')
					.attr('x1','0%')
					.attr('x2','10%')
					.attr('stroke','#FFFFFF');
			})

		node.on('mousemove',function(){
			if(!jumping){
				cursorHovered = true;
				cursorTY = Math.constrain(d3.event.layerY-30,margin+dayRad,height-dayRad);
				updateCursor(d3.event.layerY-30);
			}
		}).on('mouseout',function(){
			cursorHovered = false;
		}).on('click',function(){
			cursorHovered = false;
			if(!jumping){
				d3.event.stopPropagation();
				var d = Math.round(Math.constrain(Math.map(d3.event.layerY-30,margin,height-dayRad*2,totalTimeFrame[0],totalTimeFrame[1]),totalTimeFrame[0],totalTimeFrame[1]));
				jumpTo(d);
			}
		});

		resize();

	}

	function resize(){

		height = getBodyHeight()-70;

		node.select('line')
			.attr('y1',margin)
			.attr('y2',height);

		node.selectAll('circle.day')
			.attr('cy',function(d,i){
				return margin + dayRad + (i*((height-margin-dayRad*2)/(dates.length-1)));
			});
	}

	function initTimeCursor(){
		var timestamps = [];
		for(m in loader.members){
			var member = loader.members[m];
			timestamps.push(member.getPathQueue()[0].time);
		}
		timeCursor = timestamps.min();
		prevTimeCursor = timeFrame[0]-1;
		isNightTime = timeCursor < nightTime[dayCursor][0] || prevTimeCursor >= nightTime[dayCursor][1];
		// console.log(new Date(timeCursor*1000), new Date(nightTime[dayCursor][0]*1000), new Date(nightTime[dayCursor][1]*1000));
		// console.log('NIGHT1',isNightTime);
	}

	function setTimeFrame(){

		var loaded = loader.getLoadedDays();
		if(timeCursor != -1) dayCursor = Math.constrain(Math.floor(Math.map(timeCursor,totalTimeFrame[0],totalTimeFrame[1],0,dayCount)),0,dayCount-1);
		timeFrame = [dates[dayCursor].getTime()/1000 -4*3600,dates[dayCursor+1].getTime()/1000-1 -4*3600];
		// console.log('LOL', new Date(totalTimeFrame[0]*1000),new Date(totalTimeFrame[1]*1000),new Date(timeFrame[0]*1000),new Date(timeFrame[1]*1000));
		for(var i=dayCursor-1; i>=0; i--){
			if(loaded[i]) {
				timeFrame[0] = dates[i].getTime()/1000 -4*3600;
			} else break;
		}
		// console.log('Aasdsaddssa', dates.slice());
		for(var i=dayCursor; i<dates.length-1; i++){
			if(loaded[i]) {
				timeFrame[1] = dates[i+1].getTime()/1000-1 -4*3600;
			} else break;
		}
	}


	function update(frameRate){
		speed = Math.lerp(speed,tSpeed,0.2);
		if(wheelDelta == 0 && Math.abs(tSpeed-speed) < 0.2) {
			updateControl(paused?'Play':'Pause');
		}
		prevTimeCursor = timeCursor;
		timeCursor += (speed*60/frameRate)*(isNightTime ? 300:1) + wheelDelta*(isNightTime && pages.active.id == 'map' ? 20:1);
		timeCursor = Math.constrain(timeCursor, timeFrame[0], timeFrame[1]);
		// console.log(new Date(timeCursor*1000), 'LOL', new Date(totalTimeFrame[0]*1000),new Date(totalTimeFrame[1]*1000),'LOL',new Date(timeFrame[0]*1000),new Date(timeFrame[1]*1000));

		wheelDelta = 0;

		var day = Math.constrain(Math.floor(Math.map(timeCursor-4*3600,totalTimeFrame[0],totalTimeFrame[1],0,dayCount)),0,dayCount);
		var lastDay = Math.constrain(Math.floor(Math.map(prevTimeCursor-4*3600,totalTimeFrame[0],totalTimeFrame[1],0,dayCount)),0,dayCount);
				
		if(day != lastDay) {
			newDay();
		} else{
			for(var i=0; i<2; i++){
				if(timeCursor < nightTime[dayCursor][i] && prevTimeCursor >= nightTime[dayCursor][i]) toggleNightTime(i,false); 
				if(timeCursor >= nightTime[dayCursor][i] && prevTimeCursor < nightTime[dayCursor][i]) toggleNightTime(i,true); 
			}
			// console.log(new Date(timeCursor*1000), new Date(nightTime[dayCursor][0]*1000), new Date(nightTime[dayCursor][1]*1000));
		}
		updateCursor();
	}

	function updateCursor(hover){

		if(!cursorHovered) cursorTY = margin + Math.map(timeCursor,totalTimeFrame[0],totalTimeFrame[1],0,height-margin-dayRad*2);

		cursorY = Math.lerp(cursorY,cursorTY,0.2);
		cursor.attr('transform','translate(0,'+cursorY+')');
		if(!cursorHovered) cursorDate = new Date(timeCursor*1000);
		else if(hover){
			cursorDate = new Date(Math.constrain(Math.map(hover,margin,height-dayRad*2,totalTimeFrame[0],totalTimeFrame[1]),totalTimeFrame[0],totalTimeFrame[1])*1000);
		}
		var d = new Date(offsetTimezone(cursorDate.getTime()));
		var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var mo = monthNames[d.getMonth()];
		var da = d.getDate();
		if(da < 10) da = '0' + da;
		cursor.select('text tspan:first-child').text(mo + ' ' + da);
		var ho = d.getHours();
		if(ho < 10) ho = '0'+ho;
		var mi = d.getMinutes();
		if(mi < 10) mi = '0'+mi;
		cursor.select('text tspan:last-child').text(ho + ':' + mi);
	}

	function toggleNightTime(i,forward){
		isNightTime = (i==0 && !forward) || (i==1 && forward);
		timeCursor = nightTime[dayCursor][i] + (forward?1:-1);
		nightNode.classed('night',isNightTime);
	}


	function newDay(){
		var forward = timeCursor > prevTimeCursor;
		dayCursor += forward ? 1 : -1;
		init(dayCursor);
		cullMarkersByDay();
	}

	function cullMarkersByDay(){
		var features = ['sightings', 'tweets', 'photos', 'beacons', 'blogs'];
		for(var k=0; k<features.length; k++){
			var f = loader.getFeatures()[features[k]];
			for(var i=0; i<f.length; i++){
				if(f[i]){
					var len = f[i].length;
					for(var j=0; j<len; j++){
						var sighting = f[i][j];
						if(Math.abs(dayCursor-i)<=1){
							sighting.setVisible(true);
						} else {
							sighting.setVisible(false);
						}
					}
				}
			}
		}
	}

	function navigateMap(delta){
		// console.log(new Date(timeCursor*1000));
		tSpeed = 0;
		speed = 0;
		requestAnimationFrame(function(){
			tSpeed = paused ? 0 : autoSpeed;
		})
		wheelDelta = -delta/4;
		updateControl(wheelDelta>0?'FastForward':'FastBackward');
		if(pages.active.id == 'map'){
			d3.select('#map div.scrollPane').node().scrollTop = 2000;
		}
	}


	function navigateJournal(t){
		tSpeed = 0;
		speed = 0;
		wheelDelta = t-timeCursor;
	}


	function jumpTo(d){

		function updatePos(){
			var coord = [0,0];
			for(m in loader.members){
				var member = loader.members[m];
				member.teleport(timeCursor);
			}
		}

		function checkNightTime(){
			isNightTime = timeCursor < nightTime[dayCursor][0] || prevTimeCursor >= nightTime[dayCursor][1];
			nightNode.classed('night',isNightTime);
		}

		function resume(){
			feed.init(day);
			init(day);
			setTimeFrame();
			checkNightTime();
			jumping = false;
			updatePos();
			if(pages.active.id == 'journal') feed.jump(getTimeCursor());
			if(!paused){
				togglePause('pause');
				setTimeout(function(){
					togglePause('play')
				},2000)
			}
			speed = 0;
			wheelDelta = 0;
			cullMarkersByDay();
		}

		var day = Math.constrain(Math.floor(Math.map(d-4*3600,totalTimeFrame[0],totalTimeFrame[1],0,dayCount)),0,dayCount);
		timeCursor = d;
		prevTimeCursor = timeCursor-1;
		console.log('Jumping to day: ' + day);
		if(!loader.getLoading()[day]){
			jumping = true;
			loader.loadDay(day,function(day){
				resume();
			});
		} else {
			resume();
		}
	}


	function getTimeCursor(){
		return {current: timeCursor, last: prevTimeCursor, day: dayCursor};
	}


	function togglePause(state){
		if(state) paused = state == 'pause';
		else paused = !paused;
		tSpeed = paused ? 0 : autoSpeed;
		updateControl(paused?'Play':'Pause');
	}

	function updateControl(state){
		if(lastControlState != state) controlNode.style('background-image','url("static/img/icon'+state+'.svg")');
		lastControlState = state;
	}

	function setNightTime(day, interval){
		nightTime[day] = interval;
	}

	function getBodyHeight(){
		var containerHeight = d3.select('#mapPage').node().parentNode.parentNode.clientHeight;
		var headerHeight = d3.select('#header').node().clientHeight;
		return containerHeight - headerHeight;
	}

	return {
		init: init,
		initGraphics: initGraphics,
		initTimeCursor: initTimeCursor,
		getTimeCursor: getTimeCursor,
		navigateMap: navigateMap,
		navigateJournal: navigateJournal,
		resize: resize,
		togglePause: togglePause,
		setTimeFrame: setTimeFrame,
		setNightTime: setNightTime,
		update: update,
		updateControl: updateControl,
		setDates: setDates,
		jumpTo: jumpTo
	};
}



;

/*
	Used on the about page to move the map randomly.
*/


function Wanderer(p){

	var pos = {'x':p.lng,'y':p.lat};
	var velocity = {'x':Math.random()*0.002-0.001,'y':Math.random()*0.002-0.001};
	var acceleration = {'x':0,'y':0};
	var r = 0.0003;
	var wanderTheta = 0;
	var maxSpeed = 0.000005;
	var maxForce = 0.000000125;


	if(debug){
		var svg = d3.select('#beaconContainer')
	    	.append('svg')
	    	.classed('wanderer',true)

	    svg.append('circle')
	    	.attr('stroke','rgb(255,0,0)')
	    	.attr('fill','none')
	    	.attr('cx',150)
	    	.attr('cy',150)
	    	.attr('r',20)

	    svg.append('rect')
	    	.attr('stroke','rgb(255,0,0)')
	    	.attr('fill','none')
	    	.attr('x',145)
	    	.attr('y',145)
	    	.attr('width',10)
	    	.attr('height',10)

	    svg.append('line')
	    	.attr('stroke','rgb(255,0,0)')
	    	.classed('origin',true)

	    svg.append('line')
	    	.attr('stroke','rgb(255,0,0)')
	    	.classed('target',true)
    }


	var update = function(){
		velocity.x += acceleration.x;
		velocity.y += acceleration.y;
		velocity.x = Math.min(velocity.x, maxSpeed);
		velocity.y = Math.min(velocity.y, maxSpeed);
		pos.x += velocity.x;
		pos.y += velocity.y;
		acceleration.x = 0;
		acceleration.y = 0;
		return pos;
	}


	var wander = function(){
		var wanderR = 0.000018;
		var wanderD = 0.004;
		var change = 0.3;
		wanderTheta += Math.random()*(change*2)-change;
		
		var circlePos = {'x':velocity.x,'y':velocity.y};
		var t = Math.atan2(circlePos.y,circlePos.x);

		circlePos.x = wanderD * Math.cos(t) + pos.x;
		circlePos.y = wanderD * Math.sin(t) + pos.y;

		var t = Math.atan2(velocity.y,velocity.x);
	    var circleOffset = {'x': wanderR*Math.cos(wanderTheta+t), 'y': wanderR*Math.sin(wanderTheta+t)};
	    var target = {'x': circlePos.x + circleOffset.x, 'y': circlePos.y + circleOffset.y}
	    seek(target);

	    if(debug){
		    svg.select('circle')
		    	.attr('cx',150+(circlePos.x - pos.x)*10000)
		    	.attr('cy',150+(-circlePos.y + pos.y)*10000)

		    svg.select('line.target')
		    	.attr('x1',150+(circlePos.x - pos.x)*10000)
		    	.attr('y1',150+(-circlePos.y + pos.y)*10000)
		    	.attr('x2',150+(circlePos.x - pos.x)*10000 + Math.cos(wanderTheta)*20)
		    	.attr('y2',150+(-circlePos.y + pos.y)*10000 - Math.sin(wanderTheta)*20)
	    }
	}


	var applyForce = function(force){
		acceleration.x += force.x;
		acceleration.y += force.y;
	}


	var seek = function(target){
		var desired = {'x':target.x-pos.x,'y':target.y-pos.y};
		var t = Math.atan2(desired.y,desired.x);
	    desired.x = maxSpeed * Math.cos(t);
		desired.y = maxSpeed * Math.sin(t);

		var steer = {'x':desired.x-velocity.x,'y':desired.y-velocity.y};
		var r = Math.sqrt(steer.x*steer.x+steer.y*steer.y);
		r = Math.min(r,maxForce);
		applyForce(steer);
	}
 

	return {
		'update': update,
		'wander': wander,
		'applyForce': applyForce,
		'seek': seek
	};
}

;Math.map = function(value, start1, stop1, start2, stop2) {
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
};;var playerOrigin = '*';
var vimeoPlayer;

window.addEventListener('message', onMessageReceived, false);
function onMessageReceived(event) {
    if (!(/^https?:\/\/player.vimeo.com/).test(event.origin)) {
        return false;
    }	        
    if (playerOrigin === '*') {
        playerOrigin = event.origin;
    }
    var data = JSON.parse(event.data);
    if(data.event == 'ready') onReady();
    if(data.event == 'play') onPlay();
}

function onReady() {
    var data = {
      method: 'addEventListener',
      value: 'play'
    };
    var message = JSON.stringify(data);
    vimeoPlayer = d3.select('iframe').node();
    vimeoPlayer.contentWindow.postMessage(data, playerOrigin);
}

function onPlay(){
	d3.select('#aboutPage #video div.cover')
		.transition()
		.style('opacity',0)
		.remove();
}

function pauseVimeoPlayer(){
    var data = {
      method: 'addEventListener',
      value: 'pause'
    };
    vimeoPlayer.contentWindow.postMessage(data, playerOrigin);
};

/*


	Okavango 2015 front-end.
	Please note I have been using the following javascript pattern: 
	http://radar.oreilly.com/2014/03/javascript-without-the-this.html	

	TODOS
	- pause video when hiding about page
	- screen for mobile and tablets
	- loading screen
	- teleport map once in a while
	- unzoom at car speed
	- starts on last day
	
	- free camera mode
	- scroll map while hovering a marker
	- dim out zoom buttons when max is reached
	- sound
	- linkable features
	- fix trail in about page
	- core features?
	- add link to tweets and blogposts
	- -4h in setDates(x2) and setTimeFrame(x2)
	- add location to post meta + link
	- test without smooth scroll and with touch scroll
	- How to cache data?
	- API error handling
	- filter crazy path points
	- scrollbar event for feed navigation?
	- there are 2 getBodyHeight functions
	- marker labels and popups
	- video features	
	- sightings taxonomy color
	- 'click to pause, scroll to navigate'
	- proper teleport
	- remove global functions/variables
	- margin journal alignment with timeline
	- label for day transition
	- finer grained culling
	- heartrate peak feature
	- live mode
	- togglePause highlight on map
	- dim out night sections of timeline
	- highlight journal in header nav on new contents
	- transitions between pages
	- no night on journal

*/


var debug = false;
var frameCount = 0;

var mapbox_username = "brianhouse"; //"blprnt";
var mapbox_map_id = "oxn5wd2a"; //"vsat7sho";

var loader;
var pages = {};
var map;
var tweetLayer;
var photoLayer;
var sightingLayer;
var beaconLayer;
var beaconPathLayer;
var blogLayer;
var soundLayer;
var timeline;
var feed;
var wanderer;

var expeditionYear = '15';

var timeOffsets = {
	'14':{
		'timeAmbit': 0,
		'dateAmbit': 2*24*3600,
		'tweet': 172760,
		'photo': 24*3600,
		'timezone': 4,
		'query': -1,
		'departure': 3,
		'startDate':0
	},
	'15':{
		'timeAmbit': 0,
		'dateAmbit': 0,
		'tweet': 0,
		'photo': 0,
		'timezone': 4,
		'query': 0,
		'departure': 3,
		'startDate':-1
	}
}

var paused = false;
var blurred = false;
var jumping = false;

var carCounter = 0;

$(document).ready(function(){
// document.addEventListener('DOMContentLoaded', function(){

    map = new L.map('map', {
        layers: new L.TileLayer('http://a.tiles.mapbox.com/v3/' + mapbox_username + '.map-' + mapbox_map_id + '/{z}/{x}/{y}.png'),
        zoomControl: false,
        center:new L.LatLng(-12.811059,18.175099),
        attributionControl: false,
        doubleClickZoom: false,
        scrollWheelZoom: true,
        boxZoom: false,
        touchZoom: false,
        dragging: false,
        keyboard: false,
        minZoom: 0,                    
        maxZoom: 20,
        zoom:17,
        scrollWheelZoom:false
    });

    tweetLayer = new L.layerGroup().addTo(map);
    photoLayer = new L.layerGroup().addTo(map);
    sightingLayer = new L.layerGroup().addTo(map);
    beaconLayer = new L.layerGroup().addTo(map);
    beaconPathLayer = new L.layerGroup().addTo(map);
    blogLayer = new L.layerGroup().addTo(map);
    soundLayer = new L.layerGroup().addTo(map);

    if(d3.selectAll('#navigation li')[0].length > 3){
	    loader = Loader();
	    pages.about = AboutPage('about');
	    pages.map = MapPage('map');    
	    pages.journal = JournalPage('journal');
	    pages.data = DataPage('data');
	    pages.share = Page('share');
	    timeline = Timeline();
		feed = Feed();
	} else {
		console.log('creating about');
		pages.about = AboutPage('about');
		pages.about.show();
	}
    wanderer = Wanderer(map.getCenter());

    if(d3.selectAll('#navigation li')[0].length > 3){
		// pages.map.show();
		pages.about.show();
		setLayoutInteractions();
		loader.getDayCount(function(dayCount,startDate){
			timeline.setDates(dayCount,startDate);
			loader.loadDay(timeline.getTimeCursor().day,function(day){
				timeline.setTimeFrame();
				feed.init(day);
				timeline.init(day);
				timeline.initGraphics();
				timeline.initTimeCursor();
				animate(new Date().getTime()-16);
			});
		});
		
	} else {
		window.addEventListener('resize',resize);
		resize();	
		setPause();
		animate(new Date().getTime()-16);
	}


	function animate(lastFrameTime){
		if(!paused){
			var frameTime = new Date().getTime();
			var frameRate = 1000/(frameTime - lastFrameTime);
			if(frameRate < 0.5) frameRate = 60;
		    frameCount ++;
		    if(!blurred && !jumping){
			    if(pages.active.id == 'map' || pages.active.id == 'journal'){
				    timeline.update(frameRate);
				    var coord = [0,0];
				    var i = 0;
					
					for(m in loader.members){
						var member = loader.members[m];
						var isCore = member.move(timeline.getTimeCursor());
						// if(isCore){
						// 	var c = member.getLatLng();
						// 	coord[0] += c.lat;
						// 	coord[1] += c.lng;
						// 	i++;
						// }
					}
					// coord[0] /= i;
					// coord[1] /= i;

					// var latLng = new L.LatLng(coord[0],coord[1]);
					// if(loader.members['Steve'].getLatLng().distanceTo(latLng) > 500) latLng = loader.members['Steve'].getLatLng();
					// var previousCenter = map.getCenter();
					map.panTo(loader.members['Steve'].getLatLng(), {animate:false});

					// carCounter = Math.constrain(carCounter + (previousCenter.distanceTo(map.getCenter()) > 100?1:-1),0,30);
					// if(carCounter == 30 && map.getZoom() == 17) map.setZoom(13);
					// if(carCounter == 0 && map.getZoom() == 13) map.setZoom(17);

					var matrix = d3.select('#map div.leaflet-map-pane').style('transform').split(', ');
					matrix = matrix[0]+', '+matrix[1]+', '+matrix[2]+', '+matrix[3]+', '+(-1*parseFloat(matrix[4]))+', '+(-1*parseFloat(matrix[5]))+')';
					d3.select('#map div.scrollPane').style('transform',matrix);
					d3.select('#map div.scrollPane').node().scrollTop = 2000;
				
				} else {
					wanderer.wander();
			    	var target = wanderer.update();
			    	map.panTo(new L.LatLng(target.y,target.x), {animate:false});
				}
			}
		}
		requestAnimationFrame(function(){animate(frameTime)});
	}


	function setLayoutInteractions(){			

		d3.selectAll('#navigation li')
	    	.on('click',function(d,i){
	    		if(i<4){
		    		var btn = d3.select(this);
		    		var t = btn.text().toLowerCase();
		    		pages.active.hide();
		    		pages[t].show();
		    		resize();
		    	}
	    	});

	    if(d3.selectAll('#navigation li')[0].length > 3){
			d3.selectAll('#cta')
		    	.on('click',function(d,i){
		    		pages.active.hide();
		    		pages['map'].show();
		    		resize();
		    	});
	    }

	    d3.select('#map div.leaflet-layer')
	    	.append('div')
	    	.attr('class','scrollPane')
	    	.append('div');

		d3.select('#map div.scrollPane div')
	    	.on('mousewheel',function(){
	    		if(pages.active.id == 'map') timeline.navigateMap(d3.event.wheelDeltaY);
	    	});

	    d3.select('#map div.scrollPane div')
	    	.on('click',function(){
	    		if(pages.active.id == 'map') timeline.togglePause();
	    	});

	    d3.select('#mapPage div.button.control-playback')
	    	.on('click',function(){
	    		if(pages.active.id == 'map') timeline.togglePause();
	    	});

	    d3.select('a.control-zoom-out')
	    	.on('click',function(){
	    		map.setZoom(Math.constrain(map.getZoom()-1,9,17));
	    		d3.event.stopPropagation();
	    	});

	    d3.select('a.control-zoom-in')
	    	.on('click',function(){
	    		map.setZoom(Math.constrain(map.getZoom()+1,9,17));
	    		d3.event.stopPropagation();
	    	});
		
		window.addEventListener('resize',resize);
		resize();

		setPause();	
	}

	function setPause(){
		// d3.select('body, iframe')
		// 	.on('blur',function(){
		// 		blurred = true;
		// 	})
		// d3.select('body, iframe')
		// 	.on('focus',function(){
		// 		blurred = false;
		// 	})
		// d3.select(window)
		// 	.on('blur',function(){
		// 		blurred = true;
		// 	})
		// d3.select(window)
		// 	.on('focus',function(){
		// 		blurred = false;
		// 	})
	}


	function resize(){
		var height = getBodyHeight();

		d3.select('#mapPage')
			.style('height',height+'px');

		d3.select('#timeline')
			.style('height',(height-60)+'px');

		d3.select('#video')
			.style('height',Math.round(document.body.clientWidth*0.53) + 'px');

		d3.select('#video iframe')
			.style('height',Math.round(document.body.clientWidth*0.53) + 'px')
			.style('width',document.body.clientWidth + 'px');

		if(timeline) timeline.resize();
	}

});


function getBodyHeight(){
	var containerHeight = d3.select('#mapPage').node().parentNode.parentNode.clientHeight;
	var headerHeight = d3.select('#header').node().clientHeight;
	return containerHeight - headerHeight;
}


// kind of buggy, only takes full 13 digit long timestamps for now
function offsetTimezone(t){
	var shorthand = Math.floor(t).length == 10;
	if(shorthand) t*=1000;
	var date = new Date(t);
	var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
	var newDate = new Date(utc + (3600000 * timeOffsets[expeditionYear].timezone)).getTime();
	if(shorthand) newDate /= 1000;
	return newDate;
}



