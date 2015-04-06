

function Member(n, l){

	var name = n;
	var pathQueue = [];
	var pathTimeCursor = 0;
	var pathDayCursor = 0;
	var latLng = l;
	var icon = L.divIcon({className: 'memberMarker', html: '<p>' + name + '</p>', iconSize:['auto','auto']});
	var marker = L.marker(latLng, {icon: icon}).addTo(map);


	function addAmbitGeo(d, l, t){
		if(!pathQueue[d]) pathQueue[d] = [];
	    pathQueue[d].push({latLng:l, time:t});
	    // if(!pathCursor) pathCursor = pathQueue[d];
	}


	function move(time){
		if(!time) return;
		var forward = time.current >= time.last;
		time = time.current;
		var len = pathQueue[pathDayCursor].length;
		var interval = [];
		var aga = 0;
		while(interval.length == 0 && pathDayCursor >= 0 && pathDayCursor < 1 && aga < 5){
			aga ++;
			for(var i=Math.constrain(pathTimeCursor+(forward?-1:1),0,len-1); forward?(i<len-1):(i>0); i+= (forward?1:-1)){
				if(time >= pathQueue[pathDayCursor][i + (forward?0:-1)].time && time < pathQueue[pathDayCursor][i + (forward?1:0)].time){
					interval = [pathQueue[pathDayCursor][i + (forward?0:-1)], pathQueue[pathDayCursor][i + (forward?1:0)]];
					pathTimeCursor = i;
					break;
				}
			}
			if(interval.length == 0) pathDayCursor = Math.constrain(pathDayCursor+forward ? 1:-1,0,pathQueue.length-1);
		}

		if(interval.length > 0){
			var lat = Math.map(time, interval[0].time, interval[1].time, interval[0].latLng.lat, interval[1].latLng.lat);
			var lng = Math.map(time, interval[0].time, interval[1].time, interval[0].latLng.lng, interval[1].latLng.lng);
			latLng = new L.LatLng(lat,lng);
			marker.setLatLng(latLng);
		}
	}


	function getLatLng(){
		return latLng;
	}


	return{
		addAmbitGeo: addAmbitGeo,
		getLatLng: getLatLng,
		name: name,
		marker: marker,
		move: move,
		pathQueue: pathQueue,
		pathTimeCursor: pathTimeCursor
	}
}




function PhotoPost(feature){

	var feedPos = 0;
	var date = new Date(Math.round(parseFloat(feature.properties.t_utc*1000)));
	var latLng = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
	var photoUrl = feature.properties.Url;



	function getData(){
		return {
			type: 'photo',
			date: date,
			latLng: latLng,
			photoUrl: photoUrl,
			feedPos: feedPos,
			setFeedPos: setFeedPos
		}
	}


	function getLatLng(){
		return latLng;
	}


	function setFeedPos(y, h){
		console.log(y, h);
		feedPos = y;
	}


	return{
		getData: getData,
		getLatLng: getLatLng,
		setFeedPos: setFeedPos
	};
}




function TweetPost(feature){

	var feedPos = 0;
	var username = feature.properties.Tweet.user.name;
	var message = feature.properties.Tweet.text;
	if(message.substring(0,2).toLowerCase() == 'rt') return null;
	var date = new Date(Math.round(parseFloat(feature.properties.t_utc*1000)));
	var latLng = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
	// var profilePicUrl = feature.properties.Tweet.user.profile_image_url,
	var id = feature.id;
	var photoUrl;
	try{
		if(feature.properties.Tweet.extended_entities.media[0].type == 'photo'){
			photoUrl = feature.properties.Tweet.extended_entities.media[0].media_url;
		}
	} catch(e){}


	function getData(){
		return {
			type: 'tweet',
			username: username,
			message: message,
			date: date,
			latLng: latLng,
			id: id,
			photoUrl: photoUrl,
			feedPos: feedPos,
			setFeedPos: setFeedPos
		}
	}


	function getLatLng(){
		return latLng;
	}


	function setFeedPos(y){
		feedPos = y;
	}


	return{
		getData: getData,
		getLatLng: getLatLng,
		setFeedPos: setFeedPos
	};
}

