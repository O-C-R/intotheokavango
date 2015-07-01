
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
    var parsedSensorAirData = [];
    var parsedSensorWaterData = [];
    var parsedSensorPHData = [];
    var parsedSensorTdsData = [];
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

    var parseSensorAirData = function(item) {
        var sensorData = {};
        sensorData.airTemp = item["properties"]["AirTemp"];
        sensorData.time = new Date(+item["properties"]["t_utc"] * 1000);

        return sensorData;
    }

    var parseSensorWaterData = function(item) {
        var sensorData = {};
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

    var parseSensorPHData = function(item) {
        var sensorData = {};

        if (item["properties"].hasOwnProperty("pH")) {
            sensorData.pH = item["properties"]["pH"];
        } else if (item["properties"].hasOwnProperty("PH")) {
            sensorData.pH = item["properties"]["PH"];
        } else {
            sensorData.pH = item["properties"]["pH"];
        }
        sensorData.time = new Date(+item["properties"]["t_utc"] * 1000);
        return sensorData;
    }

    var parseSensorTdsData = function(item) {
        var sensorData = {};

        sensorData.Tds = item["properties"]["Tds"];
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

        if (feature_type === "sensor") {
            console.log("feature_type is sensor");
            console.log(parsedData);
            
            for (var i = 0; i < parsedData.length; i++) {
             /*
                if (parsedData[i].hasOwnProperty("waterTemp") && parsedData[i].hasOwnProperty("airTemp")) {

                    //graph titles
                    yAxisLabel = "Degrees Celsius";
                    graphTitle = "Air and Water Temperature";
                    
                    var color = d3.scale.ordinal()
                        .domain(["waterTemp", "airTemp"])
                        .range(["#4BFF87", "#686d9d"]);

                    color.domain(d3.keys(parsedData[0]).filter(function(key) { return key !== "time"; }));

                    var line = d3.svg.line()
                        .x(function(d) { return xScale(d.date); })
                        .y(function(d) { return yScale(d.temperature); });

                    //get waterTemp and airTemp data into values array
                    var temps = color.domain().map(function(name) {
                        return {
                          name: name,
                          values: parsedData.map(function(d) {
                            return {date: d.time, temperature: +d[name]};
                            })
                        };
                    });

                    //console.log(temps);

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
                }
              */
                if ( parsedData[i].hasOwnProperty("waterTemp") ) {
                    console.log("data has waterTemp key");
                    yAxisLabel = "Degrees Celsius";
                    graphTitle = "Water Temperature";
                    var line = d3.svg.line()
                        .x(function(d) { return xScale(d.time); })
                        .y(function(d) { return yScale(d.waterTemp); });
                    var dateRange = d3.extent(parsedData, function(d) { 
                        return d.time; 
                    });
                    console.log("dateRange: " + dateRange);
                    xScale.domain(dateRange);
                    yScale.domain(d3.extent(parsedData, function(d) { return d.waterTemp; }));
                    var dateFormat = d3.time.format.utc("%B %d %Y");
                    var timeFormat = d3.time.format.utc("%I:%M:%S");
                    xAxisLabel = dateFormat(dateRange[0]) + ", " + timeFormat(dateRange[0]) + " - " + dateFormat(dateRange[1]) + ", " + timeFormat(dateRange[1]);

                } else if (parsedData[i].hasOwnProperty("airTemp")) {
                    console.log("data has airTemp key");
                    yAxisLabel = "Degrees Celsius";
                    graphTitle = "Air Temperature";
                    var line = d3.svg.line()
                        .x(function(d) { return xScale(d.time); })
                        .y(function(d) { return yScale(d.airTemp); });
                    var dateRange = d3.extent(parsedData, function(d) { 
                        return d.time; 
                    });
                    console.log("dateRange: " + dateRange);
                    xScale.domain(dateRange);
                    yScale.domain(d3.extent(parsedData, function(d) { return d.airTemp; }));
                    var dateFormat = d3.time.format.utc("%B %d %Y");
                    var timeFormat = d3.time.format.utc("%I:%M:%S");
                    xAxisLabel = dateFormat(dateRange[0]) + ", " + timeFormat(dateRange[0]) + " - " + dateFormat(dateRange[1]) + ", " + timeFormat(dateRange[1]);

                } else if (parsedData[i].hasOwnProperty("pH")) {
                    console.log("data has pH key");
                    yAxisLabel = "pH Level";
                    graphTitle = "Water pH Level";
                    var line = d3.svg.line()
                        .x(function(d) { return xScale(d.time); })
                        .y(function(d) { return yScale(d.pH); });

                    var dateRange = d3.extent(parsedData, function(d) { 
                        return d.time; 
                    });
                    console.log("dateRange: " + dateRange);

                    xScale.domain(dateRange);
                    yScale.domain(d3.extent(parsedData, function(d) { return d.pH; }));
                    var dateFormat = d3.time.format.utc("%B %d %Y");
                    var timeFormat = d3.time.format.utc("%I:%M:%S");
                    xAxisLabel = dateFormat(dateRange[0]) + ", " + timeFormat(dateRange[0]) + " - " + dateFormat(dateRange[1]) + ", " + timeFormat(dateRange[1]);
                } else if (parsedData[i].hasOwnProperty("Tds")) {
                    console.log("data has Tds key");
                    yAxisLabel = "Tds Units";
                    graphTitle = "Tds Levels";
                    var line = d3.svg.line()
                        .x(function(d) { return xScale(d.time); })
                        .y(function(d) { return yScale(d.Tds); });

                    var dateRange = d3.extent(parsedData, function(d) { 
                        return d.time; 
                    });
                    console.log("dateRange: " + dateRange);

                    xScale.domain(dateRange);
                    yScale.domain(d3.extent(parsedData, function(d) { return d.Tds; }));
                    var dateFormat = d3.time.format.utc("%B %d %Y");
                    var timeFormat = d3.time.format.utc("%I:%M:%S");
                    xAxisLabel = dateFormat(dateRange[0]) + ", " + timeFormat(dateRange[0]) + " - " + dateFormat(dateRange[1]) + ", " + timeFormat(dateRange[1]);
                } else {
                    console.log("data has a different key");
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
            width = ($('body').width()*0.9) - margin.left - margin.right,
            barHeight = 20,
            height = barHeight * data.length,
            left_width = 400;

        var xScale = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d.total; })])
            .range([0, width - (left_width + 80) ]);
            console.log(data);
            
        var yScale = d3.scale.ordinal()
            .domain(data, function(d) { 
                return d.type; 
                console.log(d.type); //hmm it doesn't console anything
            })
            .rangeBands([60, height]);

        console.log(yScale.range());
        var svg = d3.select("#timelineViz").append("svg")
            .attr("width", width)
            .attr("height", height);

        var title = svg.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .style("fill", "white")
            .style("font-size", "18px")
            .text("TOTAL SIGHTINGS");

        
        var bar = svg.selectAll("g")
                .data(data)
            .enter().append("g")
                .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

        bar.append("rect")
            .attr("x", left_width)
            .attr("y", yScale)
            .attr("width", function(d) { return xScale(d.total); })
            .style("fill", "#4bff87")
            .attr("height", barHeight - 1);

        bar.append("text")
            .attr("x", function(d) { return xScale(d.total) + 5 + left_width; })
            //.attr("y", function(d) { return yScale(d) + yScale.rangeBand()/2; })
            .attr("y", barHeight / 2 + 60)
            .attr("dy", "0.35em")
            .attr("text-anchor", "beginning")
            .attr("class", "label")
              .style("fill", "white")
            .text(function(d) { return d.total; });

        bar.append("text")
            .attr("x", left_width - 20)
            //.attr("y", function(d) { return yScale(d) + yScale.rangeBand()/2; })
            .attr("y", barHeight / 2 + 60)
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .attr("class", "label")
              .style("fill", "white")
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

    var speciesCountObj = {};
    var speciesCountArray = [];

    var getSpeciesCount = function(sightings) {

            for (var i = 0; i < sightings.length; ++i) {
                if (!speciesCountObj.hasOwnProperty(sightings[i].properties.SpeciesName)) {
                    speciesCountObj[sightings[i].properties.SpeciesName] = 0;
                    console.log("doesn't have species property");
                }
                speciesCountObj[sightings[i].properties.SpeciesName] += sightings[i].properties.Count;
            }
            console.log(Object.keys(speciesCountObj));

            for (s in speciesCountObj){
                myObj = {};
                myObj.species = s;
                myObj.count  = speciesCountObj[s];
                speciesCountArray.push(myObj);
            }
            console.log(speciesCountArray);
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
                console.log("feature_type", feature_type);

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
                    } else {

                        getSpeciesCount(data.results.features);
                        makeTotalsViz(speciesCountArray);
                        // console.log("these are the species");
                        // for(species in data.results) {
                            
                        //     var count = data.results[species];
                        //     console.log(species + ": " + count);

                        //     var sightingCount = {};
                        //     sightingCount.type = species;
                        //     sightingCount.total = count;
                        //     speciesSightingsTotals.push(sightingCount);
                        // }
                        // console.log(speciesSightingsTotals);
                        // //totalsVizDiv.fadeIn();
                        // makeTotalsViz(speciesSightingsTotals);
                        console.log("no species in query");
                    }
                }
                if (feature_type === "sensor") {
                    console.log("SENSOR");

                    for (d in data.results.features) {
                        var item = data.results.features[d];
                        //console.log(item);

                        if (item["properties"].hasOwnProperty("AirTemp")) {
                            f = parseSensorAirData(item);
                            parsedSensorAirData.push(f);
                        }
                        if (item["properties"].hasOwnProperty("WaterTemp") || item["properties"].hasOwnProperty("water temp")) {
                            f = parseSensorWaterData(item);
                            parsedSensorWaterData.push(f);
                        }
                        if (item["properties"].hasOwnProperty("PH") || item["properties"].hasOwnProperty("pH")) {
                            f = parseSensorPHData(item);
                            parsedSensorPHData.push(f);
                        }
                        if (item["properties"].hasOwnProperty("Tds")) {
                            f = parseSensorTdsData(item);
                            parsedSensorTdsData.push(f);
                        }
                    }

                    console.log("parsedSensorAirData size: " + parsedSensorAirData.length);
                    console.log("parsedSensorPHData size: " + parsedSensorPHData.length);
                    console.log("parsedSensorWaterData size: " + parsedSensorWaterData.length);
                    console.log("parsedSensorTdsData size: " + parsedSensorTdsData.length);
                    makeTimeSeriesViz(parsedSensorAirData, feature_type);
                    makeTimeSeriesViz(parsedSensorWaterData, feature_type);
                    makeTimeSeriesViz(parsedSensorPHData, feature_type);
                    makeTimeSeriesViz(parsedSensorTdsData, feature_type);

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
};