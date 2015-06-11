
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
}, ];;
var d3Graph = function(timelineVizID, totalsVizID){
    // if(timelineVizDiv){

    // }
    //console.log("divIDs: " + timelineVizID + ", " + totalsVizID);
    var timelineVizDiv = d3.select("timelineVizID");
    // var totalsVizDiv = d3.select("totalsVizID");
    console.log("D3 GRAPH");
    //console.log(totalsVizDiv);

    // $("totalsViz").hide("slow", function() {
    //     console.log("HIDING totalsVizDiv");
    // });
    // totalsVizDiv.style("opacity", 0);
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
    var parsedSensorData = [];
    var parsedImageData = [];
    var parsedTweetData = [];
    var parsedBeaconData = [];
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
        console.log("HR: " + ambitData.time + ", " + ambitData.heartRate);
        return ambitData;
    }

    var parseAmbitEnergy = function(item) {
        //parse for energy consumption
        var ambitData = {};
        ambitData.energy = item["properties"]["EnergyConsumption"];
        ambitData.time = new Date(+item["properties"]["t_utc"] * 1000);
        console.log("Energy: " + ambitData.time + ", " + ambitData.energy);
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

    var parseAmbitGeo = function(item) {
        var ambitGeoData = {};
        if (item["properties"].hasOwnPropery("GPSSpeed")) {
            ambitGeoData.speed = item["properties"]["GPSSpeed"];
        }
        ambitGeoData.member = item["properties"]["Member"];
        ambitGeoData.time = new Date(+item["properties"]["t_utc"] * 1000);
        return ambitGeoData;
    }

    var parseBeaconData = function(item) {
        var beaconData = {};
        if(item["properties"].hasOwnProperty("Speed")) {
            var tempSpeed = item["properties"]["Speed"];
            var cleanSpeed = tempSpeed.split(' ');
            var intSpeed = parseInt(cleanSpeed[0]);
            beaconData.speed = intSpeed;
        }

        beaconData.time = new Date(+item["properties"]["t_utc"] * 1000);
        console.log("Speed: " + beaconData.time + ", " + beaconData.speed);
        return beaconData;
    }

    var parseSensorData = function(item) {
        var sensorData = {};
        sensorData.airTemp = item["properties"]["AirTemp"];
        if (item["properties"].hasOwnProperty("water temp")) {
            sensorData.waterTemp = item["properties"]["water temp"];
        } else if (item["properties"].hasOwnProperty["WaterTemp"]) {
            sensorData.waterTemp = item["properties"]["WaterTemp"];
        } else {
            sensorData.waterTemp = item["properties"]["WaterTemp"];
        }
        
        sensorData.time = new Date(+item["properties"]["t_utc"] * 1000);

        return sensorData;
    }

    var parseImage = function(item) {
        var imageData = {};
        imageData.member = item["properties"]["Member"];

        if (item["properties"].hasOwnProperty("ImageType")) {
            imageData.imageType = item["properties"]["ImageType"]
        } else {
            imageData.imageType = "unspecified";
        }

        //using t_created since t_utc coming from cameras is not correct, ex: from 2007
        imageData.time = new Date(+item["properties"]["t_created"] * 1000);

        return imageData;
    }

    var parseTweetData = function(item) {
        var tweetData = {};
        tweetData.member = item["properties"]["Member"];
        tweetData.time = new Date(+item["properties"]["t_utc"] * 1000);

        return tweetData;
    }

    var makeHistogramPlot = function(parsedData, feature_type, subTitle) {

        var xAxisLabel = "";
        var graphTitle = "";
        var yAxisLabel = "";

        //HISTOGRAM VIZ
        var margin = {top: 70.5, right: 30, bottom: 60, left: 50.5},
        width = ($('body').width()*0.9) - margin.left - margin.right,
        height = 525 - margin.top - margin.bottom,
        left_width = 100;
        var bodywidth = $('body').width();
        console.log("BODY WIDTH:" + bodywidth );
        console.log("WIDTH: " + width);
        console.log("TEST");

        var dateRange = d3.extent(parsedData, function(d) { 
            return d.time; 
        });
        var parseDate = d3.time.format("%m %d").parse;
        var date_format = d3.time.format("%d %b");
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

            var dateFormat = d3.time.format.utc("%B %d %Y");
            var timeFormat = d3.time.format.utc("%I:%M:%S");
            xAxisLabel = dateFormat(dateRange[0]) + ", " + timeFormat(dateRange[0]) + " - " + dateFormat(dateRange[1]) + ", " + timeFormat(dateRange[1]);
            
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

        if (feature_type === 'image' || feature_type === 'tweet') {

            //makeBinnedData(parsedImageData);

            yAxisLabel = "Count";
            var dateFormat = d3.time.format("%B %d %Y");
            var timeFormat = d3.time.format("%I:%M:%S");
            xAxisLabel = dateFormat(dateRange[0]) + ", " + timeFormat(dateRange[0]) + " - " + dateFormat(dateRange[1]) + ", " + timeFormat(dateRange[1]);

            if (feature_type === 'image') {
                graphTitle = "Images Per Day";
            } else if (feature_type === 'tweet') {
                graphTitle = "Tweets Per Day";
            }
            
            var binner = d3.time.scale();

            var interval = d3.time.day;

            var allIntervals = interval.range(interval.floor(dateRange[0]), interval.ceil(dateRange[1]));
            console.log("Intervals ", allIntervals);

            binner.domain([allIntervals[0], allIntervals[allIntervals.length - 1]]);
            binner.range([0, allIntervals.length - 1]);

            binner.interpolate(d3.interpolateRound);

            var hist = [];
            for(var i=0; i < allIntervals.length; i++) hist[i] = 0;

            parsedData.forEach(function(d) {
                // Compute the day index
                var tid = binner(interval.floor(new Date(d.time)));
                // console.log("Map " + d.time + " to " + tid);
                
                if(!hist[tid]) {
                  hist[tid] = 1;
                } 
                else { 
                  hist[tid]++;
                }
            });
            // Here is the histogram.
            console.log("Hist:", hist);
            console.log("dateRange", dateRange);

            var combinedData = [];
            for (var i = 0; i < hist.length; i++) {
                var dataObj = {};
                dataObj.time = allIntervals[i];
                dataObj.count = hist[i];

                combinedData.push(dataObj);
            }

            console.log("combinedData");
            console.log(combinedData);
            console.log(combinedData.length);
            
            var barWidth = 1;

            xScale.domain(d3.extent(combinedData, function(d) { 
                return d.time; }));

            var max = d3.max(combinedData, function(d) {
                return d.count;
            });

            yScale.domain([0, max]);

            xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");

            if (combinedData.length < 30) {
                xAxis.ticks(combinedData.length);
            }
                

            var y_max = yScale.domain().slice(-1)[0];
            
            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .tickValues(d3.range(y_max +1)) //to get integer y-axis values 
                .tickFormat(d3.format(",.0f"));

            var bar = svg.selectAll("g")
                    .data(combinedData)
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

        var margin = {top: 70.5, right: 30, bottom: 60, left: 50.5},
        width = ($('body').width()*0.9) - margin.left - margin.right,
        height = 525 - margin.top - margin.bottom,
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
                    console.log("data has heartRate key");
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
                    xAxisLabel = dateFormat(dateRange[0]) + ", " + timeFormat(dateRange[0]) + " - " + dateFormat(dateRange[1]) + ", " + timeFormat(dateRange[1]);
                } else if (parsedData[i].hasOwnProperty("energy")) {
                    console.log("data has energy key");
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
                    xAxisLabel = dateFormat(dateRange[0]) + ", " + timeFormat(dateRange[0]) + " - " + dateFormat(dateRange[1]) + ", " + timeFormat(dateRange[1]);
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
                    xAxisLabel = dateFormat(dateRange[0]) + ", " + timeFormat(dateRange[0]) + " - " + dateFormat(dateRange[1]) + ", " + timeFormat(dateRange[1]);
                }
            }

            xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");

            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left");
        }

        if (feature_type === "beacon") {
            yAxisLabel = "km/h";
            graphTitle = "Speed of Expedition";
            console.log("feature_type is beacon");
            console.log(parsedData);
            var line = d3.svg.line()
                        .x(function(d) { return xScale(d.time); })
                        .y(function(d) { return yScale(d.speed); });

           var dateRange = d3.extent(parsedData, function(d) { 
                return d.time; 
            });
            console.log("dateRange: " + dateRange);

            xScale.domain(dateRange);
            yScale.domain(d3.extent(parsedData, function(d) { return d.speed; }));
            var yDomain = d3.extent(parsedData, function(d) { return d.speed; });
            console.log("yDomain: " + yDomain);

            var dateFormat = d3.time.format.utc("%B %d %Y");
            var timeFormat = d3.time.format.utc("%I:%M:%S");
            xAxisLabel = dateFormat(dateRange[0]) + ", " + timeFormat(dateRange[0]) + " - " + dateFormat(dateRange[1]) + ", " + timeFormat(dateRange[1]);

            xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");

            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left");
        }

        if(feature_type === "sensor") {
            yAxisLabel = "Degrees Celsius";
            graphTitle = "Air and Water Temperature";
            var color = d3.scale.ordinal()
                .domain(["waterTemp", "airTemp"])
                .range(["#4BFF87", "#686d9d"]);

            console.log("feature_type is sensor");
            console.log(parsedData);
            color.domain(d3.keys(parsedData[0]).filter(function(key) { return key !== "time"; }));

            var line = d3.svg.line()
                .x(function(d) { return xScale(d.date); })
                .y(function(d) { return yScale(d.temperature); });

            var temps = color.domain().map(function(name) {
                return {
                  name: name,
                  values: parsedData.map(function(d) {
                    return {date: d.time, temperature: +d[name]};
                    })
                };
            });

            console.log(temps);

            var dateRange = d3.extent(parsedData, function(d) { 
                return d.time; 
                });
            xScale.domain(dateRange);

            yScale.domain([
                d3.min(temps, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
                d3.max(temps, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
            ]);

            var dateFormat = d3.time.format.utc("%B %d %Y");
            var timeFormat = d3.time.format.utc("%I:%M:%S");
            xAxisLabel = dateFormat(dateRange[0]) + ", " + timeFormat(dateRange[0]) + " - " + dateFormat(dateRange[1]) + ", " + timeFormat(dateRange[1]);

            xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");

            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left");

            var temp = svg.selectAll(".temperature")
              .data(temps)
            .enter().append("g")
              .attr("class", "temperature");

            temp.append("path")
              .attr("class", "line")
              .attr("d", function(d) { return line(d.values); })
              .style("stroke", function(d) { return color(d.name); });

            temp.append("text")
              .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
              .attr("transform", function(d) { return "translate(" + xScale(d.value.date) + "," + yScale(d.value.temperature) + ")"; })
              .attr("x", 3)
              .attr("dy", ".35em")
              .attr("class", "label")
              .style("fill", "white")
              .text(function(d) { return d.name; });
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
        var svg = d3.select("#timelineViz").append("svg")
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

    var hist = [];

    var makeBinnedData = function(parsedData) {
        dateRange = d3.extent(parsedData, function(d) { return d.time; });
        console.log("dateRange: " + dateRange);
        //compute time bins
        var binner = d3.time.scale();

        //pick time interval to bin with
        var interval = d3.time.day;
        //console.log("Interval", interval);

        //compute time intervals
        allIntervals = interval.range(interval.floor(dateRange[0]), interval.ceil(dateRange[1]));
        //console.log("Intervals", allIntervals); //array of all the hours between min and max date

        //input domain mapped to output range
        binner.domain([allIntervals[0], allIntervals[allIntervals.length - 1]]);
        binner.range([0, allIntervals.length - 1]);

        //only output integers to fill the array
        binner.interpolate(d3.interpolateRound);

        //fill histogram with 0
        for (var i = 0; i < allIntervals.length; i++) { hist[i] = 0; }

        parsedData.forEach(function(d) {
            //compute hour index
            var tid = binner(interval.floor(new Date(d.time)));
            // console.log("Map " + d.time + " to " + tid);

            if(!hist[tid]) {
                hist[tid] = 1;
            } else {
                hist[tid]++;
            }
        });

        console.log("HIST filled");
        console.log(hist);
        console.log(hist.length);
    }

    var drawHistogram = function(array) {

        var bars = svg.selectAll('rect.bar')
            .data(array)
            .enter()
            .append('rect')
            .classed('bar',true)
            .style('fill','steelblue');

        var w = xScale(1);

        console.log(d3.extent(array),yScale(1));

        bars.attr('x', function(d,i) { return xScale(i); })
            .attr('y', function(d) { return yScale(d); })
            .attr('width', w)
            .attr('height', function(d) { return height - yScale(d); 
        });
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
        //this.feature_type = feature_type;
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
                    console.log("AMBIT");
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

                if (feature_type === "ambit_geo") {
                    console.log("AMBIT_GEO");

                    for (d in data.results.features) {
                        var item = data.results.features[d];
                        console.log(item);

                    }
                }

                if (feature_type === "beacon") {
                    console.log("BEACON");

                    for(d in data.results.features) {
                        var item = data.results.features[d];
                        console.log(item);

                        if(item["properties"].hasOwnProperty("Speed")) {
                            if(item["properties"]["Speed"].indexOf("Unknown") != -1) {
                                console.log("Bad Beacon Data");
                            } else {
                                f = parseBeaconData(item);
                                parsedBeaconData.push(f);
                            }
                        }
                    }
                    makeTimeSeriesViz(parsedBeaconData, feature_type);
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
                        var speciesName = decodeURI(speciesNameClean[0]);
                        console.log("speciesName: " + speciesName);
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
                if (feature_type === "sensor") {
                    console.log("SENSOR");

                    for (d in data.results.features) {
                        var item = data.results.features[d];
                        //console.log(item);

                        if (item["properties"].hasOwnProperty("AirTemp") && item["properties"].hasOwnProperty("WaterTemp") || item["properties"].hasOwnProperty("water temp")) {
                            f = parseSensorData(item);
                            parsedSensorData.push(f);
                        }
                    }
                    makeTimeSeriesViz(parsedSensorData, feature_type);
                }
                if (feature_type === "tweet") {
                    console.log("TWEET");

                    for (d in data.results.features) {
                        var item = data.results.features[d];

                        f = parseTweetData(item);
                        parsedTweetData.push(f);
                    }

                    console.log(parsedTweetData);
                    var tweetType = "test";
                    makeHistogramPlot(parsedTweetData, feature_type, tweetType);

                    //layout tweets
                    //TO DO: figure out how many tweets to lay out? viz for tweets?
                }
                if (feature_type === "image") {
                    console.log("IMAGE");

                    for (d in data.results.features) {
                        var item = data.results.features[d];

                        f = parseImage(item);
                        parsedImageData.push(f);
                    }

                    var imageType = "test";
                    makeHistogramPlot(parsedImageData, feature_type, imageType);
                }

                if (feature_type === "blog") {

                }
            }
        });
        
    }

    return {
        loadData: loadData,
        show: show,
        hide: hide
    };
};;

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

                console.log(self.findParent(ractive));

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

                // this.on({
                //     'ShowMeWidget.heartRateQuery': function() {
                //         this.set('queryObj.filter', 'features');
                //         this.set('queryObj.featureType', 'FeatureType=ambit');
                //         this.set('queryObj.output', 'output=viz');
                //         this.set('mapChecked', false);
                //         this.set('vizChecked', true);
                //         this.set('jsonChecked', false);
                        
                //         var updatedUrl = "http://intotheokavango.org/api/features/viz";
                //             //this.set('queryObj.output', "features/" + newValue);
                //         this.set('apiUrl', updatedUrl);
                //         console.log("Show Me Button : Heart Rate Query");
                //     }
                // });

                // this.on({
                //     'ShowMeWidget.hippoSighting': function() {
                //         this.set('queryObj.filter', 'features');
                //         this.set('queryObj.featureType', 'FeatureType=sighting');
                //         this.set('queryObj.species', 'SpeciesName=Hippo');
                //         this.set('queryObj.output', 'output=map');
                //         this.set('mapChecked', true);
                //         this.set('vizChecked', false);
                //         this.set('jsonChecked', false);
                //         var updatedUrl = "http://intotheokavango.org/api/features/map";
                //         this.set('apiUrl', updatedUrl);
                //         console.log("Show Me Button : Hippo Sighting Query");
                //     }
                // });

                this.observe('hippoButton', function(newValue, oldValue) {
                    console.log("observing hippoButton from within QueryComponent");
                    console.log("newValue: " + newValue + ", oldValue: " + oldValue);
                });



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
                        image: ['Documentary', 'GoPro', 'Habitat', 'Specimen'],
                        sensor: ['DataBoat'],
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
    ################################
    ### ShowMeButtonsComponent ###
    ################################
    */
    (function(Template){
        var ShowMeWidget = Template.extend({
            template: "#showMeTemplate",
            oninit: function () {
                this.on( 'activate', function () {
                  alert( 'Activating!' );
                });
                this.on({
                    heartRateQuery: function() {
                        // ractive.set('queryObj.filter', 'features');
                        // ractive.set('queryObj.featureType', 'FeatureType=ambit');
                        // ractive.set('queryObj.output', 'output=viz');
                        // ractive.set('mapChecked', false);
                        // ractive.set('vizChecked', true);
                        // ractive.set('jsonChecked', false);
                        
                        // var updatedUrl = "http://intotheokavango.org/api/features/viz";
                            //this.set('queryObj.output', "features/" + newValue);
                        //ractive.set('apiUrl', updatedUrl);
                        console.log("Show Me Button : Heart Rate Query");
                    }
                });
                this.on({
                    hippoSighting: function() {
                        // ractive.set('queryObj.filter', 'features');
                        // ractive.set('queryObj.featureType', 'FeatureType=sighting');
                        // ractive.set('queryObj.species', 'SpeciesName=Hippo');
                        // ractive.set('queryObj.output', 'output=map');
                        // ractive.set('mapChecked', true);
                        // ractive.set('vizChecked', false);
                        // ractive.set('jsonChecked', false);
                        // var updatedUrl = "http://intotheokavango.org/api/features/map";
                        // ractive.set('apiUrl', updatedUrl);
                        ractive.set('hippoButton', true);
                        var state = ractive.get('hippoButton');
                        console.log('hippoButton ' + state);
                        console.log("Show Me Button : Hippo Sighting Query");
                    }
                });
            }
        });
        Template.components.ShowMeWidget = ShowMeWidget;
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

        // showMeRactive = new Ractive({
        //     el: "#showMeContent",
        //     template: "#showMeTemplate",
        //     oninit: function() {
        //         this.on({
        //             heartRateQuery: function() {
        //                 ractive.set('queryObj.filter', 'features');
        //                 ractive.set('queryObj.featureType', 'FeatureType=ambit');
        //                 ractive.set('queryObj.output', 'output=viz');
        //                 ractive.set('mapChecked', false);
        //                 ractive.set('vizChecked', true);
        //                 ractive.set('jsonChecked', false);
                        
        //                 var updatedUrl = "http://intotheokavango.org/api/features/viz";
        //                     //this.set('queryObj.output', "features/" + newValue);
        //                 ractive.set('apiUrl', updatedUrl);
        //                 console.log("Show Me Button : Heart Rate Query");
        //             }
        //         });
        //         this.on({
        //             hippoSighting: function() {
        //                 ractive.set('queryObj.filter', 'features');
        //                 ractive.set('queryObj.featureType', 'FeatureType=sighting');
        //                 ractive.set('queryObj.species', 'SpeciesName=Hippo');
        //                 ractive.set('queryObj.output', 'output=map');
        //                 ractive.set('mapChecked', true);
        //                 ractive.set('vizChecked', false);
        //                 ractive.set('jsonChecked', false);
        //                 var updatedUrl = "http://intotheokavango.org/api/features/map";
        //                 ractive.set('apiUrl', updatedUrl);
        //                 console.log("Show Me Button : Hippo Sighting Query");
        //             }
        //         });
        //     } 
        // });

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
                },
                'showMe': {
                    'hippoButton': false, 'heartRateButton': false
                }
			}
		});

        // ractive.on({
        //     'ShowMeWidget.hippoSighting' : function() {
        //         ractive.set('QueryComponent.queryObj.filter', 'features');
        //         ractive.set('QueryComponent.queryObj.featureType', 'FeatureType=sighting');
        //         ractive.set('QueryComponent.queryObj.species', 'SpeciesName=Hippo');
        //         ractive.set('QueryComponent.queryObj.output', 'output=map');
        //         ractive.set('QueryComponent.mapChecked', true);
        //         ractive.set('QueryComponent.vizChecked', false);
        //         ractive.set('QueryComponent.jsonChecked', false);
        //         var updatedUrl = "http://intotheokavango.org/api/features/map";
        //         ractive.set('QueryComponent.apiUrl', updatedUrl);
        //         console.log("Show Me Button : Hippo Sighting Query");
        //     },
        //     'ShowMeWidget.heartRateQuery' : function() {
        //         console.log("Show Me Button : Heart Rate Query");
        //     }
        // });
		
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
	node.on('wheel', scroll);
	var templates = {
		tweet: node.select('div.post.tweet').remove().html(),
		photo: node.select('div.post.photo').remove().html(),
		blog: node.select('div.post.blog').remove().html(),
		sound: node.select('div.post.sound').remove().html()
	}
	var postsByDay = [];
	var allPosts = [];
	var posts;
	var postCursor = 0;
	var resizing = false;

	function init(day){
		
		var monthNames = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
		var w = d3.select(node.node().parentNode).style('width');
		w = Math.round(parseFloat(w)/100*d3.select('body').node().clientWidth);

		// Definitely not optimized
		var newPosts = [];
		newPosts = newPosts.concat(loader.getTweets()[day]);
		newPosts = newPosts.concat(loader.getBlogs()[day]);
		newPosts = newPosts.concat(loader.getSounds()[day]);
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

		posts = node.selectAll('div.post')
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
			        				d.message = d.message.replace(urls[i],!d.photoUrl||i<urls.length-1?'<a href="'+urls[i]+'" target="_blank">'+urls[i]+'</a>':'');
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
			        		.on('load',function(){
			        			jump();
			        		})
		        	}
	        	} else if(d.type == 'photo'){
		        	d3.select(this).select('div.photo')
		        		.append('img')
		        		.attr('src','http://intotheokavango.org'+d.photoUrl)
		        		.attr('alt','Photo taken on ' + t)

		        	if(d.notes){
			        	d3.select(this).select('p.notes')
			        		.html(function(){
			        			var urls = d.notes.match(/http[^\s]*/gi);
			        			if(urls){
				        			for(var i=0; i<urls.length; i++){
				        				d.notes = d.notes.replace(urls[i],'<a href="'+urls[i]+'" target="_blank">'+urls[i]+'</a>');
				        			}
				        		}
			        			return d.notes
			        		})
		        	}
		        	if(d.size[0]<d.size[1]) d3.select(this).classed('vertical',true);
	        	} else if(d.type == 'blog'){
		        	d3.select(this).select('h3.title')
		        		.html(d.title);
	        		d3.select(this).select('p.message')
		        		.html(function(){
		        			return '"' + d.message + ' [...]"<br/><a href="'+d.url+'" target="_blank">Read the full article on Medium</a>'
		        		});
	        	} else if(d.type == 'sound'){
	        		d3.select(this).select('p.notes')
		        		.html(d.notes);
		        	d3.select(this).select('div.text iframe')
		        		.attr('src','https://w.soundcloud.com/player/?url='+d.url+'&color=4BFF87&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false');
	        	}
	        });

		posts.order();
		jump();

	}


	function scroll(){
		var y = node.node().parentNode.scrollTop;
		var len = allPosts.length;
		for(var i=0; i<len-1; i++){
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
				timeline.navigateJournal(t);
				postCursor = i;
				return;
			}
		}
	}


	function jump(preventJump){
		var t = timeline.getTimeCursor();
		if(!resizing){
			requestAnimationFrame(function(){
				if(posts){
					posts.each(function(d){
						d.setFeedPos(this.offsetTop, this.clientHeight);
					});
				}
				resizing = false;
				if(!preventJump){
					var len = allPosts.length;
					for(var i=0; i<len-1; i++){
						var post = allPosts[i];
						var nextPost = allPosts[i+1];
						var t1 = post.getData().date.getTime()/1000;
						var t2 = nextPost.getData().date.getTime()/1000;
						if(t.current >= t1 && t.current < t2){
							var d = post.getData();
							requestAnimationFrame(function(){
								node.node().parentNode.scrollTop = Math.map(t.current,t1,t2,d.feedPos,d.feedPos + d.height);
							})
							postCursor = i;
							break;
						}
					}
				}
			});
		}
		resizing = true;
	}
	

	return{
		init: init,
		jump: jump,
	};
}

;

/*
	Describes every features as displayed on the map and journal's page.
*/


function setPopupEvent(m){
	d3.select('div.leaflet-popup-content-wrapper')
		.on('click',function(){
			pages.active.hide();
			pages['journal'].show();
			m.closePopup();
		})
}


function Sighting(feature, m){

	var date = new Date(Math.round(parseFloat((feature.properties.t_utc+timeOffsets[expeditionYear].photo)*1000)));
	var latLng = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
	var name = feature.properties.SpeciesName.trim();
	var count = feature.properties.Count;
	var visible = true;
	var popupVisible = false;
	var popupDelay = false;
	var marker = m;
	var type = 'sighting';

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

	function animate(t){
        if(marker){
    		if(Math.abs(date.getTime()/1000-t)<600 && pages.active.id == 'map'){
    			if(!popupVisible) {
    				marker.showLabel();
    				popupVisible = true;
    			}
    		} else {
    			if(popupVisible) {
    				marker.hideLabel();
    				popupVisible = false;
    			}
    		}
        }
	}

	return{
		getData: getData,
		getLatLng: getLatLng,
		marker: marker,
		setVisible: setVisible,
		animate: animate
	};

}


function Beacon(feature, m){

	var date = new Date(Math.round(parseFloat((feature.properties.t_utc+timeOffsets[expeditionYear].photo)*1000)));
	var latLng = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
	var visible = true;
	var marker = m;
	var type = 'beacon';

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
		setVisible: setVisible,
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
	var notes = feature.properties.Notes;
	var popupVisible = false;
	var popupDelay = false;
	var type = 'photo';

	if(marker){
		marker.addEventListener('popupclose',function(){
			popupVisible = false;
			popupDelay = true;
		})
		marker.addEventListener('popupopen',function(){
			popupVisible = true;
		})
	}

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
			notes: notes
		}
	}


	function animate(t){
        if(marker){

    		if(Math.abs(date.getTime()/1000-t)<1000 && pages.active.id == 'map'){
    			if(!popupVisible && !popupDelay) {
    				marker.openPopup();
    				setPopupEvent(marker);
    			}
    		} else {
    			if(popupVisible) {
    				marker.closePopup();
    			}
    			popupDelay = false;
    		}
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
		getMember: getMember,
		animate: animate
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
	var popupVisible = false;
	var popupDelay = false;
	var type = 'tweet';

	var latLng = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
	var id = feature.id;
	var url = feature.properties.Url
	var photoUrl;
	var size = [];
	if(expeditionYear < '15'){
		try{
			if(tweetProperties.extended_entities.media[0].type == 'photo'){
				photoUrl = tweetProperties.extended_entities.media[0].media_url;
				size[0] = tweetProperties.extended_entities.media[0].sizes.large.w;
				size[1] = tweetProperties.extended_entities.media[0].sizes.large.h;
			}
		} catch(e){}
	} else {
		var images = feature.properties.Images;
    	if(images && images.length>0){
			// console.log(images[0].Url);
    		photoUrl = images[0].Url;
    	}
	}

	if(marker){
		marker.addEventListener('popupclose',function(){
			popupVisible = false;
			popupDelay = true;
		})
		marker.addEventListener('popupopen',function(){
			popupVisible = true;
		})
	}


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

	function animate(t){
        if(marker){
    		if(Math.abs(date.getTime()/1000-t)<1000 && pages.active.id == 'map'){
    			if(!popupVisible && !popupDelay) {
    				marker.openPopup();
    				setPopupEvent(marker);
    			}
    		} else {
    			if(popupVisible) {
    				marker.closePopup();
    			}
    			popupDelay = false;
    		}
        }
	}

	return{
		getData: getData,
		getLatLng: getLatLng,
		getFeedPos: getFeedPos,
		setFeedPos: setFeedPos,
		marker: marker,
		setVisible: setVisible,
		animate: animate
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
	var popupVisible = false;
	var popupDelay = false;
	var latLng;
	if(feature.geometry != null) latLng = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
	else latLng = new L.LatLng(0,0);
	var id = feature.id;
	var url = feature.properties.Url
	var type = 'blog';

	if(marker){
		marker.addEventListener('popupclose',function(){
			popupVisible = false;
			popupDelay = true;
		})
		marker.addEventListener('popupopen',function(){
			popupVisible = true;
		})
	}


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

	function animate(t){
        if(marker){
    		if(Math.abs(date.getTime()/1000-t)<1000 && pages.active.id == 'map'){
    			if(!popupVisible && !popupDelay) {
    				marker.openPopup();
    				setPopupEvent(marker);
    			}
    		} else {
    			if(popupVisible) {
    				marker.closePopup();
    			}
    			popupDelay = false;
    		}
        }
	}

	return{
		getData: getData,
		getLatLng: getLatLng,
		getFeedPos: getFeedPos,
		setFeedPos: setFeedPos,
		marker: marker,
		setVisible: setVisible,
		animate: animate
	};
}



function SoundPost(feature, m){

	var feedPos = 0;
	var height = 0;
	var notes = feature.properties.Notes;
	var member = feature.properties.Member;
	var date = new Date(Math.round(parseFloat((feature.properties.t_utc+timeOffsets[expeditionYear].tweet)*1000)));
	var visible = true;
	var popupVisible = false;
	var popupDelay = false;
	var marker = m;
	var latLng;
	if(feature.geometry != null) latLng = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
	else latLng = new L.LatLng(0,0);
	var id = feature.id;
	var url = feature.properties.SoundCloudURL;
	var type = 'sound';


	function getData(){
		return {
			type: 'sound',
			notes: notes,
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
		setVisible: setVisible,
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
		d3.select('#aboutPage #video div.cover').remove();
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
		// mapWorld.setZoom(id == 'journal' ? 15 : 17, {animate:false});
		header.classed('dark',false);
		d3.select('#night').style('display',(id != 'journal' && id != 'map' ? 'none':'block'));
		updateLoadingScreen(true);
		if(id != 'about') {
			// pauseVimeoPlayer();
		}
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
		mapWorld.setZoom(timeline.getUnzoomState() ? 15 : 17, {animate:lastActive.id=='journal'});
		page.header.classed('dark',true);
		d3.select('#contentContainer').classed('map',true);
		d3.select('#night').style('display',(page.id != 'journal' && page.id != 'map' ? 'none':'block'));
		d3.select('#mapPage div.logos').classed('hidden',false);
		d3.select('#contentContainer').classed('fixed',true);
		updateLoadingScreen(false);
		timeline.checkNightTime();
		timeline.updateCursor(true);
	}

	page.hide = function(){
		page.getNode().classed('hidden',true);
		page.button.classed('active',false);
		d3.select('#contentContainer').classed('map',false);
		d3.select('#contentContainer').classed('fixed',false);
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
		var lastActive = pages.active;
		page.getNode().classed('hidden',false);
		page.button.classed('active',true);
		pages.active = this;
		page.offsetHeader(page.id=='about');
		for(var i=0; i<3; i++){
			page.panes[i].show();
		}
		if(timeline) timeline.togglePause('pause');
		mapWorld.setZoom(15, {animate:lastActive.id=='map'});
		feed.jump(timeline.getTimeCursor());
		page.header.classed('dark',false);

		page.node.select('.controls').classed('hidden',true);
		d3.select('#night').style('display',(page.id != 'journal' && page.id != 'map' ? 'none':'block'));
		d3.select('#mapPage div.logos').classed('hidden',true);
		updateLoadingScreen(false);
		timeline.updateCursor(true);
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
	var ambits = [];
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
			var len = data['okavango_'+expeditionYear].Days + 2;
			var findLastDay = function(){
				var query = 'http://intotheokavango.org/api/features?FeatureType=ambit_geo&Expedition=okavango_'+expeditionYear+'&expeditionDay='+(len-1)+'&limit=10';
				d3.json(query, function(error, data) {
					if(error) return console.log("Failed to load " + query + ": " + error.statusText);
					if(data.total == 0) {
						len --;
						findLastDay();
					} else {
						callback(len, d);
					}
				});
			}
			findLastDay();

		});
	}


	function loadDay(day, callback) {
		console.log('loading data for day #' + day);
		var toBeCompleted = 7;
		function checkForCompletion(){
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
		loadSoundPosts(day, checkForCompletion);
		loadBeacons(day, checkForCompletion);
	}


	function loadPath(day, callback){

		var ambitCoords = {};

		loading[day] = true;
		var query = 'http://intotheokavango.org/api/features?FeatureType=ambit_geo&Expedition=okavango_'+expeditionYear+'&expeditionDay='+(day+timeOffsets[expeditionYear].query)+'&limit=0&resolution=10'
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
			        if(!ambitCoords[name]) ambitCoords[name] = [];
			        ambitCoords[name].push([latLng.lng, latLng.lat]);
			        return marker;
			    },
			    onEachFeature: function(feature){
			    	var name = feature.properties.Member;
			    	var latLng = L.latLng(feature.geometry.coordinates[1],feature.geometry.coordinates[0]);
			    	var time = feature.properties.t_utc + timeOffsets[expeditionYear].timeAmbit + timeOffsets[expeditionYear].dateAmbit;
			    	var core = feature.properties.CoreExpedition;
			        if(!members[name]) {
			        	// latLng = L.latLng(-12.811059+((Math.random()*2)-1)*0.00075, 18.175099+((Math.random()*2)-1)*0.00075);
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
			if(activityInterval[0]==0 && activityInterval[1]==10000000000) activityInterval = [10000000000,0];
			activityInterval[0]+=(10*60);
			activityInterval[1]-=(10*60);
			for(m in members) members[m].initPathQueue();
			timeline.setNightTime(day, activityInterval);
			
			for(m in members){
				if (ambitCoords[m] && ambitCoords[m].length>0) {
					var paths = [{
						"type":"Feature",
						"geometry":{
							"type":"LineString",
							"coordinates":ambitCoords[m]
						}
					}];

					var pathStyle = {
					    fillColor: "#fff",
					    color: "#C1BEFF",
					    weight: 2.5,
					    opacity: 0.4,
					};
					
					var ambitPath = L.geoJson(paths, {	style:pathStyle	});
					ambitLayer.addLayer(ambitPath);
		        }
			}

			callback();
		});   
	}


	function loadTweets(day, callback){

		var markerIcon = L.icon({
	        iconUrl: '../static/img/featureIconTweet.png',
	        shadowUrl: '../static/img/featureIconShadow.png',
	        iconSize:     [30,30],
	        shadowSize:   [30,30],
	        iconAnchor:   [15,35],
	        shadowAnchor: [15,35],
	        popupAnchor:  [10,-30]
	    });

	    var markerOptions = {
	        icon:markerIcon,
	        iconSize:[30,30]
	    };

	    var loadingImages = 0;

	    // http://intotheokavango.org/api/features?FeatureType=tweet&Expedition=okavango_15&expeditionDay=7&limit=0
		var query = 'http://intotheokavango.org/api/features?FeatureType=tweet&Expedition=okavango_'+expeditionYear+'&expeditionDay='+(day+timeOffsets[expeditionYear].query)+'&limit=0'
		d3.json(query, function(error, data) {
			if(error) return console.log("Failed to load " + query + ": " + error.statusText);
			data = data.results;	
		    L.geoJson(data.features, {
		        filter: function(feature, layer) {
		        	if(expeditionYear == '15') return (feature.geometry.coordinates[0] != 0 && feature.properties.Text.substring(0,2).toLowerCase() != 'rt' && feature.properties.Text.charAt(0) != '@');
		        	else return (feature.geometry.coordinates[0] != 0 && feature.properties.Tweet.text.substring(0,2).toLowerCase() != 'rt' && feature.properties.Tweet.text.charAt(0) != '@');
		        },
		        onEachFeature: function(feature, layer){
                	var message = expeditionYear == '15' ? feature.properties.Text : feature.properties.Tweet.text
                	if(message){
                		layer.bindPopup('<img src="static/img/iconTweet.svg"/><p class="message">'+message+'</p>');
                	}
                },
		        pointToLayer: function (feature, latlng) {
		        	var scatterX = ((Math.random() * 2) - 1) * 0.00075;
                    var scatterY = ((Math.random() * 2) - 1) * 0.00075;
                    var latlng2 = L.latLng(latlng.lat + scatterY, latlng.lng + scatterX);
                    var marker = L.marker(latlng2, markerOptions);
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
	        iconUrl: '../static/img/featureIconMedium.png',
	        shadowUrl: '../static/img/featureIconShadow.png',
	        iconSize:     [30,30],
	        shadowSize:   [30,30],
	        iconAnchor:   [15,35],
	        shadowAnchor: [15,35],
	        popupAnchor:  [10,-30]
	    });

	    var markerOptions = {
	        icon:markerIcon,
	        iconSize:[30,30]
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
		        onEachFeature: function(feature, layer){
                	var title = feature.properties.Title;
                	if(title){
                		layer.bindPopup('<img src="static/img/mediumIcon.svg"/><h3 class="title">'+title+'</h3>');
                	}
                },
		        pointToLayer: function (feature, latlng) {
                    var scatterX = ((Math.random() * 2) - 1) * 0.00075;
                    var scatterY = ((Math.random() * 2) - 1) * 0.00075;
                    var latlng2 = L.latLng(latlng.lat + scatterY, latlng.lng + scatterX);
                    var marker = L.marker(latlng2, markerOptions);
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
	        iconUrl: '../static/img/featureIconSound.png',
	        shadowUrl: '../static/img/featureIconShadow.png',
	        iconSize:     [30,30],
	        shadowSize:   [30,30],
	        iconAnchor:   [15,35],
	        shadowAnchor: [15,35],
	        popupAnchor:  [10,-30]
	    });

	    var markerOptions = {
	        icon:markerIcon,
	        iconSize:[30,30]
	    };

		var query = 'http://intotheokavango.org/api/features?FeatureType=audio&Expedition=okavango_'+expeditionYear+'&expeditionDay='+(day+timeOffsets[expeditionYear].query)+'&limit=0';
		d3.json(query, function(error, data) {
			if(error) return console.log("Failed to load " + query + ": " + error.statusText);
			data = data.results;	
		    L.geoJson(data.features, {
		        filter: function(feature, layer) {
		        	return feature.geometry != null && feature.properties.SoundCloudURL;
		        },
		        onEachFeature: function(feature, layer){
					layer.addEventListener('click',function(){
						pages.active.hide();
				    	pages['journal'].show();
					})
		        },
		        pointToLayer: function (feature, latlng) {
                    var scatterX = ((Math.random() * 2) - 1) * 0.00075;
                    var scatterY = ((Math.random() * 2) - 1) * 0.00075;
                    var latlng2 = L.latLng(latlng.lat + scatterY, latlng.lng + scatterX);
                    var marker = L.marker(latlng2, markerOptions);
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
	        iconUrl: '../static/img/featureIconPhoto.png',
	        shadowUrl: '../static/img/featureIconShadow.png',
	        iconSize:     [30,30],
	        shadowSize:   [30,30],
	        iconAnchor:   [15,35],
	        shadowAnchor: [15,35],
	        popupAnchor:  [10,-30]
	    });

	    var markerOptions = {
	        icon:markerIcon,
	        iconSize:[30,30]
	    };

		var query = 'http://intotheokavango.org/api/features?FeatureType=image&Expedition=okavango_'+expeditionYear+'&expeditionDay='+(day+timeOffsets[expeditionYear].query)+'&limit=0'
		d3.json(query, function(error, data) {
			if(error) return console.log("Failed to load " + query + ": " + error.statusText);
			data = data.results;	
		    L.geoJson(data.features, {
		        filter: function(feature, layer) {
		        	if(!feature.properties.Dimensions) return false;
		            if(feature.properties.Member == null){
			            var photo = PhotoPost(feature);
				        if(photo) photos[day].push(photo);
				        return false;
		            } else return true;
		        },
		        onEachFeature: function(feature, layer){
                	var photoUrl = feature.properties.Url;
                	var dimensions = feature.properties.Dimensions;
                	if(photoUrl && dimensions){
                		var horizontal = dimensions[0]>dimensions[1];
                		layer.bindPopup('<img class="photo" src="'+photoUrl+'" '+(horizontal?'width="400px"':'height="200px"')+'/>');
                	}
                },
		        pointToLayer: function (feature, latlng) {
	                    var scatterX = ((Math.random() * 2) - 1) * 0.00075;
	                    var scatterY = ((Math.random() * 2) - 1) * 0.00075;
	                    var latlng2 = L.latLng(latlng.lat + scatterY, latlng.lng + scatterX);
	                    var marker = L.marker(latlng2, markerOptions);
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

		var sightingOptions = {
		    radius: 2,
		    fillColor: "#FFF",
		    color: "#78BD52",
		    weight: 0,
		    opacity: 0.3,
		    fillOpacity: 0.7,
		};

		// http://intotheokavango.org/api/features?FeatureType=sighting&Expedition=okavango_15&expeditionDay=7&limit=0
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
                    var scatterX = ((Math.random() * 2) - 1) * 0.00075;
                    var scatterY = ((Math.random() * 2) - 1) * 0.00075;
                    var latlng2 = L.latLng(latlng.lat + scatterY, latlng.lng + scatterX);
			        var marker = L.circleMarker(latlng2, sightingOptions);
		        	sightingLayer.addLayer(marker);			        
			        var sighting = Sighting(feature, marker);
		            if(sighting) sightings[day].push(sighting);
		            var name = feature.properties.SpeciesName;
                	var count = feature.properties.Count;
		            marker.bindLabel((count?count + ' ' : '') + name);
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

		if(day < 7){
			callback();
			return;
		}

		var starIcon = L.icon({
		    iconUrl: '../static/img/star2.png',
		    shadowUrl: '../static/img/starShadow2.png',

		    iconSize:     [20,20],
		    shadowSize:   [20,20],
		    iconAnchor:   [10,10],
		    shadowAnchor: [10,10],
		    popupAnchor:  [0,-10]
		});

		// var beaconOptions = {
		// 	icon:starIcon,
		// 	iconSize:[20,20]
		// };

		var beaconOptions = {
		    radius: 4,
		    fillColor: "#FFF",
		    weight: 0,
		    opacity: 1,
		    fillOpacity: 1,
		};

		var beaconCoords = [];

		var query = 'http://intotheokavango.org/api/features?FeatureType=beacon&Expedition=okavango_'+expeditionYear+'&expeditionDay='+(day+timeOffsets[expeditionYear].query)+'&limit=0&Satellite=TS091180'
		d3.json(query, function(error, data) {
			if(error) return console.log("Failed to load " + query + ": " + error.statusText);
			data = data.results;	
			
		    L.geoJson(data.features, {
		        filter: function(feature, layer) {
		        	// set a minimum distance of 200m between each beacon
		        	// if(feature.properties.CoreExpedition) return false;
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
		        	// var marker = L.marker(latlng, beaconOptions);
		        	var marker = L.circleMarker(latlng, beaconOptions);
		        	var beacon = Beacon(feature, marker);
		            if(beacon) beacons[day].push(beacon);
			        beaconLayer.addLayer(marker);
			        beaconCoords.push([latlng.lng, latlng.lat]);
			        return marker;
                }
		    });

			if (beaconCoords.length>0) {
				var paths = [{
					"type":"Feature",
					"geometry":{
						"type":"LineString",
						"coordinates":beaconCoords
					}
				}];

				var pathStyle = {
				    fillColor: "#fff",
				    color: "#fff",
				    // color: "#AEB1FF",
				    weight: 2.5,
				    opacity: 0.75,
				    dashArray: "10,10",
				    noClip: true
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

	function getSounds(){
		return sounds;
	}

	function getLoading(){
		return loading;
	}

	function getLoadedDays(){
		return loadedDays;
	}

	function getSightings(){
		return sightings;
	}

	function getFeatures(){
		return {
			sightings: sightings,
			tweets: tweets,
			photos: photos,
			beacons: beacons,
			blogs: blogs,
			ambits: ambits
		}
	}

	function getBlogs(){
		return blogs;
	}

	return {
		loadDay: loadDay,
		members: members,
		getBlogs: getBlogs,
		getSounds: getSounds,
		getTweets: getTweets,
		getPhotos: getPhotos,
		getLoading: getLoading,
		getDayCount: getDayCount,
		getLoadedDays: getLoadedDays,
		getFeatures: getFeatures,
		getSightings: getSightings,
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
	var marker = L.marker(latLng, {icon: icon}).addTo(mapWorld);


	d3.select(marker._icon)
		.on('click',focus)

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


	function move(time, force){
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

		if(force){
			latLng.lat = tLatLng.lat;
			latLng.lng = tLatLng.lng;
		} else {
			latLng.lat = Math.lerp(latLng.lat,tLatLng.lat,0.22);
			latLng.lng = Math.lerp(latLng.lng,tLatLng.lng,0.22);
		}
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

	function focus(){
		if(mapWorld.focusMember) mapWorld.focusMember.unfocus();
		d3.select(marker._icon).classed('focused',true);
		d3.select(marker._icon).classed('swollen',false);
		mapWorld.focusMember = loader.members[name];
		mapWorld.dragging.disable();
		// mapWorld.scrollWheelZoom.disable();
		mapLatLng = mapWorld.getCenter();
		timeline.checkUnzoom(false, true);
	}

	function dim(){
		d3.select(marker._icon).classed('swollen',true);
	}

	function light(strength){
		strength = 1-strength;
		if(strength>0){
			d3.select(marker._icon).select('p')
				.style('color','rgb('+(Math.floor(255-strength*180))+',255,'+(Math.floor(255-strength*120))+')');
		}
		d3.select(marker._icon).classed('swollen',false);
	}

	function unfocus(unswollen){
		d3.select(marker._icon).classed('swollen',false);
		d3.select(marker._icon).classed('focused',false);
		d3.select(marker._icon).select('p')
				.style('color',null);
		if(!unswollen){
			mapWorld.focusMember = null;
			mapWorld.dragging.enable();
			// mapWorld.scrollWheelZoom.enable();
		}
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
		focus: focus,
		unfocus: unfocus,
		dim: dim,
		light: light,
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

	var autoSpeed = 2.5;
	var speed = autoSpeed;
	var tSpeed = autoSpeed;
	var wheelDelta = 0;
	var scrollStreak = 1;
	var paused = false;
	var isNightTime = false;
	var nightTime = [];

	var dayCount = 16;
	var dates = [];
	var dayRad = 2.5;
	var margin = 10;
	var cursor;
	var cursorY = 0;
	var cursorTY = 0;
	var cursorHovered = false;
	var cursorDate = new Date();

	var unzoomedTime = [[1431948652,1432199688]];
	var isUnzoomedTime = false;

	var milestones = {
		0 : 'Menongue',
		7 : 'Cuito'
	}


	node.append('line')
		.attr('x1','80%')
		.attr('y1',margin)
		.attr('x2','80%')
		.attr('y2','100%')
		.attr('stroke','#FFFFFF')
		.style('pointer-events','none');

	var nightNode = d3.select('#mapWorld div.leaflet-objects-pane').append('div').attr('id','night');

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
		timeCursor = dates[dates.length-2];
		timeCursor = timeCursor-1;
		dayCursor = dates.length-2;
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

		var day = node.selectAll('circle.day')
			.data(dates)
			.enter()
			.append('g')
			.attr('class','day')
			.attr('transform','translate(0,0)')
			.style('pointer-events','none')
			
		day.append('circle')
			.attr('cx','80%')
			.attr('r',dayRad)
			.attr('fill','rgb(255,255,255)')

		day.append('text')
			.attr('x','66%')
			.attr('dy','0.25em')
			.text(function(d,i){
				if(milestones[i]) return milestones[i];
				return 'day ' + i
				// var da = new Date(d.getTime()+timeOffsets[expeditionYear].timezone*3600*1000);
				// var s;
				// var s = dateToString(da);
				// return s.mo + ' ' + s.da
			})
			.style('fill',function(d,i){
				return 'rgba(255,255,255,'+(milestones[i]?1:0.5);
			});

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
				updateCursor(false, d3.event.layerY-30);
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

		node.selectAll('g.day')
			.attr('transform',function(d,i){
				return 'translate(0,'+ (margin + dayRad + (i*((height-margin-dayRad*2)/(dates.length-1)))) +')';
			});

		try{ updateCursor(true);
		} catch(e) {}

		updateDayLabels();
	}

	function updateDayLabels(){

		var labelSkip = Math.ceil(d3.selectAll('#timeline g.day')[0].length/((height-margin)/45));
		d3.selectAll('#timeline g.day')
			.each(function(d,i){
				var h = parseInt(d3.select(this).attr('transform').split(',')[1]);
				if(Math.abs(h - cursorY) < 45 || i%labelSkip != 0){
					if(!d3.select(this).classed('hidden')) d3.select(this).classed('hidden',true);
				} else {
					if(d3.select(this).classed('hidden')) d3.select(this).classed('hidden',false);
				}
			})
	}

	function initTimeCursor(){
		var timestamps = [];
		for(m in loader.members){
			var member = loader.members[m];
			timestamps.push(member.getPathQueue()[0].time);
		}
		timeCursor = timestamps.min();
		prevTimeCursor = timeFrame[0]-1;
		checkNightTime();
	}

	function setTimeFrame(){

		var loaded = loader.getLoadedDays();
		if(timeCursor != -1) dayCursor = Math.constrain(Math.floor(Math.map(timeCursor,totalTimeFrame[0],totalTimeFrame[1],0,dayCount)),0,dayCount-1);
		timeFrame = [dates[dayCursor].getTime()/1000 -4*3600,dates[dayCursor+1].getTime()/1000-1 -4*3600];
		for(var i=dayCursor-1; i>=0; i--){
			if(loaded[i]) {
				timeFrame[0] = dates[i].getTime()/1000 -4*3600;
			} else break;
		}
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

		scrollStreak = Math.lerp(scrollStreak,1,0.24);
		wheelDelta = 0;

		var day = Math.constrain(Math.floor(Math.map(timeCursor-4*3600,totalTimeFrame[0],totalTimeFrame[1],0,dayCount)),0,dayCount);
		var lastDay = Math.constrain(Math.floor(Math.map(prevTimeCursor-4*3600,totalTimeFrame[0],totalTimeFrame[1],0,dayCount)),0,dayCount);
				
		if(day != lastDay) newDay();
		checkNightTime();
		updateCursor();
		if(frameCount%60==0 && pages.active.id == 'map') checkUnzoom();
		// if(frameCount%60==0) console.log(new Date(timeCursor*1000), timeCursor);
	}

	function updateCursor(force, hover){
		if(cursor){
			if(!cursorHovered) cursorTY = margin + Math.map(timeCursor,totalTimeFrame[0],totalTimeFrame[1],0,height-margin-dayRad*2);
			if(!force) cursorY = Math.lerp(cursorY,cursorTY,0.2);
			else cursorY = cursorTY;
			cursor.attr('transform','translate(0,'+cursorY+')');
			if(!cursorHovered) cursorDate = new Date(timeCursor*1000);
			else if(hover){
				cursorDate = new Date(Math.constrain(Math.map(hover,margin,height-dayRad*2,totalTimeFrame[0],totalTimeFrame[1]),totalTimeFrame[0],totalTimeFrame[1])*1000);
			}
			var d = new Date(offsetTimezone(cursorDate.getTime()));
			var s = dateToString(d);
			cursor.select('text tspan:first-child').text(s.mo + ' ' + s.da);
			cursor.select('text tspan:last-child').text(s.ho + ':' + s.mi);

			if(frameCount%10==0) updateDayLabels();
		}
	}

	function dateToString(d){
		var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var mo = monthNames[d.getMonth()];
		var da = d.getDate();
		if(da < 10) da = '0' + da;
		var ho = d.getHours();
		if(ho < 10) ho = '0'+ho;
		var mi = d.getMinutes();
		if(mi < 10) mi = '0'+mi;
		return {mo:mo, da:da, ho:ho, mi:mi};
	}

	function checkNightTime(){
		var len = nightTime.length;
		var n = false;
		for(var i=0; i<nightTime.length; i++){
			if(nightTime[i]){
				n = !(timeCursor >= nightTime[i][0] && timeCursor < nightTime[i][1]);
				if(!n) break;
			}
		}
		if(isNightTime != n) nightNode.classed('night',n);
		isNightTime = n;
	}

	function checkUnzoom(force, reset){
		for(var i=0; i<unzoomedTime.length; i++){
			var u = timeCursor >= unzoomedTime[i][0] && timeCursor < unzoomedTime[i][1];
			if(isUnzoomedTime != u || reset) mapWorld.setZoom(u?15:17, {animate:!force});
			isUnzoomedTime = u;
		}
	}

	function getUnzoomState(){
		checkUnzoom();
		return isUnzoomedTime;
	}


	function newDay(){
		var forward = timeCursor > prevTimeCursor;
		dayCursor += forward ? 1 : -1;
		init(dayCursor);
		cullMarkersByDay();
	}

	function cullMarkersByDay(){
		// beacon path is not culled
		var features = ['sightings', 'tweets', 'photos', 'blogs', 'ambits'];
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
		scrollStreak *= 1.085;
		tSpeed = 0;
		speed = 0;
		requestAnimationFrame(function(){
			tSpeed = paused ? 0 : autoSpeed;
		})
		wheelDelta = -delta/4*scrollStreak;
		updateControl(wheelDelta>0?'FastForward':'FastBackward');
		if(pages.active.id == 'map'){
			d3.select('#mapWorld div.scrollPane').node().scrollTop = 2000;
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


		function resume(){
			isLoading = false;
			updateLoadingScreen(false);
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
			checkUnzoom(true);
			for(m in loader.members){
				var member = loader.members[m];
				member.move(getTimeCursor(), true);
			}
			teleportMap();
			updateCursor(true);
		}

		isLoading = true;
		updateLoadingScreen(false);
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

	function setDayCursor(i){
		dayCursor = i;
	}

	function getPaused(){
		return paused;
	}

	return {
		checkNightTime: checkNightTime,
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
		jumpTo: jumpTo,
		getUnzoomState: getUnzoomState,
		setDayCursor: setDayCursor,
		checkUnzoom: checkUnzoom,
		getPaused: getPaused,
		updateCursor: updateCursor
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
	var maxSpeed = 0.000003;
	var maxForce = 0.0000001;

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
;

/*


	Okavango 2015 front-end.
	Please note I have been using the following javascript pattern: 
	http://radar.oreilly.com/2014/03/javascript-without-the-this.html	

	TODOS

	- trail ambit
	- click on popup doesn't open them
	- multiple medium posts
	- sometines the journal doesnt load neighboring days
	- culling
	- linkable features
	- gallery page

	- IE
	- Firefox
	- away marker
	- label scroll for zoom vs time
	- click on icons to open popups
	- refine medium popup
	- actual names for timeline labels
	- remove link at the end of image tweets
	- highlight pause button
	- add video features
	- live mode
	- linkable features and pages
	- sightings taxonomy color
	- scroll map while hovering a marker
	- test resolution query
	- stacked features on map view
	- clicking on popups should open journal on right time
	- dim out zoom buttons when max zoom is reached
	- togglePause highlight on map
	- highlight journal in header nav on new contents
	- transitions between pages
	- fix trail in about page
	- core features?
	- add location to post meta + link
	- API error handling
	- scrollbar event for feed navigation?
	- remove global functions/variables
	- margin journal alignment with timeline + 35px
	- dim out night sections of timeline

*/


var debug = false;
var frameCount = 0;

var mapbox_username = "brianhouse"; //"blprnt";
var mapbox_map_id = "oxn5wd2a"; //"vsat7sho";

var loader;
var pages = {};
var mapWorld;
var tweetLayer;
var photoLayer;
var sightingLayer;
var beaconLayer;
var beaconPathLayer;
var blogLayer;
var soundLayer;
var ambitLayer;
var timeline;
var feed;
var wanderer;
var mouseOffset = L.point(0, 0);
var mapOffset = L.point(0, 0);
var mapLatLng;
var mapTLatLng;

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

var isMobile = false;
var isLoading = true;

document.addEventListener('DOMContentLoaded', function(){

	(function() {
	  var check = false;
	  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	  isMobile = check;
	  if(!isMobile) d3.selectAll('#statusScreen p, #statusScreen div').remove();
	  else d3.select('#statusScreen img').remove();
	})();


	
	mapTLatLng = new L.LatLng(-12.811059,18.175099);
	mapLatLng = new L.LatLng(-12.811059,18.175099);

    mapWorld = new L.map('mapWorld', {
        layers: new L.TileLayer('http://a.tiles.mapbox.com/v3/' + mapbox_username + '.map-' + mapbox_map_id + '/{z}/{x}/{y}.png'),
        zoomControl: false,
        center:mapLatLng,
        attributionControl: false,
        doubleClickZoom: false,
        scrollWheelZoom: true,
        boxZoom: false,
        touchZoom: false,
        dragging: false,
        keyboard: false,
        minZoom: 0,                    
        maxZoom: 17,
        zoom:17,
        scrollWheelZoom:false
    });

    initMapLabels(mapWorld);

    tweetLayer = new L.layerGroup().addTo(mapWorld);
    photoLayer = new L.layerGroup().addTo(mapWorld);
    sightingLayer = new L.layerGroup().addTo(mapWorld);
    beaconLayer = new L.layerGroup().addTo(mapWorld);
    beaconPathLayer = new L.layerGroup().addTo(mapWorld);
    blogLayer = new L.layerGroup().addTo(mapWorld);
    soundLayer = new L.layerGroup().addTo(mapWorld);
    ambitLayer = new L.layerGroup().addTo(mapWorld);

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
    wanderer = Wanderer(mapWorld.getCenter());

    if(d3.selectAll('#navigation li')[0].length > 3){
		// pages.mapWorld.show();
		pages.about.show();
		setLayoutInteractions();
		loader.getDayCount(function(dayCount,startDate,endDate){
			timeline.setDates(dayCount,startDate);
			loader.loadDay(timeline.getTimeCursor().day,function(day){
				timeline.setTimeFrame();
				feed.init(day);
				timeline.init(day);
				timeline.initGraphics();
				timeline.initTimeCursor();
				timeline.checkUnzoom(true);
				isLoading = false;
				updateLoadingScreen(false);
				feed.jump(timeline.getTimeCursor());
				loader.members['Steve'].focus();
				animate(new Date().getTime()-16);
			});
		});
		
	} else {
		window.addEventListener('resize',resize);
		resize();	
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
					
					var date = timeline.getTimeCursor();
					var sightings = loader.getSightings();
					if(sightings[date.day]){
						var len = sightings[date.day].length;
						for(var i=0; i<len; i++){
							sightings[date.day][i].animate(date.current);
						}
					}

					var photos = loader.getPhotos();
					if(photos[date.day]){
						var len = photos[date.day].length;
						for(var i=0; i<len; i++){
							photos[date.day][i].animate(date.current);
						}
					}

					var tweets = loader.getTweets();
					if(tweets[date.day]){
						var len = tweets[date.day].length;
						for(var i=0; i<len; i++){
							tweets[date.day][i].animate(date.current);
						}
					}

					var blogs = loader.getBlogs();
					if(blogs[date.day]){
						var len = blogs[date.day].length;
						for(var i=0; i<len; i++){
							blogs[date.day][i].animate(date.current);
						}
					}
					
					for(m in loader.members){
						var member = loader.members[m];
						member.move(timeline.getTimeCursor(), {animate:false});
					}

					if(mapWorld.focusMember){
						mapTLatLng = mapWorld.focusMember.getLatLng();
						if(pages.active.id == 'map'){
							var center = mapWorld.project(mapTLatLng);
							var offset = mapWorld.unproject(center.subtract(mapOffset));
							mapTLatLng = offset;
						}
						mapLatLng.lat = Math.lerp(mapLatLng.lat,mapTLatLng.lat,0.24);
						mapLatLng.lng = Math.lerp(mapLatLng.lng,mapTLatLng.lng,0.24);
						mapWorld.panTo(mapLatLng, {animate:false});
					}

					var matrix;
					try{
						matrix = d3.select('#mapWorld div.leaflet-map-pane').style('transform').split(', ');
					}catch(e){
						matrix = d3.select('#mapWorld div.leaflet-map-pane').style('-webkit-transform').split(', ');
					}
					matrix = matrix[0]+', '+matrix[1]+', '+matrix[2]+', '+matrix[3]+', '+(-1*parseFloat(matrix[4]))+', '+(-1*parseFloat(matrix[5]))+')';
					d3.select('#mapWorld div.scrollPane').style('transform',matrix);
					d3.select('#mapWorld div.scrollPane').style('-webkit-transform',matrix);
					d3.select('#mapWorld div.scrollPane').node().scrollTop = 2000;
					d3.select('#mapWorld div#night').style('transform',matrix);
					d3.select('#mapWorld div#night').style('-webkit-transform',matrix);

				} else {
					wanderer.wander();
			    	var target = wanderer.update();
			    	mapWorld.panTo(new L.LatLng(target.y,target.x), {animate:false});
				}
			}
		}
		requestAnimationFrame(function(){animate(frameTime)});
	}


	function setLayoutInteractions(){	

		mapWorld.on('zoomend',function(e){
			if(e.target._zoom < 15){
				if(mapWorld.hasLayer(beaconLayer)) {
					mapWorld.removeLayer(beaconLayer);
					mapWorld.removeLayer(beaconPathLayer);
				}
			} else {
				if(!mapWorld.hasLayer(beaconLayer)) {
					beaconLayer.addTo(mapWorld);
					beaconPathLayer.addTo(mapWorld);
				}
			}
		})		

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
	    
	    var lastPlayMode;
	    var r2;
	    var drag = d3.behavior.drag()
		    .on('dragstart', function(){
		    	if(mapWorld.focusMember){
			    	mouseOffset = L.point(0, 0);
			    	mapOffset = L.point(0, 0);
			    	d3.select(this).classed('dragged',true);
			    	lastPlayMode = timeline.getPaused();
			    }
		    })
		    .on('drag', function(){
		    	if(mapWorld.focusMember){
			    	if(!timeline.getPaused()) timeline.togglePause('pause');
			    	mouseOffset = mouseOffset.add(L.point(d3.event.dx,d3.event.dy));
			    	var theta = Math.atan2(mouseOffset.y, mouseOffset.x);
			    	var r1 = Math.sqrt(Math.pow(mouseOffset.x,2)+Math.pow(mouseOffset.y,2));
			    	r1 = Math.pow(r1,0.4)*10;
			    	mapOffset = L.point(r1*Math.cos(theta),r1*Math.sin(theta));
			    	var r2 = Math.sqrt(Math.pow(mapOffset.x,2)+Math.pow(mapOffset.y,2));
			    	if(r2 > 75){
			    		mapWorld.focusMember.dim();
			    	} else {
			    		mapWorld.focusMember.light(1-(r2/75));
			    	}
			    }
		    })
		    .on('dragend', function(){
		    	if(mapWorld.focusMember){
			    	var r2 = Math.sqrt(Math.pow(mapOffset.x,2)+Math.pow(mapOffset.y,2));
			    	var theta = Math.atan2(mapOffset.y, mapOffset.x);
			    	if(r2 > 75){
			    		timeline.togglePause('pause');
			    		r2 *= 1.4;
			    		mapOffset = L.point(r2*Math.cos(theta),r2*Math.sin(theta));
			    		mapWorld.focusMember.unfocus(true);
			    		setTimeout(function(){
			    			mouseOffset = L.point(0, 0);
			    			mapOffset = L.point(0, 0);
			    			mapWorld.focusMember.unfocus();
			    		},500);
			    	} else {
			    		mapWorld.focusMember.light(1);
			    		mouseOffset = L.point(0, 0);
			    		mapOffset = L.point(0, 0);
			    		timeline.togglePause(lastPlayMode?'pause':'play');
			    	}
			    	d3.select(this).classed('dragged',false);
			    }
		    });

	    d3.select('#mapWorld div.leaflet-objects-pane')
	    	.append('div')
		    	.attr('class','scrollPane')
		    	.append('div')
			    	.on('click',function(){
			    		if (d3.event.defaultPrevented) return;
						if(pages.active.id == 'map') timeline.togglePause();
			    	})
			    	.on('wheel',function(){
			    		// if(pages.active.id == 'map' && mapWorld.focusMember) timeline.navigateMap(-d3.event.deltaY);
			    		if(pages.active.id == 'map') timeline.navigateMap(-d3.event.deltaY);
			    	})
			    	.call(drag);

	    d3.select('#mapPage div.button.control-playback')
	    	.on('click',function(){
	    		if(pages.active.id == 'map') timeline.togglePause();
	    	});

	    d3.select('a.control-zoom-out')
	    	.on('click',function(){
	    		mapWorld.setZoom(Math.round(Math.constrain(mapWorld.getZoom()-1,5,17)));
	    		d3.event.stopPropagation();
	    	});

	    d3.select('a.control-zoom-in')
	    	.on('click',function(){
	    		mapWorld.setZoom(Math.round(Math.constrain(mapWorld.getZoom()+1,5,17)));
	    		d3.event.stopPropagation();
	    	});
		
		window.addEventListener('resize',resize);
		resize();

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

		if(pages.active.id == 'journal') feed.jump(true);
		if(timeline) timeline.resize();
	}


	

});


function teleportMap(){
	if(mapWorld.focusMember){
		mapTLatLng = mapWorld.focusMember.getLatLng();
		mapLatLng.lat = mapTLatLng.lat;
		mapLatLng.lng = mapTLatLng.lng;
		mapWorld.panTo(mapLatLng, {animate:false});
	}
}

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

function updateLoadingScreen(force){
	var hidden = d3.select('#statusScreen').classed('hidden');
	var hide = (force || !(isMobile||isLoading));
	if(hidden != hide) {
		if(hide) {
			setTimeout(function(){
				d3.select('#statusScreen')
					.transition()
					.duration(500)
					.style('opacity',0)
					.each('end',function(){
						d3.select(this).classed('hidden',true);
					})
			},500);
		} else {
			d3.select('#statusScreen')
				.style('opacity',1)
				.classed('hidden',false)
				// .transition()
				// .style('opacity',1)
		}
	}
}


