

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

					var c = members[m].getColor();

					var pathStyle = {
					    fillColor: "#fff",
					    color: 'rgba('+c[0]+','+c[1]+','+c[2]+',1)',
					    weight: 2.5,
					    opacity: 0.6,
					    'pointer-events': 'none !important'
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
		var query = 'http://intotheokavango.org/api/features?FeatureType=tweet&Expedition=okavango_'+expeditionYear+'&expeditionDay='+(day+timeOffsets[expeditionYear].query)+'&limit=0&resolution=30'
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
                		layer.addEventListener('click',function(e){
                			if(e.target._popup._isOpen) timeline.togglePause('pause');
                		})
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

		var query = 'http://intotheokavango.org/api/features?FeatureType=blog&Expedition=okavango_'+expeditionYear+'&expeditionDay='+(day+timeOffsets[expeditionYear].query)+'&limit=0&resolution=300';
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
                		layer.addEventListener('click',function(e){
                			if(e.target._popup._isOpen) timeline.togglePause('pause');
                		})
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
                		layer.addEventListener('click',function(e){
                			if(e.target._popup._isOpen) timeline.togglePause('pause');
                		})
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
		        	if(!feature.properties.CoreExpedition) return false;
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
				    noClip: true,
				    'pointer-events': 'none !important'
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

