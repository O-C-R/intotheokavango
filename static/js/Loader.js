

function Loader(){
	

	function loadDay(day, callback) {
		console.log('loading data for day #' + day);
		var toBeCompleted = 3;
		function checkForCompletion(){
			toBeCompleted --;
			if(toBeCompleted == 0) {
				callback();
				console.log('loading completed for day #' + day);
			}
		}

		loadPath(day, checkForCompletion);
		loadTweets(day, checkForCompletion);
		loadPhotos(day, checkForCompletion);
	}


	function loadPath(day, callback){
		var query = 'http://dev.intotheokavango.org/api/features?FeatureType=ambit_geo&Expedition=okavango_14&expeditionDay='+(day-16)+'&limit=0'

		d3.json(query, function(error, data) {
			if(error) return console.log("Failed to load " + query + ": " + e.statusText);
		
		    L.geoJson(data, {
		        filter: function(feature, layer) {
			    	//Filter out 0,0 points
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
			    	var time = feature.properties.t_utc;
			        if(!members[name]) {
			        	members[name] = Member(name, latLng);
			        }
			        members[name].addAmbitGeo(day, latLng, time);
			    }
			});
			callback();
		});   
	}


	function loadTweets(day, callback){
		var query = 'http://dev.intotheokavango.org/api/features?FeatureType=tweet&Expedition=okavango_14&expeditionDay='+(day-16)+'&limit=0'
		d3.json(query, function(error, data) {
			if(error) return console.log("Failed to load " + query + ": " + e.statusText);
		    L.geoJson(data.features, {
		        filter: function(feature, layer) {
		            return (feature.geometry.coordinates[0] != 0 && feature.properties.Tweet.text.substring(0,2).toLowerCase() != 'rt');
		        },
		        onEachFeature: function(feature){
		        	var tweet = TweetPost(feature);
		        	if(tweet) tweets.push(tweet);
		        }
		    });
		    callback();
		});
	}


	function loadPhotos(day, callback){
		var query = 'http://dev.intotheokavango.org/api/features?FeatureType=image&Expedition=okavango_14&expeditionDay='+(day-16)+'&limit=0'
		d3.json(query, function(error, data) {
			if(error) return console.log("Failed to load " + query + ": " + e.statusText);
		    L.geoJson(data.features, {
		        filter: function(feature, layer) {
		            // return (feature.properties.url.indexOf('james') > -1);
		            return true;
		        },
		        onEachFeature:function(feature, layer) {
		            var photo = PhotoPost(feature);
		            if(photo) photos.push(photo);
		        }
		    });
		    callback();
		});
	}


	return {
		loadDay: loadDay
	};
}

