

/*
	Loads all features day by day and stores them .
*/


function Loader(){

	var loading = [];
	var tweets = [];
	var photos = [];
	var members = {};	

	function loadDay(day, callback) {
		console.log('loading data for day #' + day);
		var toBeCompleted = 3;
		function checkForCompletion(){
			toBeCompleted --;
			if(toBeCompleted == 0) {
				console.log('loading completed for day #' + day);
				callback(day);
			}
		}

		tweets[day] = [];
		photos[day] = [];

		loadPath(day, checkForCompletion);
		loadTweets(day, checkForCompletion);
		loadPhotos(day, checkForCompletion);
	}


	function loadPath(day, callback){
		loading[day] = true;
		var query = 'http://dev.intotheokavango.org/api/features?FeatureType=ambit_geo&Expedition=okavango_14&expeditionDay='+(day+5)+'&limit=0'
		d3.json(query, function(error, data) {
			if(error) return console.log("Failed to load " + query + ": " + e.statusText);
		
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
			    	var time = feature.properties.t_utc + timeOffset;
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
			timeline.setNightTime(day, activityInterval);
			callback();
		});   
	}


	function loadTweets(day, callback){
		var query = 'http://dev.intotheokavango.org/api/features?FeatureType=tweet&Expedition=okavango_14&expeditionDay='+(day+5)+'&limit=0'
		d3.json(query, function(error, data) {
			if(error) return console.log("Failed to load " + query + ": " + e.statusText);
		    L.geoJson(data.features, {
		        filter: function(feature, layer) {
		            return (feature.geometry.coordinates[0] != 0 && feature.properties.Tweet.text.substring(0,2).toLowerCase() != 'rt');
		        },
		        onEachFeature: function(feature){
		        	var tweet = TweetPost(feature);
		        	if(tweet) tweets[day].push(tweet);
		        }
		    });
		    callback();
		});
	}


	function loadPhotos(day, callback){
		var query = 'http://dev.intotheokavango.org/api/features?FeatureType=image&Expedition=okavango_14&expeditionDay='+(day+5)+'&limit=0'
		d3.json(query, function(error, data) {
			if(error) return console.log("Failed to load " + query + ": " + e.statusText);
		    L.geoJson(data.features, {
		        filter: function(feature, layer) {
		        	// ???
		        	// console.log(feature.properties.Url);
		            return (feature.properties.Url.indexOf('james') > -1);
		            // return true;
		        },
		        onEachFeature:function(feature, layer) {
		            var photo = PhotoPost(feature);
		            if(photo) photos[day].push(photo);
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


	return {
		loadDay: loadDay,
		members: members,
		getTweets: getTweets,
		getPhotos: getPhotos,
		getLoading: getLoading
	};
}

