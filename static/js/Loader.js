

/*
	Loads all features day by day and stores them .
*/


function Loader(){

	var loading = [];
	var tweets = [];
	var photos = [];
	var sightings = [];
	var beacons = [];
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

		loadPath(day, checkForCompletion);
		loadTweets(day, checkForCompletion);
		loadPhotos(day, checkForCompletion);
		loadSightings(day, checkForCompletion);
		// loadBeacons(day, checkForCompletion);
		checkForCompletion();
		// checkForCompletion();
		// checkForCompletion();
		// checkForCompletion();
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
			        	members[name] = Member(name, latLng, day);
			        }
			        console.log(feature);
			        members[name].addAmbitGeo(day, latLng, time, core);
			    }
			});
			for(m in members) members[m].initPathQueue();
			var activityInterval = [0, 10000000000];
			for(m in members){
				var member = members[m];
				var pathQueue = member.getPathQueueByDay(day);
				if(activityInterval[0] < pathQueue[0].time) activityInterval[0] = pathQueue[0].time;
				if(activityInterval[1] > pathQueue[pathQueue.length-1].time) activityInterval[1] = pathQueue[pathQueue.length-1].time;
			}
			activityInterval[0]+(10*60);
			activityInterval[1]-(10*60);
			// console.log(day, activityInterval);
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
		        	console.log(feature.properties);
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
		            return (feature.properties.Url.indexOf('james') > -1);
		            // return true;
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
			beacons: beacons
		}
	}

	return {
		loadDay: loadDay,
		members: members,
		getTweets: getTweets,
		getPhotos: getPhotos,
		getLoading: getLoading,
		getDayCount: getDayCount,
		getLoadedDays: getLoadedDays,
		getFeatures: getFeatures,
		expeditionYear: expeditionYear	
	};
}

