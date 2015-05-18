// path_to_data = "{{ query }}";
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
// });