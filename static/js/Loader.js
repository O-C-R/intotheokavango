

/*
	Loads all features day by day and stores them .
*/


function Loader(){

	var loading = [];
	var tweets = [];
	var photos = [];
	var sightings = [];
	var members = {};	
	var queryOffset = -1;
	var expeditionYear = 14;
	var loadedDays = [];


	function getDayCount(callback){
		var query = 'http://intotheokavango.org/api/expeditions';
		d3.json(query, function(error, data){
			if(error) return console.log("Failed to load " + query + ": " + error.statusText);
			data = data.results;
			var d = data['okavango_'+expeditionYear].StartDate.split(' ')[0];
			query = 'http://intotheokavango.org/api/features/?FeatureType=ambit&expedition=okavango_14&startDate='+d+'&endDate=2014-09-17&limit=0&resolution=86400';
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
		var toBeCompleted = 4;
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

		loadPath(day, checkForCompletion);
		loadTweets(day, checkForCompletion);
		loadPhotos(day, checkForCompletion);
		loadSightings(day, checkForCompletion);
		// checkForCompletion();
		// checkForCompletion();
		// checkForCompletion();
		// checkForCompletion();
	}


	function loadPath(day, callback){
		loading[day] = true;
		var query = 'http://intotheokavango.org/api/features?FeatureType=ambit_geo&Expedition=okavango_'+expeditionYear+'&expeditionDay='+(day+queryOffset)+'&limit=0'
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
			    	var time = feature.properties.t_utc + timeOffsets.timeAmbit + timeOffsets.dateAmbit;
			        if(!members[name]) {
			        	members[name] = Member(name, latLng, day);
			        }
			        members[name].addAmbitGeo(day, latLng, time);
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

		var query = 'http://intotheokavango.org/api/features?FeatureType=tweet&Expedition=okavango_'+expeditionYear+'&expeditionDay='+(day+queryOffset)+'&limit=0'
		d3.json(query, function(error, data) {
			if(error) return console.log("Failed to load " + query + ": " + error.statusText);
			data = data.results;	
		    L.geoJson(data.features, {
		        filter: function(feature, layer) {
		            return (feature.geometry.coordinates[0] != 0 && feature.properties.Tweet.text.substring(0,2).toLowerCase() != 'rt');
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

		var query = 'http://intotheokavango.org/api/features?FeatureType=image&Expedition=okavango_'+expeditionYear+'&expeditionDay='+(day+queryOffset)+'&limit=0'
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

		    iconSize:     [40,40], // size of the icon
		    shadowSize:   [40,40], // size of the shadow
		    iconAnchor:   [15,35], // point of the icon which will correspond to marker's location
		    shadowAnchor: [15,35],  // the same for the shadow
		    popupAnchor:  [10,-40] // point from which the popup should open relative to the iconAnchor
		});

		var sightingOptions = {
		    radius: 2,
		    fillColor: "#FFF",
		    color: "#78BD52",
		    weight: 0,
		    opacity: 0.3,
		    fillOpacity: 0.7,
		};

		var query = 'http://intotheokavango.org/api/features?FeatureType=sighting&Expedition=okavango_'+expeditionYear+'&expeditionDay='+(day+queryOffset)+'&limit=0'
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
		        	// marker.bindLabel(feature.properties.Count + " " + feature.properties.SpeciesName);
			        // sightingsQueue.push({marker:marker, time:feature.properties.t_utc, tries:0});
			        
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
			photos: photos
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
		getFeatures: getFeatures		
	};
}

