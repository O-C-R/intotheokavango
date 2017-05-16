
var d3Graph = function(timelineVizLeftId, timelineVizRightId, totalsVizID){
    // if(timelineVizDiv){

    // }
    //console.log("divIDs: " + timelineVizID + ", " + totalsVizID);
    var timelineVizDiv = d3.select("timelineVizID");
    var timelineVizLeft = d3.select("timelineVizLeftId");
    var timelineVizRight = d3.select("timelineVizRightId");
    // var totalsVizDiv = d3.select("totalsVizID");
    console.log("D3 GRAPH", timelineVizLeft, timelineVizRight);

    var features = ["ambit","ambit_geo","audio","beacon","image","sensor","sighting","tweet"];
    var index = 0;    
    var featuresCountArray = [];
    
    var parsedSpeciesSighting = [];
    var parsedAmbitHR = [];
    var parsedAmbitEnergy = [];
    var parsedAmbitSpeed = [];
    var speciesSightingsTotals = [];

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
        sensorData.airTemp = item["properties"]["Temp"];
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

    var parseSensorDoData = function(item) {
        var sensorData = {};
        sensorData.Do = item["properties"]["Do"];
        sensorData.time = new Date(+item["properties"]["t_utc"] * 1000);

        return sensorData;
    }

    var parseSensorHumidityData = function(item) {
        var sensorData = {};
        if (item["properties"].hasOwnProperty("Hum")) {
            sensorData.humidity = item["properties"]["Hum"];
        } else if (item["properties"].hasOwnProperty("hum")) {
            sensorData.humidity = item["properties"]["hum"];
        }
        sensorData.time = new Date(+item["properties"]["t_utc"] * 1000);

        return sensorData;
    }

    var parseSensorBaroPressureData = function(item) {
        var sensorData = {};
        sensorData.Press = item["properties"]["Press"];
        sensorData.time = new Date(+item["properties"]["t_utc"] * 1000);
        return sensorData;
    }

    var parseSensorData = function(item, property) {
        var sensorData = {};
        sensorData.reading = item["properties"][property];
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

    var makeTimeSeriesViz = function(parsedData, feature_type, graph_type, isRightSide) {
        var selectedDiv;
        if (isRightSide) {
            selectedDiv = d3.select("#timelineVizRight");
        } else {
            selectedDiv = d3.select("#timelineVizLeft");
        }
        //TIMESERIES VIZ

        var margin = {top: 70.5, right: 30, bottom: 60, left: 50.5},
        width = (selectedDiv.node().getBoundingClientRect().width * 0.9) - margin.left - margin.right,
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

        var line = d3.svg.line();

        var svg = selectedDiv.append("svg")
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
                    line = d3.svg.line()
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
                    line = d3.svg.line()
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
                    line = d3.svg.line()
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
            line = d3.svg.line()
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
            if (graph_type === "airTemp") {
                console.log("airTemp");
                yAxisLabel = "Degrees Celsius";
                graphTitle = "Air Temperature";
            } else if (graph_type === "waterTemp") {
                console.log("waterTemp");
                yAxisLabel = "Degrees Celsius";
                graphTitle = "Water Temperature";
            } else if (graph_type === "humidity") {
                console.log("humidity");
                yAxisLabel = "Percent of water vapor to dry air";
                graphTitle = "Humidity Levels";
            } else if (graph_type === "pH") {
                console.log("pH");
                yAxisLabel = "pH Level";
                graphTitle = "Water pH Level";
            } else if (graph_type === "EC1") {
                console.log("EC1");
                yAxisLabel = "μS/cm";
                graphTitle = "EC1";
            } else if (graph_type === "EC2") {
                console.log("EC2");
                yAxisLabel = "Parts per Million";
                graphTitle = "Total Dissolved Solids";
            }else if (graph_type === "EC3") {
                console.log("EC3");
                yAxisLabel = "";
                graphTitle = "Salinity";
            }else if (graph_type === "EC4") {
                console.log("EC4");
                yAxisLabel = "";
                graphTitle = "Specific Gravity";
            } else if (graph_type === "Do") {
                console.log("Do");
                yAxisLabel = "mg/L";
                graphTitle = "Dissolved Oxygen Levels";
            } else if (graph_type === "Orp") {
                console.log("Orp");
                yAxisLabel = "mV";
                graphTitle = "Oxidation-Reduction Potential";
            } else if (graph_type === "WaterLevelM1") {
                console.log("WaterLevelM1");
                yAxisLabel = "meters depth";
                graphTitle = "WaterLevelM1";
            } else if (graph_type === "WaterLevelM2") {
                console.log("WaterLevelM2");
                yAxisLabel = "meters depth";
                graphTitle = "WaterLevelM2";
            } else if (graph_type === "WaterLevelM3") {
                console.log("WaterLevelM3");
                yAxisLabel = "meters depth";
                graphTitle = "WaterLevelM3";
            } else if (graph_type === "WaterLevelM4") {
                console.log("WaterLevelM4");
                yAxisLabel = "meters depth";
                graphTitle = "WaterLevelM4";
            } else if (graph_type === "WaterLevelM5") {
                console.log("WaterLevelM5");
                yAxisLabel = "meters depth";
                graphTitle = "WaterLevelM5";
            } else if (graph_type === "BaroPress") {
                console.log("BaroPress");
                yAxisLabel = "Pa";
                graphTitle = "Barometric Pressure";
            } else if (graph_type === "WindSpeed") {
                console.log("WindSpeed");
                yAxisLabel = "mph, 2 min avg";
                graphTitle = "Wind Speed";
            } else if (graph_type === "WindDir") {
                console.log("WindDir");
                yAxisLabel = "degrees?";
                graphTitle = "Compass Direction, 2 min avg";
            } else if (graph_type === "WindGust") {
                console.log("WindGust");
                yAxisLabel = "mph";
                graphTitle = "Wind Gust Speed, 10 min avg"
            } else if (graph_type === "WindGustDir") {
                console.log("WindGustDir");
                yAxisLabel = "degrees?";
                graphTitle = "Wind Gust Compass Direction";
            } else if (graph_type === "DailyRain") {
                console.log("DailyRain");
                yAxisLabel = "inches over past hour";
                graphTitle = "Daily Rainfall";
            }

            line = d3.svg.line()
                .x(function(d) { return xScale(d.time); })
                .y(function(d) { return yScale(d.reading); })
                .interpolate("linear");

            var dateRange = d3.extent(parsedData, function(d) { 
                    return d.time; 
                });
            console.log("dateRange: " + dateRange);
            xScale.domain(dateRange);
            yScale.domain(d3.extent(parsedData, function(d) { return d.reading; })); //change this to something more standard
            //yScale.domain([50, 110]);
            var dateFormat = d3.time.format.utc("%B %d %Y");
            var timeFormat = d3.time.format.utc("%I:%M:%S");
            xAxisLabel = dateFormat(dateRange[0]) + ", " + timeFormat(dateRange[0]) + " - " + dateFormat(dateRange[1]) + ", " + timeFormat(dateRange[1]);



            // for (var i = 0; i < parsedData.length; i++) {
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
            // }

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

        svg.append("svg:path")
              .data([parsedData])
              // .attr("class", "line")
              .attr("d", line)
              .attr("stroke", "#4bff87")
              .attr("stroke-width", "1.5px")
              .attr("fill", "none");

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
    function refresh(path_to_data, feature_type) {

    }

    function loadTimeSeriesGraphs(error, station1, station2) {

    }

    function loadData(dataUrl, feature_type, isRightSide) {
        console.log(dataUrl);
        //ADD MORE SENSOR DATA ARRAYS HERE
        //WEATHER (AIR)
        var parsedSensorAirTempData = [];
        var parsedSensorHumidityData = [];
        var parsedBaroPressureData = [];
        var parsedWindSpeedData = [];
        var parsedWindDirData = [];
        var parsedWindGustData = [];
        var parsedWindGustDirData = [];
        var parsedDailyRainData = [];

        //WATER (ATLAS)
        var parsedSensorOrpData = [];
        var parsedSensorDoData = [];
        var parsedSensorPHData = [];
        var parsedSensorEC1Data = [];
        var parsedSensorEC2Data = [];
        var parsedSensorEC3Data = [];
        var parsedSensorEC4Data = [];
        var parsedSensorWaterTempData = [];

        //SONAR
        var parsedWaterLevel1Data = [];
        var parsedWaterLevel2Data = [];
        var parsedWaterLevel3Data = [];
        var parsedWaterLevel4Data = [];
        var parsedWaterLevel5Data = [];

        d3.json(dataUrl, function(error, data) {

            if(error) {
                console.error("Failed to load " + dataUrl);
                console.log(error);
                return error;
            } else {
                console.log("Initial Data", data);
                console.log("feature_type", feature_type);

                // data.results.features = data.results.features.filter(function(d){
                //     if(isNaN(d.value)){
                //         return false;
                //     }
                //     return true;
                // });


                //parse item differently based on feature_type
                if (feature_type === "None" && dataUrl.indexOf("features") != -1 ) { //top level features
                    //make features viz - totals of all the feature types?
                    //if api call is expeditions or members, get from query string?
                    //totalsVizDiv.show();
                    getFeatureTotalData(features[index])

                    console.log("these are the features"); //do we need a viz for members or expeditions?
                }

                if(feature_type === "None" && dataUrl.indexOf("species") != -1 ) { //list of all species with totals
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

                    if(dataUrl.indexOf("SpeciesName") != -1) { //if query asks for species name
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

                        if (item["properties"].hasOwnProperty("WaterTemp")) {
                            f = parseSensorData(item, "WaterTemp");
                            parsedSensorWaterTempData.push(f);
                        }
                        if (item["properties"].hasOwnProperty("pH")) {
                            f = parseSensorData(item, "pH");
                            parsedSensorPHData.push(f);
                        }
                        if (item["properties"].hasOwnProperty("Do")) {
                            f = parseSensorData(item, "Do");
                            parsedSensorDoData.push(f);
                        }
                        if (item["properties"].hasOwnProperty("Orp")) {
                            f = parseSensorData(item, "Orp");
                            parsedSensorOrpData.push(f);
                        }
                        if (item["properties"].hasOwnProperty("EC1")) {
                            f = parseSensorData(item, "EC1");
                            parsedSensorEC1Data.push(f);
                        }
                        if (item["properties"].hasOwnProperty("EC2")) {
                            f = parseSensorData(item, "EC2");
                            parsedSensorEC2Data.push(f);
                        }
                        if (item["properties"].hasOwnProperty("EC3")) {
                            f = parseSensorData(item, "EC3");
                            parsedSensorEC3Data.push(f);
                        }
                        if (item["properties"].hasOwnProperty("EC4")) {
                            f = parseSensorData(item, "EC4");
                            parsedSensorEC4Data.push(f);
                        }
                        if (item["properties"].hasOwnProperty("WaterLevelInM1")) {
                            f = parseSensorData(item, "WaterLevelInM1");
                            parsedWaterLevel1Data.push(f);
                        }
                        if (item["properties"].hasOwnProperty("WaterLevelInM2")) {
                            f = parseSensorData(item, "WaterLevelInM2");
                            parsedWaterLevel2Data.push(f);
                        }
                        if (item["properties"].hasOwnProperty("WaterLevelInM3")) {
                            f = parseSensorData(item, "WaterLevelInM3");
                            parsedWaterLevel3Data.push(f);
                        }
                        if (item["properties"].hasOwnProperty("WaterLevelInM4")) {
                            f = parseSensorData(item, "WaterLevelInM4");
                            parsedWaterLevel4Data.push(f);
                        }
                        if (item["properties"].hasOwnProperty("WaterLevelInM5")) {
                            f = parseSensorData(item, "WaterLevelInM5");
                            parsedWaterLevel5Data.push(f);
                        }
                        if (item["properties"].hasOwnProperty("Hum")) {
                            f = parseSensorData(item, "Hum");
                            parsedSensorHumidityData.push(f);
                        }
                        if (item["properties"].hasOwnProperty("Temp")) {
                            f = parseSensorData(item, "Temp");
                            parsedSensorAirTempData.push(f);
                        }
                        if (item["properties"].hasOwnProperty("Press")) {
                            f = parseSensorData(item, "Press");
                            parsedBaroPressureData.push(f);
                        }
                        if (item["properties"].hasOwnProperty("WindSpeed2")) {
                            f = parseSensorData(item, "WindSpeed2");
                            parsedWindSpeedData.push(f);
                        }
                        if (item["properties"].hasOwnProperty("WindDir2")) {
                            f = parseSensorData(item, "WindDir2");
                            parsedWindDirData.push(f);
                        }
                        if (item["properties"].hasOwnProperty("WindGust10")) {
                            f = parseSensorData(item, "WindGust10");
                            parsedWindGustData.push(f);
                        }
                        if (item["properties"].hasOwnProperty("WindGustDir10")) {
                            f = parseSensorData(item, "WindGustDir10");
                            parsedWindGustDirData.push(f);
                        }
                        if (item["properties"].hasOwnProperty("DailyRain")) {
                            f = parseSensorData(item, "DailyRain");
                            parsedDailyRainData.push(f);
                        }
                    }

                    console.log("parsedSensorPHData size: " + parsedSensorPHData.length);
                    if (parsedSensorPHData.length > 0) makeTimeSeriesViz(parsedSensorPHData, feature_type, "pH", isRightSide);

                    console.log("parsedSensorWaterTempData size: " + parsedSensorWaterTempData.length);
                    if (parsedSensorWaterTempData.length > 0) makeTimeSeriesViz(parsedSensorWaterTempData, feature_type, "waterTemp", isRightSide);

                    console.log("parsedSensorDOData size: " + parsedSensorDoData.length);
                    if (parsedSensorDoData.length > 0) makeTimeSeriesViz(parsedSensorDoData, feature_type, "Do", isRightSide);

                    console.log("parsedSensorOrpData size: " + parsedSensorOrpData.length);
                    if (parsedSensorOrpData.length > 0) makeTimeSeriesViz(parsedSensorOrpData, feature_type, "Orp", isRightSide);

                    console.log("parsedSensorEC1Data size: " + parsedSensorEC1Data.length);
                    if (parsedSensorEC1Data.length > 0) makeTimeSeriesViz(parsedSensorEC1Data, feature_type, "EC1", isRightSide);

                    console.log("parsedSensorEC2Data size: " + parsedSensorEC2Data.length);
                    if (parsedSensorEC2Data.length > 0) makeTimeSeriesViz(parsedSensorEC2Data, feature_type, "EC2", isRightSide);

                    console.log("parsedSensorEC3Data size: " + parsedSensorEC3Data.length);
                    if (parsedSensorEC3Data.length > 0) makeTimeSeriesViz(parsedSensorEC3Data, feature_type, "EC3", isRightSide);

                    console.log("parsedSensorEC4Data size: " + parsedSensorEC4Data.length);
                    if (parsedSensorEC4Data.length > 0) makeTimeSeriesViz(parsedSensorEC4Data, feature_type, "EC4", isRightSide);

                    console.log("parsedWaterLevel1Data size: " + parsedWaterLevel1Data.length);
                    if (parsedWaterLevel1Data.length > 0) makeTimeSeriesViz(parsedWaterLevel1Data, feature_type, "WaterLevelM1", isRightSide);

                    console.log("parsedWaterLevel2Data size: " + parsedWaterLevel2Data.length);
                    if (parsedWaterLevel2Data.length > 0) makeTimeSeriesViz(parsedWaterLevel2Data, feature_type, "WaterLevelM2", isRightSide);

                    console.log("parsedWaterLevel3Data size: " + parsedWaterLevel3Data.length);
                    if (parsedWaterLevel3Data.length > 0) makeTimeSeriesViz(parsedWaterLevel3Data, feature_type, "WaterLevelM3", isRightSide);

                    console.log("parsedWaterLevel4Data size: " + parsedWaterLevel4Data.length);
                    if (parsedWaterLevel4Data.length > 0) makeTimeSeriesViz(parsedWaterLevel4Data, feature_type, "WaterLevelM4", isRightSide);

                    console.log("parsedWaterLevel5Data size: " + parsedWaterLevel5Data.length);
                    if (parsedWaterLevel5Data.length > 0) makeTimeSeriesViz(parsedWaterLevel5Data, feature_type, "WaterLevelM5", isRightSide);

                    console.log("parsedSensorAirTempData size: " + parsedSensorAirTempData.length);
                    if (parsedSensorAirTempData.length > 0) makeTimeSeriesViz(parsedSensorAirTempData, feature_type, "airTemp", isRightSide);

                    console.log("parsedSensorHumidityData size: " + parsedSensorHumidityData.length);
                    if (parsedSensorHumidityData.length > 0) makeTimeSeriesViz(parsedSensorHumidityData, feature_type, "humidity", isRightSide);

                    console.log("parsedBaroPressureData size: " + parsedBaroPressureData.length);
                    if (parsedBaroPressureData.length > 0) makeTimeSeriesViz(parsedBaroPressureData, feature_type, "BaroPress", isRightSide);

                    console.log("parsedWindSpeedData size: " + parsedWindSpeedData.length);
                    if (parsedWindSpeedData.length > 0) makeTimeSeriesViz(parsedWindSpeedData, feature_type, "WindSpeed", isRightSide);

                    console.log("parsedWindDirData size: " + parsedWindDirData.length);
                    if (parsedWindDirData.length > 0) makeTimeSeriesViz(parsedWindDirData, feature_type, "WindDir", isRightSide);

                    console.log("parsedWindGustData size: " + parsedWindGustData.length);
                    if (parsedWindGustData.length > 0) makeTimeSeriesViz(parsedWindGustData, feature_type, "WindGust", isRightSide);

                    console.log("parsedWindGustDirData size: " + parsedWindGustDirData.length);
                    if (parsedWindGustDirData.length > 0) makeTimeSeriesViz(parsedWindGustDirData, feature_type, "WindGustDir", isRightSide);

                    // console.log("parsedDailyRainData size: " + parsedDailyRainData.length);
                    // if (parsedDailyRainData.length > 0) makeTimeSeriesViz(parsedDailyRainData, feature_type, "DailyRain", isRightSide);
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